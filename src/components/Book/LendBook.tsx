/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useDispatch } from 'react-redux';
import SearchIcon from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, styled } from '@material-ui/core/styles';
// @ts-ignore
import CustomizedSnackbars from '../Helpers/Snackbar.tsx';
// @ts-ignore
import ConciseBook from './ConciseBook.tsx';
// @ts-ignore
import { getBooks, lendBook, setNotification } from '../../actions/books.tsx';
// @ts-ignore
import { getUsers } from '../../actions/users.tsx';
// @ts-ignore
import { AppDispatch } from '../../store.ts';
// @ts-ignore
import type { Book, User } from '../../types.ts';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 42px',
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
  padding: theme.spacing(5, 2, 2, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const useStyles = makeStyles(() => ({
  results: {
    minHeight: '50vh',
    overflow: 'auto',
    marginTop: '2rem',
  },
}));

interface Props {
  user: User;
  books: [Book];
  token: string;
  authUserRoles: Array<string>;
}

const LendBook: React.FC<Props> = (props: Props) => {
  const { user, books, token, authUserRoles } = props;
  const classes = useStyles();
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Book[]>([]);

  const dispatch: AppDispatch = useDispatch();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  React.useEffect(() => {
    const filteredResults = books.filter(
      (book: Book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.serNo.toLowerCase().includes(search.toLowerCase())
    );
    if (search !== '') {
      setSearchResults(filteredResults.reverse());
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const lend = (book: Book) => {
    setSearchResults([]);
    setSearch('');
    dispatch(lendBook(book, user, authUserRoles, token)).then(
      (resp: { status: number; message: any }) => {
        if (resp.status === 200) {
          dispatch(getBooks(token));
          dispatch(getUsers(token));
        }
      }
    );
  };

  const setNewNotification = (book: Book) => {
    dispatch(setNotification(token, authUserRoles, book, user));
  };

  return (
    <>
      <CustomizedSnackbars />
      <FormControl fullWidth variant="standard" data-testid="lend-book-form">
        <InputLabel htmlFor="demo-customized-textbox" data-testid="form-input-label">
          search books by title or serial number
        </InputLabel>
        <BootstrapInput
          id="demo-customized-textbox"
          type="text"
          placeholder=""
          inputProps={{ 'data-testid': 'form-input' }}
          value={search}
          name="search"
          onChange={handleSearchChange}
        />
        <SearchIconWrapper>
          <SearchIcon color="primary" />
        </SearchIconWrapper>
      </FormControl>

      <div className={classes.results} data-testid="results">
        {!searchResults?.length ? (
          <Typography className="centered" data-testid="no-results-message">
            No results.
          </Typography>
        ) : (
          searchResults.map((book: Book) => (
            <ConciseBook book={book} lend={lend} onNotifyUser={setNewNotification} key={book._id} />
          ))
        )}
      </div>
    </>
  );
};

export default LendBook;
