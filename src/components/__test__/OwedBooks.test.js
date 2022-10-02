import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import '@testing-library/jest-dom/extend-expect';
import OwedBooks from '../Book/OwedBooks.tsx';

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

const setup = (books) => {
  render(
    <Provider store={store}>
      <OwedBooks owedBooks={books} books={booksArray} />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('OwedBooks', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <OwedBooks owedBooks={[]} />
      </Provider>,
      div
    );
  });
  it(`renders 'No owed books for this user.' message if user owes no books`, () => {
    setup([]);

    expect(screen.getByTestId('no-owed-books')).toBeInTheDocument();
    expect(screen.getByTestId('no-owed-books').textContent).toBe('No owed books for this user.');
  });
  it('renders a list of owed books if any', () => {
    setup(['123456789']);

    expect(screen.getByTestId('concise-book')).toBeInTheDocument();
  });
});
