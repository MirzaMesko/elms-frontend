import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { history as historyPropTypes } from 'history-prop-types';
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
    margin: theme.spacing(0, 3, 0),
  },
  search: {
    margin: theme.spacing(3, 0, 2),
    padding: '0.1rem',
  },
  label: {
    fontSize: '20px',
    color: '#3f51b5',
  },
  input: {
    border: '1px solid #3f51b5',
    padding: '0.3rem 0.3rem',
    marginRight: '0.5rem',
    color: '#3f51b5',
  },
  option: {
    margin: ' 0 0.2rem',
    fontSize: '20px',
    color: '#3f51b5',
  },
}));

function ManageBooks(props) {
  const { token, onGetBooks, books, roles, history } = props;
  const classes = useStyles();
  const [openDialogue, setOpenDialogue] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [categorySearchResults, setCategorySearchResults] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [searchFilter, setSearchFilter] = React.useState('title');
  const [roleFilter, setRoleFilter] = React.useState('');

  const isAdmin = roles.includes('Admin');
  const categories = [
    'All books',
    'Politics',
    'History',
    'Romance',
    'Science Fiction & Fantasy',
    'Biographies',
    'Classics',
    'Course books',
  ];

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

  const filterByCategorie = () => {
    if (roleFilter === 'All books') {
      setCategorySearchResults(books);
      return;
    }
    const filteredResults = books.filter(
      (book) =>
        (roleFilter === 'Classics' && book.categorie?.toLowerCase() === roleFilter.toLowerCase()) ||
        (roleFilter === 'Politics' && book.categorie?.toLowerCase() === roleFilter.toLowerCase()) ||
        (roleFilter === 'History' && book.categorie?.toLowerCase() === roleFilter.toLowerCase()) ||
        (roleFilter === 'History' && book.categorie?.toLowerCase() === roleFilter.toLowerCase()) ||
        (roleFilter === 'Course books' &&
          book.categorie?.toLowerCase() === roleFilter.toLowerCase()) ||
        (roleFilter === 'Biographies' &&
          book.categorie?.toLowerCase() === roleFilter.toLowerCase()) ||
        (roleFilter === 'Science Fiction & Fantasy' &&
          book.categorie?.toLowerCase() === roleFilter.toLowerCase())
    );
    setCategorySearchResults(filteredResults.reverse());
  };

  React.useEffect(() => {
    const filteredResults = categorySearchResults.filter(
      (book) =>
        (searchFilter === 'title' && book.title.toLowerCase().includes(search.toLowerCase())) ||
        (searchFilter === 'author' && book.author.toLowerCase().includes(search.toLowerCase())) ||
        (searchFilter === 'year' && book.year.toString().includes(search)) ||
        (searchFilter === 'publisher' &&
          book.publisher.toLowerCase().includes(search.toLowerCase())) ||
        (searchFilter === 'serNo' && book.serNo.toLowerCase().includes(search.toLowerCase()))
    );
    setSearchResults(filteredResults.reverse());
  }, [search, searchFilter, categorySearchResults]);

  React.useEffect(() => {
    filterByCategorie();
  }, [roleFilter]);

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
        <form className={classes.search} onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search" className={classes.label}>
            Search by
            <select
              className={classes.option}
              selected={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            >
              <option value="title">title</option>
              <option value="author">author</option>
              <option value="year">year</option>
              <option value="publisher">publisher</option>
              {roles !== 'Member' && <option value="serNo">serial no</option>}
              {roles === 'Member' && <option value="category">category</option>}
            </select>
          </label>
        </form>
        <div style={{ marginLeft: '4rem' }}>
          <form className={classes.search} onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search" className={classes.label}>
              Showing
              <select
                className={classes.option}
                selected={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {categories.map((categorie) => (
                  <option value={categorie} key={categorie}>
                    {categorie}
                  </option>
                ))}
              </select>
            </label>
          </form>
        </div>
      </div>

      <BookTable books={searchResults} onShowSnackbar={showSnackbar} history={history} />
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
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  history: PropTypes.shape(historyPropTypes).isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  books: state.books.books,
});

const mapDispatchToProps = (dispatch) => ({
  onGetBooks: (token) => dispatch(getBooks(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageBooks);
