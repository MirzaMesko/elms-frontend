import { AnyAction } from 'redux';
import {
  RETRIEVE_BOOKS_SUCCESS,
  RETRIEVE_BOOKS_FAIL,
  RETRIEVE_BOOKS_PENDING,
  // @ts-ignore
} from '../actions/books.tsx';

const initialState = {
  books: [],
  loading: false,
  error: {},
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
    default:
      return state;
  }
};

export default books;
