import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import { useParams, MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { store } from '../../store.ts';
import LendOrReturn from '../Book/LendOrReturn.tsx';
import '@testing-library/jest-dom/extend-expect';

const usersArray = [
  {
    _id: '123456789',
    name: 'name',
    username: 'username',
    image: 'image',
    roles: { member: 'Member' },
    email: 'user@email.com',
    owedBooks: ['123456789', '456'],
  },
  {
    _id: '987654321',
    name: 'name',
    username: 'username',
    image: 'image',
    roles: { member: 'Member' },
    email: 'user@email.com',
  },
];

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
  roles: { member: 'Member' },
};

const setup = (users) => {
  useParams.mockReturnValue({ id: '123456789' });
  const history = createMemoryHistory();
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  useSelectorMock.mockReturnValue({ users, authUser, books: booksArray });
  render(
    <Provider store={store}>
      <MemoryRouter history={history}>
        <LendOrReturn />
      </MemoryRouter>
    </Provider>
  );
  useSelectorMock.mockClear();
};

afterEach(() => cleanup());

describe('LendOrReturn', () => {
  it('renders without crashing', () => {
    useParams.mockReturnValue({ id: '123456789' });
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ users: usersArray, authUser, books: booksArray });
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <LendOrReturn />
      </Provider>,
      div
    );
  });
  it('renders tabs for lending books and displaying owed books', () => {
    setup(usersArray);

    expect(screen.getByTestId('lend-new-book-tab')).toBeInTheDocument();
    expect(screen.getByTestId('owed-books-tab')).toBeInTheDocument();
  });
  it(`renders LendBook component if 'Lend new book' tab is clicked`, () => {
    setup(usersArray);

    const lendBookTab = screen.getByTestId('lend-new-book-tab');
    fireEvent.click(lendBookTab);
    expect(screen.getByTestId('lend-book-form')).toBeInTheDocument();
  });
  it(`renders OwedBooks component if 'Owed books' tab is clicked`, () => {
    setup(usersArray);

    const owedBooksTab = screen.getByTestId('owed-books-tab');
    fireEvent.click(owedBooksTab);
    expect(screen.getByTestId('concise-book')).toBeInTheDocument();
  });
  it('renders a button for returning to table of users', () => {
    setup(usersArray);

    expect(screen.getByTestId('back-to-users-button')).toBeInTheDocument();
  });
  it(`takes user back to table of users when 'Back to users' button is clicked`, () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, 'push');
    useParams.mockReturnValue({ id: '123456789' });
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ users: usersArray, authUser, books: booksArray });
    render(
      <Provider store={store}>
        <Router history={history}>
          <LendOrReturn />
        </Router>
      </Provider>
    );
    fireEvent.click(screen.getByTestId('back-to-users-button'));
    expect(pushSpy).toHaveBeenCalled();
  });
});
