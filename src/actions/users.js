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

export function addUser(authUserRoles, email, username, password, roles, name, bio, token) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  return () =>
    axios
      .post(
        'http://localhost:3500/users',
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

export function getUsers(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const url = 'http://localhost:3500/users';
  return (dispatch) =>
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch(retrieveUsersSuccess(response.data));
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
        if (error.message.includes('401')) {
          dispatch(authFail(error));
        }
      });
}

export function editUser(id, email, roles, name, bio, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const url = `http://localhost:3500/users`;

  return () =>
    axios
      .put(url, { id, email, roles, name, bio }, { headers })
      .then((response) => response)
      .catch((error) => error.response.data);
}
