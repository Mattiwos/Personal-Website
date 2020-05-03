import { Secret } from "../secret";
var secret = new Secret();
/* eslint-disable import/first */
import * as React from "react";

import io from "socket.io-client";

import Noteboard from "./Noteboard"
import WordofTheDay from "./Wordoftheday";
import Schedule from './Schedule'
import Display from "../LiveStream/Display"
//  


interface Props {
  //interface is used to make entities such as Property conform with
  products?: string[]; //contains all the properies such as html tag
}

interface State {
  hasError: boolean;
  htmltxt: string;
  randomColor: string;
  random2Color:string;
  //quantities: { [key: string]: number};  //represents elements of the page that could change
}

class Board extends React.Component<Props, State> {
  baseUrl: string;

  dom: HTMLDivElement | undefined;
  socket: SocketIOClient.Socket;
  getPageContainer: HTMLDivElement | null | undefined;
 

  constructor(props: Props, state: State) {
    super(props);
    // this.state = state;
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
    this.state = {
      hasError: false,
      htmltxt: "",
      randomColor: "red",
      random2Color: "blue",

    };

    this.socket.on("connect", () => {
      console.log("socket connected!");
    });

    this.socket.on("connect_error", (err: string) => {
      console.log("socket connected error --> " + err);
    });

   

    this.socket.on("htmlpageres", (arg: { pagetxt: string }) => {
     
      this.setState(state => {
        this.componentDidMount();
        return { htmltxt: arg.pagetxt };
      });
    });

    this.getPage = this.getPage.bind(this);
    setInterval(() => this.tick(), 1000);


  }

  getPage() {
    console.log(this.stringToHTML(this.state.htmltxt).innerHTML);
    return this.stringToHTML(this.state.htmltxt);
  }
  stringToHTML(str: string) {

    this.dom = document.createElement("div");
    this.dom.innerHTML = str;
    return this.dom;
  }

  componentDidMount() {
    if (this.getPageContainer != null)
      this.getPageContainer.appendChild(this.getPage());
     
     
  }
  tick(){
    this.changeTcolor()

  }
  changeTcolor = () => {
    this.setState(state => {
      // Important: read `state` instead of `this.state` when updating.
      return {
        randomColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
        random2Color: "#" + ((Math.random() * 0xffffff) << 0).toString(16)
      };

    });

  };

  render() {
    return (
      <div>
        
        

        <div ref={node => (this.getPageContainer = node)}>
          <div id="hiddenpage"></div>
        </div>
        <div><h1 style = {{color: this.state.randomColor}} >Dashboard</h1>
        <p style = {{color: this.state.random2Color}} >By Mattiwos B.</p>
        </div>


    <div className="grid-stack">
      <div className="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2">
        <div className="grid-stack-item-content">
        <h2 style = {{color: "red"}} >Notes:</h2>
        <Noteboard/>
          </div>
      </div>
      <div className="grid-stack-item" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="4">
        <div className="grid-stack-item-content">
        <h2 style = {{color: "red"}} >Schedule:</h2>
          <Schedule/>
        
        </div>
      </div>
      <div className="grid-stack-item" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="4">
        <div className="grid-stack-item-content">
        <h2 style = {{color: "red"}} >WOD:</h2>
          <WordofTheDay/>
        
        </div>
      </div>

      <div className="grid-stack-item" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="4">
        <div className="grid-stack-item-content">
        <h2 style = {{color: "red"}} >Live Feed:</h2>
          <Display/>
        
        </div>
      </div>

    </div>

    <script type="text/javascript">
    GridStack.init();
    console.log("Ree")
    </script>
    
   
        
        

      </div>
    );
  }
  htmlreq() {
    this.sendReq();
    this.socket.emit("homepagereq", {
      sesskey: getCookie("key")
    });
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

export default Board;
//JSX allows you to use html in typescript .tsx makes it expect to encounter html
