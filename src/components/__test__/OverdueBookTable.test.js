import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import OverdueBookTable from '../Book/OverdueBookTable.tsx';
import '@testing-library/jest-dom/extend-expect';

const booksArray = [
  {
    _id: '123456789',
    title: 'title',
    author: 'author',
    image: 'image',
    year: '1988',
    serNo: '123',
    category: 'classics',
    description: `Lorem ipsum dolor sit amet`,
    owedBy: {
      userId: '123456789',
    },
  },
  {
    _id: '987654321',
    title: 'title',
    author: 'author',
    image: 'image',
    year: '1988',
    serNo: '456',
    category: 'classics',
    description: `Lorem ipsum dolor sit amet`,
    owedBy: {
      userId: '123456789',
    },
  },
];

const usersArray = [
  {
    _id: '123456789',
    name: 'name',
    username: 'username',
    image: 'image',
    roles: ['Member'],
    email: 'user@email.com',
  },
  {
    _id: '987654321',
    name: 'name',
    username: 'username',
    image: 'image',
    roles: ['Member'],
    email: 'user@email.com',
  },
];

const authUser = {
  username: 'test2',
  roles: ['Librarian', 'Member'],
};

const setup = (books) => {
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  useSelectorMock.mockReturnValue({ users: usersArray, authUser });
  render(
    <Provider store={store}>
      <OverdueBookTable books={books} />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('OverdueBookTable', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <OverdueBookTable books={[]} />
      </Provider>,
      div
    );
  });
  it(`renders 'Overdue Books' as title of table`, () => {
    setup([]);

    expect(screen.getByTestId('overdue-book-table-title')).toBeInTheDocument();
  });
  it(`renders 'No overdue books to display.' message if no ovedue books or search returns no results`, () => {
    setup([]);

    expect(screen.getByTestId('no-results-message')).toBeInTheDocument();
    expect(screen.getByTestId('no-results-message').textContent).toBe(
      'No overdue books to display.'
    );
  });
  it('renders table with tablehead, tablebody and pagination', () => {
    setup(booksArray);

    expect(screen.queryByTestId('table-head')).toBeInTheDocument();
    expect(screen.queryByTestId('overdue-book-table-body')).toBeInTheDocument();
    expect(screen.queryByTestId('table-pagination')).toBeInTheDocument();
  });
  it('renders tablehead with headcells for Title, Author, Serial No, Owed by, Due on and Actions', () => {
    setup(booksArray);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
    expect(screen.getByText('Serial No')).toBeInTheDocument();
    expect(screen.getByText('Owed by')).toBeInTheDocument();
    expect(screen.getByText('Due on')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
