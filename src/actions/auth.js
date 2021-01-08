import { getUsers } from './users';

const axios = require('axios');

export const SET_AUTH_USER = 'SET_AUTH_USER';
export const SET_AUTH_FAIL = 'SET_AUTH_FAIL';
export const LOG_OUT = 'LOG_OUT';

function authSuccess(user) {
  return {
    type: SET_AUTH_USER,
    user,
  };
}

function authFail(error) {
  return {
    type: SET_AUTH_FAIL,
    error,
  };
}

export function login(username, password) {
  // eslint-disable-next-line func-names
  return function (dispatch) {
    return axios
      .post('http://localhost:8888/api/user/login', { username, password })
      .then((response) => {
        dispatch(authSuccess(response.data));
        getUsers(response.data.token);
      })
      .catch((error) => {
        if (error.response.data.statusCode === 401) {
          dispatch(authFail('Incorrect username / password.'));
        }
      });
  };
}

export function logout() {
  return {
    type: LOG_OUT,
  };
}
