import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAppSelector } from "../redux/store";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const newSocket = io("/notifications", {
      transports: ["polling"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Connected to notification socket:", newSocket.id);
      if (user?._id) {
        newSocket.emit("join-user", user._id);
      }
    });

    newSocket.on("connect_error", (err) => {
      console.error("Notification socket connect error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user?._id]);

  return socket;
};