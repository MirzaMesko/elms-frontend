import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import BookTable from '../Book/BookTable.tsx';
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

const authUser = {
  username: 'test2',
  roles: ['Librarian', 'Member'],
};

const setup = (books) => {
  render(
    <Provider store={store}>
      <BookTable books={books} />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('BookTable', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <BookTable books={[]} />
      </Provider>,
      div
    );
  });
  it(`renders 'Books' as title of table`, () => {
    setup([]);

    expect(screen.getByTestId('book-table-title')).toBeInTheDocument();
  });
  it(`renders 'No matches for your search' message if search returns no results`, () => {
    setup([]);

    expect(screen.getByTestId('no-results-message')).toBeInTheDocument();
    expect(screen.getByTestId('no-results-message').textContent).toBe('No matches for your search');
  });
  it('renders table with tablehead, tablebody and pagination', () => {
    setup(booksArray);

    expect(screen.queryByTestId('table-head')).toBeInTheDocument();
    expect(screen.queryByTestId('book-table-body')).toBeInTheDocument();
    expect(screen.queryByTestId('table-pagination')).toBeInTheDocument();
  });
  it('renders Loading component if waiting for API response', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ loading: true });
    render(
      <reactRedux.Provider store={store}>
        <BookTable books={[]} />
      </reactRedux.Provider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    useSelectorMock.mockClear();
  });
  it('renders Error component if error after API request', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ error: { error: true, message: 'test' } });
    render(
      <reactRedux.Provider store={store}>
        <BookTable books={[]} />
      </reactRedux.Provider>
    );

    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByTestId('error-message').textContent).toBe('test');
    useSelectorMock.mockClear();
  });
  it('renders tablehead with headcells for Title, Author, Year, Description, Publisher, Serial No and Actions', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ authUser, error: { error: false, message: '' } });
    setup(booksArray);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Publisher')).toBeInTheDocument();
    expect(screen.getByText('Serial No')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
  it('does not render headcells for Serial No and Actions if user not admin', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({
      authUser: { roles: ['Member'] },
      error: { error: false, message: '' },
    });
    setup(booksArray);
    expect(screen.queryByText('Serial No')).not.toBeInTheDocument();
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });
});
