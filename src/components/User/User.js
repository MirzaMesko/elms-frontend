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
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { notifyUser } from '../../actions/users';
import CustomizedSnackbars from '../Helpers/Snackbar';
import EmailDialogue from '../Dialogues/EmailDialogue';
import NotificationDialogue from '../Dialogues/NotificationDialogue';
import { sendEmail } from '../../actions/email';
import profilePlaceholder from '../../utils/profile-picture-default-png.png';
import * as helpers from '../Helpers/helpers';
import { LightTooltip } from '../Helpers/Tooltip';

function UserDetails(props) {
  const { open, handleClose, user, onNotifyUser, onSendEmail, token, roles } = props;
  const [showEmailDialogue, setShowEmailDialogue] = React.useState(false);
  const [showNotificationDialogue, setShowNotificationDialogue] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const image = user?.image ? user.image : profilePlaceholder;

  const history = useHistory();

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
    <>
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
        <div className="dialogueContainer">
          <img src={image} alt="" className="largeImage" />
          <DialogContent>
            <span className="spaceBetween">
              <Typography gutterBottom variant="h4">
                {user.username}
              </Typography>
              <span>
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
              </span>
            </span>
            {user.roles &&
              Object.values(user.roles).map((item) => (
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
    </>
  );
}

UserDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  user: PropTypes.objectOf(
    PropTypes.shape({
      username: PropTypes.string,
      roles: PropTypes.objectOf(PropTypes.string),
      _id: PropTypes.string,
      email: PropTypes.string,
    })
  ).isRequired,
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
