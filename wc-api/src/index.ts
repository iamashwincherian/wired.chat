import express, { Express } from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

import connectDB from "./db";
import socket from "./socket";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

dotenv.config();
socket(io);
connectDB();

// Middlewares
app.use(cors());

const PORT = process.env.PORT;
server.listen(PORT, () =>
  console.log(`⚡️[server]: Server is running at port: ${PORT}`)
);
