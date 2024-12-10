import Peer from "peerjs";
import { io } from "socket.io-client";

export class SocketService {
  private static instance: SocketService;
  public socket;
  public myPeer;
  private constructor() {
    this.socket = io("https://zoom-socket.onrender.com");
    this.myPeer = new Peer(localStorage.isMain == 1 ? "controller" : "device", {
      host: "localhost",
      port: 3001,
    });
  }
  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }
}
