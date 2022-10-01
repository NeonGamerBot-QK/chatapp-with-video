//@ts-ignore
import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from 'next'
import { Socket } from "socket.io-client";
import handle from "../../utils/Socket";
export default function SocketHandler(req: NextApiRequest,res: any):void {
if(res.socket.server.io) {
    console.log("[SOCKET.IO] already setup")
    res.end();
    return;
}
//Typings for socket
interface ServerToClientEvents { 
    messageCreate: (msg: string) => void;
}
interface ClientToServerEvents {
    e: () => void;
  }
  interface InterServerEvents {
    ping: () => void;
  }
  
  interface SocketData {
    name: string;
    age: number;
  }
// run io
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(res.socket.server);
res.socket.server.io = io;
const onConnect = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    handle(io, socket);
}
io.on("connection", onConnect as any);
console.log("SOCKET.IO connection established");
res.end();
}