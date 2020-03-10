import { App } from "../testsecret";
var secret = new App.Secret();
/* eslint-disable import/first */
import * as React from "react";

import io from "socket.io-client";

interface Props {
    products?: string[]; //contains all the properies such as html tag
}
interface State {
    displayboard: boolean;
}

class Noteboard extends React.Component<Props, State> {
    baseUrl: string;
    socket: SocketIOClient.Socket;
    

    constructor(props: Props, state: State){
        super(props);

        this.baseUrl = secret.getLocalhost();
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

    }


    render(){
        return (

            <div style = "
                background-color: lightblue,
                width: 200px

            ">
                <h1>Yo.</h1>
            </div>

        );

    }


}

export default Noteboard;