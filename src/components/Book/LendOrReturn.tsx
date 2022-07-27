/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import Button from '@material-ui/core/Button';
import { connect, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import InputBase from '@material-ui/core/InputBase';
import Tab from '@material-ui/core/Tab';
import { makeStyles, styled } from '@material-ui/core/styles';
// @ts-ignore
import TabPanel from '../Helpers/TabPanel.tsx';
// @ts-ignore
import CustomizedSnackbars from '../Helpers/Snackbar.tsx';
// @ts-ignore
import ConciseBook from './ConciseBook.tsx';
// @ts-ignore
import { getBooks, lendBook, returnBook, setNotification } from '../../actions/books.tsx';
// @ts-ignore
import { getUsers, notifyUser } from '../../actions/users.tsx';
// @ts-ignore
import Profile from '../User/Profile.tsx';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
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
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    width: '100%',
  },
  results: {
    minHeight: '50vh',
    overflow: 'auto',
    marginTop: '2rem',
  },
}));

interface OwnProps {
  users: [User];
  books: [Book];
  token: string;
  authUserRoles: Array<string>;
}

type Params = {
  id: string;
};

type Props = OwnProps & RootState;

const LendOrReturn: React.FC<OwnProps> = (props: Props) => {
  const { users, books, token, authUserRoles } = props;
  const classes = useStyles();
  const [search, setSearch] = React.useState('');
  const [user, setUser] = React.useState<User>({});
  const [owedBooks, setOwedBooks] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState(['']);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [value, setValue] = React.useState(0);

  const { id } = useParams<Params>();
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();

  const showSnackbar = (
    show: boolean | ((prevState: boolean) => boolean),
    status: string,
    message: string
  ) => {
    setSeverity(status);
    setErrMessage(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 6000);
    dispatch(getBooks(token));
    dispatch(getUsers(token));
  };

  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
    setSearch('');
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
      setSearchResults(['']);
    }
  }, [search]);

  React.useEffect(() => {
    const result = users.filter((u: { _id: string }) => u._id === id);
    setUser(result[0]);
    if (result[0].owedBooks?.length) {
      setOwedBooks(result[0].owedBooks);
    } else {
      setOwedBooks([]);
    }
  }, [users]);

  const returnABook = (book: Book) => {
    const newOwedBooks = owedBooks.filter((i) => i !== book._id);
    dispatch(returnBook(token, authUserRoles, book, user, newOwedBooks)).then(
      (resp: { status: number; message: any }) => {
        if (resp.status !== 200) {
          showSnackbar(true, 'error', resp.message);
        }
        if (resp.status === 200) {
          showSnackbar(true, 'success', `Book ${book.title} was returned`);
          if (book.reservedBy[0]) {
            dispatch(
              notifyUser(
                token,
                authUserRoles,
                book.reservedBy[0],
                `${book.title} by ${book.author} is now available.`
              )
            );
          }
        }
      }
    );
  };

  const sendReminder = (book: Book) => {
    dispatch(
      notifyUser(
        token,
        authUserRoles,
        book.owedBy.userId,
        `"${book.title}" by "${book.author}" is overdue. Please return it as soon as possible!`
      )
    ).then((response: { status: number; message: any }) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(
          true,
          'success',
          `A reminder that "${book.title}" by "${book.author}" is overdue was sent to ${user.username}.`
        );
      }
    });
  };

  const lend = (book: Book) => {
    setSearchResults(['']);
    setSearch('');
    dispatch(lendBook(book, user, authUserRoles, token)).then(
      (resp: { status: number; message: any }) => {
        if (resp.status !== 200) {
          showSnackbar(true, 'error', resp.message);
        }
        if (resp.status === 200) {
          showSnackbar(true, 'success', `Book ${book.title} was lent to ${user.username}`);
        }
      }
    );
  };

  const setNewNotification = (book: Book) => {
    dispatch(setNotification(token, authUserRoles, book, user._id)).then(
      (resp: { status: number; message: any }) => {
        if (resp.status !== 200) {
          showSnackbar(true, 'error', resp.message);
        }
        if (resp.status === 200) {
          showSnackbar(
            true,
            'success',
            `User ${user.username} will be notified when ${book.title} by ${book.author} is available.`
          );
        }
      }
    );
  };

  const lendBookBlock = (
    <>
      <FormControl fullWidth variant="standard">
        <InputLabel htmlFor="demo-customized-textbox">
          search books by title or serial number
        </InputLabel>
        <BootstrapInput
          id="demo-customized-textbox"
          type="text"
          placeholder=""
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SearchIconWrapper>
          <SearchIcon color="primary" />
        </SearchIconWrapper>
      </FormControl>

      <div className={classes.results}>
        {!searchResults?.length ? (
          <Typography className="centered">No results.</Typography>
        ) : (
          searchResults.map((book: Book) => (
            <ConciseBook book={book} lend={lend} onNotifyUser={setNewNotification} id={book._id} />
          ))
        )}
      </div>
    </>
  );

  const owedBooksBlock = !owedBooks?.length ? (
    <Typography className="centered">No owed books for this user.</Typography>
  ) : (
    owedBooks.map((bookId) => {
      const match = books.filter((book: { _id: string }) => book._id === bookId);
      return match.map((owedBook: Book) => (
        <ConciseBook
          book={owedBook}
          onReturnBook={returnABook}
          sendOverdueReminder={sendReminder}
          id={owedBook._id}
        />
      ));
    })
  );

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div>
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={errMessage} />
      <div className={classes.container}>
        <Profile user={user} />
        <div style={{ flex: '6', padding: '1rem' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Lend new book" {...a11yProps(0)} />
            <Tab label="Owed Books" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0} key={0}>
            {lendBookBlock}
          </TabPanel>
          <TabPanel value={value} index={1} key={1}>
            {owedBooksBlock}
          </TabPanel>

          <div className="centered">
            <ButtonGroup variant="outlined" size="large" aria-label="large button group">
              <Button autoFocus onClick={() => history.push(`/manage/users`)}>
                back to users
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  token: state.users.token,
  books: state.books.books,
  authUserRoles: state.users.authUser.roles,
  users: state.users.users,
});

export default connect<OwnProps, RootState>(mapStateToProps)(LendOrReturn);
