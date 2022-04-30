/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { addUser, editUser, getUsers } from '../../actions/users';
import Confirm from '../Helpers/Confirm';
import MulitpleSelect from '../Helpers/MulitpleSelect';
import profilePlaceholder from '../../utils/profile-picture-default-png.png';

const roleOptions = ['Admin', 'Librarian', 'Member'];

function UserDialog(props) {
  const {
    show,
    close,
    token,
    onGetUsers,
    onShowSnackbar,
    user,
    title,
    onEditUser,
    onAddUser,
    authUserRoles,
  } = props;

  const [open, setOpen] = React.useState(show);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [name, setName] = React.useState('');
  const [image, setImage] = React.useState(profilePlaceholder);
  const [roles, setRoles] = React.useState([]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRoleChange = (selectedRoles) => {
    setRoles(selectedRoles);
  };

  const handleImageChange = (event) => {
    setImage(event.target.value);
  };

  const resetInput = () => {
    setEmail('');
    setBio('');
    setName('');
    setPassword('');
    setUsername('');
    setUserId('');
    setRoles([]);
  };

  const handleClose = () => {
    setOpen(false);
    close();
    setOpenConfirm(false);
    resetInput();
  };

  const onAddNewUser = (event) => {
    event.preventDefault();
    if (!email || !username || !password) {
      onShowSnackbar(true, 'error', 'Please fill in the required fileds!');
      return;
    }
    onAddUser(authUserRoles, email, username, password, roles, name, image, bio, token).then(
      (response) => {
        if (response.status !== 201) {
          onShowSnackbar(true, 'error', `${response.message}`);
        }
        if (response.status === 201) {
          onShowSnackbar(true, 'success', `User ${response.data.username} was created`);
          onGetUsers(token);
          close();
          resetInput();
        }
      }
    );
  };

  const onEditSingleUser = (event) => {
    event.preventDefault();
    onEditUser(authUserRoles, userId, email, roles, name, image, bio, token).then((response) => {
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        onShowSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        onShowSnackbar(true, 'success', `User ${response.data.username} was edited`);
        onGetUsers(token);
        close();
      }
    });
  };

  const showConfirm = () => {
    if (username.length || password.length || email.length || name.length) {
      setOpenConfirm(true);
    } else {
      handleClose();
    }
  };

  React.useEffect(() => {
    setOpen(show);
    if (user.username) {
      setEmail(user.email);
      setBio(user.bio);
      setName(user.name);
      setPassword(user.password);
      setUsername(user.username);
      // eslint-disable-next-line no-underscore-dangle
      setUserId(user._id);
      setRoles(Object.values(user.roles));
      setImage(user.image || profilePlaceholder);
    }
  }, [show, user]);

  return (
    <Dialog open={open} onClose={showConfirm} aria-labelledby="form-dialog-title">
      <Confirm
        show={openConfirm}
        title="Are you sure?"
        message="Entered input will be lost. Are you sure you want to cancel?"
        confirm={handleClose}
        cancel={() => setOpenConfirm(false)}
        cancelText="confirm cancel"
        confirmText="continue editing"
      />
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>Please fill in the following information.</DialogContentText>
        <div style={{ display: 'flex' }}>
          <div>
            <input
              type="image"
              id="image"
              alt="Login"
              src={image}
              style={{
                height: '250px',
                width: '300px',
                objectFit: 'cover',
                display: 'block',
                paddingRight: '1rem',
              }}
            />
          </div>
          <div>
            <TextField
              margin="dense"
              autoComplete="off"
              label="Username*"
              defaultValue={username}
              disabled={user.username?.length > 1}
              type="username"
              fullWidth
              onChange={handleUsernameChange}
            />
            <TextField
              margin="dense"
              autoComplete="off"
              label="Password*"
              type="password"
              disabled={user.password?.length > 1}
              defaultValue={password}
              fullWidth
              onChange={handlePasswordChange}
            />
            <MulitpleSelect
              onChange={handleRoleChange}
              selected={roles}
              disabled={!roles.includes('Admin')}
              options={roleOptions}
              label="Roles"
            />
            <TextField
              focus="true"
              margin="dense"
              id="email"
              defaultValue={email}
              label="Email Address*"
              type="email"
              fullWidth
              onChange={handleEmailChange}
            />
            <TextField
              margin="dense"
              id="name"
              label="Name"
              type="name"
              defaultValue={name}
              fullWidth
              onChange={handleNameChange}
            />
          </div>
        </div>
        <TextField
          margin="dense"
          id="image"
          label="Image Url"
          type="text"
          defaultValue={image}
          fullWidth
          onChange={handleImageChange}
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
              onChange={(event) => handleImageChange(event)}
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
          defaultValue={bio}
          fullWidth
          multiline
          onChange={handleBioChange}
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
}

UserDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  onGetUsers: PropTypes.func.isRequired,
  onShowSnackbar: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  user: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.objectOf(PropTypes.string),
      PropTypes.objectOf({}),
    ])
  ),
  onEditUser: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  authUserRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

UserDialog.defaultProps = {
  user: {},
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  authUserRoles: state.users.authUser.roles,
});

const mapDispatchToProps = (dispatch) => ({
  onEditUser: (authUserRoles, userId, email, roles, name, image, bio, token) =>
    dispatch(editUser(authUserRoles, userId, email, roles, name, image, bio, token)),
  onGetUsers: (token) => dispatch(getUsers(token)),
  onAddUser: (authUserRoles, email, username, password, roles, name, image, bio, token) =>
    dispatch(addUser(authUserRoles, email, username, password, roles, name, image, bio, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDialog);