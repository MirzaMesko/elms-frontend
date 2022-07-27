/* eslint-disable import/prefer-default-export */
const axios = require('axios');

interface Types {
  token: string;
  authUserRoles: Array<string>;
  email: string;
  subject: string;
  text: string;
}

export function sendEmail({ token, authUserRoles, email, subject, text }: Types) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };

  return () =>
    axios
      .post(`http://localhost:3500/send`, { email, subject, text }, { headers })
      .then((resp: any) => resp)
      .catch((error: any) => error.response.data);
}
