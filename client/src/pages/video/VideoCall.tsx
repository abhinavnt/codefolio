"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Peer from "peerjs"
import { io, type Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  X,
  Send,
  Users,
  ScreenShare,
  ScreenShareOff,
  Maximize2,
  Minimize2,
} from "lucide-react"

interface VideoStream {
  peerId: string
  stream: MediaStream
  isScreenShare?: boolean
}

interface ChatMessage {
  id: string
  sender: string
  text: string
  timestamp: Date
}

export function VideoCall() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<VideoStream[]>([])
  const peerRef = useRef<Peer | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const screenShareRef = useRef<MediaStream | null>(null)
  const [displayStream, setDisplayStream] = useState<MediaStream | null>(null)
  const [screenSharingPeer, setScreenSharingPeer] = useState<string | null>(null)
  const [isPeerOpen, setIsPeerOpen] = useState<boolean>(false)
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false)
  const [isMediaInitialized, setIsMediaInitialized] = useState<boolean>(false)
  const [focusedParticipant, setFocusedParticipant] = useState<string | null>(null)

  // UI state
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false)
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false)
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState<string>("")
  const [participantCount, setParticipantCount] = useState<number>(1)

  // Initialize socket and peer
  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      transports: ["polling"],
      withCredentials: true,
    })

    peerRef.current = new Peer("", {
      host: "localhost",
      port: 5000,
      path: "/peerjs",
      secure: false,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    })

    // PeerJS setup
    peerRef.current.on("open", (peerId) => {
      console.log("PeerJS ID:", peerId)
      setIsPeerOpen(true)
    })

    peerRef.current.on("error", (err) => {
      console.error("PeerJS Error:", err)
    })

    peerRef.current.on("call", (call) => {
      const isScreenShare = call.metadata?.isScreenShare || false
      if (localStreamRef.current) {
        call.answer(localStreamRef.current)
        call.on("stream", (remoteStream) => {
          setRemoteStreams((prev) => {
            const exists = prev.some((s) => s.peerId === call.peer && s.isScreenShare === isScreenShare)
            if (!exists) {
              return [...prev, { peerId: call.peer, stream: remoteStream, isScreenShare }]
            }
            return prev
          })
          if (isScreenShare) {
            setScreenSharingPeer(call.peer)
          }
          updateParticipantCount()
        })
        call.on("error", (err) => console.error("Call Error:", err))
      }
    })

    // Socket.io setup
    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id)
      setIsSocketConnected(true)
    })

    socketRef.current.on("connect_error", (err: Error) => {
      console.error("Socket Connect Error:", err.message)
    })

    socketRef.current.on("user-connected", (data: { peerId: string; screenSharingPeer?: string }) => {
      const { peerId, screenSharingPeer: currentScreenSharingPeer } = data
      if (peerRef.current && localStreamRef.current) {
        const call = peerRef.current.call(peerId, localStreamRef.current, { metadata: { isScreenShare: false } })
        call.on("stream", (remoteStream) => {
          setRemoteStreams((prev) =>
            prev.some((s) => s.peerId === peerId && !s.isScreenShare)
              ? prev
              : [...prev, { peerId, stream: remoteStream, isScreenShare: false }],
          )
          updateParticipantCount()
        })
        call.on("error", (err) => console.error("Call Error:", err))

        if (isScreenSharing && screenShareRef.current) {
          const screenCall = peerRef.current.call(peerId, screenShareRef.current, { metadata: { isScreenShare: true } })
          screenCall.on("error", (err) => console.error("Screen Share Call Error:", err))
        }
      }
      if (currentScreenSharingPeer) {
        setScreenSharingPeer(currentScreenSharingPeer)
      }
    })

    socketRef.current.on("user-disconnected", (peerId: string) => {
      setRemoteStreams((prev) => prev.filter((s) => s.peerId !== peerId))
      if (screenSharingPeer === peerId) {
        setScreenSharingPeer(null)
      }
      if (focusedParticipant === peerId) {
        setFocusedParticipant(null)
      }
      updateParticipantCount()
    })

    socketRef.current.on("chat-message", (message: ChatMessage) => {
      setChatMessages((prev) => [...prev, message])
    })

    socketRef.current.on("screen-share-started", (peerId: string) => {
      setScreenSharingPeer(peerId)
    })

    socketRef.current.on("screen-share-stopped", (peerId: string) => {
      setRemoteStreams((prev) => prev.filter((s) => !(s.peerId === peerId && s.isScreenShare)))
      if (screenSharingPeer === peerId) {
        setScreenSharingPeer(null)
      }
    })

    return () => {
      cleanupResources()
    }
  }, [bookingId])

  // Initialize media
  useEffect(() => {
    initializeMedia()
  }, [])

  // Join room when all dependencies are ready
  useEffect(() => {
    if (isPeerOpen && isSocketConnected && isMediaInitialized && socketRef.current && peerRef.current) {
      console.log("Emitting join-room with peerId:", peerRef.current.id)
      socketRef.current.emit("join-room", {
        roomId: bookingId,
        peerId: peerRef.current.id,
      })
    }
  }, [isPeerOpen, isSocketConnected, isMediaInitialized, bookingId])

  const updateParticipantCount = () => {
    const uniquePeers = new Set(remoteStreams.map((s) => s.peerId))
    setParticipantCount(uniquePeers.size + 1)
  }

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      localStreamRef.current = stream
      setDisplayStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      setIsMediaInitialized(true)
    } catch (err) {
      console.error("Error accessing media devices:", err)
      localStreamRef.current = new MediaStream()
      setIsCameraOff(true)
      setIsMuted(true)
      setDisplayStream(localStreamRef.current)
      setIsMediaInitialized(true)
    }
  }

  const cleanupResources = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (screenShareRef.current) {
      screenShareRef.current.getTracks().forEach((track) => track.stop())
    }
    if (peerRef.current) {
      peerRef.current.destroy()
    }
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
  }

  const handleLeaveCall = () => {
    if (isScreenSharing && socketRef.current) {
      socketRef.current.emit("screen-share-stopped", { roomId: bookingId, peerId: peerRef.current?.id })
    }
    cleanupResources()
    navigate("/mentor")
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMuted((prev) => !prev)
    }
  }

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsCameraOff((prev) => !prev)
    }
  }

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenShareRef.current) {
        screenShareRef.current.getTracks().forEach((track) => track.stop())
        screenShareRef.current = null
      }
      setDisplayStream(localStreamRef.current)
      setIsScreenSharing(false)
      if (socketRef.current && peerRef.current) {
        socketRef.current.emit("screen-share-stopped", { roomId: bookingId, peerId: peerRef.current.id })
      }
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        })
        screenShareRef.current = screenStream
        setDisplayStream(screenStream)
        setIsScreenSharing(true)

        if (socketRef.current && peerRef.current) {
          socketRef.current.emit("screen-share-started", { roomId: bookingId, peerId: peerRef.current.id })
          remoteStreams.forEach((stream) => {
            if (peerRef.current) {
              const call = peerRef.current.call(stream.peerId, screenStream, { metadata: { isScreenShare: true } })
              call.on("error", (err) => console.error("Screen Share Call Error:", err))
            }
          })
        }

        screenStream.getVideoTracks()[0].onended = () => {
          setDisplayStream(localStreamRef.current)
          setIsScreenSharing(false)
          screenShareRef.current = null
          if (socketRef.current && peerRef.current) {
            socketRef.current.emit("screen-share-stopped", { roomId: bookingId, peerId: peerRef.current.id })
          }
        }
      } catch (err) {
        console.error("Error sharing screen:", err)
      }
    }
  }

  const sendChatMessage = () => {
    if (messageInput.trim() && socketRef.current) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "You",
        text: messageInput,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, newMessage])
      socketRef.current.emit("chat-message", {
        roomId: bookingId,
        message: { ...newMessage, sender: "Participant" },
      })
      setMessageInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  const toggleFocusParticipant = (peerId: string | null) => {
    if (focusedParticipant === peerId) {
      setFocusedParticipant(null)
    } else {
      setFocusedParticipant(peerId)
    }
  }

  // Get layout configuration based on participant count and screen sharing status
  const getLayoutConfig = () => {
    const totalParticipants = remoteStreams.filter((s) => !s.isScreenShare).length + 1
    const hasScreenShare = screenSharingPeer !== null

    // If there's a focused participant, use a different layout
    if (focusedParticipant !== null) {
      return {
        gridCols: "grid-cols-1 md:grid-cols-4",
        mainArea: "col-span-3",
        sideArea: "col-span-1",
        hasFocus: true,
      }
    }

    // If screen sharing is active
    if (hasScreenShare) {
      return {
        gridCols: "grid-cols-1",
        mainArea: "w-full mb-4",
        participantGrid:
          totalParticipants <= 2 ? "grid-cols-2" : totalParticipants <= 4 ? "grid-cols-2" : "grid-cols-3",
        hasFocus: false,
      }
    }

    // Regular layout based on participant count
    if (totalParticipants === 1) {
      return { gridCols: "grid-cols-1", hasFocus: false }
    } else if (totalParticipants === 2) {
      return { gridCols: "grid-cols-2", hasFocus: false }
    } else if (totalParticipants <= 4) {
      return { gridCols: "grid-cols-2", hasFocus: false }
    } else if (totalParticipants <= 6) {
      return { gridCols: "grid-cols-3", hasFocus: false }
    } else {
      return { gridCols: "grid-cols-4", hasFocus: false }
    }
  }

  useEffect(() => {
    if (localVideoRef.current && displayStream) {
      localVideoRef.current.srcObject = displayStream
    }
  }, [displayStream])

  const layout = getLayoutConfig()

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <h1 className="text-lg font-medium text-gray-800">Meeting: {bookingId}</h1>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Users className="h-5 w-5" />
                  <span className="ml-1">{participantCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Participants</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 ${isChatOpen ? "pr-0" : ""} p-4`}>
          {/* Screen sharing layout */}
          {screenSharingPeer && remoteStreams.find((s) => s.peerId === screenSharingPeer && s.isScreenShare) && (
            <div className="flex flex-col h-full">
              {/* Screen share video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden mb-4 h-2/3">
                <video
                  autoPlay
                  ref={(video) => {
                    const stream = remoteStreams.find((s) => s.peerId === screenSharingPeer && s.isScreenShare)?.stream
                    if (video && stream) video.srcObject = stream
                  }}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                  {screenSharingPeer === peerRef.current?.id ? "You (Screen)" : "Participant (Screen)"}
                </div>
              </div>

              {/* Participant videos in a grid below the screen share */}
              <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-1/3`}>
                {/* Local video */}
                <div
                  className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => toggleFocusParticipant("local")}
                >
                  {isCameraOff && !isScreenSharing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <Avatar className="h-16 w-16 mb-2">
                        <div className="bg-blue-500 h-full w-full flex items-center justify-center text-white text-xl font-semibold">
                          Y
                        </div>
                      </Avatar>
                      <p className="text-white">You</p>
                    </div>
                  )}
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className={`w-full h-full object-cover ${isCameraOff && !isScreenSharing ? "opacity-0" : "opacity-100"}`}
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                    You {isMuted && <MicOff className="h-3 w-3 inline ml-1" />}
                  </div>
                </div>

                {/* Remote videos */}
                {remoteStreams
                  .filter((stream) => !stream.isScreenShare)
                  .map((stream) => (
                    <div
                      key={stream.peerId}
                      className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => toggleFocusParticipant(stream.peerId)}
                    >
                      <video
                        autoPlay
                        ref={(video) => {
                          if (video) video.srcObject = stream.stream
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                        Participant
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Regular layout (no screen sharing) */}
          {!screenSharingPeer && (
            <div className={`grid ${layout.gridCols} gap-4 h-full`}>
              {/* Focused participant if any */}
              {layout.hasFocus && (
                <>
                  <div className={`${layout.mainArea} bg-gray-800 rounded-lg overflow-hidden`}>
                    {focusedParticipant === "local" ? (
                      <>
                        {isCameraOff && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <Avatar className="h-24 w-24 mb-2">
                              <div className="bg-blue-500 h-full w-full flex items-center justify-center text-white text-2xl font-semibold">
                                Y
                              </div>
                            </Avatar>
                            <p className="text-white">You</p>
                          </div>
                        )}
                        <video
                          ref={(video) => {
                            if (video && localStreamRef.current) video.srcObject = localStreamRef.current
                          }}
                          autoPlay
                          muted
                          className={`w-full h-full object-cover ${isCameraOff ? "opacity-0" : "opacity-100"}`}
                        />
                        <div className="absolute bottom-4 right-4">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-black bg-opacity-50 text-white"
                            onClick={() => setFocusedParticipant(null)}
                          >
                            <Minimize2 className="h-4 w-4 mr-2" />
                            Exit Focus
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <video
                          autoPlay
                          ref={(video) => {
                            const stream = remoteStreams.find((s) => s.peerId === focusedParticipant)?.stream
                            if (video && stream) video.srcObject = stream
                          }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 right-4">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-black bg-opacity-50 text-white"
                            onClick={() => setFocusedParticipant(null)}
                          >
                            <Minimize2 className="h-4 w-4 mr-2" />
                            Exit Focus
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className={`${layout.sideArea} grid grid-rows-3 gap-4`}>
                    {/* Local video if not focused */}
                    {focusedParticipant !== "local" && (
                      <div className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer">
                        {isCameraOff && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <Avatar className="h-12 w-12 mb-1">
                              <div className="bg-blue-500 h-full w-full flex items-center justify-center text-white text-lg font-semibold">
                                Y
                              </div>
                            </Avatar>
                            <p className="text-white text-sm">You</p>
                          </div>
                        )}
                        <video
                          ref={localVideoRef}
                          autoPlay
                          muted
                          className={`w-full h-full object-cover ${isCameraOff ? "opacity-0" : "opacity-100"}`}
                        />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
                          You {isMuted && <MicOff className="h-3 w-3 inline ml-1" />}
                        </div>
                      </div>
                    )}

                    {/* Other participants if not focused */}
                    {remoteStreams
                      .filter((stream) => !stream.isScreenShare && stream.peerId !== focusedParticipant)
                      .map((stream) => (
                        <div
                          key={stream.peerId}
                          className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => toggleFocusParticipant(stream.peerId)}
                        >
                          <video
                            autoPlay
                            ref={(video) => {
                              if (video) video.srcObject = stream.stream
                            }}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
                            Participant
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}

              {/* Regular grid layout no focus */}
              {!layout.hasFocus && (
                <>
                  {/* Local video */}
                  <div
                    className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer aspect-video"
                    onClick={() => toggleFocusParticipant("local")}
                  >
                    {isCameraOff && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <Avatar className="h-16 w-16 md:h-24 md:w-24 mb-2">
                          <div className="bg-blue-500 h-full w-full flex items-center justify-center text-white text-xl md:text-2xl font-semibold">
                            Y
                          </div>
                        </Avatar>
                        <p className="text-white">You</p>
                      </div>
                    )}
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      className={`w-full h-full object-cover ${isCameraOff ? "opacity-0" : "opacity-100"}`}
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                      You {isMuted && <MicOff className="h-3 w-3 inline ml-1" />}
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-black bg-opacity-50 text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFocusParticipant("local")
                        }}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Remote videos */}
                  {remoteStreams
                    .filter((stream) => !stream.isScreenShare)
                    .map((stream) => (
                      <div
                        key={stream.peerId}
                        className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer aspect-video"
                        onClick={() => toggleFocusParticipant(stream.peerId)}
                      >
                        <video
                          autoPlay
                          ref={(video) => {
                            if (video) video.srcObject = stream.stream
                          }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                          Participant
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-black bg-opacity-50 text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFocusParticipant(stream.peerId)
                            }}
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Chat sidebar */}
        {isChatOpen && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-medium">Meeting chat</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-3">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-3 py-2 rounded-lg max-w-[85%] ${
                          msg.sender === "You" ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <p className="text-sm font-medium">{msg.sender}</p>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="p-3 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Send a message"
                  className="flex-1"
                />
                <Button size="icon" onClick={sendChatMessage} disabled={!messageInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white border-t border-gray-200 p-4 flex justify-center">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "Unmute" : "Mute"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isCameraOff ? "destructive" : "secondary"}
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={toggleCamera}
                >
                  {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isCameraOff ? "Turn camera on" : "Turn camera off"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isScreenSharing ? "destructive" : "secondary"}
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={toggleScreenShare}
                >
                  {isScreenSharing ? <ScreenShareOff className="h-5 w-5" /> : <ScreenShare className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isScreenSharing ? "Stop sharing" : "Share screen"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-8 mx-2" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isChatOpen ? "default" : "secondary"}
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-8 mx-2" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" className="rounded-full h-12 w-12" onClick={handleLeaveCall}>
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Leave call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
