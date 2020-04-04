import React, { Component } from "react";
import jquery from 'jquery'
var $: any = jquery;

interface Props{
    product?: String[];
    id: string
}
interface States{
    x: Number;
    y: Number;
    snowloc: Number[];

}

class Snow extends React.Component<Props,States>{

    constructor(props: Props, state: States){
        super(props)
        this.state = {
            x: Math.random()* window.innerWidth,
            y: Math.random()* window.innerHeight,
            snowloc: []
        }

        // setInterval(()=> this.tick(), 1000)
    }
    newsnow(){
        this.setState((snowloc)=>{
            var list: any = this.state.snowloc
            list.push([Math.random()* window.innerWidth])
           return{
            snowloc: list
           } 
            
        })
    } 
    tick(){
        for (var i: number =0; i < this.state.snowloc.length; i++){

        }
    }
    render(){
        return (
            <div>
                {this.rendersnow()}


            </div>

        );
    }
    rendersnow(){
        $(function() {
            // var Grid : any= function() {
            //     var c: any = document.getElementById(this.props.id);
            //     console.log(c)
            // }
        })
       return <div>


       </div>
    }
    



}
export default Snow;