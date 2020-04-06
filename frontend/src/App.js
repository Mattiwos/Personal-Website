import React from "react";
// eslint-disable-next-line
import { BrowserRouter, Route } from "react-router-dom";
/* eslint-disable import/first */
import Guide from "./Dashboard/Guide";
import Home from "./Homepage/Home";
import Display from "./LiveStream/Display";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Route
          exact={true}
          path="/"
          render={() => (
            <div className="App">
              <Home />
              <div>
                <p style = {{
                  position: "fixed",
                  bottom: "1%",
                  left: "47%"}}>@2020 Mattiwos</p>
              </div>
            </div>
          )}
        />

        
  

        <Route
          path="/dashboard"
          render={() => (
            <div className="App">
              <Guide />
              <div>
              <p style = {{
                  position: "fixed",
                  bottom: "1%",
                  left: "47%"}}>@2020 Mattiwos</p>
              </div>
            </div>
          )}
        />


        <Route
          exact={true}
          path="/live"
          render={() => (
            <div className="App">
              <Display />
              <div>
              <p style = {{
                  position: "fixed",
                  bottom: "1%",
                  left: "47%"}}>@2020 Mattiwos</p>
              </div>

            </div>
          )}
        />  


      </div>
    </BrowserRouter>
  );
}

export default App;

