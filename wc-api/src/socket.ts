import { Server, Socket } from "socket.io";

interface WiredSocket extends Socket {
  user?: object;
}

export default function handleSocket(io: Server) {
  io.on("connection", (socket: WiredSocket) => {
    const activeConnectionsCount: number = io.of("/").sockets.size;
    const { id: connectionId } = socket;

    console.log("User connected:", socket.id, activeConnectionsCount);

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
      console.log(
        "user got disconnected",
        connectionId,
        io.of("/").sockets.size
      );
    });
  });
}
