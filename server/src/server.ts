// src/server.ts

import app from "./app";
import { createServer } from "http";
import { setupSocket } from "./socket/socket";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const server = createServer(app);

const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
  })
);

setupSocket(server);

server.listen(PORT, () => {
  
});
