import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import UserTable from '../User/UserTable.tsx';
import '@testing-library/jest-dom/extend-expect';

const usersArray = [
  {
    _id: '123456789',
    name: 'name',
    username: 'username',
    image: 'image',
    roles: ['Member'],
    email: 'user@email.com',
  },
  {
    _id: '987654321',
    name: 'name',
    username: 'username',
    image: 'image',
    roles: ['Member'],
    email: 'user@email.com',
  },
];

const setup = (users) => {
  render(
    <Provider store={store}>
      <UserTable users={users} />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('UserTable', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <UserTable users={[]} />
      </Provider>,
      div
    );
  });
  it(`renders 'Users' as title of table`, () => {
    setup([]);

    expect(screen.getByTestId('user-table-title')).toBeInTheDocument();
  });
  it(`renders 'No matches for your search' message if search returns no results`, () => {
    setup([]);

    expect(screen.getByTestId('no-results-message')).toBeInTheDocument();
    expect(screen.getByTestId('no-results-message').textContent).toBe('No matches for your search');
  });
  it('renders table with tablehead, tablebody and pagination', () => {
    setup(usersArray);

    expect(screen.queryByTestId('table-head')).toBeInTheDocument();
    expect(screen.queryByTestId('user-table-body')).toBeInTheDocument();
    expect(screen.queryByTestId('table-pagination')).toBeInTheDocument();
  });
  it('renders Loading component if waiting for API response', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ loadingUsers: true });
    render(
      <reactRedux.Provider store={store}>
        <UserTable users={[]} />
      </reactRedux.Provider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    useSelectorMock.mockClear();
  });
  it('renders Error component if error after API request', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue({ err: { error: true, message: 'test' } });
    render(
      <reactRedux.Provider store={store}>
        <UserTable users={[]} />
      </reactRedux.Provider>
    );

    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByTestId('error-message').textContent).toBe('test');
    useSelectorMock.mockClear();
  });
});
