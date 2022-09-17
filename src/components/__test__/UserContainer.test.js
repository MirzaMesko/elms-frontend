import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import UserContainer from '../User/UserContainer.tsx';
import '@testing-library/jest-dom/extend-expect';

const User = {
  _id: '123456789',
  name: 'name',
  username: 'username',
  image: 'image',
  roles: ['Member'],
  email: 'user@email.com',
  bio: 'Lorem ipsum dolor sit amet',
};

const setup = () => {
  render(
    <Provider store={store}>
      <UserContainer open user={User} />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('UserContainer', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <UserContainer open user={User} />
      </Provider>,
      div
    );
  });
  it('renders email dialogue', () => {
    setup();

    expect(screen.getByTestId('email-dialog')).toBeInTheDocument();
  });
  it('renders notification dialogue', () => {
    setup();

    expect(screen.getByTestId('notification-dialog')).toBeInTheDocument();
  });
  it('renders UserDetails', () => {
    setup();

    expect(screen.getAllByTestId('user-details')[0]).toBeInTheDocument();
  });
});
