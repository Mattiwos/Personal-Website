import React from "react";
//import ReactDOM from 'react-dom'

import { App } from "../testsecret";
var secret = new App.Secret();

// eslint-disable-next-line
//import React, { Component } from "react";
/* eslint-disable import/first */
import io from "socket.io-client";

//import io from "socketio";

interface Props {
  //interface is used to make entities such as Property conform with
  products?: string[]; //contains all the properies such as html tag
}

interface State {
  key: string;
  //quantities: { [key: string]: number};  //represents elements of the page that could change
}

class Login extends React.Component<Props, State> {
  baseUrl: any;
  socket: SocketIOClient.Socket;

  constructor(props: Props, state: State) {
    super(props);
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

    this.socket.on("authres", (arg: { wrong: boolean; key: any }) => {
      if (arg.wrong === true) {
        alert("Key is incorrect");
      }
      if (arg.wrong === false) {
        window.location.href = `/dashboard/homepage`;
        gotohomepage()
        document.cookie = `key= ${arg.key}`;
      }
    });

    this.socket.emit('LoginAttempt')


    console.log("response");

    this.state = {
      key: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: { target: { value: string } }) {
    this.setState({ key: event.target.value });
    console.log(this.state.key);
  }

  render() {
    return (
      <div>
        <div className="authkey">
          <label style = {{color: "red",}} htmlFor="key">Auth-Key </label>

          <input
            style = {{background: "transparent",color: "red",textAlign: "center",maxWidth: "fit-content"}}
            className="u-full-width"
            type="text"
            id="key"
            value={this.state.key}
            onChange={this.handleChange}
            name="key"
          ></input><br></br>
          <button style = {{background: "transparent",color: "red"}} id="submit" type="button" onClick={() => this.buttonclick()}>
            Submit
          </button>
        </div>
      </div>
    );
  }
  buttonclick() {
    console.log(this.state.key);
    this.socket.emit("authreq", {
      key: this.state.key
    });
    console.log("sent");
  }
}
function gotohomepage(){
  window.location.href = `/dashboard/homepage`
}

export default Login;
