/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import FormDialog from './FormDialogue';
import CustomizedSnackbars from './Snackbar';
import ConciseBook from './ConciseBook';

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
}));

const Settings = (props) => {
  const [user, setUser] = React.useState({});
  const [value, setValue] = React.useState(0);
  const [showEditDialogue, setShowEditDialogue] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState();
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [newUser, setNewUser] = React.useState('');

  const classes = useStyles();
  const { users, books } = props;
  const { id } = useParams();

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

  React.useEffect(() => {
    const result = users.filter((u) => u.username === id);
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
              // eslint-disable-next-line no-underscore-dangle
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
            key="Member"
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
    user.readingHistory.map((bookId) => {
      const match = books.filter((book) => book._id === bookId);
      return match.map((owedBook) => <ConciseBook book={owedBook} />);
    })
  );

  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="My Profile" />
        <Tab label="reading history" />
        <Tab label="notifications" />
      </Tabs>
      <div style={{ paddingTop: '2rem' }}>
        {value === 0 && profile}
        {value === 1 && readingHistory}
        {value === 2 && <p className={classes.centered}>Nothing to show here yet.</p>}
      </div>
    </div>
  );
};

Settings.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Settings;
