import type { NextPage } from 'next';
import  { useState, useRef, useEffect } from 'react';
import io, { Socket } from "socket.io-client";
let socket:Socket | null;
import Peer from 'peerjs';
const TestPage: NextPage = () => { 
    const [uvideo, setVideo] = useState<any>(null)
    const [videos, setVideos] = useState<any>([])
    const [mypeer, setPeer] = useState<any>(null)
    const [peers, setPeers] = useState<any>({})
    const [state, setState] = useState<any>({
      myId: '',
      friendId: '',
      peer: {},
      message: '',
      messages: []
    })
    const myVideo = useRef(null) 
    const friendVideo = useRef(null) 
   
      useEffect(() => {
        const CallSocket = async () => {
          await fetch("/api/socket");
          socket = io();
  
          socket.on('test:user-disconnected', userId => {
              if (peers[userId]) peers[userId].close()
            })
        }
        CallSocket()
          }, [peers])
          useEffect(() => {
            const peer = new Peer('', {
              host: 'localhost',
              port: 3001,
              path: '/',
            });
            
    peer.on('open', (id) => {
      setState({
        myId: id,
        peer: peer
      });
    });
    peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        setState({
          messages: [...state.messages, data]
        });
      });
    });
    peer.on('call', (call) => {
      const getUserMedia = navigator.mediaDevices.getUserMedia;

      getUserMedia({ video: true, audio: true }).then((stream) => {
if(myVideo.current) {
  (myVideo.current as HTMLVideoElement).srcObject = stream;
  (myVideo.current as HTMLVideoElement).play();
}
        
        call.answer(stream);

        call.on('stream', (remoteStream) => {
       if (friendVideo.current) {
        (friendVideo.current as HTMLVideoElement) .srcObject = remoteStream;
        (friendVideo.current as HTMLVideoElement).play();
       }
        });

      });
    });
          })
          
    // useEffect(() => {
    //     if(!mypeer && socket) {
    //         import('peerjs').then(({ default: Peer }) => {
    //             // Do your stuff here
    //         console.log(Peer, "PEER")
    //         const myPeer = new Peer({
    //             host: '/',
    //             port: 3001
    //           })
    //           setPeer(myPeer)
    //           myPeer.on('open', id => {
    //             console.debug("OPEND")
    //             socket?.emit('test:join-room', window.location.pathname.slice(1), id)
    //           })
    //           navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {

    //             const videoCurr = videoRef.current;
    //             if (!videoCurr) return
    //             const video = videoCurr! as HTMLVideoElement
    //                 video.srcObject = stream;
    //                 video.play();
          
    //             const call = myPeer.call("test", stream);
          
    //             call.on('stream', (remoteStream: MediaStream) => {
    //               const fvideoCurr = videoRef.current;
    //               if (!fvideoCurr) return
    //               const fvideo = fvideoCurr! as HTMLVideoElement
    //               fvideo.srcObject = remoteStream;
    //               fvideo.play();
    //             });
    //           });
    //           myPeer.on('call', (call) => {
    //             var getUserMedia = navigator.mediaDevices.getUserMedia;
          
    //             getUserMedia({ video: true, audio: true }).then((stream) => {
    //               const videoCurr = videoRef.current;
    //               if (!videoCurr) return
    //               const video = videoCurr! as HTMLVideoElement
    //                   video.srcObject = stream;
    //                   video.play();
          
    //                call.answer(stream);
          
    //               call.on('stream', (remoteStream) => {
    //                 const fvideoCurr = videoRef.current;
    //                 if (!fvideoCurr) return
    //                 const fvideo = fvideoCurr! as HTMLVideoElement
    //                 fvideo.srcObject = remoteStream;
    //                 fvideo.play();
    //               });
              
    //             });
    //           });
    //           });
    //     }
    // })
    const addVideoStream = (video: any, stream: any) => {
setVideos((oldVids:any) => [...oldVids, video])
    }
    useEffect(() => {
      function connectToNewUser(userId:string, stream:any) {
        const call = mypeer.call(userId, stream)
        const video = (<video> </video>)
        const id = videos.length
        video.props.srcObject = stream;
        video.props.id = id
        call.on('stream', (userVideoStream: any) => {
          addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
          setVideos((oldVids: any) => {
            return oldVids.filter((vid: any) => {
                vid.props.id !== id
            })
          })
        })
      
        setPeers((oldPeers: any) => {
            return {
                ...oldPeers,
                userId: call
            }
        })
      }
        // const runVideo = () => {
        //     let inter = setInterval(() => {
        //        navigator.mediaDevices.getUserMedia({video:true, audio:true}).then((stream) => {
       
        //            const videoCurr = videoRef.current;
        //            if (!videoCurr) return
        //            const video = videoCurr! as HTMLVideoElement
        //            if(!video.srcObject) {
        //                video.srcObject = stream;
        //            stream.addEventListener("addtrack", console.log)
        //         //    console.log("getAudioTracks"); 
        //         //    console.log(stream.getAudioTracks()); 
        //         //    console.log("getVideoTracks()"); 
        //         //    console.log(stream.getVideoTracks());   
               
        //            mypeer.on("call", (call:any) => {
        //            console.debug("call#call")
        //             call.answer(stream)
        //             const video = (<video> </video>)
        //             video.props.srcObject = stream;
        //             call.on('stream', (userVideoStream: any) => {
        //            console.debug("call#stream(")
        //                 addVideoStream(video, userVideoStream)
        //             })
        //             socket?.on('test:user-connected', userId => {
        //                 connectToNewUser(userId, stream)
        //               })
        //         })  
        //        }
        //                    })
        //     }, 5000)
        //     return () => clearInterval(inter);
        //    }
      //  return runVideo()
    }, [mypeer, videos.length])
    const toggleVideo = () => setVideo(!uvideo);
    return (<>
  <button onClick={toggleVideo}> Get video </button>  
  <video ref={myVideo}  autoPlay muted> </video>
    <br />
    {videos.map((video:any, index: number) => {
        return (<div key={index}>
Number: {index} <br />
{video}
        </div>)
    })}
     <video ref={friendVideo} />
        </>)
}
export default TestPage;