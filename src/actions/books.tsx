/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
// @ts-ignore
import { AppDispatch } from '../store.ts';
// @ts-ignore
import type { Book, User, Review, Roles } from '../types.ts';
// @ts-ignore
import responseInterceptor from './refreshToken.tsx';

const axios = require('axios');

export const RETRIEVE_BOOKS_SUCCESS = 'RETRIEVE_BOOKS_SUCCESS';
export const SHOW_SNACKBAR_MESSAGE = 'SHOW_SNACKBAR_MESSAGE';
export const CLOSE_SNACKBAR_MESSAGE = 'CLOSE_SNACKBAR_MESSAGE';
export const RETRIEVE_BOOKS_FAIL = 'RETRIEVE_BOOKS_FAIL';
export const RETRIEVE_BOOKS_PENDING = 'RETRIEVE_BOOKS_PENDING';

function retrieveBooksPending() {
  return {
    type: RETRIEVE_BOOKS_PENDING,
  };
}

function retrieveBooksSuccess(books: [Book]) {
  return {
    type: RETRIEVE_BOOKS_SUCCESS,
    books,
  };
}

export function showSnackbarMessage(status: string, message: string) {
  return {
    type: SHOW_SNACKBAR_MESSAGE,
    status,
    message,
  };
}

// used in snackbarMiddleware with timeout to close snackbar messages
export function closeSnackbarMessage() {
  return {
    type: CLOSE_SNACKBAR_MESSAGE,
  };
}

function retrieveBooksFail(error: string) {
  return {
    type: RETRIEVE_BOOKS_FAIL,
    error,
  };
}

export function getBookById(token: string, bookId: string) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}` };
    const url = `http://localhost:3500/books/${bookId}`;
    return axios
      .get(url, { headers })
      .then((response: any) => response)
      .catch((error: any) => error);
  };
}

export function getBooks(token: string) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    dispatch(retrieveBooksPending());
    const headers = { Authorization: `Bearer ${token}` };
    const url = 'http://localhost:3500/books';
    return axios
      .get(url, { headers })
      .then((response: any) => {
        dispatch(retrieveBooksSuccess(response.data));
      })
      .catch((error: any) => {
        dispatch(retrieveBooksFail(error.message));
      });
  };
}

export function addBook(
  authUserRoles: Array<string>,
  title: Book,
  author: Book,
  year: Book,
  description: Book,
  category: Book,
  image: Book,
  publisher: Book,
  serNo: Book,
  token: string
) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    return axios
      .post(
        'http://localhost:3500/books',
        { title, author, year, description, category, image, publisher, serNo },
        { headers }
      )
      .then((response: any) => {
        if (response.status === 201) {
          dispatch(showSnackbarMessage('success', 'Book successfully added to the library.'));
        } else {
          dispatch(
            showSnackbarMessage(
              'error',
              `Something went wrong. Please try again.${response.data.message}`
            )
          );
        }
        return response;
      })
      .catch((error: any) => {
        dispatch(showSnackbarMessage('error', `Something went wrong. Please try again.`));
        return error;
      });
  };
}

export function editBook(
  authUserRoles: Array<string>,
  id: Book,
  title: Book,
  author: Book,
  year: Book,
  description: Book,
  category: Book,
  image: Book,
  publisher: Book,
  serNo: Book,
  token: string
) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    const url = `http://localhost:3500/books`;

    return axios
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
      .then((response: any) => {
        dispatch(showSnackbarMessage('success', 'Book successfully edited.'));
        return response;
      })
      .catch((error: any) => {
        dispatch(showSnackbarMessage('error', 'Something went wrong. Please try again.'));
        return error;
      });
  };
}

export function deleteBook(authUserRoles: Roles, id: string, token: string) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const config = {
      headers: { Authorization: `Bearer ${token}`, roles: authUserRoles },
      data: { id },
    };
    const url = `http://localhost:3500/books`;

    return axios
      .delete(url, config)
      .then((response: any) => {
        dispatch(showSnackbarMessage('success', 'Book successfully deleted.'));
        return response;
      })
      .catch((error: any) => {
        dispatch(showSnackbarMessage('error', 'Something went wrong. Please try again.'));
        return error;
      });
  };
}

