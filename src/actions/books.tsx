/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
// @ts-ignore
import { AppDispatch } from '../store.ts';
// @ts-ignore
import type { Book, User, Review, Roles } from '../types.ts';
// @ts-ignore
import { refresh } from './auth.tsx';

const axios = require('axios');

export const RETRIEVE_BOOKS_SUCCESS = 'RETRIEVE_BOOKS_SUCCESS';
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

function retrieveBooksFail(error: string) {
  return {
    type: RETRIEVE_BOOKS_FAIL,
    error,
  };
}

const responseInterceptor = (dispatch: AppDispatch) => {
  // Add a response interceptor
  axios.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      console.log('it was here');
      const prevRequest = error?.config;
      if (error?.response?.status === 403 && !prevRequest?.sent) {
        // eslint-disable-next-line no-unused-expressions
        prevRequest.sent === true;
        const newAccessToken = await dispatch(refresh());
        console.log(newAccessToken);
        if (prevRequest.config) {
          prevRequest.config.headers.Authorization = `Bearer ${newAccessToken}`;
        } else {
          prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axios(prevRequest);
      }
    }
  );
  axios.interceptors.response.eject();
};

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
      .then((response: any) => response)
      .catch((error: any) => error);
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
      .then((response: any) => response)
      .catch((error: any) => error.response.data);
  };
}

export function deleteBook(authUserRoles: Roles, id: string, token: string) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const config = {
      headers: { authorization: `Bearer ${token}`, roles: authUserRoles },
      data: { id },
    };
    const url = `http://localhost:3500/books`;

    return axios
      .delete(url, config)
      .then((response: any) => response)
      .catch((error: any) => error.response.data);
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
            .then((resp: any) => resp)
            .catch((error: any) => error.response.data);
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
            .then((resp: any) => resp)
            .catch((error: any) => error.response.data);
        }
        return response;
      });
  };
}

export function setNotification(token: string, authUserRoles: Roles, book: Book, userId: string) {
  return (dispatch: AppDispatch) => {
    responseInterceptor(dispatch);
    const { reservedBy } = book;
    reservedBy.push(userId);
    const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
    const url = `http://localhost:3500/books`;

    return axios
      .put(
        url,
        {
          id: book._id,
          reservedBy: userId,
        },
        { headers }
      )
      .then((resp: any) => resp)
      .catch((error: any) => error.response.data);
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
      .then((resp: any) => resp)
      .catch((error: any) => error);
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
      .then((resp: any) => resp)
      .catch((error: any) => error);
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
      .then((resp: any) => resp)
      .catch((error: any) => error);
  };
}
