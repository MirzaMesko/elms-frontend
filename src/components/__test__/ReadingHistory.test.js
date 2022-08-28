import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import ReadingHistory from '../Settings/ReadingHistory.tsx';
// @ts-ignore
import '@testing-library/jest-dom/extend-expect';

afterEach(() => cleanup());

describe('ReadingHistory', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ReadingHistory user={' '} />, div);
  });
  it('renders appropriate message if no reading history for user', () => {
    render(<ReadingHistory user={' '} />);

    expect(screen.getByTestId('no-history-message')).toBeInTheDocument();
    expect(screen.getByTestId('no-history-message').textContent).toBe(
      'No reading history for this user.'
    );
  });
  it('renders a list of books in users reading history', () => {
    const user = { readingHistory: ['1', '2', '3'] };
    const books = [
      { _id: '1', title: 'book1', author: 'author1' },
      { _id: '2', title: 'book2', author: 'author2' },
      { _id: '3', title: 'book3', author: 'author3' },
    ];

    render(<ReadingHistory user={user} books={books} />);
    expect(screen.getAllByTestId('owedBook')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('owedBook').length).toBe(3);
  });
});
