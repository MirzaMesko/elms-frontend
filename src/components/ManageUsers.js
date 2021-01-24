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
}));

function ManageUsers(props) {
  const { token, onGetUsers, users } = props;
  const classes = useStyles();
  const [openDialogue, setOpenDialogue] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [newUser, setNewUser] = React.useState('');

  const handleOpen = () => {
    setOpenDialogue(true);
  };

  const handleClose = () => {
    setOpenDialogue(false);
  };

  const showSnackbar = (show, status, message) => {
    setOpenSnackbar(show);
    setNewUser(message);
    setSeverity(status);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 6000);
  };

  React.useEffect(() => {
    onGetUsers(token, { offset: 0 });
  }, [token]);

  return (
    <Box>
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={newUser} />
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
      <UserTable users={users} onShowSnackbar={showSnackbar} />
      <FormDialogue
        show={openDialogue}
        close={handleClose}
        onGetUsers={onGetUsers}
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
};

const mapStateToProps = (state) => ({
  token: state.authUser.token,
  users: state.users,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUsers: (token, params) => dispatch(getUsers(token, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
