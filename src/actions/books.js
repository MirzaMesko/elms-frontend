const axios = require('axios');

export const RETRIEVE_BOOKS_SUCCESS = 'RETRIEVE_BOOKS_SUCCESS';
export const RETRIEVE_BOOKS_FAIL = 'RETRIEVE_BOOKS_FAIL';

function retrieveBooksSuccess(books) {
  return {
    type: RETRIEVE_BOOKS_SUCCESS,
    books,
  };
}

function retrieveBooksFail(error) {
  return {
    type: RETRIEVE_BOOKS_FAIL,
    error,
  };
}

export function getBooks(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const url = 'http://localhost:3500/books';
  return (dispatch) =>
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch(retrieveBooksSuccess(response.data));
      })
      .catch((error) => {
        if (error.response.data.statusCode === 401) {
          dispatch(retrieveBooksFail(error));
        }
      });
}

export function addBook(authUserRoles, title, author, year, description, publisher, serNo, token) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  return () =>
    axios
      .post(
        'http://localhost:3500/books',
        { title, author, year, description, publisher, serNo },
        { headers }
      )
      .then((response) => response)
      .catch((error) => error.response.data);
}

export function editBook(
  authUserRoles,
  id,
  title,
  author,
  year,
  description,
  publisher,
  serNo,
  token
) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  const url = `http://localhost:3500/books`;

  return () =>
    axios
      .put(url, { id, title, author, year, description, publisher, serNo }, { headers })
      .then((response) => response)
      .catch((error) => error.response.data);
}

export function deleteBook(authUserRoles, id, token) {
  const config = {
    headers: { authorization: `Bearer ${token}`, roles: authUserRoles },
    data: { id },
  };
  const url = `http://localhost:3500/books`;

  return () =>
    axios
      .delete(url, config)
      .then((response) => response)
      .catch((error) => error.response.data);
}
