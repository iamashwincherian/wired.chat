import express, { Express } from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

dotenv.config();
app.use(cors());
const PORT = process.env.PORT;

io.on("connection", (socket) => {
  const count: number = io.of("/").sockets.size;
  const { id: connectionId } = socket;
  console.log("User connected:", socket.id, count);

  socket.on("message", ({ message, room, user }) => {
    console.log(`${connectionId}:`, message);
    io.to(room).emit("message", {
      type: user === socket.user ? "mine" : "others",
      message,
    });
  });

  socket.on("chatroom-join", ({ room, user }) => {
    console.log("joining room:", room);
    socket.join(room);
    socket.user = user;
    io.to(room).emit("chatroom-mod", {
      type: "mod",
      user,
      state: "connected",
    });
  });

  socket.on("disconnect", () => {
    console.log("user got disconnected", connectionId, io.of("/").sockets.size);
  });
});

server.listen(PORT, () =>
  console.log(`⚡️[server]: Server is running at port: ${PORT}`)
);
