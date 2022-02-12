import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Chip from '@material-ui/core/Chip';
import DialogContent from '@material-ui/core/DialogContent';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import profilePlaceholder from '../utils/profile-picture-default-png.png';

const useStyles = makeStyles(() => ({
  image: {
    height: '300px',
    width: '300px',
    display: 'inline-flex',
    objectFit: 'cover',
  },
  container: {
    display: 'flex',
    maxHeight: '500px',
    padding: '1rem',
  },
}));

export default function UserDetails(props) {
  const { open, handleClose, user } = props;
  const classes = useStyles();
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
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
      >
        <div className={classes.container}>
          <img src={image} alt="" className={classes.image} />
          <DialogContent>
            <Typography gutterBottom variant="h4">
              {user.username}
            </Typography>
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
        </div>

        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            back to users
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

UserDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.string).isRequired,
};
