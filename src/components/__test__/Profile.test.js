import { screen, render, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
// @ts-ignore
import { store } from '../../store.ts';
import Profile from '../Settings/Profile.tsx';
// @ts-ignore
import '@testing-library/jest-dom/extend-expect';

const testUser = {
  username: 'test',
  email: 'test@elms.ba',
  bio: 'Lorem ipsum dolor sit amet.',
  roles: { member: 'Member' },
};

const setup = (user) =>
  render(
    <Provider store={store}>
      <Profile user={user} />
    </Provider>
  );

afterEach(() => cleanup());

describe('Profile', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Profile user={testUser} />
      </Provider>,
      div
    );
  });
  it('renders default image if users image is not available', () => {
    setup(testUser);
    const image = screen.getByTestId('image');

    expect(image).toBeInTheDocument();
    expect(image.src).toEqual('http://localhost/profile-picture-default-png.png');
  });
  it('renders user image if it is available', () => {
    const userWithImage = {
      username: 'test',
      email: 'test@elms.ba',
      bio: 'nothing special',
      roles: { member: 'Member' },
      image: 'test.png',
    };
    setup(userWithImage);
    const image = screen.getByTestId('image');

    expect(image).toBeInTheDocument();
    expect(image.src).toEqual('http://localhost/test.png');
  });
  it('renders users username', () => {
    setup(testUser);
    const username = screen.getByTestId('username');

    expect(username).toBeInTheDocument();
    expect(username.textContent).toEqual('test');
  });
  it('renders users email', () => {
    setup(testUser);
    const email = screen.getByTestId('email');

    expect(email).toBeInTheDocument();
    expect(email.textContent).toEqual('test@elms.ba');
  });
  it('renders users bio', () => {
    setup(testUser);
    const bio = screen.getByTestId('bio');
    const bioTitle = screen.getByTestId('bio-title');

    expect(bio).toBeInTheDocument();
    expect(bioTitle).toBeInTheDocument();
    expect(bio.textContent).toEqual('Lorem ipsum dolor sit amet.');
    expect(bioTitle.textContent).toEqual(`About ${testUser.username}`);
  });
  it('renders button for editing users profile', () => {
    setup(testUser);
    const editButton = screen.getByTestId('edit-button');

    expect(editButton).toBeInTheDocument();
    expect(editButton.textContent).toEqual('Edit Profile');
  });
  it('displays edit dialogue when edit profile button is clicked', () => {
    setup(testUser);
    const editButton = screen.getByTestId('edit-button');

    fireEvent.click(editButton);
    expect(screen.getByTestId('user-dialogue')).toBeInTheDocument();
  });
});
