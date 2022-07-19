/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
// @ts-ignore
import UserDialog from './Dialogues/UserDialogue.tsx';
import CustomizedSnackbars from './Helpers/Snackbar';
// @ts-ignore
import Notification from './Notfication/Notification.tsx';
import TabPanel from './Helpers/TabPanel';
import LinkTab from './Helpers/LinkTab';
import profilePlaceholder from '../utils/profile-picture-default-png.png';
import { updateNotifications, getUsers } from '../actions/users';
import * as helpers from './Helpers/helpers';
// @ts-ignore
import type { RootState, AppDispatch } from '../store.ts';
// @ts-ignore
import ConciseBook from './Book/ConciseBook.tsx';
// @ts-ignore
import type { User, Book, NotificationType } from '../types.ts';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    padding: '1rem',
  },
  notification: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    margin: '1rem auto',
    borderBottom: '1px solid #CCC',
  },
}));

type Params = {
  id: string;
};

interface OwnProps {
  users: [User];
  books: [Book];
}

type Props = RootState & AppDispatch & OwnProps;

const Settings: React.FC<Props> = (props: Props) => {
  const {
    users,
    books,
    onSetNotificationsSeen,
    token,
    roles,
    onDismissNotification,
    onGetUsers,
  } = props;

  const [user, setUser] = React.useState<User | any>({});
  const [value, setValue] = React.useState<number>(0);
  const [showEditDialogue, setShowEditDialogue] = React.useState<boolean>(false);
  const [selectedUser, setSelectedUser] = React.useState<User | {}>({});
  const [severity, setSeverity] = React.useState<string>('');
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');

  const classes = useStyles();

  const { id } = useParams<Params>();

  React.useEffect(() => {
    if (window.location.href.includes('profile') && value !== 1) {
      setValue(1);
    }
    if (window.location.href.includes('notifications') && value !== 0) {
      setValue(0);
    }
    if (window.location.href.includes('history') && value !== 2) {
      setValue(0);
    }
  }, [window.location.href]);

  const showSnackbar = (show: boolean, status: string, msg: string) => {
    setSeverity(status);
    setMessage(msg);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 6000);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const onEdit = (u: {}) => {
    setSelectedUser(u);
    setShowEditDialogue(!showEditDialogue);
  };

  const dismissNotification = (notification: NotificationType) => {
    const newNotifications = user?.notifications?.filter(
      (n: NotificationType) => n.timestamp !== notification.timestamp
    );
    onDismissNotification(token, roles, user._id, newNotifications).then((response: any) => {
      if (response) {
        setUser({ ...user, notifications: newNotifications });
        onGetUsers(token);
      }
    });
  };

  React.useEffect(() => {
    const result = users.filter((u: User) => u.username === id);
    const notificationsSeen = result[0].notifications.map((n: NotificationType) => ({
      message: n.message,
      timestamp: n.timestamp,
      seen: 'true',
    }));
    onSetNotificationsSeen(token, roles, result[0]._id, notificationsSeen);
    setUser(result[0]);
  }, [users]);

  const profile = (
    <div className={classes.container}>
      <img src={user?.image || profilePlaceholder} alt="" className="largeImage" />
      <DialogContent>
        <div className="spaceBetween">
          <Typography gutterBottom variant="h4">
            {user?.username}
          </Typography>
          <Button
            autoFocus
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => onEdit(user)}
          >
            <EditIcon style={{ marginRight: '15px' }} />
            Edit Profile
          </Button>
        </div>
        {user.roles &&
          Object.values(user.roles).map((item: any) => (
            <Chip
              key={item + user._id}
              icon={helpers.setIcon(item)}
              size="small"
              label={item}
              color={helpers.roleColor(item)}
              style={{ margin: '3px' }}
            />
          ))}
        <Typography gutterBottom variant="subtitle2">
          {user.email}
        </Typography>
        <Typography gutterBottom>{user.name}</Typography>
        <Typography gutterBottom variant="h6">
          About {user.username}
        </Typography>
        <Typography gutterBottom variant="body1">
          {user.bio}
        </Typography>
      </DialogContent>
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={message} />
      <UserDialog
        title="Edit User"
        show={showEditDialogue}
        close={() => onEdit(selectedUser)}
        user={selectedUser}
        onShowSnackbar={showSnackbar}
      />
    </div>
  );

  const readingHistory = !user.readingHistory?.length ? (
    <Typography className="centered">No reaading history for this user.</Typography>
  ) : (
    user.readingHistory
      .map((bookId: string) => {
        const match = books.filter((book: { _id: string }) => book._id === bookId);
        return match.map((owedBook: Book) => <ConciseBook book={owedBook} />);
      })
      .reverse()
  );

  const notifications = !user.notifications?.length ? (
    <Typography className="centered">Nothing to show here yet.</Typography>
  ) : (
    user.notifications
      .map((n: NotificationType) => (
        <Notification notification={n} dismiss={dismissNotification} key={n.timestamp} />
      ))
      .reverse()
  );

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
      >
        <LinkTab
          label="notifications"
          href="notifications"
          username={user.username}
          {...a11yProps(0)}
        />
        <LinkTab label="profile" href="profile" username={user.username} {...a11yProps(1)} />
        <LinkTab
          label="reading history"
          href="reading history"
          username={user.username}
          {...a11yProps(2)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        {notifications}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {profile}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {readingHistory}
      </TabPanel>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  roles: state.users.authUser.roles,
  token: state.users.token,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onSetNotificationsSeen: (
    token: string,
    authUserRoles: { x: string },
    userId: string,
    notifications: [NotificationType]
  ) => dispatch(updateNotifications(token, authUserRoles, userId, notifications)),
  onDismissNotification: (
    token: string,
    authUserRoles: { x: string },
    userId: string,
    notifications: [NotificationType]
  ) => dispatch(updateNotifications(token, authUserRoles, userId, notifications)),
  onGetUsers: (token: string) => dispatch(getUsers(token)),
});

export default connect<RootState, AppDispatch, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
