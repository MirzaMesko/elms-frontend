import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import Confirm from '../Helpers/Confirm.tsx';
import '@testing-library/jest-dom/extend-expect';

const confirmFn = jest.fn(() => null);
const cancelFn = jest.fn(() => null);

const setup = () => {
  render(
    <Provider store={store}>
      <Confirm
        title="title"
        show
        message="message"
        confirm={confirmFn}
        cancel={cancelFn}
        cancelText="cancel"
        confirmText="confirm"
      />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('Confirm', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Confirm />
      </Provider>,
      div
    );
  });
  it('renders a title for confirm', () => {
    setup();

    expect(screen.getByText('title')).toBeInTheDocument();
  });
  it('renders a message for confirm', () => {
    setup();

    expect(screen.getByText('message')).toBeInTheDocument();
  });
  it('renders a button for canceling with provided text', () => {
    setup();

    const cancelButton = screen.getByTestId('cancel');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('cancel');
  });
  it('calls cancel function when cancel button is clicked', () => {
    setup();

    const cancelButton = screen.getByTestId('cancel');
    fireEvent.click(cancelButton);
    expect(cancelFn).toHaveBeenCalledTimes(1);
  });
  it('renders a button for confirming with provided text', () => {
    setup();

    const confirmButton = screen.getByTestId('confirm');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toHaveTextContent('confirm');
  });
  it('calls confirm function when confirm button is clicked', () => {
    setup();

    const confirmButton = screen.getByTestId('confirm');
    fireEvent.click(confirmButton);
    expect(confirmFn).toHaveBeenCalledTimes(1);
  });
});
