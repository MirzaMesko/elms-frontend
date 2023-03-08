import { screen, render, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { createMemoryHistory } from 'history';
import NotificationsMenu from '../Notfication/NotificationsMenu.tsx';
// @ts-ignore
import '@testing-library/jest-dom/extend-expect';

const notificationsTest = [
  {
    message: 'test',
    timestamp: '2022-07-02T19:14:41.002Z',
    seen: 'false',
  },
  {
    message: 'test2',
    timestamp: '2022-07-02T19:14:44.002Z',
    seen: 'true',
  },
];

const resetBadgeFn = jest.fn(() => null);

const setup = (notifications) => {
  const history = createMemoryHistory();
  render(
    <NotificationsMenu
      badgeContent={3}
      notifications={notifications}
      resetBadge={resetBadgeFn}
      history={history}
      username="testUser"
    />
  );
};

afterEach(() => cleanup());

describe('NotificationsMenu', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<NotificationsMenu notifications={notificationsTest} />, div);
  });
  it('renders icon with number of unseen notifications', () => {
    setup(notificationsTest);
    const badge = screen.getByTestId('notifications-badge');

    expect(screen.getByTestId('notifications-icon')).toBeInTheDocument();
    expect(badge).toBeInTheDocument();
    // expect(badge).textContent.toBe(3);
  });
  it('renders menu when notifications icon is clicked', () => {
    setup(notificationsTest);
    const icon = screen.getByTestId('notifications-icon');

    fireEvent.click(icon);

    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });
  it(`renders 'No new notifications.' message if no notifications`, () => {
    setup([]);

    const icon = screen.getByTestId('notifications-icon');

    fireEvent.click(icon);
    expect(screen.getByTestId('no-notifications-message')).toBeInTheDocument();
    expect(screen.getByTestId('no-notifications-message').textContent).toBe(
      'No new notifications.'
    );
  });
  it('renders preview of users notifications', () => {
    setup(notificationsTest);

    const icon = screen.getByTestId('notifications-icon');

    fireEvent.click(icon);
    expect(screen.getAllByTestId('notification-test')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('notification-test2')[0]).toBeInTheDocument();
  });
  //   it('goes to notifications page in settings when notification is clicked', async () => {
  //     setup(notificationsTest);

  //     const icon = screen.getByTestId('notifications-icon');

  //     fireEvent.click(icon);
  //     expect(screen.queryByTestId('notification-test')).toBeInTheDocument();
  //     const notification1 = screen.getByTestId('notification-test');

  //     await fireEvent.click(notification1);
  //     expect(screen.getAllByTestId('notification-test')[0]).not.toBeInTheDocument();
  //   });
  it(`renders a link to notifications page with 'See all notifications' text`, () => {
    setup(notificationsTest);

    const icon = screen.getByTestId('notifications-icon');

    fireEvent.click(icon);

    expect(screen.getByTestId('see-notifications-link')).toBeInTheDocument();
    expect(screen.getByTestId('see-notifications-link').textContent).toBe('See all notifications');
  });
});
