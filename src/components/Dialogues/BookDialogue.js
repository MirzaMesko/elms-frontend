/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
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
import { addBook, getBooks, editBook } from '../../actions/books';
import Confirm from '../Helpers/Confirm';
import BasicSelect from '../Helpers/Select';
import editionPlaceholder from '../../utils/edition_placeholder2.png';

const categoryOptions = [
  'All Books',
  'Politics',
  'History',
  'Romance',
  'Science Fiction & Fantasy',
  'Biographies',
  'Classics',
  'Course books',
];

function BookDialog(props) {
  const { show, close, token, onGetBooks, onShowSnackbar, title, book, onEditBook, onAddBook, authUserRoles } = props;

  const [open, setOpen] = React.useState(show);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [bookId, setBookId] = React.useState('');
  const [bookTitle, setBookTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [year, setYear] = React.useState('');
  const [image, setImage] = React.useState(editionPlaceholder);
  const [description, setDescription] = React.useState('');
  const [publisher, setPublisher] = React.useState('');
  const [serNo, setSerNo] = React.useState('');
  const [category, setCategory] = React.useState('');

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

  const onAddNewBook = (event) => {
    event.preventDefault();
    if (!bookTitle || !author || !serNo || !year) {
      onShowSnackbar(true, 'error', 'Please fill in the required fileds!');
      return;
    }
    onAddBook(authUserRoles, bookTitle, author, year, description, category, image, publisher, serNo, token)
    .then((response) => {
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

  const onEditSingleBook = (event) => {
    event.preventDefault();
    onEditBook(authUserRoles, bookId, bookTitle, author, year, description, category, image, publisher, serNo, token)
    .then((response) => {
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
    if (bookTitle.length || author.length) {
      setOpenConfirm(true);
    } else {
      handleClose();
    }
  };

  React.useEffect(() => {
    setOpen(show);
    if (book.title) {
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
  }, [show, book]);

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
              label="Year*"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={showConfirm} color="primary">
          Cancel
        </Button>
        <Button onClick={title.includes('Edit') ? onEditSingleBook : onAddNewBook} color="primary">
          {title.includes('Edit') ? 'Save Changes' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BookDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  onGetBooks: PropTypes.func.isRequired,
  onShowSnackbar: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  book: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.number,
      PropTypes.objectOf({}),
    ])
  ),
  onEditBook: PropTypes.func.isRequired,
  onAddBook: PropTypes.func.isRequired,
  authUserRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

BookDialog.defaultProps = {
  book: {},
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  authUserRoles: state.users.authUser.roles,
});

const mapDispatchToProps = (dispatch) => ({
  onEditBook: (authUserRoles, bookId, title, author, year, description, category, image, publisher, serNo, token) => 
    dispatch(editBook(authUserRoles, bookId, title, author, year, description, category, image, publisher, serNo, token)),
  onGetBooks: (token) => dispatch(getBooks(token)),
  onAddBook: (authUserRoles, title, author, year, description, category, image, publisher, serNo, token) => 
    dispatch(addBook(authUserRoles, title, author, year, description, category, image, publisher, serNo, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookDialog);
