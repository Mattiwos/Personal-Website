import { App } from "../testsecret";
var secret = new App.Secret();
/* eslint-disable import/first */
import * as React from "react";
import Request from "request";

import io from "socket.io-client";


interface Props {
    products?: string[]; //contains all the properies such as html tag
}
interface State {
    
    wordoftehdaylist: any;

}

class WordofTheDay extends React.Component<Props, State> {
    baseUrl: string;
    socket: SocketIOClient.Socket;
   
    constructor(props: Props, state: State){
        super(props);

        this.baseUrl = secret.getLocalhost();
        this.state = {wordoftehdaylist: undefined};

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

        this.socket.on("wordoftheday", (arg: { wod: {word: string} , test: string }) => {
            console.log(arg.test);
            this.setState(state => {
            //   this.componentDidMount();
              return { wordoftehdaylist: JSON.stringify(arg.wod.word )};
            });
          });

        Request.get("https://dictionaryapi.com/api/v3/references/collegiate/json/test?key=9e9ca34c-7e51-41cc-bf5e-4dd5e8a0f613", (error: any, response: any, body: any) => {
            if(error) {
                return error;
            }
            console.dir(JSON.parse(body))
        
          return 0;
        
        });


    }


    render(){
        const mystyle = {
            padding: "2px",
            fontFamily: "Arial",
            
          };
          
        return (
            <div>
                <div style ={mystyle}>
                    <h1>Word of the Day</h1>
                </div>
                {this.displaywords()}
        


            </div>
            

            

        );

    }
    wordofthedayreq(){
        console.log("sending request")
        this.socket.emit('wordofthedayreq',{});

    }
    displaywords(){
        if (this.state.wordoftehdaylist !== undefined){
           return(
            <div>
                <h1>should display</h1>
             </div>

           );
           
        }
     

    }



}


export default WordofTheDay;