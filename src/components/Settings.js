/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import FormDialog from './Dialogues/UserDialogue';
import CustomizedSnackbars from './Helpers/Snackbar';
import ConciseBook from './Book/ConciseBook';
import Notification from './Notfication/Notification';
import { updateNotifications } from '../actions/users';

const useStyles = makeStyles(() => ({
  image: {
    height: '300px',
    width: '250px',
    display: 'inline-flex',
    objectFit: 'cover',
  },
  container: {
    display: 'flex',
    padding: '1rem',
  },
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    margin: '5rem 1rem',
  },
  notification: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    margin: '1rem auto',
    borderBottom: '1px solid #CCC',
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const Settings = (props) => {
  const [user, setUser] = React.useState({});
  const [value, setValue] = React.useState(0);
  const [showEditDialogue, setShowEditDialogue] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState();
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [newUser, setNewUser] = React.useState('');

  const classes = useStyles();
  const history = useHistory();
  const { users, books, onSetNotificationsSeen, token, roles, onDismissNotification } = props;
  const { id } = useParams();

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

  const showSnackbar = (show, status, message) => {
    setSeverity(status);
    setNewUser(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 6000);
  };

  const roleColor = (item) => {
    if (item === 'Admin') {
      return 'secondary';
    }
    if (item === 'Librarian') {
      return 'primary';
    }
    return 'default';
  };

  const setIcon = (item) => {
    if (item === 'Admin') {
      return <VerifiedUserIcon />;
    }
    if (item === 'Librarian') {
      return <AssignmentIndIcon />;
    }
    return <AccountCircleIcon />;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onEdit = (u) => {
    setSelectedUser(u);
    setShowEditDialogue(!showEditDialogue);
  };

  const dismissNotification = (notification) => {
    const newNotifications = user.notifications.filter(
      (n) => n.timestamp !== notification.timestamp
    );
    onDismissNotification(token, roles, user._id, newNotifications).then((response) => {
      if (response) {
        setUser({ ...user, notifications: newNotifications });
      }
    });
  };

  React.useEffect(async () => {
    const result = users.filter((u) => u.username === id);
    const notificationsSeen = await result[0].notifications.map((n) => ({
      message: n.message,
      timestamp: n.timestamp,
      seen: 'true',
    }));
    onSetNotificationsSeen(token, roles, result[0]._id, notificationsSeen);
    setUser(result[0]);
  }, [users]);

  const profile = (
    <div className={classes.container}>
      <img src={user.image} alt="" className={classes.image} />
      <DialogContent>
        <div className={classes.firstRow}>
          <Typography gutterBottom variant="h4">
            {user.username}
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
        {user.roles ? (
          Object.values(user.roles).map((item) => (
            <Chip
              key={item + user._id}
              icon={setIcon(item)}
              size="small"
              label={item}
              color={roleColor(item)}
              style={{ margin: '3px' }}
            />
          ))
        ) : (
          <Chip
            key={user._id}
            icon={setIcon('Member')}
            size="small"
            label="Member"
            color={roleColor('Member')}
            style={{ margin: '3px' }}
          />
        )}
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
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={newUser} />
      <FormDialog
        title="Edit User"
        show={showEditDialogue}
        close={() => onEdit()}
        user={selectedUser}
        onShowSnackbar={showSnackbar}
      />
    </div>
  );

  const readingHistory = !user.readingHistory?.length ? (
    <Typography className={classes.centered}>No reaading history for this user.</Typography>
  ) : (
    user.readingHistory
      .map((bookId) => {
        const match = books.filter((book) => book._id === bookId);
        return match.map((owedBook) => <ConciseBook book={owedBook} />);
      })
      .reverse()
  );

  const notifications = !user.notifications?.length ? (
    <Typography className={classes.centered}>Nothing to show here yet.</Typography>
  ) : (
    user.notifications
      .map((n) => <Notification notification={n} dismiss={dismissNotification} key={n.timestamp} />)
      .reverse()
  );

  function a11yProps(index) {
    return {
      id: `nav-tab-${index}`,
      'aria-controls': `nav-tabpanel-${index}`,
    };
  }

  // eslint-disable-next-line no-shadow
  function LinkTab(props) {
    return (
      <Tab
        component="a"
        onClick={(event) => {
          event.preventDefault();
          if (!window.history.href?.includes(`${props.href}`)) {
            history.push(`/users/settings/${user.username}/${props.href}`);
          }
        }}
        {...props}
      />
    );
  }

  LinkTab.propTypes = {
    href: PropTypes.string.isRequired,
  };

  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <LinkTab label="notifications" href="notifications" {...a11yProps(0)} />
        <LinkTab label="profile" href="profile" {...a11yProps(1)} />
        <LinkTab label="reading history" href="reading history" {...a11yProps(2)} />
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

Settings.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSetNotificationsSeen: PropTypes.func.isRequired,
  onDismissNotification: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  roles: state.users.authUser.roles,
  token: state.users.token,
});

const mapDispatchToProps = (dispatch) => ({
  onSetNotificationsSeen: (token, authUserRoles, userId, notifications) =>
    dispatch(updateNotifications(token, authUserRoles, userId, notifications)),
  onDismissNotification: (token, authUserRoles, userId, notifications) =>
    dispatch(updateNotifications(token, authUserRoles, userId, notifications)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
