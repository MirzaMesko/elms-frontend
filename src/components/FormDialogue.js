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
import { addUser } from '../actions/users';
import Confirm from './Confirm';
import MulitpleSelect from './MulitpleSelect';
import CustomizedSnackbars from './Snackbar';

const roleOptions = ['Admin', 'Librarian', 'Student'];

function FormDialog(props) {
  const { show, close, token } = props;
  const [open, setOpen] = React.useState(show);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [newUser, setNewUser] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [name, setName] = React.useState('');
  const [roles, setRoles] = React.useState([]);
  const [severity, setSeverity] = React.useState('');

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
    // eslint-disable-next-line
    console.log(selectedRoles);
    setRoles(selectedRoles);
  };

  const resetInput = () => {
    setEmail('');
    setBio('');
    setName('');
    setPassword('');
    setUsername('');
  };

  const handleClose = () => {
    setOpen(false);
    close();
    setOpenConfirm(false);
    resetInput();
  };

  const onAddUser = (event) => {
    event.preventDefault();
    addUser(email, username, password, roles, name, bio, token).then((response) => {
      if (
        response.statusCode === 400 ||
        response.statusCode === 401 ||
        response.statusCode === 403
      ) {
        setSeverity('error');
        setNewUser(response.message);
      }
      if (response.status === 201) {
        setSeverity('success');
        setNewUser(`User ${response.data.username} was created`);
      }
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);
      }, 6000);
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
  }, [show, handleClose]);

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
        <CustomizedSnackbars show={openAlert} severity={severity} message={newUser} />
        <DialogTitle id="form-dialog-title">Add New User</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill in the following information.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username*"
            type="username"
            fullWidth
            onChange={handleUsernameChange}
          />
          <TextField
            margin="dense"
            id="name"
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
            fullWidth
            onChange={handleNameChange}
          />
          <TextField
            margin="dense"
            id="name"
            label="Bio"
            type="bio"
            fullWidth
            onChange={handleBioChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={showConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={onAddUser} color="primary">
            Add
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
};

// eslint-disable-next-line
const mapStateToProps = (state) => {
  return {
    token: state.authUser.token,
  };
};

export default connect(mapStateToProps)(FormDialog);
