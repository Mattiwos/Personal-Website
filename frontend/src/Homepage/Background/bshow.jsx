import React, { Component } from "react";
import Sketch from "react-p5";

export default class Bshow extends Component {
  x = 150
  y = 150

  setup = (p5, parent) => {
    p5.createCanvas(p5.width, p5.height).parent(parent)
  }
  draw = p5 => {
    p5.background(0)
    p5.ellipse(this.x, this.y, 70, 70)
		p5.background('orangered');
    p5.ellipse(150, 100, 100, 100);
    this.x++
  }

  render() {
    return <Sketch setup={this.setup} draw={this.draw} />
  }
}
