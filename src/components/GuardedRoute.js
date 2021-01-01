import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const GuardedRoute = ({ component: Component, auth, props }) => (
  <Route render={() => (auth === true ? <Component info={props} /> : <Redirect to="/login" />)} />
);

GuardedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  auth: PropTypes.bool.isRequired,
  props: PropTypes.shape({}).isRequired,
};

export default GuardedRoute;
