// @ts-ignore
import { AppDispatch } from '../store.ts';
// @ts-ignore
import { authSuccess, logout, authFail } from './auth.tsx';

const axios = require('axios');

export function refresh() {
  return (dispatch: AppDispatch) =>
    axios
      .get('http://localhost:3500/refresh', {
        withCredentials: true,
        credentials: 'include',
      })
      // eslint-disable-next-line consistent-return
      .then((response: { data: { accessToken: string } }) => {
        dispatch(authSuccess(response.data.accessToken));
        return response.data.accessToken;
      })
      .catch((error: { message: string | string[] }) => {
        if (error.message.includes('403')) {
          dispatch(logout());
          dispatch(authFail('Please log in to continue.'));
        } else {
          dispatch(logout());
        }
      });
}

export default function responseInterceptor(dispatch: AppDispatch) {
  // Add a response interceptor
  axios.interceptors.response.use(
    // eslint-disable-next-line no-console
    (response: any) => response,
    // eslint-disable-next-line consistent-return
    async (error: any) => {
      const prevRequest = error?.config;
      if (error?.response?.status === 403 && !prevRequest?.sent) {
        // eslint-disable-next-line no-unused-expressions
        prevRequest.sent === true;
        const newAccessToken = await dispatch(refresh());
        prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axios(prevRequest);
      }
    }
  );
  axios.interceptors.response.eject();
}
