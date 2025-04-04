const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const MessageService = require("./services/message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // Add your frontend URL(s)
    credentials: true,
  },
});

// Store active rooms and their connected sockets
const rooms = new Map();

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle joining a room
  socket.on("join-room", ({ roomId, userId }) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Handle messages in a room
  socket.on("send-message", async (data) => {
    const { roomId, userId, message, receiverId = null } = data;
    const newMessage = await MessageService.createMessage({
      message,
      roomId,
      userId,
      receiverId,
    });

    io.to(roomId).emit("receive-message", newMessage);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    rooms.forEach((sockets, roomId) => {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
    console.log("A user disconnected");
  });
});

// Export the server instead
module.exports = server;
