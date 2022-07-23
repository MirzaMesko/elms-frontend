import { connect } from 'react-redux';
import React from 'react';
import { Route, Switch, withRouter, Redirect, useHistory } from 'react-router-dom';
import './App.css';
// @ts-ignore
import Dashboard from './components/Dashboard.tsx';
// @ts-ignore
import ManageUsers from './components/User/ManageUsers.tsx';
// @ts-ignore
import ManageBooks from './components/Book/ManageBooks.tsx';
// @ts-ignore
import ManageOverdueBooks from './components/Book/ManageOverdueBooks.tsx';
import { logout, authCheckState } from './actions/auth';
import { getBooks } from './actions/books';
import { getUsers } from './actions/users';
import Links from './components/Helpers/Links';
// @ts-ignore
import Login from './components/Auth/Login.tsx';
// @ts-ignore
import Register from './components/Auth/SignUp.tsx';
// @ts-ignore
import LendOrReturn from './components/Book/LendOrReturn.tsx';
// @ts-ignore
import Settings from './components/Settings.tsx';
// @ts-ignore
import { RootState, AppDispatch } from './store.ts';
// @ts-ignore
import type { User, Book } from './types.ts';

interface OwnProps {
  users: [User];
  books: [Book];
  error: any;
}

type Props = RootState & AppDispatch & OwnProps;

const App: React.FC<Props> = (props: Props) => {
  const {
    loggedIn,
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

  const history = useHistory();

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
      <Route path="/login" render={() => <Login history={history} />} />
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
          <Route path="/manage/users" exact render={() => <ManageUsers roles={roles} />} />
          <Route
            path="/manage/books"
            exact
            render={() => <ManageBooks history={history} roles={roles} />}
          />
          <Route
            path="/manage/overdue books"
            exact
            render={() => <ManageOverdueBooks roles={roles} />}
          />
          <Route path="/users/lend&return/:id" render={() => <LendOrReturn />} />
          <Route
            path="/users/settings/:id"
            render={() => <Settings authUser={authUser} users={users} books={books} />}
          />
          <Route
            path="/"
            exact
            render={() => <Links roles={roles} user={authUser} users={users} books={books} />}
          />
          <Redirect to="/" />
        </Switch>
      </Dashboard>
    );
  }

  return routes;
};

// App.propTypes = {
//   history: PropTypes.shape(historyPropTypes).isRequired,
//   loggedIn: PropTypes.bool.isRequired,
//   error: PropTypes.shape({}).isRequired,
//   authUser: PropTypes.string,
//   onLogout: PropTypes.func.isRequired,
//   onTryAutoSignup: PropTypes.func.isRequired,
//   roles: PropTypes.arrayOf(PropTypes.string).isRequired,
//   users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
//   books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
//   token: PropTypes.string.isRequired,
//   onGetBooks: PropTypes.func.isRequired,
//   onGetUsers: PropTypes.func.isRequired,
// };

// App.defaultProps = {
//   roles: [],
//   users: [],
//   books: [],
//   authUser: '',
// };

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.users.loggedIn,
  error: state.users.err,
  authUser: state.users.authUser.username,
  roles: state.users.authUser.roles,
  users: state.users.users,
  token: state.users.token,
  books: state.books.books,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onLogout: () => dispatch(logout()),
  onTryAutoSignup: () => dispatch(authCheckState()),
  onGetBooks: (token: string) => dispatch(getBooks(token)),
  onGetUsers: (token: string) => dispatch(getUsers(token)),
});

export default withRouter(
  connect<RootState, AppDispatch>(mapStateToProps, mapDispatchToProps)(App)
);
