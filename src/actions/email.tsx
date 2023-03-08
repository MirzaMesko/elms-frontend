/* eslint-disable import/prefer-default-export */
// @ts-ignore
import { AppDispatch } from '../store.ts';
// @ts-ignore
import responseInterceptor from './refreshToken.tsx';
// @ts-ignore
import { showSnackbarMessage } from './books.tsx';

const axios = require('axios');

interface Types {
  token: string;
  authUserRoles: Array<string>;
  email: string;
  subject: string;
  text: string;
}

export function sendEmail({ token, authUserRoles, email, subject, text }: Types) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };

    return axios
      .post(`http://localhost:3500/send`, { email, subject, text }, { headers })
      .then((response: any) => {
        // eslint-disable-next-line no-console
        console.log(response);
        if (response?.status === 200) {
          dispatch(showSnackbarMessage('success', `Your email has been sent.`));
        }
        dispatch(showSnackbarMessage('error', `Something went wrong. Please try again.`));
        return response;
      })
      .catch((error: any) => {
        // eslint-disable-next-line no-console
        console.log(error);
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
