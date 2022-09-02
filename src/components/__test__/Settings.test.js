import { screen, render, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
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
    notifications: [],
  },
  {
    username: 'test2',
    email: 'test2@elms.ba',
    bio: 'Lorem ipsum dolor sit amet.',
    roles: { member: 'Member' },
    notifications: [],
  },
];

const setup = (usersArray) => {
  render(
    <Provider store={store}>
      <Settings users={usersArray} />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('Settings', () => {
  it('renders without crashing', () => {
    useParams.mockReturnValue({ id: 'test' });
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Settings />
      </Provider>,
      div
    );
  });
  it('renders tabs for notifications, profile and reading history', async () => {
    useParams.mockReturnValue({ id: 'test2' });
    setup(users);

    expect(screen.getByTestId('settings-tabs')).toBeInTheDocument();
    expect(screen.getAllByTestId('settings-link-tab').length).toBe(3);
  });
});
