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

function ManageUsers(props) {
  const { token, onGetUsers, users, roles } = props;
  const classes = useStyles();
  const [openDialogue, setOpenDialogue] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [newUser, setNewUser] = React.useState('');
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
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filteredResults.reverse());
  }, [search]);

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
            Search users
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
