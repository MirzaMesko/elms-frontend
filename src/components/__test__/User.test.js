import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import UserDetails from '../User/User.tsx';
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

const close = jest.fn(() => null);
const showNotificationDialogue = jest.fn(() => null);
const showEmailDialogue = jest.fn(() => null);

const setup = (user) => {
  const history = createMemoryHistory();
  render(
    <Provider store={store}>
      <UserDetails
        user={user}
        open
        handleClose={close}
        showNotificationDialogue={showNotificationDialogue}
        showEmailDialogue={showEmailDialogue}
        history={history}
      />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('User', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <UserDetails user={User} />
      </Provider>,
      div
    );
  });
  it(`renders users's image if it is available`, () => {
    setup(User);

    expect(screen.getByTestId('user-image')).toBeInTheDocument();
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
        <UserDetails open />
      </Provider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
  it(`renders user's username`, () => {
    setup(User);

    expect(screen.getByTestId('username')).toBeInTheDocument();
    expect(screen.getByTestId('username').textContent).toBe('username');
  });
  it('renders icon for notifying the user', () => {
    setup(User);

    expect(screen.getByTestId('notify-user')).toBeInTheDocument();
  });
  it('renders notification dialog when notification icon is clicked', () => {
    setup(User);

    const notifyIcon = screen.getByTestId('notify-user');
    fireEvent.click(notifyIcon);
    expect(showNotificationDialogue).toHaveBeenCalledTimes(1);
  });
  it('renders icon for emailing the user', () => {
    setup(User);

    expect(screen.getByTestId('email-user')).toBeInTheDocument();
  });
  it('renders email dialog when email icon is clicked', () => {
    setup(User);

    const emailIcon = screen.getByTestId('email-user');
    fireEvent.click(emailIcon);
    expect(showEmailDialogue).toHaveBeenCalledTimes(1);
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
  it(`renders user's bio with title 'About -username-' `, () => {
    setup(User);

    expect(screen.getByTestId('user-bio-title')).toBeInTheDocument();
    expect(screen.getByTestId('user-bio-title').textContent).toBe('About username');
    expect(screen.getByTestId('user-bio-text')).toBeInTheDocument();
    expect(screen.getByTestId('user-bio-text').textContent).toBe(`Lorem ipsum dolor sit amet`);
  });
  it('renders Back button for closing the dialog', () => {
    setup(User);

    const backButton = screen.getByTestId('back-button');
    expect(backButton).toBeInTheDocument();
  });
  it('closes the UserDetails dialog when Back button is clicked', () => {
    setup(User);

    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);
    expect(close).toHaveBeenCalledTimes(1);
  });
  it(`renders 'Go to Lend & Return' button`, () => {
    setup(User);

    const lendReturnButton = screen.getByTestId('lend-return-link');
    expect(lendReturnButton).toBeInTheDocument();
  });
  it(`navigates to lend&return page when 'Go to Lend & Return' button is clicked`, () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, 'push');

    render(
      <Provider store={store}>
        <UserDetails open history={history} user={User} />
      </Provider>
    );

    const lendReturnButton = screen.getByTestId('lend-return-link');
    expect(lendReturnButton).toBeInTheDocument();
    fireEvent.click(lendReturnButton);

    expect(pushSpy).toHaveBeenCalledTimes(1);
  });
});
