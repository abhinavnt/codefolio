// src/server.ts

import app from "./app";
import { createServer } from "http";
import { setupSocket } from "./socket/socket";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const server = createServer(app);

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
  allowedHeaders: ["Content-Type"],
}));

setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
