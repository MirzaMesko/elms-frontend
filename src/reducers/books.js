import {
  RETRIEVE_BOOKS_SUCCESS,
  RETRIEVE_BOOKS_FAIL,
  RETRIEVE_BOOKS_PENDING,
} from '../actions/books';

const initialState = {
  books: [],
};

const books = (state = initialState, action) => {
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
