import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import CustomizedSnackbars from './Snackbar';
import FormDialogue from './FormDialogue';
import BookTable from './BookTable';
import { getBooks } from '../actions/books';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 3, 2),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  search: {
    margin: theme.spacing(3, 3, 2),
    padding: '0.4rem',
  },
  label: {
    fontSize: '20px',
    color: '#3f51b5',
  },
  input: {
    border: '1px solid #3f51b5',
    padding: '0.3rem',
    marginLeft: '0.9rem',
    color: '#3f51b5',
  },
}));

function ManageBooks(props) {
  const { token, onGetBooks, books, roles } = props;
  const classes = useStyles();
  const [openDialogue, setOpenDialogue] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [search, setSearch] = React.useState('');

  const isAdmin = Object.values(roles).includes('Admin');

  const handleOpen = () => {
    setOpenDialogue(true);
  };

  const handleClose = () => {
    setOpenDialogue(false);
  };

  const showSnackbar = (show, status, message) => {
    setSeverity(status);
    setErrMessage(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 6000);
  };

  React.useEffect(() => {
    onGetBooks(token);
  }, [token]);

  React.useEffect(() => {
    setSearchResults(books);
  }, [books]);

  React.useEffect(() => {
    const filteredResults = books.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filteredResults.reverse());
  }, [search]);

  return (
    <Box>
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={errMessage} />
      <div className={classes.container}>
        {isAdmin && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleOpen}
          >
            <LibraryBooksIcon style={{ marginRight: '15px' }} />
            New Book
          </Button>
        )}
        <form className={classes.search} onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search" className={classes.label}>
            Search books
            <input
              id="search"
              type="text"
              placeholder=""
              value={search}
              className={classes.input}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </form>
      </div>

      <BookTable books={searchResults} onShowSnackbar={showSnackbar} />
      <FormDialogue
        show={openDialogue}
        close={handleClose}
        onShowSnackbar={showSnackbar}
        title="Add New Book"
      />
    </Box>
  );
}

ManageBooks.propTypes = {
  token: PropTypes.string.isRequired,
  onGetBooks: PropTypes.func.isRequired,
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  roles: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  books: state.books.books,
});

const mapDispatchToProps = (dispatch) => ({
  onGetBooks: (token) => dispatch(getBooks(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageBooks);
