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
            </div>
          )}
        />

        
  

        <Route
          path="/dashboard"
          render={() => (
            <div className="App">
              <Guide />
            </div>
          )}
        />


        <Route
          exact={true}
          path="/live"
          render={() => (
            <div className="App">
              <Display />
            </div>
          )}
        />  


      </div>
    </BrowserRouter>
  );
}

export default App;

