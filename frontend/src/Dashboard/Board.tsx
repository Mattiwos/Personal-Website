import { App } from "../testsecret";
var secret = new App.Secret();
/* eslint-disable import/first */
import * as React from "react";

import io from "socket.io-client";

import Noteboard from "./Noteboard"
import WordofTheDay from "./Wordoftheday";

//  

interface Props {
  //interface is used to make entities such as Property conform with
  products?: string[]; //contains all the properies such as html tag
}

interface State {
  hasError: boolean;
  htmltxt: string;
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
    this.baseUrl = secret.getLocalhost();
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
      htmltxt: ""
    };

    this.socket.on("connect", () => {
      console.log("socket connected!");
    });

    this.socket.on("connect_error", (err: string) => {
      console.log("socket connected error --> " + err);
    });

   

    this.socket.on("htmlpageres", (arg: { pagetxt: string }) => {
      console.log(arg.pagetxt);
      this.setState(state => {
        this.componentDidMount();
        return { htmltxt: arg.pagetxt };
      });
    });

    this.getPage = this.getPage.bind(this);
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

  render() {
    return (
      <div>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"></link>

        <div ref={node => (this.getPageContainer = node)}>
          <div id="hiddenpage"></div>
        </div>
        <div><h1>Dashboard</h1></div>
        <div className="container">
              <div className="row">
                   <div className="col-sm">
                     <h2>Notes:</h2>
                     <Noteboard></Noteboard>
                    </div>
                    <div className="col-sm">
                       email?
                    </div>
                    <div className="col-sm">
                   
                      <WordofTheDay></WordofTheDay>
                    
                </div>
          </div>
         </div>

        
        

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
