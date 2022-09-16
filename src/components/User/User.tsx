/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import NotificationsIcon from '@material-ui/icons/Notifications';
// @ts-ignore
import RoleChip from '../Helpers/Chip.tsx';
// @ts-ignore
import { notifyUser } from '../../actions/users.tsx';
// @ts-ignore
import CustomizedSnackbars from '../Helpers/Snackbar.tsx';
// @ts-ignore
import EmailDialogue from '../Dialogues/EmailDialogue.tsx';
// @ts-ignore
import NotificationDialogue from '../Dialogues/NotificationDialogue.tsx';
// @ts-ignore
import { sendEmail } from '../../actions/email.tsx';
import profilePlaceholder from '../../utils/profile-picture-default-png.png';
// @ts-ignore
import { LightTooltip } from '../Helpers/Tooltip.tsx';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { User } from '../../types.ts';

interface OwnProps {
  open: boolean;
  handleClose: () => void;
  user: User;
}

type Props = OwnProps & RootState & AppDispatch;

const UserDetails: React.FC<OwnProps> = ({ open, handleClose, user }: Props) => {
  const [showEmailDialogue, setShowEmailDialogue] = React.useState(false);
  const [showNotificationDialogue, setShowNotificationDialogue] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  // const image = user?.image ? user.image : profilePlaceholder;

  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const { token, authUser } = useSelector((state: RootState) => state.users);

  const showSnackbar = (show: boolean, status: string, message: string) => {
    setSeverity(status);
    setErrMessage(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 6000);
  };

  const handleSendEmail = (email: string, subject: string, text: string) => {
    dispatch(sendEmail(token, authUser.roles, email, subject, text)).then((resp: any) => {
      if (resp.status !== 200) {
        showSnackbar(true, 'error', resp.message);
      }
      if (resp.status === 200) {
        setShowEmailDialogue(false);
        showSnackbar(true, 'success', `An email  was sent to ${user.username}.`);
      }
    });
  };

  const handleSendNotification = (text: string) => {
    dispatch(notifyUser(token, authUser.roles, user._id, text)).then((resp: any) => {
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
          <img
            src={user?.image || profilePlaceholder}
            alt=""
            className="largeImage"
            data-testid="user-image"
          />
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
            <RoleChip user={user} />
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
};

export default UserDetails;
