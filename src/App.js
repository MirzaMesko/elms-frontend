import React from 'react';
//import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login/Login';
import logo from './logo.svg';
import './App.css';
const axios = require('axios');

class App extends React.Component {
  state = {
    loggedIn: false,
    authUser: '',
  }

  login = (username, password) => {
    return axios.post("http://localhost:8888/api/user/login", {username: username, password: password})
    .then((response) => {
      this.setState({ authUser: response.username, loggedIn: true})
    })
    .catch((error) => {
      console.log(error)
  })
  }

  render () {
    if (this.state.loggedIn) {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Welcome to ELMS
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
    return <Login onLogin={this.login}/>
  }
  
}

export default App;
