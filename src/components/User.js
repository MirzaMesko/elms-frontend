/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Chip from '@material-ui/core/Chip';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import DialogContent from '@material-ui/core/DialogContent';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { notifyUser } from '../actions/users';
import CustomizedSnackbars from './Snackbar';
import EmailDialogue from './EmailDialogue';
import NotificationDialogue from './NotificationDialogue';
import { sendEmail } from '../actions/email';
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
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '0.3rem',
  },
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: '#3f51b5',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

function UserDetails(props) {
  const { open, handleClose, user, onNotifyUser, onSendEmail, token, roles } = props;
  const [showEmailDialogue, setShowEmailDialogue] = React.useState(false);
  const [showNotificationDialogue, setShowNotificationDialogue] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const classes = useStyles();
  const image = user?.image ? user.image : profilePlaceholder;

  const history = useHistory();

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

  const showSnackbar = (show, status, message) => {
    setSeverity(status);
    setErrMessage(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 6000);
  };

  const handleSendEmail = (email, subject, text) => {
    onSendEmail(token, roles, email, subject, text).then((resp) => {
      if (resp.status !== 200) {
        showSnackbar(true, 'error', resp.message);
      }
      if (resp.status === 200) {
        setShowEmailDialogue(false);
        showSnackbar(true, 'success', `An email  was sent to ${user.username}.`);
      }
    });
  };

  const handleSendNotification = (text) => {
    onNotifyUser(token, roles, user._id, text).then((resp) => {
      if (resp.status !== 200) {
        showSnackbar(true, 'error', resp.message);
      }
      if (resp.status === 200) {
        setShowNotificationDialogue(false);
        showSnackbar(true, 'success', `Notification was sent to ${user.username}.`);
      }
    });
  };

  return (
    <div>
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={errMessage} />
      <EmailDialogue
        show={showEmailDialogue}
        close={() => setShowEmailDialogue(false)}
        emailSubject=""
        emailText=""
        sendEmail={handleSendEmail}
        recepientsEmail={user.email}
      />
      <NotificationDialogue
        show={showNotificationDialogue}
        close={() => setShowNotificationDialogue(false)}
        sendNotification={handleSendNotification}
      />
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
      >
        <div className={classes.container}>
          <img src={image} alt="" className={classes.image} />
          <DialogContent>
            <div className={classes.firstRow}>
              <Typography gutterBottom variant="h4">
                {user.username}
              </Typography>
              <div>
                <LightTooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  title={`Send ${user.username} a notification`}
                >
                  <IconButton
                    aria-label="edit"
                    onClick={() => setShowNotificationDialogue(true)}
                    color="primary"
                  >
                    <NotificationsIcon fontSize="large" />
                  </IconButton>
                </LightTooltip>
                <LightTooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  title={`Send ${user.username} an email`}
                >
                  <IconButton
                    aria-label="edit"
                    onClick={() => setShowEmailDialogue(true)}
                    color="primary"
                  >
                    <EmailIcon fontSize="large" />
                  </IconButton>
                </LightTooltip>
              </div>
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
            back
          </Button>
          <Button autoFocus onClick={() => history.push(`/users/lend&return/${user._id}`)}>
            go to lend & return
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

UserDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.string, PropTypes.objectOf(PropTypes.string)).isRequired,
  onNotifyUser: PropTypes.func.isRequired,
  onSendEmail: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  roles: state.users.authUser.roles,
});

const mapDispatchToProps = (dispatch) => ({
  onSendEmail: (token, authUserRoles, email, subject, text) =>
    dispatch(sendEmail(token, authUserRoles, email, subject, text)),
  onNotifyUser: (token, authUserRoles, userId, message) =>
    dispatch(notifyUser(token, authUserRoles, userId, message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
