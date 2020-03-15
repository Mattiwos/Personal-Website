// eslint-disable-next-line
import React, { Component } from "react";


interface Props{
    product?: String[];

}
interface States{
    titlesize: number;
    randomColor: String;



}

class Home extends React.Component<Props,States> {



  constructor(props: Props, state: States) {
    super(props);

   

    this.state = {
      titlesize: 9,
      randomColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16)
    };

    
    setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
   
  }
  increasebutton = () => {
    this.setState(state => {
      // Important: read `state` instead of `this.state` when updating.
      return {
        titlesize: state.titlesize + 10,
        randomColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16)
      };
    });
  };
  tick() {
    this.increasebutton();
  }

  render() {
    const mystyle = {
      padding: "10px",
      fontFamily: "Arial",
      color: this.state.randomColor
    };

    return (
      <div>
        <h1 style={mystyle}>Mattiwos Belachew</h1>
        <a href = "/dashboard" target="_top" >dashboard</a>
       
      </div>
    );
  }
}

export default Home;
