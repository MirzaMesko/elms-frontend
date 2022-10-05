import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import Alert from '../Helpers/Alert.tsx';
import '@testing-library/jest-dom/extend-expect';

const closeAlertFn = jest.fn(() => null);

const setup = (message) => {
  render(
    <Provider store={store}>
      <Alert title="test" show onClose={closeAlertFn} message={message} />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('Alert', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Alert />
      </Provider>,
      div
    );
  });
  it('renders a title for alert', () => {
    setup();

    expect(screen.getByTestId('alert-title')).toBeInTheDocument();
  });
  it('renders icon for closing the alert', () => {
    setup();

    expect(screen.getByTestId('close-alert-icon')).toBeInTheDocument();
  });
  it('calls onClose function when close icon is clicked', () => {
    setup();

    const closeIcon = screen.getByTestId('close-alert-icon');
    fireEvent.click(closeIcon);
    expect(closeAlertFn).toHaveBeenCalledTimes(1);
  });
  it('renders alert message if it is provided', () => {
    setup('alert');

    expect(screen.getByTestId('alert-message')).toBeInTheDocument();
    expect(screen.getByTestId('alert-message').textContent).toBe('alert');
  });
  it(`renders 'Something went wrong. Please try again.' message if custom message is not provided`, () => {
    setup();

    expect(screen.getByTestId('alert-message')).toBeInTheDocument();
    expect(screen.getByTestId('alert-message').textContent).toBe(
      'Something went wrong. Please try again.'
    );
  });
  it(`renders 'OK' button for closing the alert`, () => {
    setup();

    expect(screen.getByTestId('close-alert-button')).toBeInTheDocument();
    expect(screen.getByTestId('close-alert-button').textContent).toBe('OK');
  });
  it('calls onClose function when close button is clicked', () => {
    setup();

    const closeButton = screen.getByTestId('close-alert-button');
    fireEvent.click(closeButton);
    expect(closeAlertFn).toHaveBeenCalledTimes(1);
  });
});
