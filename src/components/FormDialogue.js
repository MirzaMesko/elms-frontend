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
import { addUser, editUser, getUsers } from '../actions/users';
import { addBook, getBooks } from '../actions/books';
import Confirm from './Confirm';
import MulitpleSelect from './MulitpleSelect';

const roleOptions = ['Admin', 'Librarian', 'Member'];

function FormDialog(props) {
  const {
    show,
    close,
    token,
    onGetUsers,
    onGetBooks,
    onShowSnackbar,
    title,
    user,
    book,
    onEditUser,
    onAddUser,
    onAddBook,
    authUserRoles,
  } = props;
  const [open, setOpen] = React.useState(show);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [id, setId] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [name, setName] = React.useState('');
  const [bookTitle, setBookTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [year, setYear] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [publisher, setPublisher] = React.useState('');
  const [serNo, setSerNo] = React.useState('');
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

  const handleBookTitleChange = (event) => {
    setBookTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePublisherChange = (event) => {
    setPublisher(event.target.value);
  };

  const handleSerialNumberChange = (event) => {
    setSerNo(event.target.value);
  };

  const resetInput = () => {
    setEmail('');
    setBio('');
    setName('');
    setPassword('');
    setUsername('');
    setId('');
    setRoles([]);
    setBookTitle('');
    setAuthor('');
    setYear('');
    setDescription('');
    setPublisher('');
    setSerNo('');
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
    onAddUser(
      Object.values(authUserRoles),
      email,
      username,
      password,
      roles,
      name,
      bio,
      token
    ).then((response) => {
      if (response.status !== 201) {
        onShowSnackbar(true, 'error', `${response.message}`);
      }
      if (response.status === 201) {
        onShowSnackbar(true, 'success', `User ${response.data.username} was created`);
        onGetUsers(token);
        close();
        resetInput();
      }
    });
  };

  const onAddNewBook = (event) => {
    event.preventDefault();
    if (!bookTitle || !author || !year) {
      onShowSnackbar(true, 'error', 'Please fill in the required fileds!');
      return;
    }
    onAddBook(
      Object.values(authUserRoles),
      bookTitle,
      author,
      year,
      description,
      publisher,
      serNo,
      token
    ).then((response) => {
      if (response.status !== 201) {
        onShowSnackbar(true, 'error', `${response.message}`);
      }
      if (response.status === 201) {
        onShowSnackbar(
          true,
          'success',
          `${response.data.title} by ${response.data.author} was added to the database.`
        );
        onGetBooks(token);
        close();
        resetInput();
      }
    });
  };

  const onEdit = (event) => {
    event.preventDefault();
    onEditUser(Object.values(authUserRoles), id, email, roles, name, bio, token).then(
      (response) => {
        if (response.status === 400 || response.status === 401 || response.status === 403) {
          onShowSnackbar(true, 'error', response.message);
        }
        if (response.status === 200) {
          onShowSnackbar(true, 'success', `User ${response.data.username} was edited`);
          onGetUsers(token);
          close();
        }
      }
    );
  };

  const showConfirm = () => {
    if (
      username.length ||
      password.length ||
      email.length ||
      name.length ||
      bookTitle.length ||
      author.length
    ) {
      setOpenConfirm(true);
    } else {
      handleClose();
    }
  };

  React.useEffect(() => {
    setOpen(show);
    if (user) {
      setEmail(user.email);
      setBio(user.bio);
      setName(user.name);
      setPassword(user.password);
      setUsername(user.username);
      // eslint-disable-next-line no-underscore-dangle
      setId(user._id);
      // eslint-disable-next-line
      if (Object.values(user.roles).includes('Admin', 'Librarian')) {
        setRoles(Object.values(user.roles));
      }
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
      />
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>Please fill in the following information.</DialogContentText>
        {title.includes('User') ? (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Username*"
              defaultValue={username}
              disabled={user}
              type="username"
              fullWidth
              onChange={handleUsernameChange}
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
              id="password"
              label="Password*"
              type="password"
              disabled={user}
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
              id="bio"
              label="Bio"
              type="bio"
              defaultValue={bio}
              fullWidth
              onChange={handleBioChange}
            />
          </>
        ) : (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title*"
              defaultValue={bookTitle}
              disabled={book}
              type="text"
              fullWidth
              onChange={handleBookTitleChange}
            />
            <TextField
              focus="true"
              margin="dense"
              id="author"
              defaultValue={author}
              label="Author*"
              type="text"
              fullWidth
              onChange={handleAuthorChange}
            />
            <TextField
              margin="dense"
              id="year"
              label="Year*"
              type="year"
              defaultValue={year}
              fullWidth
              onChange={handleYearChange}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              defaultValue={description}
              fullWidth
              onChange={handleDescriptionChange}
            />
            <TextField
              margin="dense"
              id="publisher"
              label="Publisher"
              type="text"
              defaultValue={publisher}
              fullWidth
              onChange={handlePublisherChange}
            />
            <TextField
              margin="dense"
              id="serNo"
              label="Serial No"
              type="text"
              defaultValue={serNo}
              fullWidth
              onChange={handleSerialNumberChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={showConfirm} color="primary">
          Cancel
        </Button>
        {title.includes('User') ? (
          <Button onClick={user ? onEdit : onAddNewUser} color="primary">
            {user ? 'Save Changes' : 'Add'}
          </Button>
        ) : (
          <Button onClick={book ? onEdit : onAddNewBook} color="primary">
            {book ? 'Save Changes' : 'Add'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

FormDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  onGetUsers: PropTypes.func.isRequired,
  onGetBooks: PropTypes.func.isRequired,
  onShowSnackbar: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  user: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])),
  book: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])),
  onEditUser: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  onAddBook: PropTypes.func.isRequired,
  authUserRoles: PropTypes.objectOf(PropTypes.string).isRequired,
};

FormDialog.defaultProps = {
  user: null,
  book: null,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  authUserRoles: state.users.authUser.roles,
});

const mapDispatchToProps = (dispatch) => ({
  onEditUser: (authUserRoles, id, email, roles, name, bio, token) =>
    dispatch(editUser(authUserRoles, id, email, roles, name, bio, token)),
  onGetUsers: (token) => dispatch(getUsers(token)),
  onGetBooks: (token) => dispatch(getBooks(token)),
  onAddUser: (authUserRoles, email, username, password, roles, name, bio, token) =>
    dispatch(addUser(authUserRoles, email, username, password, roles, name, bio, token)),
  onAddBook: (authUserRoles, title, author, year, description, publisher, serNo, token) =>
    dispatch(addBook(authUserRoles, title, author, year, description, publisher, serNo, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);
