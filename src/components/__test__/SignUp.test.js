import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import ReactDOM from 'react-dom';
// @ts-ignore
import { store } from '../../store.ts';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import Register from '../Auth/SignUp.tsx';

const setup = () =>
  render(
    <Provider store={store}>
      <Register />
    </Provider>
  );

beforeEach(() => {
  setup();
});

afterEach(() => cleanup());

describe('SignUp', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Register />
      </Provider>,
      div
    );
  });
  it('renders the sign up page', () => {
    expect(screen.getByTestId('signup-page')).toBeInTheDocument();
  });
  it('displays the sign up message', () => {
    expect(screen.getByTestId('sign-up-text').textContent).toBe('Sign up');
  });
  it('renders the signup form', () => {
    expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
  });
  it('renders inputs for email, username and password', () => {
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });
  it('allows users to enter values for email, username and password', () => {
    const emailInput = screen.getByTestId('email-input');

    fireEvent.change(emailInput, { target: { value: 'test' } });
    expect(emailInput.value).toBe('test');

    const usernameInput = screen.getByTestId('username-input');

    fireEvent.change(usernameInput, { target: { value: 'test' } });
    expect(usernameInput.value).toBe('test');

    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(passwordInput, { target: { value: 'test' } });
    expect(passwordInput.value).toBe('test');
  });
  it('renders the signup button', () => {
    expect(screen.getByTestId('signup-button')).toBeInTheDocument();
  });
  it('renders the login button as disabled if no email, username or password', () => {
    const emailInput = screen.getByTestId('email-input');
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    expect(screen.getByTestId('signup-button')).toHaveAttribute('disabled');

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    expect(screen.getByTestId('signup-button')).toHaveAttribute('disabled');

    fireEvent.change(emailInput, { target: { value: 'test' } });
    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    expect(screen.getByTestId('signup-button')).toHaveAttribute('disabled');

    fireEvent.change(emailInput, { target: { value: 'test' } });
    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    expect(screen.getByTestId('signup-button')).not.toHaveAttribute('disabled');
  });
  it('renders the message and link for log in', () => {
    expect(screen.getByTestId('login-message')).toBeInTheDocument();
    expect(screen.getByTestId('login-link')).toBeInTheDocument();
    expect(screen.getByTestId('login-link')).toHaveAttribute('href', '/login');
  });
  it('renders alert if bad response from api', () => {
    cleanup();
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ error: true, message: 'test' });
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    );
    expect(screen.getByTestId('error-alert')).toBeInTheDocument();
    expect(screen.getByTestId('error-message').textContent).toBe('test');
  });
});
