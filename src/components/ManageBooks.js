import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles, styled } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import { connect } from 'react-redux';
import { history as historyPropTypes } from 'history-prop-types';
import PropTypes from 'prop-types';
import React from 'react';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import CustomizedSnackbars from './Snackbar';
import FormDialogue from './FormDialogue';
import BookTable from './BookTable';
import { getBooks } from '../actions/books';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    margin: theme.spacing(3, 2, 2, 0),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 46px 10px 32px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(3, 2, 2, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

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
  const [roleFilter, setRoleFilter] = React.useState('all books');

  const isAdmin = roles.includes('Admin');
  const categories = [
    'all books',
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
    if (roleFilter === 'all books') {
      setCategorySearchResults(books);
      return;
    }
    const filteredResults = books.filter(
      (book) => book.category?.toLowerCase() === roleFilter.toLowerCase()
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
        <FormControl variant="standard">
          <InputLabel htmlFor="demo-customized-textbox">search users</InputLabel>
          <BootstrapInput
            id="demo-customized-textbox"
            type="text"
            placeholder=""
            value={search}
            label="search books"
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIconWrapper>
            <SearchIcon color="primary" />
          </SearchIconWrapper>
        </FormControl>
        <Typography style={{ margin: '2rem 0.5rem' }}>by</Typography>
        <FormControl variant="standard">
          <InputLabel htmlFor="demo-customized-textbox"> </InputLabel>
          <Select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            input={<BootstrapInput />}
          >
            <MenuItem value="title">title</MenuItem>
            <MenuItem value="author">author</MenuItem>
            <MenuItem value="year">year</MenuItem>
            <MenuItem value="publisher">publisher</MenuItem>
            {roles !== 'Member' && <MenuItem value="serNo">serial no</MenuItem>}
            {roles === 'Member' && <MenuItem value="category">category</MenuItem>}
          </Select>
        </FormControl>
        <Typography style={{ margin: '2rem 0.5rem 2rem 9rem' }}>showing</Typography>
        <FormControl variant="standard">
          <InputLabel htmlFor="demo-customized-textbox"> </InputLabel>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            input={<BootstrapInput />}
          >
            {categories.map((category) => (
              <MenuItem value={category} key={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
