import { App } from "../testsecret";
var secret = new App.Secret();
// eslint-disable-next-line
import React, { Component } from "react";
/* eslint-disable import/first */
import io from "socket.io-client";

interface Props{
    product?: String[];

}
interface States{
   liveimg: any;
   imgrendered: any;



}

class Display extends React.Component<Props,States> {
    baseUrl: string;
    socket: SocketIOClient.Socket;


  constructor(props: Props, state: States) {
    super(props);
    this.baseUrl = secret.getIP();
   
    this.state = {
        liveimg: undefined,
        imgrendered: undefined
      };

    this.socket = io(this.baseUrl, {
        reconnectionDelay: 1000,
        reconnection: true,
        reconnectionAttempts: 10,
        transports: ["websocket"],
        agent: false, 
        upgrade: false,
        rejectUnauthorized: false
      });

      this.socket.on("connect", () => {
      console.log("socket connected!");
      });

      this.socket.on("connect_error", (err: string) => {
      console.log("socket connected error --> " + err);
      });
      this.socket.on('liveFeed', (arg:any)=>{
        var bytes = new Uint8Array(arg);
        console.log("New Frame recieved")

        this.setState({liveimg: encode(bytes) })
      });

    
    setInterval(() => this.tick(), 1000/60);
  }
  componentDidMount(){

    
  }

  
  tick() {
    // refreshPage()
    
  }
  imgrender(){
      if (this.state.liveimg === null ||this.state.liveimg === undefined) {
        return <div></div>
      }
      else{
          return <img alt = "true" id="Feed" src = {`data:image/png;base64,${this.state.liveimg}` } ></img>;
      }
  }

  render() {
    

    return (
      <div>
       
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"></link>

        <h1 style={{color: "red"}} >Live</h1>

        {this.imgrender()}
        

        

      </div>
    );
  }
}
// public method for encoding an Uint8Array to base64
function encode (input: any) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}
// eslint-disable-next-line
function refreshPage(){ 
  window.location.reload(); 
}



export default Display;
