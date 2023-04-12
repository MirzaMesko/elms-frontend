// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
// @ts-ignore
import { AppDispatch } from '../store.ts';

interface Decoded {
  UserInfo: {
    username: string;
    roles: Array<string>;
    image: string;
  };
}

const axios = require('axios');

export const SET_AUTH_USER = 'SET_AUTH_USER';
export const SET_AUTH_FAIL = 'SET_AUTH_FAIL';
export const LOG_OUT = 'LOG_OUT';
export const DISMISS_ALERT = 'DISMISS_ALERT';

export function authSuccess(accessToken: string) {
  const token = accessToken;
  const decoded: Decoded = jwt_decode(token);
  const user = {
    username: decoded.UserInfo.username,
    roles: Object.values(decoded.UserInfo.roles),
    image: decoded.UserInfo.image,
  };
  return {
    type: SET_AUTH_USER,
    token,
    user,
  };
}

export function authFail(error: string) {
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

export function logoutSuccess() {
  return {
    type: LOG_OUT,
  };
}

export function logout() {
  return (dispatch: AppDispatch) =>
    axios
      .get('http://localhost:3500/logout', {
        withCredentials: true,
        credentials: 'include',
      })
      .then(() => {
        dispatch(logoutSuccess());
      });
}

export function login(username: string, password: string) {
  return (dispatch: AppDispatch) =>
    axios
      .post(
        'http://localhost:3500/login',
        { username, password },
        { withCredentials: true, credentials: 'include' }
      )
      .then((response: { data: { accessToken: string } }) => {
        dispatch(authSuccess(response.data.accessToken));
      })
      .catch((error: { message: string | string[] }) => {
        if (error.message.includes('401')) {
          dispatch(authFail('Incorrect username / password.'));
        }
      });
}

export function register(email: string, username: string, password: string) {
  return () =>
    axios
      .post(
        'http://localhost:3500/register',
        { email, username, password },
        { withCredentials: true, credentials: 'include' }
      )
      .then((response: { data: { message: string } }) => response)
      .catch((error: { response: { data: any } }) => error.response.data);
}
