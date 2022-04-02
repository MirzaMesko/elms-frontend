/* eslint-disable import/prefer-default-export */
const axios = require('axios');

export function sendEmail(token, authUserRoles, email, subject, text) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };

  return () =>
    axios
      .post(`http://localhost:3500/send`, { email, subject, text }, { headers })
      .then((resp) => resp)
      .catch((error) => error.response.data);
}
