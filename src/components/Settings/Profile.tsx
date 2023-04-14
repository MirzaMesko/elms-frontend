/* eslint-disable no-underscore-dangle */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
// @ts-ignore
import UserDialog from '../Dialogues/UserDialogue.tsx';
// @ts-ignore
import CustomizedSnackbars from '../Helpers/Snackbar.tsx';
// @ts-ignore
import RoleChip from '../Helpers/Chip.tsx';
// @ts-ignore
import type { User } from '../../types.ts';
import profilePlaceholder from '../../utils/profile-picture-default-png.png';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    padding: '1rem',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center',
      padding: 0,
    },
  },
  content: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
}));

interface Props {
  user: User;
}

const Profile: React.FC<Props> = ({ user }: Props) => {
  const [showEditDialogue, setShowEditDialogue] = React.useState<boolean>(false);
  const [selectedUser, setSelectedUser] = React.useState<User | {}>({});
  const classes = useStyles();

  const onEdit = (u: {}) => {
    setSelectedUser(u);
    setShowEditDialogue(!showEditDialogue);
  };

  return (
    <div className={classes.container} data-testid="profile">
      <img
        src={user?.image || profilePlaceholder}
        alt=""
        className="largeImage"
        data-testid="image"
      />
      <DialogContent className={classes.content}>
        <div className="spaceBetween">
          <Typography gutterBottom variant="h4" data-testid="username">
            {user.username}
          </Typography>
          <Button
            autoFocus
            type="submit"
            data-testid="edit-button"
            variant="contained"
            color="primary"
            onClick={() => onEdit(user)}
          >
            <EditIcon fontSize="default" />
          </Button>
        </div>
        <RoleChip user={user} />
        <Typography gutterBottom variant="subtitle2" data-testid="email">
          {user.email}
        </Typography>
        <Typography gutterBottom>{user.name}</Typography>
        <Typography gutterBottom variant="h6" data-testid="bio-title">
          About {user.username}
        </Typography>
        <Typography gutterBottom variant="body1" data-testid="bio">
          {user.bio}
        </Typography>
      </DialogContent>
      <CustomizedSnackbars />
      <UserDialog
        title="Edit User"
        show={showEditDialogue}
        close={() => onEdit(selectedUser)}
        user={selectedUser}
      />
    </div>
  );
};

export default Profile;
