// eslint-disable-next-line
import React, { Component } from "react";
import githubLogo from "../assets/github.png"
import linkedinLogo from "../assets/linkedin.png"


// import Snow from './Background/Snow'

interface Props{
    product?: String[];

}
interface States{
    titlesize: number;
    randomColor: string;



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
  changeTcolor = () => {
    this.setState(state => {
      // Important: read `state` instead of `this.state` when updating.
      return {
        titlesize: state.titlesize + 10,
        randomColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16)
      };
    });
  };
  tick() {
    this.changeTcolor();
  }

  render() {
    const mystyle = {
      padding: "10px",
      fontFamily: "Arial",
      color: this.state.randomColor
    };

    return (
      <div>
       
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"></link>
        
        {/* <canvas id="myCanvas" width="100" height="100"></canvas>
        <Snow id = {'myCanvas'}/> */}

        <h1 style={mystyle} >Mattiwos Belachew</h1>
        <a href = "/dashboard" target="_top" >Dashboard</a>

        <div className="container-fluid">
          <div className="row">
                   <div className="col-sm">
                      <div><a href="https://github.com/mattiwos"> <img alt="true" src={githubLogo} width="100" height="100"/> </a>
                       </div>
                    </div>

                    <div className="col-sm">
                       <div><a href="https://www.linkedin.com/in/mattiwos-belachew-2b9807157">
                          <img alt="true" src={linkedinLogo} width="100" height="100"/>
                        </a></div>
                    </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Home;
