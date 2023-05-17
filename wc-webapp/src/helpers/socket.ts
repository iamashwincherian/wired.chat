"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
const socket = io("ws://localhost:4000");

// const useSocket = () => {
//   let socket: Socket;

//   useEffect(() => {
//     socket.connect();
//     socket.on("connect", () => {
//       console.log("client to the socket");
//     });

//     socket.on("disconnect", () => {
//       socket.disconnect();
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);
//   return socket;
// };

export default socket;
