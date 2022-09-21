import { AnyAction } from 'redux';
import {
  RETRIEVE_BOOKS_SUCCESS,
  RETRIEVE_BOOKS_FAIL,
  RETRIEVE_BOOKS_PENDING,
  SHOW_SNACKBAR_MESSAGE,
  CLOSE_SNACKBAR_MESSAGE,
  // @ts-ignore
} from '../actions/books.tsx';

const initialState = {
  books: [],
  loading: false,
  error: {},
  snackbar: {
    show: false,
    severity: '',
    message: '',
  },
};

const books = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case RETRIEVE_BOOKS_PENDING:
      return {
        ...state,
        loading: true,
      };
    case RETRIEVE_BOOKS_SUCCESS:
      return {
        ...state,
        books: action.books,
        loading: false,
      };
    case RETRIEVE_BOOKS_FAIL:
      return {
        ...state,
        error: {
          error: true,
          message: action.error,
        },
        loading: false,
      };
    case SHOW_SNACKBAR_MESSAGE:
      return {
        ...state,
        snackbar: {
          show: true,
          severity: action.status,
          message: action.message,
        },
      };
    case CLOSE_SNACKBAR_MESSAGE:
      return {
        ...state,
        snackbar: {
          show: false,
        },
      };
    default:
      return state;
  }
};

export default books;
