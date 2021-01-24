import { authFail } from './auth';

const axios = require('axios');

export const RETRIEVE_USERS_SUCCESS = 'RETRIEVE_USERS_SUCCESS';
export const RETRIEVE_USERS_FAIL = 'RETRIEVE_USERS_FAIL';
export const CURRENT_USER_INFO = 'CURRENT_USER_INFO';

function currentUser(user) {
  return {
    type: CURRENT_USER_INFO,
    user,
  };
}

export function addUser(email, username, password, roles, name, bio, token) {
  const headers = { Authorization: `Bearer ${token}` };
  return axios
    .post(
      'http://localhost:8888/api/user',
      { email, username, password, roles, name, bio },
      { headers }
    )
    .then((response) => response)
    .catch((error) => error.response.data);
}

function retrieveUsersSuccess(users) {
  return {
    type: RETRIEVE_USERS_SUCCESS,
    users,
  };
}

function retrieveUsersFail(error) {
  return {
    type: RETRIEVE_USERS_FAIL,
    error,
  };
}

export function getUsers(token, params) {
  const headers = { Authorization: `Bearer ${token}` };
  const url = 'http://localhost:8888/api/users';
  return (dispatch) =>
    axios
      .get(url, { headers, params })
      .then((response) => {
        dispatch(retrieveUsersSuccess(response.data.items));
      })
      .catch((error) => {
        if (error.response.data.statusCode === 401) {
          dispatch(retrieveUsersFail(error));
        }
      });
}

export function getCurrentUser(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const url = 'http://localhost:8888/api/user';

  return (dispatch) =>
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch(currentUser(response.data));
      })
      .catch((error) => {
        if (error.response.data.statusCode === 401) {
          dispatch(authFail(error));
        }
      });
}

export function editUser(email, username, roles, name, bio, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const url = `http://localhost:8888/api/user/${username}`;

  return (dispatch) =>
    axios
      .put(url, { email, username, roles, name, bio }, { headers })
      .then((response) => {
        dispatch(getUsers(token));
        return response;
      })
      .catch((error) => {
        if (error.response.data.statusCode === 401) {
          dispatch(authFail(error));
        }
      });
}
