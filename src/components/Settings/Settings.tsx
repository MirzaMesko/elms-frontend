/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
// @ts-ignore
import NotificationsContainer from './NotificationsContainer.tsx';
// @ts-ignore
import TabPanel from '../Helpers/TabPanel.tsx';
// @ts-ignore
import LinkTab from '../Helpers/LinkTab.tsx';
// @ts-ignore
import { updateNotifications, getUsers } from '../../actions/users.tsx';
// @ts-ignore
import type { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import ReadingHistory from './ReadingHistory.tsx';
// @ts-ignore
import Profile from './Profile.tsx';
// @ts-ignore
import type { User, Book, NotificationType } from '../../types.ts';

type Params = {
  id: string;
};

interface OwnProps {
  users: [User];
  books: [Book];
}

type Props = RootState & AppDispatch & OwnProps;

const Settings: React.FC<Props> = ({ users, books, token, roles, authUser }: Props) => {
  const [user, setUser] = React.useState<User | any>({});
  const [value, setValue] = React.useState<number>(0);

  const { id } = useParams<Params>();
  const dispatch: AppDispatch = useDispatch();

  React.useEffect(() => {
    if (window.location.href.includes('profile') && value !== 1) {
      setValue(1);
    }
    if (window.location.href.includes('notifications') && value !== 0) {
      setValue(0);
    }
    if (window.location.href.includes('history') && value !== 2) {
      setValue(2);
    }
  }, [window.location.href]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const dismissNotification = (notification: NotificationType) => {
    const newNotifications = user?.notifications?.filter(
      (n: NotificationType) => n.timestamp !== notification.timestamp
    );
    if (authUser === user.username) {
      roles.push('Admin');
    }
    dispatch(updateNotifications(token, roles, user._id, newNotifications)).then(
      (response: any) => {
        if (response) {
          setUser({ ...user, notifications: newNotifications });
          dispatch(getUsers(token));
        }
      }
    );
    if (authUser === user.username) {
      roles.pop();
    }
  };

  React.useEffect(() => {
    if (users) {
      const result = users.filter((u: User) => u.username === id);
      const notificationsSeen = result[0].notifications.map((n: NotificationType) => ({
        message: n.message,
        timestamp: n.timestamp,
        seen: 'true',
      }));
      dispatch(updateNotifications(token, roles, result[0]._id, notificationsSeen));
      setUser(result[0]);
    }
  }, [users]);

  function a11yProps(index: number) {
    return {
      id: `nav-tab-${index}`,
      'aria-controls': `nav-tabpanel-${index}`,
    };
  }

  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        textColor="primary"
        indicatorColor="primary"
        data-testid="settings-tabs"
      >
        <LinkTab
          title="notifications"
          href="notifications"
          username={user.username}
          data-testid="notifications-link-tab"
          {...a11yProps(0)}
        />
        <LinkTab
          title="profile"
          href="profile"
          username={user.username}
          data-testid="profile-link-tab"
          {...a11yProps(1)}
        />
        <LinkTab
          title="reading history"
          href="reading history"
          username={user.username}
          data-testid="reading-history-link-tab"
          {...a11yProps(2)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <NotificationsContainer user={user} dismissNotification={dismissNotification} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Profile user={user} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ReadingHistory user={user} books={books} />
      </TabPanel>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  roles: state.users.authUser.roles,
  token: state.users.token,
  authUser: state.users.authUser.username,
});

export default connect<RootState, AppDispatch, OwnProps>(mapStateToProps)(Settings);
