import app from "./app";
import { createServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { ExpressPeerServer } from "peer";
import cors from "cors";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
} as ServerOptions);

// Initialize PeerJS server with path set to '/'
const peerServer = ExpressPeerServer(server, {
  path: '/', // Use '/' to avoid path doubling
});

// Apply CORS middleware to the Express app
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}));

// Mount PeerJS server at /peerjs
app.use("/peerjs", peerServer);

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join-room", ({ roomId, peerId }) => {
    socket.join(roomId);
    console.log(`User with peerId ${peerId} joined room ${roomId}`);
    socket.to(roomId).emit("user-connected", peerId);

    socket.on("disconnect", () => {
      console.log(`User with peerId ${peerId} disconnected from room ${roomId}`);
      socket.to(roomId).emit("user-disconnected", peerId);
    });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});