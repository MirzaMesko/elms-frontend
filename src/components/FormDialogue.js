import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { addUser, editUser } from '../actions/users';
import Confirm from './Confirm';
import MulitpleSelect from './MulitpleSelect';

const roleOptions = ['Admin', 'Librarian', 'Student'];

function FormDialog(props) {
  const { show, close, token, onGetUsers, onShowSnackbar, title, user, onEditUser } = props;
  const [open, setOpen] = React.useState(show);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [name, setName] = React.useState('');
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

  const resetInput = () => {
    setEmail('');
    setBio('');
    setName('');
    setPassword('');
    setUsername('');
    setRoles([]);
  };

  const handleClose = () => {
    setOpen(false);
    close();
    setOpenConfirm(false);
    resetInput();
  };

  const onAddUser = (event) => {
    event.preventDefault();
    if (!email || !username || !password) {
      onShowSnackbar(true, 'error', 'Please fill in the required fileds!');
      return;
    }
    addUser(email, username, password, roles, name, bio, token).then((response) => {
      if (
        response.statusCode === 400 ||
        response.statusCode === 401 ||
        response.statusCode === 403
      ) {
        onShowSnackbar(true, 'error', response.message);
      }
      if (response.status === 201) {
        onShowSnackbar(true, 'success', `User ${response.data.username} was created`);
        onGetUsers(token);
        close();
      }
    });
  };

  const onEdit = (event) => {
    event.preventDefault();
    // eslint-disable-next-line
    console.log(email, password, roles, name, bio, token);
    onEditUser(email, username, roles, name, bio, token).then((response) => {
      // eslint-disable-next-line
      console.log(response);
      if (
        response.statusCode === 400 ||
        response.statusCode === 401 ||
        response.statusCode === 403
      ) {
        onShowSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        onShowSnackbar(true, 'success', `User ${response.data.username} was edited`);
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
    // eslint-disable-next-line
    console.log('user: ', user, show);
    if (user) {
      setEmail(user.email);
      setBio(user.bio);
      setName(user.name);
      setPassword(user.password);
      setUsername(user.username);
      // eslint-disable-next-line
      if (user.roles.includes('Admin','Librarian')) {
        setRoles(user.roles);
      }
    }
  }, [show, user]);

  return (
    <div>
      <Dialog open={open} onClose={showConfirm} aria-labelledby="form-dialog-title">
        <Confirm
          show={openConfirm}
          title="Are you sure?"
          message="Entered input will be lost. Are you sure you want to cancel?"
          confirm={handleClose}
          cancel={() => setOpenConfirm(false)}
        />
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill in the following information.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username*"
            defaultValue={username}
            type="username"
            fullWidth
            onChange={handleUsernameChange}
          />
          <TextField
            focus="true"
            margin="dense"
            id="name"
            defaultValue={email}
            label="Email Address*"
            type="email"
            fullWidth
            onChange={handleEmailChange}
          />
          <TextField
            margin="dense"
            id="name"
            label="Password*"
            type="password"
            defaultValue={password}
            fullWidth
            onChange={handlePasswordChange}
          />
          <MulitpleSelect
            onChange={handleRoleChange}
            selected={roles}
            options={roleOptions}
            label="Roles"
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
          <TextField
            margin="dense"
            id="name"
            label="Bio"
            type="bio"
            placeholder={bio}
            fullWidth
            onChange={handleBioChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={showConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={user ? onEdit : onAddUser} color="primary">
            {user ? 'Edit' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

FormDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  onGetUsers: PropTypes.func.isRequired,
  onShowSnackbar: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  user: PropTypes.objectOf(PropTypes.shape({})),
  onEditUser: PropTypes.func.isRequired,
};

FormDialog.defaultProps = {
  user: null,
};

const mapStateToProps = (state) => ({
  token: state.authUser.token,
});

const mapDispatchToProps = (dispatch) => ({
  onEditUser: (email, username, roles, name, bio, token) =>
    dispatch(editUser(email, username, roles, name, bio, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);
