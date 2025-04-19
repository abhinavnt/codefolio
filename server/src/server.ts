import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const server = createServer(app);

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
  allowedHeaders: ["Content-Type"],
}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling"], // Force polling to bypass WebSocket issues
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
    socket.to(roomId).emit("user-connected", peerId);

    socket.on("disconnect", () => {
      console.log(`User with peerId ${peerId} disconnected from room ${roomId}`);
      socket.to(roomId).emit("user-disconnected", peerId);
    });
  });
});

const peerServer = ExpressPeerServer(server, {
  path: "/",
});

app.use("/peerjs", peerServer);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});