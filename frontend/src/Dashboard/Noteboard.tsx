import { App } from "../testsecret";
var secret = new App.Secret();

/* eslint-disable import/first */
import Request from "request";
/* eslint-disable import/first */
import * as React from "react";

import io from "socket.io-client";

interface Props {
    products?: string[]; //contains all the properies such as html tag
}
interface State {
  
    noteinput:string;
    notes?: any;
    listNotes?: any;
    


}

class Noteboard extends React.Component<Props, State> {
    baseUrl: string;
    socket: SocketIOClient.Socket;
    tempip!: string;
    ul: any;
    listItems: any;
    prevclick?: any;

    constructor(props: Props, state: State){
        super(props);

        this.baseUrl = secret.getIP();
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
        
        this.socket.on("collList", (arg: { list:any, collname: string} ) => {
            if (arg.collname === 'Note'){
                this.setState({notes: arg.list});
            }
           
          
        });

        this.state = {
            noteinput:"",
        }
        this.getIpAddress()
        this.reloadnotes()

        this.showlist()

        setInterval(() => this.tick(), 1000);


       

    }
    reloadnotes(){
        this.socket.emit('reqcolllist',{
            sessid:getCookie('key'),
            collname: 'Note'
        })
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
       
        
        // return this.tempid;
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this)
    }
    handleChange(event: { target: { value: string } }) {
        this.setState({ noteinput: event.target.value });
    }

    handleCheck(event: {target: any,currentTarget: any}) {
       if (this.prevclick === event.currentTarget.dataset.id){
            this.removeNote(event.currentTarget.dataset.id, 'Note')

       }
       this.prevclick = event.currentTarget.dataset.id
      
        
     }
    
      tick(){
        this.reloadnotes();
        this.showlist();

      }


    render(){
        const mystyle = {
            padding: "10px",
            fontFamily: "Arial",
            color:"red"
            
          };
          
        return (
            <div>
                
                 
                <div>
                    <ul style={{color: "aliceblue",
                    font: "message-box",
                    
                    overflow: "auto",
                    padding: "0",
                    margin: "0",
                    maxHeight: "100px",
                    maxWidth: "100%"
                    }}> {this.state.listNotes}
                   
                    </ul>

                    </div>

                    <br/>
                    
                <div style ={mystyle}>
                <input  style = {{background: "transparent",color: "red",textAlign: "center",maxWidth: "fit-content"}} 
                value={this.state.noteinput}
                onChange={this.handleChange}
                type="text" id="Noteinput"  name="Noteinput"></input>
                <button style = {{background: "transparent",color: "red"}} type="button" onClick= {() => this.addNote('Note')}>Add</button>
                

            </div>
        


            </div>
            

            

        );

    }
    showlist(){
       if (this.state.notes !== undefined){
          
            var data = this.state.notes
            
            this.listItems = data.map((notes: any) =>
               
                <li data-id={notes._id} onClick={this.handleCheck} key = {notes._id} >{notes.note}</li>

                
                
             

            );
            console.log(this.listItems)
            this.setState({listNotes: this.listItems })
        

          
            
       
   
        }

    }
    addNote(collname: string){


        console.log(this.state.noteinput)

        this.setState({ noteinput: "" });
        this.socket.emit('addtolist', {
            name: this.tempip,
            note: this.state.noteinput,
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

export default Noteboard;