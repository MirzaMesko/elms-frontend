// @ts-ignore
import { AppDispatch } from '../store.ts';
// @ts-ignore
import type { User, NotificationType, Roles } from '../types.ts';
// @ts-ignore
import responseInterceptor from './refreshToken.tsx';
// @ts-ignore
import { showSnackbarMessage } from './books.tsx';

const axios = require('axios');

export const RETRIEVE_USERS_SUCCESS = 'RETRIEVE_USERS_SUCCESS';
export const RETRIEVE_USERS_FAIL = 'RETRIEVE_USERS_FAIL';
export const RETRIEVE_USERS_PENDING = 'RETRIEVE_USERS_PENDING';
export const CURRENT_USER_INFO = 'CURRENT_USER_INFO';

function currentUser(user: User) {
  return {
    type: CURRENT_USER_INFO,
    user,
  };
}

export function addUser(
  authUserRoles: Roles,
  email: User,
  username: User,
  password: User,
  roles: User,
  name: User,
  image: User,
  bio: User,
  token: string
) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    return axios
      .post(
        'http://localhost:3500/users',
        { email, username, password, roles, name, image, bio },
        { headers }
      )
      .then((response: any) => {
        dispatch(showSnackbarMessage('success', `User ${response.data.username} was created`));
        return response;
      })
      .catch((error: any) => {
        dispatch(showSnackbarMessage('error', `Something went wrong. Please try again.`));
        return error;
      });
  };
}

function retrieveUsersPending() {
  return {
    type: RETRIEVE_USERS_PENDING,
  };
}

function retrieveUsersSuccess(users: [User]) {
  return {
    type: RETRIEVE_USERS_SUCCESS,
    users,
  };
}

function retrieveUsersFail(error: string) {
  return {
    type: RETRIEVE_USERS_FAIL,
    error,
  };
}

export function getUsers(token: string) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    dispatch(retrieveUsersPending());
    const headers = { Authorization: `Bearer ${token}` };
    const url = 'http://localhost:3500/users';
    return axios
      .get(url, { headers })
      .then((response: any) => {
        dispatch(retrieveUsersSuccess(response.data));
      })
      .catch((error: any) => {
        dispatch(retrieveUsersFail(error.message));
      });
  };
}

export function getCurrentUser(token: string) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}` };
    const url = 'http://localhost:8888/api/user';

    return axios
      .get(url, { headers })
      .then((response: any) => {
        dispatch(currentUser(response.data));
      })
      .catch((error: any) => error);
  };
}

export function editUser(
  authUserRoles: Roles,
  id: User,
  email: User,
  roles: User,
  name: User,
  image: User,
  bio: User,
  token: string
) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    const url = `http://localhost:3500/users`;

    return axios
      .put(url, { id, email, roles, name, image, bio }, { headers })
      .then((response: any) => {
        dispatch(showSnackbarMessage('success', `User ${response.data.username} was edited.`));
        return response;
      })
      .catch((error: any) => {
        dispatch(
          showSnackbarMessage(
            'error',
            `Something went wrong. Please try again.${error.response.data}`
          )
        );
        return error;
      });
  };
}

export function deleteUser(authUserRoles: Roles, id: string, token: string) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const config = {
      headers: { Authorization: `Bearer ${token}`, roles: authUserRoles },
      data: { id },
    };
    const url = `http://localhost:3500/users`;

    return axios
      .delete(url, config)
      .then((response: any) => {
        dispatch(showSnackbarMessage('success', `User deleted.`));
        return response;
      })
      .catch((error: any) => {
        dispatch(
          showSnackbarMessage(
            'error',
            `Something went wrong. Please try again.${error.response.data}`
          )
        );
        return error;
      });
  };
}

export function notifyUser(token: string, authUserRoles: Roles, userId: string, message: string) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    const url = `http://localhost:3500/users`;

    return axios
      .put(url, { id: userId, newNotification: message, seen: 'false' }, { headers })
      .then((response: any) => response)
      .catch((error: any) => {
        dispatch(
          showSnackbarMessage(
            'error',
            `Something went wrong. Please try again.${error.response.data}`
          )
        );
        return error;
      });
  };
}

export function updateNotifications(
  token: string,
  roles: Roles,
  userId: string,
  notifications: [NotificationType]
) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}`, roles };
    const url = `http://localhost:3500/users`;

    return axios
      .put(url, { id: userId, notifications }, { headers })
      .then((response: any) => response)
      .catch((error: any) => error.response.data);
  };
}
