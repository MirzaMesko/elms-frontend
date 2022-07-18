import Box from '@material-ui/core/Box';
import { makeStyles, styled } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import { connect } from 'react-redux';
import React from 'react';
// @ts-ignore
import OverdueBookTable from './OverdueBookTable.tsx';
import { getBooks } from '../../actions/books';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { Book } from '../../types.ts';

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

interface OwnProps {
  roles: Array<string>;
}

type Props = OwnProps & RootState & AppDispatch;

const ManageOverdueBooks: React.FC<OwnProps> = (props: Props) => {
  const { token, onGetBooks, books, roles } = props;
  const classes = useStyles();
  const [searchResults, setSearchResults] = React.useState([]);
  const [categorySearchResults, setCategorySearchResults] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [searchFilter, setSearchFilter] = React.useState('title');
  const [roleFilter, setRoleFilter] = React.useState('all books');

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

  const handleRoleFilterChange = (event: { target: { value: any } }) => {
    setRoleFilter(event.target.value);
  };

  const handleSearchFilterChange = (event: { target: { value: any } }) => {
    setSearchFilter(event.target.value);
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
      (book: Book) => book.category?.toLowerCase() === roleFilter.toLowerCase()
    );
    setCategorySearchResults(filteredResults.reverse());
  };

  React.useEffect(() => {
    const filteredResults = categorySearchResults.filter(
      (book: Book) =>
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
      <div className={classes.container}>
        <FormControl variant="standard">
          <InputLabel htmlFor="demo-customized-textbox">search books</InputLabel>
          <BootstrapInput
            id="demo-customized-textbox"
            type="text"
            placeholder=""
            value={search}
            title="search books"
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
            onChange={handleSearchFilterChange}
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
          <Select value={roleFilter} onChange={handleRoleFilterChange} input={<BootstrapInput />}>
            {categories.map((category) => (
              <MenuItem value={category} key={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <OverdueBookTable books={searchResults} />
    </Box>
  );
};

const mapStateToProps = (state: RootState) => ({
  token: state.users.token,
  books: state.books.books.filter(
    (book: Book) => new Date(book.owedBy?.dueDate).getTime() < new Date().getTime()
  ),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onGetBooks: (token: string) => dispatch(getBooks(token)),
});

export default connect<RootState, AppDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(ManageOverdueBooks);
