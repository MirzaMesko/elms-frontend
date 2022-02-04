import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import CustomizedSnackbars from './Snackbar';
import FormDialogue from './FormDialogue';
import UserTable from './UserTable';
import { getUsers } from '../actions/users';

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
  const [roleFilter, setRoleFilter] = React.useState('');

  const isAdmin = Object.values(roles).includes('Admin');

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
            Search users by
          </label>
        </form>
        <form className={classes.search} onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search" className={classes.label}>
            <select
              className={classes.option}
              selected={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="username">username</option>
              <option value="email">email</option>
              <option value="name">name</option>
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
                <option value="All">all users</option>
                <option value="Admin">Admins</option>
                <option value="Member">Members</option>
                <option value="Librarian">Librarians</option>
              </select>
            </label>
          </form>
        </div>
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
  roles: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  users: state.users.users,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUsers: (token) => dispatch(getUsers(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
