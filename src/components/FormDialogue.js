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
import { addUser, editUser, getUsers } from '../actions/users';
import { addBook, getBooks, editBook } from '../actions/books';
import Confirm from './Confirm';
import MulitpleSelect from './MulitpleSelect';
import BasicSelect from './Select';
import editionPlaceholder from '../utils/edition_placeholder2.png';
import profilePlaceholder from '../utils/profile-picture-default-png.png';

const roleOptions = ['Admin', 'Librarian', 'Member'];
const categoryOptions = [
  'All books',
  'Politics',
  'History',
  'Romance',
  'Science Fiction & Fantasy',
  'Biographies',
  'Classics',
  'Course books',
];

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
    onEditBook,
    onAddUser,
    onAddBook,
    authUserRoles,
  } = props;
  const [open, setOpen] = React.useState(show);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [bookId, setBookId] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [name, setName] = React.useState('');
  const [bookTitle, setBookTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [year, setYear] = React.useState('');
  const [image, setImage] = React.useState(
    title.includes('User') ? profilePlaceholder : editionPlaceholder
  );
  const [description, setDescription] = React.useState('');
  const [publisher, setPublisher] = React.useState('');
  const [serNo, setSerNo] = React.useState('');
  const [roles, setRoles] = React.useState([]);
  const [category, setCategory] = React.useState('');

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

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
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
    setCategory('');
    setBookTitle('');
    setAuthor('');
    setYear('');
    setDescription('');
    setPublisher('');
    setSerNo('');
    setBookId();
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

  const onAddNewBook = (event) => {
    event.preventDefault();
    if (!bookTitle || !author || !year) {
      onShowSnackbar(true, 'error', 'Please fill in the required fileds!');
      return;
    }
    onAddBook(
      authUserRoles,
      bookTitle,
      author,
      year,
      description,
      category,
      image,
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

  const onEditSingleBook = (event) => {
    event.preventDefault();
    onEditBook(
      authUserRoles,
      bookId,
      bookTitle,
      author,
      year,
      description,
      category,
      image,
      publisher,
      serNo,
      token
    ).then((response) => {
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        onShowSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        onShowSnackbar(true, 'success', `Book ${response.data.serNo} was edited`);
        onGetBooks(token);
        close();
      }
    });
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
    if (book.title) {
      // eslint-disable-next-line no-underscore-dangle
      setBookId(book._id);
      setBookTitle(book.title);
      setAuthor(book.author);
      setYear(book.year);
      setDescription(book.description);
      setPublisher(book.publisher);
      setSerNo(book.serNo);
      setCategory(book.category);
      setImage(book.image || editionPlaceholder);
    }
  }, [show, user, book]);

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
        {title.includes('User') ? (
          <>
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
          </>
        ) : (
          <>
            <div style={{ display: 'flex' }}>
              <div>
                <input
                  type="image"
                  id="image"
                  alt="Login"
                  src={image}
                  style={{
                    height: '320px',
                    display: 'block',
                    paddingRight: '1rem',
                  }}
                />
              </div>
              <div>
                <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  label="Title*"
                  defaultValue={bookTitle}
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
                  label="Year"
                  type="year"
                  defaultValue={year}
                  fullWidth
                  onChange={handleYearChange}
                />
                <BasicSelect
                  onChange={handleCategoryChange}
                  selected={category || 'All books'}
                  options={categoryOptions}
                  label="Category"
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
                  label="Serial No*"
                  type="text"
                  defaultValue={serNo}
                  fullWidth
                  onChange={handleSerialNumberChange}
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
              id="outlined-multiline-flexible"
              multiline
              label="Description"
              type="text"
              defaultValue={description}
              fullWidth
              onChange={handleDescriptionChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={showConfirm} color="primary">
          Cancel
        </Button>
        {title.includes('User') ? (
          <Button
            onClick={title.includes('Edit') ? onEditSingleUser : onAddNewUser}
            color="primary"
          >
            {title.includes('Edit') ? 'Save Changes' : 'Add'}
          </Button>
        ) : (
          <Button
            onClick={title.includes('Edit') ? onEditSingleBook : onAddNewBook}
            color="primary"
          >
            {title.includes('Edit') ? 'Save Changes' : 'Add'}
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
  user: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.objectOf(PropTypes.string),
      PropTypes.objectOf({}),
    ])
  ),
  book: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.number,
      PropTypes.objectOf({}),
    ])
  ),
  onEditUser: PropTypes.func.isRequired,
  onEditBook: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  onAddBook: PropTypes.func.isRequired,
  authUserRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

FormDialog.defaultProps = {
  book: {},
  user: {},
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  authUserRoles: state.users.authUser.roles,
});

const mapDispatchToProps = (dispatch) => ({
  onEditUser: (authUserRoles, userId, email, roles, name, image, bio, token) =>
    dispatch(editUser(authUserRoles, userId, email, roles, name, image, bio, token)),
  onEditBook: (
    authUserRoles,
    bookId,
    title,
    author,
    year,
    description,
    category,
    image,
    publisher,
    serNo,
    token
  ) =>
    dispatch(
      editBook(
        authUserRoles,
        bookId,
        title,
        author,
        year,
        description,
        category,
        image,
        publisher,
        serNo,
        token
      )
    ),
  onGetUsers: (token) => dispatch(getUsers(token)),
  onGetBooks: (token) => dispatch(getBooks(token)),
  onAddUser: (authUserRoles, email, username, password, roles, name, image, bio, token) =>
    dispatch(addUser(authUserRoles, email, username, password, roles, name, image, bio, token)),
  onAddBook: (
    authUserRoles,
    title,
    author,
    year,
    description,
    category,
    image,
    publisher,
    serNo,
    token
  ) =>
    dispatch(
      addBook(
        authUserRoles,
        title,
        author,
        year,
        description,
        category,
        image,
        publisher,
        serNo,
        token
      )
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);
