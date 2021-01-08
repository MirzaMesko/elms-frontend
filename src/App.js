import { history as historyPropTypes } from 'history-prop-types';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import ManageUsers from './components/ManageUsers';
import { logout } from './actions/users';
import Links from './components/Links';
import Login from './components/Login';

function App(props) {
  const { loggedIn, history, error, authUser, onLogout, roles } = props;

  let routes = (
    <Switch>
      <Route
        path="/login"
        render={() => <Login error={error.error} history={history} message={error.message} />}
      />
      ;
      <Redirect to="/login" />
    </Switch>
  );

  if (loggedIn) {
    routes = (
      <Dashboard onLogout={onLogout} history={history} roles={roles}>
        <Switch>
          <Route
            path="/"
            exact
            render={() => <Links history={history} roles={roles} user={authUser} />}
          />
          <Route path="/manage/users" render={() => <ManageUsers history={history} />} />
        </Switch>
      </Dashboard>
    );
  }

  return routes;
}

App.propTypes = {
  history: PropTypes.shape(historyPropTypes).isRequired,
  loggedIn: PropTypes.bool.isRequired,
  error: PropTypes.shape({}).isRequired,
  authUser: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

App.defaultProps = {
  roles: [],
};
// eslint-disable-next-line
const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn,
    error: state.error,
    authUser: state.authUser.username,
    roles: state.authUser.roles,
  };
};
// eslint-disable-next-line
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
