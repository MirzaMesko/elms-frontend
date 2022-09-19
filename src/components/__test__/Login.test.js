import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import * as reactRedux from 'react-redux';
// @ts-ignore
import { store } from '../../store.ts';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import Login from '../Auth/Login.tsx';

const setup = () =>
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );

beforeEach(() => {
  setup();
});

afterEach(() => cleanup());

describe('Login', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Login />
      </Provider>,
      div
    );
  });
  it('renders the login page', () => {
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
  it('displays the log in message', () => {
    expect(screen.getByTestId('log-in-text').textContent).toBe('Log in');
  });
  it('renders the login form', () => {
    expect(screen.getByTestId('log-in-form')).toBeInTheDocument();
  });
  it('renders inputs for username and password', () => {
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });
  it('allows users to enter values for username and password', () => {
    const usernameInput = screen.getByTestId('username-input');

    fireEvent.change(usernameInput, { target: { value: 'test' } });
    expect(usernameInput.value).toBe('test');

    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(passwordInput, { target: { value: 'test' } });
    expect(passwordInput.value).toBe('test');
  });
  it('renders the login button', () => {
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });
  it('renders the login button as disabled if no username or password', () => {
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    expect(screen.getByTestId('login-button')).toHaveAttribute('disabled');

    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    expect(screen.getByTestId('login-button')).toHaveAttribute('disabled');

    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    expect(screen.getByTestId('login-button')).not.toHaveAttribute('disabled');
  });
  it('renders the message and link for sign up', () => {
    expect(screen.getByTestId('signup-message')).toBeInTheDocument();
    expect(screen.getByTestId('signup-link')).toBeInTheDocument();
    expect(screen.getByTestId('signup-link')).toHaveAttribute('href', '/register');
  });
  it('renders alert if bad response from api', () => {
    cleanup();
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ error: true, message: 'test' });
    render(
      <reactRedux.Provider store={store}>
        <Login />
      </reactRedux.Provider>
    );
    expect(screen.getByTestId('error-alert')).toBeInTheDocument();
    expect(screen.getByTestId('error-message').textContent).toBe('test');
    useSelectorMock.mockClear();
  });
});
