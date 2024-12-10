import { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { SocketService } from "./socket";

export default function App() {
  const [isMain, setIsMain] = useState(+localStorage.isMain);
  const vid_me = useRef<HTMLVideoElement>(null);
  const vid_main = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // const socket = SocketService.getInstance().socket;
    const myPeer = SocketService.getInstance().myPeer;
    makeACall(myPeer);
    // socket.on("cam-ready", (sid) => {
    //   //answerCall
    // });
  }, []);

  const makeACall = (peer: Peer) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
      (stream) => {
        vid_me.current!.srcObject = stream;
        vid_me.current!.play();
        const call = peer.call("controller", stream);
        call.on("stream", (remoteStream) => {
          vid_main.current!.srcObject = remoteStream;
          vid_main.current!.play();
        });
        peer.on("call", (call) => {
          call.answer(stream);
        });
      },
      (err) => {
        console.error("Failed to get local stream", err);
      }
    );
  };

  return (
    <div>
      <button
        onClick={() => {
          setIsMain(isMain == 1 ? 0 : 1);
          localStorage.isMain = isMain == 1 ? 0 : 1;
        }}
      >
        {isMain == 1
          ? "i am controller, set me to device"
          : "i am device, set me to controller"}
      </button>
      <video style={{ width: "50vw" }} muted ref={vid_me}></video>
      <video style={{ width: "50vw" }} muted ref={vid_main}></video>
    </div>
  );
}
