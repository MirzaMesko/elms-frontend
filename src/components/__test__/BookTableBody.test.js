import { screen, render, cleanup, getByTestId } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import * as reactRedux from 'react-redux';
import TableRow from '@material-ui/core/TableRow';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import BookTableBody from '../Book/BookTableBody.tsx';
import '@testing-library/jest-dom/extend-expect';

const booksArray = [
  {
    _id: '123456789',
    title: 'title',
    author: 'author',
    image: 'image',
    year: '1988',
    category: 'classics',
    description: `Lorem ipsum dolor sit amet`,
  },
  {
    _id: '987654321',
    title: 'title',
    author: 'author',
    image: 'image',
    year: '1988',
    category: 'classics',
    description: `Lorem ipsum dolor sit amet`,
  },
];

const setup = (books) => {
  render(<BookTableBody books={books} page={1} order="asc" orderBy="username" rowsPerPage={10} />);
};

describe('BookTableBody', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <BookTableBody books={[]} />
      </Provider>,
      div
    );
  });
});
