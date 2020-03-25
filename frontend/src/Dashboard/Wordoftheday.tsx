import { App } from "../testsecret";
var secret = new App.Secret();
/* eslint-disable import/first */
import * as React from "react";
// import Request from "request";

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
    tempid!: string; //alldya
 //alldya
   
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

        // Request.get("http://ipinfo.io", (error: any, response: any) => {
        //     if(error) {
        //         return error;
        //     }    
        //     alert(response.ip);
        // }, "jsonp").then((data:any) => {
        //     // Use data
        // })
        // .catch((err:any) => {
        //     // Handle err
        // });
      
       

      


    }
   


    render(){
        const mystyle = {
            padding: "2px",
            fontFamily: "Arial",
            size: 2,
            fontSize: "xx-large",

            
          };
          
        return (
            <div>
                <div>
                    {/* <h1 style ={mystyle} >Word of the Day</h1> */}
                    <br/>
                    <p>Word:</p>
                    <p>Def:</p>
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