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
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
// @ts-ignore
import CustomizedSnackbars from '../Helpers/Snackbar.tsx';
// @ts-ignore
import UserDialogue from '../Dialogues/UserDialogue.tsx';
// @ts-ignore
import UserTable from './UserTable.tsx';
// @ts-ignore
import { getUsers } from '../../actions/users.tsx';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { User } from '../../types.ts';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    margin: theme.spacing(3, 2, 2, 0),
    [theme.breakpoints.down('sm')]: {
      fontSize: 6,
    },
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
    [theme.breakpoints.down('md')]: {
      padding: '12px 26px 10px 10px',
      fontSize: 14,
      minWidth: '100px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '12px 16px 10px 6px',
      fontSize: 10,
      minWidth: '50px',
      marginRight: 0,
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
    maxHeight: '40px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.5rem',
      maxHeight: '35px',
      margin: theme.spacing(3, 1, 2, 2),
      padding: '3px 5px',
    },
  },
  addUserIcon: {
    marginRight: '15px',
    [theme.breakpoints.down('sm')]: {
      margin: '2px',
      padding: 0,
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'centre',
    alignContent: 'centre',
    flexWrap: 'wrap',
  },
  form: {
    margin: theme.spacing(0, 4, 0),
  },
  label: {
    fontSize: '20px',
    color: '#3f51b5',
    margin: '2rem 3px 2rem 0rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      maxHeight: '40px',
    },
  },
  option: {
    margin: ' 0 0.2rem',
    fontSize: '20px',
    color: '#3f51b5',
  },
}));

const ManageUsers: React.FC = () => {
  const classes = useStyles();
  const [openDialogue, setOpenDialogue] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('username');
  const [roleFilter, setRoleFilter] = React.useState('All');

  const dispatch: AppDispatch = useDispatch();
  const { token, authUser, users } = useSelector((state: RootState) => state.users);
  const { roles } = authUser;
  const isAdmin: boolean = roles.includes('Admin');

  const handleOpen = () => {
    setOpenDialogue(true);
  };

  const handleClose = () => {
    setOpenDialogue(false);
  };

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  const handleRoleFilterChange = (event: any) => {
    setRoleFilter(event.target.value);
  };

  React.useEffect(() => {
    dispatch(getUsers(token));
  }, []);

  React.useEffect(() => {
    setSearchResults(users);
  }, [users]);

  React.useEffect(() => {
    const filteredResults = users.filter(
      (user: User) =>
        (filter === 'username' && user.username.toLowerCase().includes(search.toLowerCase())) ||
        (filter === 'email' && user.email.toLowerCase().includes(search.toLowerCase())) ||
        (filter === 'name' && user.name && user.name.toLowerCase().includes(search.toLowerCase()))
    );
    setSearchResults(filteredResults.reverse());
  }, [search, filter]);

  React.useEffect(() => {
    const filteredResults = users.filter(
      (user: User) =>
        (roleFilter === 'Admin' && Object.values(user.roles).includes(roleFilter)) ||
        (roleFilter === 'Librarian' && Object.values(user.roles).includes(roleFilter)) ||
        (roleFilter === 'Member' && Object.values(user.roles).length === 1) ||
        (roleFilter === 'All' && Object.values(user.roles).includes('Member'))
    );
    setSearchResults(filteredResults.reverse());
  }, [roleFilter]);

  return (
    <Box>
      <CustomizedSnackbars />
      <div className={classes.container}>
        {isAdmin && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleOpen}
          >
            <PersonAddOutlinedIcon className={classes.addUserIcon} />
            New User
          </Button>
        )}
        <FormControl variant="standard" className={classes.form}>
          <InputLabel htmlFor="demo-customized-textbox">search users</InputLabel>
          <BootstrapInput
            id="demo-customized-textbox"
            type="text"
            placeholder="Search…"
            value={search}
            title="search users"
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIconWrapper>
            <SearchIcon color="primary" />
          </SearchIconWrapper>
        </FormControl>
        <Typography className={classes.label}>by</Typography>
        <FormControl variant="standard">
          <InputLabel htmlFor="demo-customized-textbox"> </InputLabel>
          <Select value={filter} onChange={handleFilterChange} input={<BootstrapInput />}>
            <MenuItem value="username">username</MenuItem>
            <MenuItem value="email">email</MenuItem>
            <MenuItem value="name">name</MenuItem>
          </Select>
        </FormControl>
        <Typography className={classes.label}>showing</Typography>
        <FormControl variant="standard">
          <InputLabel htmlFor="demo-customized-textbox"> </InputLabel>
          <Select value={roleFilter} onChange={handleRoleFilterChange} input={<BootstrapInput />}>
            <MenuItem value="All">all users</MenuItem>
            <MenuItem value="Admin">Admins</MenuItem>
            <MenuItem value="Member">Members</MenuItem>
            <MenuItem value="Librarian">Librarians</MenuItem>
          </Select>
        </FormControl>
      </div>

      <UserTable users={searchResults} />
      <UserDialogue show={openDialogue} close={handleClose} title="Add New User" />
    </Box>
  );
};

export default ManageUsers;
