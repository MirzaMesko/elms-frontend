import { history as historyPropTypes } from 'history-prop-types';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import ManageUsers from './components/ManageUsers';
import ManageBooks from './components/ManageBooks';
import { logout, authCheckState } from './actions/auth';
import Links from './components/Links';
import Login from './components/Login';

function App(props) {
  const { loggedIn, history, error, authUser, roles, onLogout, users, onTryAutoSignup } = props;

  React.useEffect(() => {
    onTryAutoSignup();
  }, []);

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
            path="/manage/users"
            exact
            render={() => <ManageUsers history={history} users={users} roles={roles} />}
          />
          <Route
            path="/manage/books"
            exact
            render={() => <ManageBooks history={history} users={users} roles={roles} />}
          />
          <Route
            path="/"
            exact
            render={() => <Links history={history} roles={roles} user={authUser} />}
          />
          <Redirect to="/" />
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
  onTryAutoSignup: PropTypes.func.isRequired,
  roles: PropTypes.objectOf(PropTypes.string).isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  token: PropTypes.string.isRequired,
};

App.defaultProps = {
  roles: [],
  users: [],
  authUser: '',
};

const mapStateToProps = (state) => ({
  loggedIn: state.users.loggedIn,
  error: state.users.err,
  authUser: state.users.authUser.username,
  roles: state.users.authUser.roles,
  users: state.users.users,
  token: state.users.token,
});

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(logout()),
  onTryAutoSignup: () => dispatch(authCheckState()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
