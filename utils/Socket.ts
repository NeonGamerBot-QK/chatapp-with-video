import type { Socket } from "socket.io-client";
type Message = {
    author: string;
    message: string;
  };
  type PeopleTyping = {
    [name: string]: boolean;
  }
  const  msgs:Message[] = []
let peopleTyping:PeopleTyping = {}
  export default function SocketHandler(io: any, socket: any): void {
    socket.broadcast.emit("messages", msgs);

socket.on("messageCreate", (msg: Message) => {
    console.debug("messageCreate#()")
msgs.push(msg)
socket.broadcast.emit("messages", msgs);

})
socket.on("message:request", () => {
    console.debug("message:request#()")
    socket.emit("messages", msgs)
})

socket.on('test:join-room', (roomId:string , userId: string) => {
    console.debug("test:join-room", socket)
    socket.join(roomId)
    const room = io.of("/").to(roomId)
console.debug("room:", room.emit)
    room.emit('test:user-connected', userId)

    socket.on('disconnect', () => {
      room.emit('test:user-disconnected', userId)
    })
  })
function removeDuplicateObjectFromArray(array:string[], key:string) {
    var check:any = {};
    var res:string[] = [];
    array.forEach((element:string) => {
        if(!check[element]) {
            check[element] = true;
            res.push(element);
        }
    });
    return res;
}
const userNamespace = io.of("/users");
userNamespace.on("user:typing", (user: string, valid: boolean) => {
if(valid) {
    peopleTyping[user] = true;
} else {
    delete peopleTyping[user]
}
    socket.broadcast.emit("typing", user, valid)
})
}