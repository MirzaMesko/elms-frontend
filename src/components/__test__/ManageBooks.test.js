import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../store.ts';
import '@testing-library/jest-dom/extend-expect';
import ManageBooks from '../Book/ManageBooks.tsx';

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
    title: 'title2',
    author: 'author2',
    image: 'image2',
    year: '1988',
    category: 'classics',
    description: `Lorem ipsum dolor sit amet`,
  },
];

const authUser = {
  username: 'test2',
  roles: ['Member'],
};

const setup = () => {
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  useSelectorMock.mockReturnValue({ authUser, books: booksArray });
  render(
    <Provider store={store}>
      <ManageBooks />
    </Provider>
  );
  useSelectorMock.mockClear();
};

afterEach(() => cleanup());

describe('ManageBooks', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <ManageBooks />
      </Provider>,
      div
    );
  });
});
