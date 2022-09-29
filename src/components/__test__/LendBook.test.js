import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import LendBook from '../Book/LendBook.tsx';
import '@testing-library/jest-dom/extend-expect';

const user = [
  {
    username: 'test',
    email: 'test@elms.ba',
    bio: 'Lorem ipsum dolor sit amet.',
    roles: { member: 'Member' },
    notifications: [],
  },
];

const booksArray = [
  {
    _id: '123456789',
    serNo: '111',
    title: 'title1',
    author: 'author1',
    image: 'image1',
    year: '1988',
    category: 'classics',
    description: `Lorem ipsum dolor sit amet`,
  },
  {
    _id: '987654321',
    serNo: '222',
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
  render(
    <Provider store={store}>
      <LendBook user={user} authUserRoels={authUser.roles} books={booksArray} />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('LendBook', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <LendBook books={[]} />
      </Provider>,
      div
    );
  });
  it('renders a form for searching books', () => {
    setup();

    expect(screen.getByTestId('lend-book-form')).toBeInTheDocument();
  });
  it(`renders input with label 'search books by title or serial number'`, () => {
    setup();

    const label = screen.getByTestId('form-input-label');
    expect(label).toBeInTheDocument();
    expect(label.textContent).toBe('search books by title or serial number');

    const input = screen.getByTestId('form-input');
    expect(input).toBeInTheDocument();
    expect(input.textContent).toBe('');
  });
  it(`enables user to enter their search`, () => {
    setup();

    const input = screen.getByTestId('form-input');
    expect(input).toBeInTheDocument();
    expect(input.textContent).toBe('');

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');
  });
  it(`displays 'No results' message if search returns no results`, () => {
    setup();

    const input = screen.getByTestId('form-input');
    const results = screen.getByTestId('results');

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');
    expect(results.textContent).toBe('No results.');
  });
  it(`displays result if search returns a match`, () => {
    setup();

    const input = screen.getByTestId('form-input');
    const results = screen.getByTestId('results');

    fireEvent.change(input, { target: { value: 'title1' } });
    expect(input.value).toBe('title1');
    expect(results.textContent).not.toBe('No results.');
    expect(screen.getByTestId('concise-book')).toBeInTheDocument();
  });
});
