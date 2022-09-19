import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import ReactDOM from 'react-dom';
import { useParams, MemoryRouter } from 'react-router-dom';
// @ts-ignore
import { store } from '../../store.ts';
import Dashboard from '../Dashboard.tsx';
import Settings from '../Settings/Settings.tsx';
// @ts-ignore
import '@testing-library/jest-dom/extend-expect';

const users = [
  {
    username: 'test',
    email: 'test@elms.ba',
    bio: 'Lorem ipsum dolor sit amet.',
    roles: { member: 'Member' },
    notifications: [],
  },
  {
    username: 'test2',
    email: 'test2@elms.ba',
    bio: 'Lorem ipsum dolor sit amet.',
    roles: { member: 'Member' },
  },
];

const authUser = {
  username: 'test2',
  roles: ['Member'],
};

const setup = () => {
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  useSelectorMock.mockReturnValue({ users, authUser });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </Provider>
  );
};

afterEach(() => cleanup());

describe('Dashboard', () => {
  it('renders without crashing', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ users, authUser });
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>,
      div
    );
  });
  it('renders a toolbar with links for menu, home, notifications and settings/logout', () => {
    setup();

    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon-link')).toBeInTheDocument();
    expect(screen.getByTestId('elms-home-link')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-menu')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-button')).toBeInTheDocument();
  });
  it('renders a drawer with links for managing users, books and overdue books', () => {
    setup();

    expect(screen.getByTestId('dashboard-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('manage-users')).toBeInTheDocument();
    expect(screen.getByTestId('manage-books')).toBeInTheDocument();
    expect(screen.getByTestId('manage-overdue-books')).toBeInTheDocument();
  });
  it('renders children component', () => {
    useParams.mockReturnValue({ id: 'test2' });
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ users, authUser });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard>
            <Settings />
          </Dashboard>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('settings-tabs')).toBeInTheDocument();
  });
});
