import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { useParams, MemoryRouter } from 'react-router-dom';
// @ts-ignore
import { store } from '../../store.ts';
import Dashboard from '../Dashboard.tsx';
import Settings from '../Settings/Settings.tsx';
// @ts-ignore
import '@testing-library/jest-dom/extend-expect';

const setup = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard roles={['Admin']} />
      </MemoryRouter>
    </Provider>
  );
};

afterEach(() => cleanup());

describe('Dashboard', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard roles={['Admin']} />
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
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard roles={['Admin']}>
            <Settings />
          </Dashboard>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('settings-tabs')).toBeInTheDocument();
  });
});
