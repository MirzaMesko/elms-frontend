import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import NotifificationsContainer from '../Settings/NotificationsContainer.tsx';
// @ts-ignore
import '@testing-library/jest-dom/extend-expect';

afterEach(() => cleanup());

describe('NotificationsContainer', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<NotifificationsContainer user={' '} />, div);
  });
  it('renders appropriate message if no notifications', () => {
    render(<NotifificationsContainer user={' '} />);

    expect(screen.getByTestId('no-notifications')).toBeInTheDocument();
    expect(screen.getByTestId('no-notifications').textContent).toBe('Nothing to show here yet.');
  });
  it('displays users notifications', () => {
    const user = {
      notifications: [
        { message: 'test', timestamp: '123456678896875674' },
        { message: 'test2', timestamp: '124365456446875674' },
      ],
    };

    render(<NotifificationsContainer user={user} />);

    expect(screen.getAllByTestId('notification-message')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('notification-message').length).toBe(2);
  });
  it('displays users notifications in reverse order', () => {
    const user = {
      notifications: [
        { message: 'test', timestamp: '123456678896875674' },
        { message: 'test2', timestamp: '124365456446875674' },
        { message: 'test3', timestamp: '34564356435643896875674' },
      ],
    };

    render(<NotifificationsContainer user={user} />);

    expect(screen.getAllByTestId('notification-message')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('notification-message')[0].textContent).toBe('test3');
    expect(screen.getAllByTestId('notification-message').length).toBe(3);
  });
});
