/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import NotificationsIcon from '@material-ui/icons/Notifications';
import profilePlaceholder from '../../utils/profile-picture-default-png.png';
// @ts-ignore
import { LightTooltip } from '../Helpers/Tooltip.tsx';
// @ts-ignore
import RoleChip from '../Helpers/Chip.tsx';
// @ts-ignore
import type { User } from '../../types.ts';

interface Props {
  user: User;
  handleClose: () => void;
  open: boolean;
  showNotificationDialogue: () => void;
  showEmailDialogue: () => void;
}

const UserDetails: React.FC<Props> = ({
  user,
  handleClose,
  open,
  showEmailDialogue,
  showNotificationDialogue,
}: Props) => {
  const history = useHistory();
  return (
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
                  onClick={() => showNotificationDialogue()}
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
                <IconButton aria-label="edit" onClick={() => showEmailDialogue()} color="primary">
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
  );
};

export default UserDetails;
