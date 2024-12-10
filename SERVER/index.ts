import express, { Express } from "express";
import "dotenv/config";
import cors from "cors";
import chalk from "chalk";
import http from "http";
import { Server } from "socket.io";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
let connectedDevices: string[] = [];
app.use(express.json());

io.on("connection", (socket) => {
  connectedDevices.push(socket.id);
  console.log("user connected");

  socket.on("cam-ready", () => {
    console.log("cam-ready");

    socket.emit("cam-ready", socket.id);
  });
  socket.on("disconnect", () => {
    connectedDevices = connectedDevices.filter((id) => id !== socket.id);
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log(chalk.blue(`Listening on: http://localhost:${3000}`));
});
