import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "peerjs";
import io, { Socket } from "socket.io-client";
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
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Initialize Socket.io
    socketRef.current = io("http://localhost:5000", {
      transports: ["polling", "websocket"],
    });

    // Initialize PeerJS with path set to '/peerjs'
    peerRef.current = new Peer("", {
      host: "localhost",
      port: 5000,
      path: "/peerjs", // Matches the backend mount point
      secure: false,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
        ],
      },
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        peerRef.current!.on("open", (peerId) => {
          console.log("PeerJS ID:", peerId);
          socketRef.current!.emit("join-room", { roomId: bookingId, peerId });
        });

        peerRef.current!.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            setRemoteStreams((prev) => {
              if (!prev.some((s) => s.peerId === call.peer)) {
                return [...prev, { peerId: call.peer, stream: remoteStream }];
              }
              return prev;
            });
          });
        });

        socketRef.current!.on("user-connected", (peerId: string) => {
          const call = peerRef.current!.call(peerId, stream);
          call.on("stream", (remoteStream) => {
            setRemoteStreams((prev) => {
              if (!prev.some((s) => s.peerId === peerId)) {
                return [...prev, { peerId, stream: remoteStream }];
              }
              return prev;
            });
          });
        });

        socketRef.current!.on("user-disconnected", (peerId: string) => {
          setRemoteStreams((prev) => prev.filter((s) => s.peerId !== peerId));
        });
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
      });

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