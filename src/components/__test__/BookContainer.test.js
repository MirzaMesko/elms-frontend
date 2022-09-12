import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import BookContainer from '../Book/BookContainer.tsx';
import '@testing-library/jest-dom/extend-expect';

const setup = () => {
  render(
    <Provider store={store}>
      <BookContainer open />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('BookContainer', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <BookContainer open />
      </Provider>,
      div
    );
  });
  it('renders rating dialogue', () => {
    setup();

    expect(screen.getByTestId('rating-dialog')).toBeInTheDocument();
  });
  it('renders review dialogue', () => {
    setup();

    expect(screen.getByTestId('review-dialog')).toBeInTheDocument();
  });
  it('renders BookDetails', () => {
    setup();

    expect(screen.getAllByTestId('book-details')[0]).toBeInTheDocument();
  });
});
