
//not compiling
import { App } from "../secret";
var secret = new App.Secret();

// eslint-disable-next-line
import React, { Component } from "react";
/* eslint-disable import/first */
import {
  // BrowserRouter as Router,
  Route
  // BrowserRouter
} from "react-router-dom";

import io from "socket.io-client";
import Login from "./Login";
import Board from "./Board";

interface Props {
  products: string[]; //contains all the properies such as html tag
}
interface State {
  displayboard: boolean;
  x:any;
  y:any;
}

class Guide extends React.Component<Props, State> {
  baseUrl: string;
  socket: SocketIOClient.Socket;
  

  constructor(props: Props, state: State) {
    super(props);

    this.state = {
      displayboard: false,
      x:50,
      y: 50
    };

    this.baseUrl = secret.getIP();
    this.socket = io(this.baseUrl, {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ["websocket"],
      agent: false, // [2] Please don't set this to true
      upgrade: false,
      rejectUnauthorized: false
    });
    this.socket.on("connect", () => {
      console.log("socket connected!");
    });

    this.socket.on("connect_error", (err: string) => {
      console.log("socket connected error --> " + err);
    });

    this.socket.on("reconnect_attempt", () => {
      this.socket.io.opts.transports = ["websocket"];
    });
    this.sendReq();

    this.socket.on("ressessionkey", (arg: { wrong: boolean }) => {
      if (arg.wrong === true) {
        //Mattiwos
        //window.location.href = "/Guide";
        this.setState(state => {});
      } else {
        this.setState(state => {
          return { displayboard: true };
        });
      }
    });
    setInterval(()=>this.tick(),1000)
  }
  render() {
      
    return (
    //   <BrowserRouter>
        <div>
          <Route
            exact={true}
            path="/dashboard"
            render={() => (
              <div className="App">
                <Login></Login>
              </div>
            )}
          />
          <Route
            exact={true}
            path="/dashboard/homepage"
            render={() => <div className="App">{this.keyAuthentication()}</div>}
          />
        </div>
    // {/* //   </BrowserRouter> */}
    );
  }
  tick(){
    this.setState(state => {
      var n = (Math.random() > .5) ? -1 : 1
      var ns = (Math.random() > .5) ? -1 : 1
      return { 
        x: state.x + 2 *Math.random() * n,
        y: state.y + 2 *Math.random() *ns
        };
    });
  }

  keyAuthentication() {
    if (this.state.displayboard === false) {
    

      

      return (
        
        <div>

          <h1 style = {{position:"fixed",left: `${this.state.x}%`,bottom: `${this.state.y}%`  }}>
            
            <span role = "img" aria-label="snow"> ❄️</span> 
          ️</h1>
        </div>

      );
    } else return <Board></Board>;
  }
  errorPagefun(){
    
      

    
    

  }
  sendReq() {
    console.log("Auth process started");
    this.socket.emit("sessionkey", {
      sesskey: getCookie("key")
    });
  }
}

function getCookie(cname: string) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default Guide;
