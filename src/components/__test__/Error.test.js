import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import Error from '../Helpers/Error.tsx';
import '@testing-library/jest-dom/extend-expect';

const setup = (message) => {
  render(
    <Provider store={store}>
      <Error message={message} />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('Error', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Error />
      </Provider>,
      div
    );
  });
  it('renders alert message if it is provided', () => {
    setup('error');

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message').textContent).toBe('error');
  });
  it(`renders 'Something went wrong. Please try again.' message if custom message is not provided`, () => {
    setup();

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message').textContent).toBe(
      'Something went wrong. Please try again.'
    );
  });
});
