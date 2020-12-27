import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import './App.css';
import PropTypes from 'prop-types';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import GuardedRoute from './components/GuardedRoute';

const axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      authUser: '',
    };
  }

  login = (username, password) => {
    const { history } = this.props;
    axios
      .post('http://localhost:8888/api/user/login', { username, password })
      .then((response) => {
        this.setState({ authUser: response.username, loggedIn: true });
        history.push('/');
      })
      .catch((error) => {
        // eslint-disable-next-line
        alert(error.message);
      });
  };

  render() {
    const { loggedIn, authUser } = this.state;
    return (
      <Switch>
        <Route path="/login" render={() => <Login onLogin={this.login} />} />
        <GuardedRoute path="/" exact component={Dashboard} auth={loggedIn} authUser={authUser} />
      </Switch>
    );
  }
}

App.propTypes = {
  history: PropTypes.string.isRequired,
};

export default withRouter(App);