export function lendBook(book: Book, user: User, authUserRoles: Roles, token: string) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const owed = user.owedBooks;
    owed.push(book._id);
    const { readingHistory } = user;
    readingHistory.push(book._id);
    const timeOfLending = new Date().getTime() + 1000 * 3600 * 168;
    const dueDate = new Date(timeOfLending).toDateString();
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    const url = `http://localhost:3500/users`;

    return axios
      .put(
        url,
        {
          id: user._id,
          newOwedBooks: owed,
          readingHistory,
        },
        { headers }
      )
      .then((response: any) => {
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
            .then((resp: any) => {
              dispatch(
                showSnackbarMessage('success', `Book ${book.title} was lent to ${user.username}`)
              );
              return resp;
            })
            .catch((error: any) => {
              dispatch(showSnackbarMessage('error', 'Something went wrong. Please try again.'));
              return error;
            });
        }
        return response;
      });
  };
}

export function returnBook(
  token: string,
  authUserRoles: Roles,
  book: Book,
  user: User,
  newOwedBooks: [Book]
) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    const url = `http://localhost:3500/users`;

    return axios
      .put(
        url,
        {
          id: user._id,
          newOwedBooks,
        },
        { headers }
      )
      .then((response: any) => {
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
            .then((resp: any) => {
              dispatch(
                showSnackbarMessage('success', `Book ${book.title} was returned to the library`)
              );
              return resp;
            })
            .catch((error: any) => {
              dispatch(showSnackbarMessage('error', 'Something went wrong. Please try again.'));
              return error;
            });
        }
        return response;
      });
  };
}

export function setNotification(token: string, authUserRoles: Roles, book: Book, user: User) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const { reservedBy } = book;
    reservedBy.push(user._d);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    const url = `http://localhost:3500/books`;

    return axios
      .put(
        url,
        {
          id: book._id,
          reservedBy: user._id,
        },
        { headers }
      )
      .then((resp: any) => {
        dispatch(
          showSnackbarMessage(
            'success',
            `User ${user.username} will be notified when ${book.title} by ${book.author} is available.`
          )
        );
        return resp;
      })
      .catch((error: any) => {
        dispatch(showSnackbarMessage('error', 'Something went wrong. Please try again.'));
        return error;
      });
  };
}

export function addNewRating(
  token: string,
  authUserRoles: Roles,
  bookTitle: string,
  userId: string,
  newRating: number
) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    const url = `http://localhost:3500/books/rate/`;

    return axios
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
      .then((resp: any) => {
        dispatch(showSnackbarMessage('success', 'Thank you for your rating.'));
        return resp;
      })
      .catch((error: any) => {
        dispatch(showSnackbarMessage('error', 'Something went wrong. Please try again.'));
        return error;
      });
  };
}

export function addReview(
  token: string,
  authUserRoles: Roles,
  bookTitle: string,
  userId: string,
  newReview: string
) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    const url = `http://localhost:3500/books/review/`;

    return axios
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
      .then((resp: any) => {
        dispatch(showSnackbarMessage('success', 'Thank you for your review.'));
        return resp;
      })
      .catch((error: any) => {
        dispatch(showSnackbarMessage('error', 'Something went wrong. Please try again.'));
        return error;
      });
  };
}

export function updateReview(
  token: string,
  authUserRoles: Roles,
  bookTitle: string,
  reviews: [Review]
) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    const url = `http://localhost:3500/books/review/`;

    return axios
      .put(
        url,
        {
          title: bookTitle,
          reviews,
        },
        { headers }
      )
      .then((resp: any) => {
        dispatch(showSnackbarMessage('success', 'Your review has been edited.'));
        return resp;
      })
      .catch((error: any) => {
        dispatch(showSnackbarMessage('error', 'Something went wrong. Please try again.'));
        return error;
      });
  };
}
