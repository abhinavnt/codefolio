import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "peerjs";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";

interface VideoStream {
  peerId: string;
  stream: MediaStream;
}

export function VideoCall() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<VideoStream[]>([]);
  const peerRef = useRef<Peer | null>(null);
  const socketRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {

    console.log("1");
    socketRef.current = io("http://localhost:5000", {
      transports: ["polling"], // Match server to use polling
      withCredentials: true,
    });

    console.log("2");
    peerRef.current = new Peer("", {
      host: "localhost",
      port: 5000,
      path: "/peerjs",
      secure: false,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });


   console.log('3');
    navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      console.log('log from                                                                                                    3')
      console.log("Got local stream");
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      console.log("here is the localstream ref first",localStreamRef.current);
      
      // initializePeer();  
      // initializeSocket();                                                     
    })
    .catch((err) => {
      console.error("Error accessing media devices:", err);
    });


    //peer setup
    console.log("4");
    
    peerRef.current.on("open", (peerId) => {
      // console.log('hai from peeref.current.on');
      
      // console.log("PeerJS ID:", peerId);
      console.log('socket.current from second',socketRef.current);
      console.log("hai iam from localsteram ref secondd",localStreamRef.current);
      
      if (socketRef.current && localStreamRef.current) {
        console.log('hai iam from going to emit socketref emit');
        
        socketRef.current.emit("join-room", { roomId: bookingId, peerId });
      }
    });

    peerRef.current.on("error", (err) => {
      console.error("PeerJS Error:", err);
    });

    peerRef.current.on("call", (call) => {
      console.log("Trying to  call");
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
        call.on("stream", (remoteStream) => {
          setRemoteStreams((prev) => {
            if (!prev.some((s) => s.peerId === call.peer)) {
              return [...prev, { peerId: call.peer, stream: remoteStream }];
            }
            return prev;
          });
        });
        call.on("error", (err) => console.error("Call Error:", err));
      }
    });


    //socket setup
    console.log("5");
    
    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
    });

    socketRef.current.on("connect_error", (err :any) => {
      console.error("Socket Connect Error:", err.message);
    });

    socketRef.current.on("user-connected", (peerId: string) => {
      console.log("User connected:", peerId);
      if (peerRef.current && localStreamRef.current) {
        const call = peerRef.current.call(peerId, localStreamRef.current);
        call.on("stream", (remoteStream) => {
          setRemoteStreams((prev) => {
            if (!prev.some((s) => s.peerId === peerId)) {
              return [...prev, { peerId, stream: remoteStream }];
            }
            return prev;
          });
        });
        call.on("error", (err) => console.error("Call Error:", err));
      }
    });

    socketRef.current.on("user-disconnected", (peerId: string) => {
      setRemoteStreams((prev) => prev.filter((s) => s.peerId !== peerId));
    });



console.log("6");

    console.log(peerRef.current,"peerref curen");
    
    // const initializePeer = () => {
      
    //   if (!peerRef.current) return;

      
    //   peerRef.current.on("open", (peerId) => {
        
    //     console.log("PeerJS ID:", peerId);
    //     if (socketRef.current && localStreamRef.current) {
    //       socketRef.current.emit("join-room", { roomId: bookingId, peerId });
    //     }
    //   });

    //   peerRef.current.on("error", (err) => {
    //     console.error("PeerJS Error:", err);
    //   });

    //   peerRef.current.on("call", (call) => {
    //     console.log("Trying to answer call");
    //     if (localStreamRef.current) {
    //       call.answer(localStreamRef.current);
    //       call.on("stream", (remoteStream) => {
    //         setRemoteStreams((prev) => {
    //           if (!prev.some((s) => s.peerId === call.peer)) {
    //             return [...prev, { peerId: call.peer, stream: remoteStream }];
    //           }
    //           return prev;
    //         });
    //       });
    //       call.on("error", (err) => console.error("Call Error:", err));
    //     }
    //   });
    // };

    // const initializeSocket = () => {
      
    //   if (!socketRef.current) return;

    //   socketRef.current.on("connect", () => {
    //     console.log("Socket connected:", socketRef.current?.id);
    //   });

    //   socketRef.current.on("connect_error", (err :any) => {
    //     console.error("Socket Connect Error:", err.message);
    //   });

    //   socketRef.current.on("user-connected", (peerId: string) => {
    //     console.log("User connected:", peerId);
    //     if (peerRef.current && localStreamRef.current) {
    //       const call = peerRef.current.call(peerId, localStreamRef.current);
    //       call.on("stream", (remoteStream) => {
    //         setRemoteStreams((prev) => {
    //           if (!prev.some((s) => s.peerId === peerId)) {
    //             return [...prev, { peerId, stream: remoteStream }];
    //           }
    //           return prev;
    //         });
    //       });
    //       call.on("error", (err) => console.error("Call Error:", err));
    //     }
    //   });

    //   socketRef.current.on("user-disconnected", (peerId: string) => {
    //     setRemoteStreams((prev) => prev.filter((s) => s.peerId !== peerId));
    //   });
    // };

    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((stream) => {
    //     console.log("Got local stream");
    //     localStreamRef.current = stream;
    //     if (localVideoRef.current) {
    //       localVideoRef.current.srcObject = stream;
    //     }
    //     console.log("here is the localstream ref now",localStreamRef.current);
        
    //     // initializePeer();
    //     // initializeSocket();
    //   })
    //   .catch((err) => {
    //     console.error("Error accessing media devices:", err);
    //   });


    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [bookingId]);

  const handleLeaveCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Video Call - Booking ID: {bookingId}</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-64 h-48 bg-black rounded-lg"
          />
          <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">You</p>
        </div>
        {remoteStreams.map((stream) => (
          <div key={stream.peerId} className="relative">
            <video
              autoPlay
              ref={(video) => { if (video) video.srcObject = stream.stream; }}
              className="w-64 h-48 bg-black rounded-lg"
            />
            <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">
              Participant
            </p>
          </div>
        ))}
      </div>
      <Button
        variant="destructive"
        onClick={handleLeaveCall}
        className="mt-4"
      >
        Leave Call
      </Button>
    </div>
  );
}