import { RETRIEVE_BOOKS_SUCCESS, RETRIEVE_BOOKS_FAIL } from '../actions/books';

const initialState = {
  books: [],
};

const books = (state = initialState, action) => {
  switch (action.type) {
    case RETRIEVE_BOOKS_SUCCESS:
      return {
        ...state,
        books: action.books,
      };
    case RETRIEVE_BOOKS_FAIL:
      return {
        ...state,
        books: action.error,
      };
    default:
      return state;
  }
};

export default books;
