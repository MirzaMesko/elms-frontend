/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
// import { editUser } from './users';

const axios = require('axios');

export const RETRIEVE_BOOKS_SUCCESS = 'RETRIEVE_BOOKS_SUCCESS';
export const RETRIEVE_BOOKS_FAIL = 'RETRIEVE_BOOKS_FAIL';
export const RETRIEVE_BOOKS_PENDING = 'RETRIEVE_BOOKS_PENDING';

function retrieveBooksPending() {
  return {
    type: RETRIEVE_BOOKS_PENDING,
  };
}

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

export function getBookById(token, bookId) {
  const headers = { Authorization: `Bearer ${token}` };
  const url = `http://localhost:3500/books/${bookId}`;
  return () =>
    axios
      .get(url, { headers })
      .then((response) => response)
      .catch((error) => error.response.data);
}

export function getBooks(token) {
  return (dispatch) => {
    dispatch(retrieveBooksPending());
    const headers = { Authorization: `Bearer ${token}` };
    const url = 'http://localhost:3500/books';
    return axios
      .get(url, { headers })
      .then((response) => {
        dispatch(retrieveBooksSuccess(response.data));
      })
      .catch((error) => {
        if (error.response.data.statusCode !== 200) {
          dispatch(retrieveBooksFail(error.message));
        }
      });
  };
}

export function addBook(
  authUserRoles,
  title,
  author,
  year,
  description,
  category,
  image,
  publisher,
  serNo,
  token
) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  return () =>
    axios
      .post(
        'http://localhost:3500/books',
        { title, author, year, description, category, image, publisher, serNo },
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
  category,
  image,
  publisher,
  serNo,
  token
) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  const url = `http://localhost:3500/books`;

  return () =>
    axios
      .put(
        url,
        {
          id,
          title,
          author,
          year,
          description,
          category,
          image,
          publisher,
          serNo,
        },
        { headers }
      )
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

export function lendBook(book, user, authUserRoles, token) {
  const owed = user.owedBooks;
  owed.push(book._id);
  const history = user.readingHistory;
  history.push(book._id);
  const timeOfLending = new Date().getTime() + 1000 * 3600 * 168;
  const dueDate = new Date(timeOfLending).toDateString();
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  const url = `http://localhost:3500/users`;

  return () =>
    axios
      .put(
        url,
        {
          id: user._id,
          newOwedBooks: owed,
          readingHistory: history,
        },
        { headers }
      )
      .then((response) => {
        if (response) {
          axios
            .put(
              `http://localhost:3500/books`,
              {
                authUserRoles,
                id: book._id,
                available: 'false',
                owedBy: { userId: user._id, dueDate },
              },
              { headers }
            )
            .then((resp) => resp)
            .catch((error) => error.response.data);
        }
        return response;
      });
}

export function returnBook(token, authUserRoles, book, user, newOwedBooks) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  const url = `http://localhost:3500/users`;

  return () =>
    axios
      .put(
        url,
        {
          id: user._id,
          newOwedBooks,
        },
        { headers }
      )
      .then((response) => {
        if (response) {
          axios
            .put(
              `http://localhost:3500/books`,
              {
                id: book._id,
                available: 'true',
                owedBy: { userId: '', dueDate: '' },
              },
              { headers }
            )
            .then((resp) => resp)
            .catch((error) => error.response.data);
        }
        return response;
      });
}

export function setNotification(token, authUserRoles, book, userId) {
  const { reservedBy } = book;
  reservedBy.push(userId);
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  const url = `http://localhost:3500/books`;

  return () =>
    axios
      .put(
        url,
        {
          id: book._id,
          reservedBy: userId,
        },
        { headers }
      )
      .then((resp) => resp)
      .catch((error) => error.response.data);
}

export function addNewRating(token, authUserRoles, bookTitle, userId, newRating) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  const url = `http://localhost:3500/books/rate/`;

  return () =>
    axios
      .put(
        url,
        {
          title: bookTitle,
          newRating: {
            userId,
            value: newRating,
          },
        },
        { headers }
      )
      .then((resp) => resp)
      .catch((error) => error);
}

export function addReview(token, authUserRoles, bookTitle, userId, newReview) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  const url = `http://localhost:3500/books/review/`;

  return () =>
    axios
      .put(
        url,
        {
          title: bookTitle,
          newReview: {
            userId,
            review: newReview,
          },
        },
        { headers }
      )
      .then((resp) => resp)
      .catch((error) => error);
}

export function updateReview(token, authUserRoles, bookTitle, reviews) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  const url = `http://localhost:3500/books/review/`;

  return () =>
    axios
      .put(
        url,
        {
          title: bookTitle,
          reviews,
        },
        { headers }
      )
      .then((resp) => resp)
      .catch((error) => error);
}
