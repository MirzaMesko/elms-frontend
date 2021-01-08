const axios = require('axios');

export const RETRIEVE_USERS_SUCCESS = 'RETRIEVE_USERS_SUCCESS';
export const RETRIEVE_USERS_FAIL = 'RETRIEVE_USERS_FAIL';

export default function addUser(email, username, password, roles, name, bio, token) {
  // eslint-disable-next-line
  console.log(email, username, password, roles, bio, name, token);
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

export function getUsers(token, offset, limit, roles, name, email) {
  const headers = { Authorization: `Bearer ${token}` };
  // eslint-disable-next-line func-names
  return function (dispatch) {
    return axios
      .get(
        `http://localhost:8888//api/users?offset=${offset}&limit=${limit}$roles=${roles}&name=${name}&email=${email}`,
        { headers }
      )
      .then((response) => {
        dispatch(retrieveUsersSuccess(response.items));
      })
      .catch((error) => {
        if (error.response.data.statusCode === 401) {
          dispatch(retrieveUsersFail(error));
        }
      });
  };
}
