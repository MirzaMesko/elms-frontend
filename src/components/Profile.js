/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import profilePlaceholder from '../utils/profile-picture-default-png.png';

const useStyles = makeStyles(() => ({
  image: {
    height: '200px',
    width: '150px',
    display: 'inline-flex',
    objectFit: 'cover',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    padding: '4.5rem 1rem',
    backgroundColor: '#efefef',
    height: '100vh',
    alignItems: 'center',
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  const { user } = props;

  const image = user?.image ? user.image : profilePlaceholder;

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
  return (
    <div className={classes.container}>
      <img src={image} alt="" className={classes.image} />
      <Typography gutterBottom variant="h4">
        {user.username}
      </Typography>
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
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.arrayOf(), PropTypes.String).isRequired,
};

export default Profile;
