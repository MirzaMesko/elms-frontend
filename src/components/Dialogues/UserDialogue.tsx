/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import Button from '@material-ui/core/Button';
import { connect, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// @ts-ignore
import { addUser, editUser, getUsers } from '../../actions/users.tsx';
// @ts-ignore
import Confirm from '../Helpers/Confirm.tsx';
// @ts-ignore
import MulitpleSelect from '../Helpers/MulitpleSelect.tsx';
import profilePlaceholder from '../../utils/profile-picture-default-png.png';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { User } from '../../types.ts';

interface OwnProps {
  show: boolean;
  close: () => void;
  token: string;
  onShowSnackbar: () => void;
  title: string;
  user?: User;
  authUserRoles: Array<string>;
  roles: Array<string>;
}

const roleOptions = ['Admin', 'Librarian', 'Member'];

type Props = OwnProps & RootState;

const UserDialog: React.FC<OwnProps> = (props: Props) => {
  const { show, close, token, onShowSnackbar, user, title, authUserRoles, authUser } = props;

  const [state, setState] = React.useState({
    userId: '',
    username: '',
    password: '',
    email: '',
    image: profilePlaceholder,
    bio: '',
    name: '',
    roles: [''],
    open: show,
    openConfirm: false,
  });

  const dispatch: AppDispatch = useDispatch();

  const handleChange = (event: { target: { name: string; value: string | boolean } }) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleRoleChange = (selectedRoles: Array<string>) => {
    setState({ ...state, roles: selectedRoles });
  };

  const resetInput = () => {
    setState({
      ...state,
      userId: '',
      username: '',
      password: '',
      email: '',
      image: profilePlaceholder,
      bio: '',
      name: '',
      roles: [],
      open: false,
      openConfirm: false,
    });
  };

  const handleClose = () => {
    close();
    resetInput();
    dispatch(getUsers(token));
  };

  const onAddNewUser = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!state.email || !state.username || !state.password) {
      onShowSnackbar(true, 'error', 'Please fill in the required fileds!');
      return;
    }
    dispatch(
      addUser(
        authUserRoles,
        state.email,
        state.username,
        state.password,
        state.roles,
        state.name,
        state.image,
        state.bio,
        token
      )
    ).then((response: any) => {
      if (response.status !== 201) {
        onShowSnackbar(true, 'error', `${response.message}`);
      }
      if (response.status === 201) {
        onShowSnackbar(true, 'success', `User ${response.data.username} was created`);
        handleClose();
      }
    });
  };

  const onEditSingleUser = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (authUser === state.username) {
      authUserRoles.push('Admin');
    }
    dispatch(
      editUser(
        authUserRoles,
        state.userId,
        state.email,
        state.roles,
        state.name,
        state.image,
        state.bio,
        token
      )
    ).then((response: any) => {
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        onShowSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        onShowSnackbar(true, 'success', `User ${response.data.username} was edited`);
        handleClose();
      }
    });
    if (authUser === state.username) {
      authUserRoles.pop();
    }
  };

  const showConfirm = () => {
    if (state.username.length || state.password.length || state.email.length || state.name.length) {
      setState({ ...state, openConfirm: true });
    } else {
      handleClose();
    }
  };

  React.useEffect(() => {
    setState({ ...state, open: show });
    if (user?.username) {
      setState({
        ...state,
        userId: user._id,
        username: user.username,
        password: user.password,
        email: user.email,
        image: user.image || profilePlaceholder,
        bio: user.bio,
        name: user.name,
        roles: Object.values(user.roles),
        open: show,
      });
    }
  }, [show, user]);

  return (
    <Dialog open={state.open} onClose={showConfirm} aria-labelledby="form-dialog-title">
      <Confirm
        show={state.openConfirm}
        title="Are you sure?"
        message="Entered input will be lost. Are you sure you want to cancel?"
        confirm={handleClose}
        cancel={() => setState({ ...state, openConfirm: false })}
        cancelText="confirm cancel"
        confirmText="continue editing"
      />
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>Please fill in the following information.</DialogContentText>
        <div className="dialogueContainer">
          <div>
            <input type="image" id="image" alt="Login" src={state.image} className="mediumImage" />
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <TextField
              margin="dense"
              autoComplete="off"
              label="Username*"
              defaultValue={state.username}
              disabled={title.includes('Edit')}
              type="username"
              fullWidth
              name="username"
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              autoComplete="off"
              label="Password*"
              type="password"
              disabled={title.includes('Edit')}
              defaultValue={state.password}
              fullWidth
              name="password"
              onChange={handleChange}
            />
            <MulitpleSelect
              onChange={handleRoleChange}
              selected={state.roles}
              disabled={!authUserRoles.includes('Admin')}
              options={roleOptions}
              label="Roles"
            />
            <TextField
              margin="dense"
              id="email"
              defaultValue={state.email}
              label="Email Address*"
              type="email"
              fullWidth
              name="email"
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="name"
              label="Name"
              type="name"
              defaultValue={state.name}
              fullWidth
              name="name"
              onChange={handleChange}
            />
          </div>
        </div>
        <TextField
          margin="dense"
          id="image"
          label="Image Url"
          type="text"
          defaultValue={state.image}
          fullWidth
          name="image"
          onChange={handleChange}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography>or</Typography>
          <label htmlFor="raised-button-file">
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              hidden
              name="image"
              onChange={handleChange}
            />
            <Button variant="outlined" component="span">
              Upload image
            </Button>
          </label>
        </div>

        <TextField
          margin="dense"
          id="bio"
          label="Bio"
          type="bio"
          defaultValue={state.bio}
          fullWidth
          multiline
          name="bio"
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={showConfirm} color="primary">
          Cancel
        </Button>
        <Button onClick={title.includes('Edit') ? onEditSingleUser : onAddNewUser} color="primary">
          {title.includes('Edit') ? 'Save Changes' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state: RootState) => ({
  token: state.users.token,
  authUserRoles: state.users.authUser.roles,
  authUser: state.users.authUser.username,
});

export default connect<RootState, OwnProps>(mapStateToProps)(UserDialog);
