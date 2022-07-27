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

export function authSuccess(
  token: string,
  user: { username: string | null; roles: Array<string> | undefined; image: string | null }
) {
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

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('user');
  return {
    type: LOG_OUT,
  };
};

export function checkAuthTimeout(expirationTime: number) {
  return (dispatch: AppDispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
}

export function authCheckState() {
  return (dispatch: AppDispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const date = localStorage.getItem('expirationDate');
      const expirationDate = date ? new Date(date) : null;
      if (expirationDate && expirationDate >= new Date()) {
        const username = localStorage.getItem('username');
        const roles = localStorage.getItem('roles')?.split(',');
        const image = localStorage.getItem('userImage');
        dispatch(authSuccess(token, { username, roles, image }));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      } else {
        dispatch(logout());
      }
    }
  };
}

export function login(username: string, password: string) {
  return (dispatch: AppDispatch) =>
    axios
      .post('http://localhost:3500/login', { username, password })
      .then((response: { data: { accessToken: string } }) => {
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000).toString();
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('expirationDate', expirationDate);
        const token = response.data.accessToken;
        const decoded: Decoded = jwt_decode(token);
        const user = {
          username: decoded.UserInfo.username,
          roles: Object.values(decoded.UserInfo.roles),
          image: decoded.UserInfo.image,
        };
        localStorage.setItem('username', decoded.UserInfo.username);
        localStorage.setItem('roles', Object.values(decoded.UserInfo.roles).toString());
        localStorage.setItem('userImage', decoded.UserInfo.image);
        dispatch(authSuccess(response.data.accessToken, user));
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
      .post('http://localhost:3500/register', { email, username, password })
      .then((response: { data: { message: string } }) => response)
      .catch((error: { response: { data: any } }) => error.response.data);
}
