/* eslint-disable global-require */
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
// @ts-ignore
import books from './reducers/books.tsx';
// @ts-ignore
import users from './reducers/users.tsx';

export const store = configureStore({
  reducer: {
    books,
    users,
  },
  middleware: [thunk],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// eslint-disable-next-line no-undef
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
