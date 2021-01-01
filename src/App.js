import { history as historyPropTypes } from 'history-prop-types';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import GuardedRoute from './components/GuardedRoute';
import { logout } from './actions/users';
import Login from './components/Login';

function App(props) {
  const { loggedIn, history, error, authUser, onLogout } = props;
  // eslint-disable-next-line
  console.log(history, loggedIn, error);
  return (
    <Switch>
      <Route path="/login" render={() => <Login error={error} history={history} />} />
      <GuardedRoute
        path="/"
        exact
        component={Dashboard}
        auth={loggedIn}
        props={{ user: authUser, onLogout }}
      />
    </Switch>
  );
}

App.propTypes = {
  history: PropTypes.shape(historyPropTypes).isRequired,
  loggedIn: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  authUser: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};
// eslint-disable-next-line
const mapStateToProps = (state) => {
  // eslint-disable-next-line
  return {
    // eslint-disable-next-line
    loggedIn: state.loggedIn,
    error: state.error,
    authUser: state.authUser.username,
  };
};
// eslint-disable-next-line
const mapDispatchToProps = (dispatch) => {
  // eslint-disable-next-line
  return {
    // eslint-disable-next-line
    onLogout: () => dispatch(logout()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
