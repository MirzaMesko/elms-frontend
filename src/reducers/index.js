import { combineReducers } from 'redux';
// @ts-ignore
import books from './books.tsx';
// @ts-ignore
import users from './users.tsx';

export default combineReducers({
  books,
  users,
});
