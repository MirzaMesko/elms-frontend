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
      showAlert: false,
      errorMessage: '',
    };
  }

  login = (username, password) => {
    const { history } = this.props;
    axios
      .post('http://localhost:8888/api/user/login', { username, password })
      .then((response) => {
        if (response.status === 201) {
          this.setState({ authUser: response.username, loggedIn: true });
        } else if (response.status === 401) {
          this.setState({ showAlert: true });
          // eslint-disable-next-line
          console.log(this.state.showAlert)
        }
        history.push('/');
      })
      .catch((error) => {
        this.setState({ showAlert: true, errorMessage: error.message });
        // eslint-disable-next-line
      });
  };

  render() {
    const { loggedIn, authUser, showAlert, errorMessage } = this.state;
    return (
      <Switch>
        <Route
          path="/login"
          render={() => <Login onLogin={this.login} alert={showAlert} message={errorMessage} />}
        />
        <GuardedRoute path="/" exact component={Dashboard} auth={loggedIn} authUser={authUser} />
      </Switch>
    );
  }
}

App.propTypes = {
  history: PropTypes.string.isRequired,
};

export default withRouter(App);
