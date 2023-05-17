import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if(res.socket?.server?.io) {
    console.log("server is already running")
  } else {
    console.log("socket is initializing")
    const io = new Server(res.socket?.server, {
      path: "/api/socket",
      addTrailingSlash: false
    });

    io.on("connection", (socket) => {
      console.log("user has joined:", socket.id)
      socket.on("message", (chat) => {
        console.log("message", chat)
      })
    })

    res.socket.server.io = io
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing
  },
};