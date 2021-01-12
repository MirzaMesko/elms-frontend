const axios = require('axios');

export const SET_AUTH_USER = 'SET_AUTH_USER';
export const SET_AUTH_FAIL = 'SET_AUTH_FAIL';
export const LOG_OUT = 'LOG_OUT';

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
        const user = localStorage.getItem('user');
        dispatch(authSuccess(token, user));
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
      .post('http://localhost:8888/api/user/login', { username, password })
      .then((response) => {
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('user', response.data.username);
        dispatch(authSuccess(response.data.token, response.data));
      })
      .catch((error) => {
        if (error.response.data.statusCode === 401) {
          dispatch(authFail('Incorrect username / password.'));
        }
      });
}
