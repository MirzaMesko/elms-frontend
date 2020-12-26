import React from 'react';
//import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login/Login';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  state = {
    loggedIn: false
  }
  render () {
    if (this.state.loggedIn) {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              welcome to elms
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      );
    }
    return <Login />
  }
  
}

export default App;
