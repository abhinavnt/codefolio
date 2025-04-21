// src/socket/socket.ts

import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { ExpressPeerServer } from "peer";
import app from "../app";

const roomScreenSharingPeers: { [roomId: string]: string | null } = {};

export const setupSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["polling"],
  });

  io.on("connection_error", (err) => {
    console.log("Connection Error:", err.message, err.context);
  });

  io.on("connect_error", (err) => {
    console.log("Connect Error:", err.message, err.context);
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join-room", ({ roomId, peerId }) => {
      socket.join(roomId);
      console.log(`User with peerId ${peerId} joined room ${roomId}`);

      socket.to(roomId).emit("user-connected", {
        peerId,
        screenSharingPeer: roomScreenSharingPeers[roomId] || null,
      });

      socket.on("screen-share-started", ({ roomId, peerId }) => {
        roomScreenSharingPeers[roomId] = peerId;
        socket.to(roomId).emit("screen-share-started", peerId);
      });

      socket.on("screen-share-stopped", ({ roomId, peerId }) => {
        if (roomScreenSharingPeers[roomId] === peerId) {
          roomScreenSharingPeers[roomId] = null;
        }
        socket.to(roomId).emit("screen-share-stopped", peerId);
      });

      socket.on("disconnect", () => {
        console.log(`User with peerId ${peerId} disconnected from room ${roomId}`);
        socket.to(roomId).emit("user-disconnected", peerId);
        if (roomScreenSharingPeers[roomId] === peerId) {
          roomScreenSharingPeers[roomId] = null;
          socket.to(roomId).emit("screen-share-stopped", peerId);
        }
      });
    });
  });

  const peerServer = ExpressPeerServer(server, {
    path: "/",
  });

  app.use("/peerjs", peerServer);
};
