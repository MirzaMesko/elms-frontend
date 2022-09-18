import { useDispatch, useSelector } from 'react-redux';
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
// @ts-ignore
import { refresh } from './actions/refreshToken.tsx';
// @ts-ignore
import Links from './components/Helpers/Links.tsx';
// @ts-ignore
import Login from './components/Auth/Login.tsx';
// @ts-ignore
import Register from './components/Auth/SignUp.tsx';
// @ts-ignore
import LendOrReturn from './components/Book/LendOrReturn.tsx';
// @ts-ignore
import Settings from './components/Settings/Settings.tsx';
// @ts-ignore
import { RootState, AppDispatch } from './store.ts';

const App: React.FC = () => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const { loggedIn } = useSelector((state: RootState) => state.users);

  React.useEffect(() => {
    dispatch(refresh());
  }, []);

  let routes = (
    <Switch>
      <Route path="/login" render={() => <Login />} />
      <Route path="/register" render={() => <Register />} />
      <Redirect to="/login" />
    </Switch>
  );

  if (loggedIn) {
    routes = (
      <Dashboard history={history}>
        <Switch>
          <Route path="/manage/users" exact render={() => <ManageUsers />} />
          <Route path="/manage/books" exact render={() => <ManageBooks history={history} />} />
          <Route path="/manage/overdue books" exact render={() => <ManageOverdueBooks />} />
          <Route path="/users/lend&return/:id" render={() => <LendOrReturn />} />
          <Route path="/users/settings/:id" render={() => <Settings history={history} />} />
          <Route path="/" exact render={() => <Links />} />
          <Redirect to="/" />
        </Switch>
      </Dashboard>
    );
  }

  return routes;
};

export default withRouter(App);
