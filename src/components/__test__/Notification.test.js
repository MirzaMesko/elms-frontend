import { screen, render, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import Notification from '../Notfication/Notification.tsx';
// @ts-ignore
import '@testing-library/jest-dom/extend-expect';

const notificationTest = {
  message: 'test',
  timestamp: '2022-07-02T19:14:41.002Z',
  seen: 'false',
};

const notificationSeen = {
  message: 'test',
  timestamp: '2022-07-02T19:14:41.002Z',
  seen: 'true',
};

const dismissFn = jest.fn(() => null);

const setup = (notification) => {
  render(<Notification notification={notification} dismiss={dismissFn} />);
};

afterEach(() => cleanup());

describe('Notification', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Notification notification={notificationTest} />, div);
  });
  it('renders notification background gray if seen', () => {
    setup(notificationSeen);
    const notification = screen.getByTestId('notification');

    expect(notification).toBeInTheDocument();
    expect(notification).toHaveAttribute('style', 'background-color: rgb(245, 245, 245);');
  });
  it('renders notification background white if not seen', () => {
    setup(notificationTest);
    const notification = screen.getByTestId('notification');

    expect(notification).toBeInTheDocument();
    expect(notification).toHaveAttribute('style', 'background-color: rgb(255, 255, 255);');
  });
  it('renders notification message', () => {
    setup(notificationTest);

    expect(screen.getByTestId('notification-message')).toBeInTheDocument();
    expect(screen.getByTestId('notification-message').textContent).toBe('test');
  });
  it('renders notification timestamp', () => {
    setup(notificationTest);

    expect(screen.getByTestId('notification-timestamp')).toBeInTheDocument();
    expect(screen.getByTestId('notification-timestamp').textContent).toBe('Sat Jul 02 2022, 19:14');
  });
  it('renders a button for dismissing each notification', () => {
    setup(notificationTest);

    expect(screen.getByTestId('notification-dismiss-button')).toBeInTheDocument();
    expect(screen.getByTestId('notification-dismiss-button').textContent).toBe('Dismiss');
  });
  it('calls dismiss fn when dismiss button is clicked', () => {
    setup(notificationTest);

    const dismissButton = screen.getByTestId('notification-dismiss-button');
    fireEvent.click(dismissButton);
    expect(dismissFn).toHaveBeenCalledTimes(1);
  });
});
