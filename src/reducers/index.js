import { combineReducers } from 'redux';
import books from './books';
import users from './users';

export default combineReducers({
  books,
  users,
});
