import { history as historyPropTypes } from 'history-prop-types';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import ManageUsers from './components/User/ManageUsers';
import ManageBooks from './components/Book/ManageBooks';
import ManageOverdueBooks from './components/Book/ManageOverdueBooks';
import { logout, authCheckState } from './actions/auth';
import { getBooks } from './actions/books';
import { getUsers } from './actions/users';
import Links from './components/Helpers/Links';
import Login from './components/Auth/Login';
import Register from './components/Auth/SignUp';
import LendOrReturn from './components/Book/LendOrReturn';
import Settings from './components/Settings';

function App(props) {
  const {
    loggedIn,
    history,
    error,
    authUser,
    roles,
    onLogout,
    users,
    onTryAutoSignup,
    books,
    onGetBooks,
    onGetUsers,
    token,
  } = props;

  React.useEffect(() => {
    onTryAutoSignup();
  }, []);

  React.useEffect(() => {
    if (token) {
      onGetBooks(token);
      onGetUsers(token);
    }
  }, [token]);

  let routes = (
    <Switch>
      <Route
        path="/login"
        render={() => <Login error={error.error} history={history} message={error.message} />}
      />
      <Route
        path="/register"
        render={() => <Register error={error.error} history={history} message={error.message} />}
      />
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
            path="/manage/overdue books"
            exact
            render={() => <ManageOverdueBooks history={history} users={users} roles={roles} />}
          />
          <Route
            path="/users/lend&return/:id"
            render={() => (
              <LendOrReturn user={authUser} history={history} books={books} users={users} />
            )}
          />
          <Route
            path="/users/settings/:id"
            render={() => <Settings authUser={authUser} users={users} books={books} />}
          />
          <Route
            path="/"
            exact
            render={() => (
              <Links history={history} roles={roles} user={authUser} users={users} books={books} />
            )}
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
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  token: PropTypes.string.isRequired,
  onGetBooks: PropTypes.func.isRequired,
  onGetUsers: PropTypes.func.isRequired,
};

App.defaultProps = {
  roles: [],
  users: [],
  books: [],
  authUser: '',
};

const mapStateToProps = (state) => ({
  loggedIn: state.users.loggedIn,
  error: state.users.err,
  authUser: state.users.authUser.username,
  roles: state.users.authUser.roles,
  users: state.users.users,
  token: state.users.token,
  books: state.books.books,
});

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(logout()),
  onTryAutoSignup: () => dispatch(authCheckState()),
  onGetBooks: (token) => dispatch(getBooks(token)),
  onGetUsers: (token) => dispatch(getUsers(token)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
