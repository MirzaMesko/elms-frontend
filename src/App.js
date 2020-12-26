import React from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import GuardedRoute from './components/GuardedRoute';


const axios = require('axios');

class App extends React.Component {
  state = {
    loggedIn: false,
    authUser: '',
  };

  login = (username, password) => {
    return axios.post("http://localhost:8888/api/user/login", { username: username, password: password })
      .then((response) => {
        this.setState({ authUser: response.username, loggedIn: true });
        this.props.history.push('/');
      })
      .catch((error) => {
        console.log(error);
      })
  };

  render() {
    return (
      <Switch>
        <Route path='/login' render={() => <Login onLogin={this.login} />} />
        <GuardedRoute path='/' exact component={Dashboard} auth={this.state.loggedIn} />
      </Switch>
    )
  }
}

export default withRouter(App);
