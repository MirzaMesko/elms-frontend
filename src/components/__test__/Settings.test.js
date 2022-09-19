import { screen, render, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import ReactDOM from 'react-dom';
import { useParams, MemoryRouter } from 'react-router-dom';
// @ts-ignore
import { store } from '../../store.ts';
import Settings from '../Settings/Settings.tsx';
// @ts-ignore
import '@testing-library/jest-dom/extend-expect';

const users = [
  {
    username: 'test',
    email: 'test@elms.ba',
    bio: 'Lorem ipsum dolor sit amet.',
    roles: { member: 'Member' },
    notifications: [{}],
  },
  {
    username: 'test2',
    email: 'test2@elms.ba',
    bio: 'Lorem ipsum dolor sit amet.',
    roles: { member: 'Member' },
    notifications: [],
  },
];

const authUser = {
  username: 'test2',
  roles: { member: 'Member' },
};

const setup = (usersArray) => {
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  useSelectorMock.mockReturnValue({ users: usersArray, authUser });
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/users/settings/test2']}>
        <Settings />
      </MemoryRouter>
    </Provider>
  );
  useSelectorMock.mockClear();
};

afterEach(() => cleanup());

describe('Settings', () => {
  it('renders without crashing', () => {
    useParams.mockReturnValue({ id: 'test' });
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ users, authUser });
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Settings />
      </Provider>,
      div
    );
  });
  it('renders tabs for notifications, profile and reading history', () => {
    useParams.mockReturnValue({ id: 'test' });
    setup(users);

    expect(screen.getByTestId('settings-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('profile-link-tab')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-link-tab')).toBeInTheDocument();
    expect(screen.getByTestId('reading-history-link-tab')).toBeInTheDocument();
  });
  it('displays users profile when Profile LinkTab is clicked', () => {
    useParams.mockReturnValue({ id: 'test2' });
    setup(users);

    const tabLink = screen.getByTestId('profile-link-tab');
    fireEvent.click(tabLink);

    expect(screen.getByTestId('profile')).toBeInTheDocument();
  });
  it('displays users notifications when notifications LinkTab is clicked', () => {
    useParams.mockReturnValue({ id: 'test2' });
    setup(users);

    const tabLink = screen.getByTestId('notifications-link-tab');
    fireEvent.click(tabLink);

    expect(screen.getByTestId('no-notifications')).toBeInTheDocument();
  });
  it('displays users reading history when Reading History LinkTab is clicked', () => {
    useParams.mockReturnValue({ id: 'test2' });
    setup(users);

    const tabLink = screen.getByTestId('reading-history-link-tab');
    fireEvent.click(tabLink);

    expect(screen.getByTestId('no-history-message')).toBeInTheDocument();
  });
});
