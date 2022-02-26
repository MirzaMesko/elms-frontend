// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

const axios = require('axios');

export const SET_AUTH_USER = 'SET_AUTH_USER';
export const SET_AUTH_FAIL = 'SET_AUTH_FAIL';
export const LOG_OUT = 'LOG_OUT';
export const DISMISS_ALERT = 'DISMISS_ALERT';

export function authSuccess(token, user) {
  return {
    type: SET_AUTH_USER,
    token,
    user,
  };
}

export function authFail(error) {
  return {
    type: SET_AUTH_FAIL,
    error,
  };
}
export function dismissAlert() {
  return {
    type: DISMISS_ALERT,
  };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('user');
  return {
    type: LOG_OUT,
  };
}

export function checkAuthTimeout(expirationTime) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
}

export function authCheckState() {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate >= new Date()) {
        const username = localStorage.getItem('username');
        const roles = localStorage.getItem('roles').split(',');
        dispatch(authSuccess(token, { username, roles }));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      } else {
        dispatch(logout());
      }
    }
  };
}

export function login(username, password) {
  return (dispatch) =>
    axios
      .post('http://localhost:3500/login', { username, password })
      .then((response) => {
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('expirationDate', expirationDate);
        const token = response.data.accessToken;
        const decoded = jwt_decode(token);
        const user = {
          username: decoded.UserInfo.username,
          roles: Object.values(decoded.UserInfo.roles),
          image: decoded.UserInfo.image,
        };
        localStorage.setItem('username', decoded.UserInfo.username);
        localStorage.setItem('roles', Object.values(decoded.UserInfo.roles));
        dispatch(authSuccess(response.data.accessToken, user));
      })
      .catch((error) => {
        if (error.message.includes('401')) {
          dispatch(authFail('Incorrect username / password.'));
        }
      });
}

export function register(email, username, password) {
  return () =>
    axios
      .post('http://localhost:3500/register', { email, username, password })
      .then((response) => response)
      .catch((error) => error.response.data);
}
