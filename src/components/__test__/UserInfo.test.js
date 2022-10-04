import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import UserInfo from '../User/UserInfo.tsx';
import '@testing-library/jest-dom/extend-expect';

const User = {
  _id: '123456789',
  name: 'name',
  username: 'username',
  image: 'image.png',
  roles: ['Member'],
  email: 'user@email.com',
  bio: 'Lorem ipsum dolor sit amet',
};

const setup = (user) => {
  render(<UserInfo user={user} />);
};

afterEach(() => cleanup());

describe('UserInfo', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<UserInfo user={User} />, div);
  });
  it(`renders user's image if available`, () => {
    setup(User);

    expect(screen.getByTestId('user-image')).toBeInTheDocument();
    expect(screen.getByTestId('user-image')).toHaveAttribute('src', 'image.png');
  });
  it('renders a placeholder image if book image not available', () => {
    setup({
      _id: '123456789',
      name: 'name',
      username: 'username',
      roles: ['Member'],
      email: 'user@email.com',
    });

    expect(screen.getByTestId('user-image')).toBeInTheDocument();
    expect(screen.getByTestId('user-image')).toHaveAttribute(
      'src',
      'profile-picture-default-png.png'
    );
  });
  it('renders Loading component if user details are not available', () => {
    render(
      <Provider store={store}>
        <UserInfo />
      </Provider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
  it(`renders user's username`, () => {
    setup(User);

    expect(screen.getByTestId('username')).toBeInTheDocument();
    expect(screen.getByTestId('username').textContent).toBe('username');
  });
  it(`renders user's roles`, () => {
    setup(User);

    expect(screen.queryByTestId('user-roles')).toBeInTheDocument();
    expect(screen.getByTestId('user-roles').textContent).toBe('Member');
    cleanup();

    setup({
      _id: '123456789',
      username: 'username',
      roles: ['Member', 'Admin', 'Librarian'],
    });
    expect(screen.queryAllByTestId('user-roles')[0]).toBeInTheDocument();
    expect(screen.queryAllByTestId('user-roles')[0].textContent).toBe('Member');
    expect(screen.queryAllByTestId('user-roles')[1].textContent).toBe('Admin');
    expect(screen.queryAllByTestId('user-roles')[2].textContent).toBe('Librarian');
  });
  it(`renders user's email`, () => {
    setup(User);

    expect(screen.getByTestId('user-email')).toBeInTheDocument();
    expect(screen.getByTestId('user-email').textContent).toBe('user@email.com');
  });
  it(`renders user's name`, () => {
    setup(User);

    expect(screen.getByTestId('user-name')).toBeInTheDocument();
    expect(screen.getByTestId('user-name').textContent).toBe('name');
  });
});
