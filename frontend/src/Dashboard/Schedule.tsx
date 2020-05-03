/* eslint-disable import/first */
import * as React from "react";
import io from "socket.io-client";

import Request from 'request'
import { Secret } from "../secret";
var secret = new Secret();

interface Props{
    products?: String[]
}
interface States{
    schedule?: any
}

export default class Schedule extends React.Component<Props,States>{
    socket: SocketIOClient.Socket;
    tempip: string;
    baseUrl: string
    constructor(props:Props,states: States){
        super(props);
        this.tempip = ""

        this.state ={
            schedule: undefined
        }

        this.getIpAddress()
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
        this.socket.on("connect_error", (err: string) => {
            console.log("socket connected error --> " + err);
        });
        this.socket.on("collList", (arg: {list:any, collname: string} ) => {
            if (arg.collname === 'Schedule'){
                this.setState({schedule: arg.list});
            }
           
          
        });



    }
    reloadnotes(){
        this.socket.emit('reqcolllist',{
            sessid: getCookie('key'),
            collname: 'Schedule'
        })
    }

    render(){//Schedule
        return (
            <div>   
                



            </div>

        );

    }
    async getIpAddress(){// I just wanna know more about you...
        this.tempip = "";
        Request.get("https://jsonip.com/?callback=?", (error: any, response: any, body: any) => {
            if (error) {
                return error;
            }
            this.tempip = JSON.parse(body.slice(2, body.length - 2)).ip;
            console.log("IP: " + this.tempip);
            
        })
    }

    addNote(collname: string){



        this.socket.emit('addtolist', {
            name: this.tempip,
            note: "",
            collname:collname


        })

        

    }
    removeNote(id: string, collname: string){
        this.socket.emit('removeFromList', {
            id: id,
            sessid: getCookie('key'),
            collname:collname
        })

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
