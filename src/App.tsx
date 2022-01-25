import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import FrontendAuth from "./router/FrontendAuth";
import RouterMap from "./router/router";
import './App.css';

function App() {
  return (
    <Router>
        <FrontendAuth routerConfig={RouterMap} />
    </Router>
  );
}

export default App;

