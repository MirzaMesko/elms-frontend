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
import PropTypes from 'prop-types';
import React from 'react';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import CustomizedSnackbars from './Snackbar';
import FormDialogue from './FormDialogue';
import UserTable from './UserTable';
import { getUsers } from '../actions/users';

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
    padding: '0.3rem 0',
    marginRight: '0.5rem',
    color: '#3f51b5',
  },
  option: {
    margin: ' 0 0.2rem',
    fontSize: '20px',
    color: '#3f51b5',
  },
}));

function ManageUsers(props) {
  const { token, onGetUsers, users, roles } = props;
  const classes = useStyles();
  const [openDialogue, setOpenDialogue] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [newUser, setNewUser] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('username');
  const [roleFilter, setRoleFilter] = React.useState('All');

  const isAdmin = roles.includes('Admin');

  const handleOpen = () => {
    setOpenDialogue(true);
  };

  const handleClose = () => {
    setOpenDialogue(false);
  };

  const showSnackbar = (show, status, message) => {
    setSeverity(status);
    setNewUser(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 6000);
  };

  React.useEffect(() => {
    onGetUsers(token);
  }, [token]);

  React.useEffect(() => {
    setSearchResults(users);
  }, [users]);

  React.useEffect(() => {
    const filteredResults = users.filter(
      (user) =>
        (filter === 'username' && user.username.toLowerCase().includes(search.toLowerCase())) ||
        (filter === 'email' && user.email.toLowerCase().includes(search.toLowerCase())) ||
        (filter === 'name' && user.name && user.name.toLowerCase().includes(search.toLowerCase()))
    );
    setSearchResults(filteredResults.reverse());
  }, [search, filter]);

  React.useEffect(() => {
    const filteredResults = users.filter(
      (user) =>
        (roleFilter === 'Admin' && Object.values(user.roles).includes(roleFilter)) ||
        (roleFilter === 'Librarian' && Object.values(user.roles).includes(roleFilter)) ||
        (roleFilter === 'Member' && Object.values(user.roles).length === 1) ||
        (roleFilter === 'All' && Object.values(user.roles).includes('Member'))
    );
    setSearchResults(filteredResults.reverse());
  }, [roleFilter]);

  return (
    <Box>
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={newUser} />
      <div className={classes.container}>
        {isAdmin && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleOpen}
          >
            <PersonAddOutlinedIcon style={{ marginRight: '15px' }} />
            New User
          </Button>
        )}
        <FormControl variant="standard">
          <InputLabel htmlFor="demo-customized-textbox">search users</InputLabel>
          <BootstrapInput
            id="demo-customized-textbox"
            type="text"
            placeholder="Search…"
            value={search}
            label="search users"
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
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            input={<BootstrapInput />}
          >
            <MenuItem value="username">username</MenuItem>
            <MenuItem value="email">email</MenuItem>
            <MenuItem value="name">name</MenuItem>
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
            <MenuItem value="All">all users</MenuItem>
            <MenuItem value="Admin">Admins</MenuItem>
            <MenuItem value="Member">Members</MenuItem>
            <MenuItem value="Librarian">Librarians</MenuItem>
          </Select>
        </FormControl>
      </div>

      <UserTable users={searchResults} onShowSnackbar={showSnackbar} />
      <FormDialogue
        show={openDialogue}
        close={handleClose}
        onShowSnackbar={showSnackbar}
        title="Add New User"
      />
    </Box>
  );
}

ManageUsers.propTypes = {
  token: PropTypes.string.isRequired,
  onGetUsers: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  users: state.users.users,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUsers: (token) => dispatch(getUsers(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
