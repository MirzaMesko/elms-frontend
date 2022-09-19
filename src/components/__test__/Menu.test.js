import { screen, render, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { store } from '../../store.ts';
import Menu from '../Menu.tsx';
// @ts-ignore
import '@testing-library/jest-dom/extend-expect';

const setup = () =>
  render(
    <Provider store={store}>
      <Menu username="Mirza" />
    </Provider>
  );

afterEach(() => cleanup());

describe('Menu', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Menu username="Mirza" />
      </Provider>,
      div
    );
  });
  it('renders the avatar button to display the menu', () => {
    setup();
    expect(screen.getByTestId('avatar-button')).toBeInTheDocument();
  });
  it('displays the menu when avatar button is clicked', () => {
    setup();
    const button = screen.getByTestId('avatar-button');

    fireEvent.click(button);
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });
  it('menu contains users image and username', () => {
    setup();
    const button = screen.getByTestId('avatar-button');

    fireEvent.click(button);
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByTestId('username')).toBeInTheDocument();
    expect(screen.getByTestId('username').textContent).toBe('Mirza');
  });
  it('menu contains the link to Settings', () => {
    setup();
    const button = screen.getByTestId('avatar-button');

    fireEvent.click(button);
    expect(screen.getByTestId('settings').textContent).toBe('Settings');
  });
  it('menu contains the link for logging out', () => {
    setup();
    const button = screen.getByTestId('avatar-button');

    fireEvent.click(button);
    expect(screen.getByTestId('logout').textContent).toBe('Log out');
  });
  it('calls logout fn when logout button is clicked', () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);

    setup();
    const button = screen.getByTestId('avatar-button');

    fireEvent.click(button);
    const logout = screen.getByTestId('logout');
    fireEvent.click(logout);

    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    useDispatchSpy.mockClear();
  });
});
