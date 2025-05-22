// src/socket/socket.ts

import { Server as HttpServer } from "http";
import { Namespace, Server as SocketIOServer } from "socket.io";
import { ExpressPeerServer } from "peer";
import app from "../app";

const roomScreenSharingPeers: { [roomId: string]: string | null } = {};

let notificationIo: Namespace;

const CLIENT_URL = process.env.CLIENT_URL;

export const setupSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["polling","websocket"],
  });

    notificationIo = io.of("/notifications");

  
  notificationIo.on("connection", (socket) => {
    

    // Join a room based on userId
    socket.on("join-user", (userId: string) => {
      socket.join(userId);
      
    });

    socket.on("disconnect", () => {
      
    });
  });

  io.on("connection_error", (err) => {
    console.log("Connection Error:", err.message, err.context);
  });

  io.on("connect_error", (err) => {
    console.log("Connect Error:", err.message, err.context);
  });

  io.on("connection", (socket) => {
    

    socket.on("join-room", ({ roomId, peerId }) => {
      socket.join(roomId);
      

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


      socket.on("chat-message", (data) => {
        const { roomId, message } = data;
        io.to(roomId).emit("chat-message", message);
      });

      socket.on("disconnect", () => {
        
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

  return { io, notificationIo };
};

export { notificationIo };
