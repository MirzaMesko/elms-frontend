import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import CssBaseline from '@material-ui/core/CssBaseline';
import { history as historyPropTypes } from 'history-prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { FormControl, OutlinedInput, InputLabel } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { login, dismissAlert } from '../../actions/auth';
import Alert from '../Helpers/Alert';
import logo from '../../utils/logo.png';
import Copyright from '../Helpers/Copyright';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(true);
  const classes = useStyles();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { error, history, message, onDismissAlert } = props;

  const logIn = (event) => {
    event.preventDefault();
    props.onLogin(username, password).then(() => {
      history.push('/');
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Alert show={error} title="Error" message={message} onClose={onDismissAlert} />
      <CssBaseline />
      <div className={classes.paper}>
        <img src={logo} alt="logo" style={{ marginBottom: '2rem' }} />
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <form className={classes.form} validate="true">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={handleUsernameChange}
          />
          <FormControl fullWidth>
            <InputLabel
              htmlFor="outlined-adornment-password"
              required
              margin="dense"
              variant="outlined"
              autoComplete="current-password"
            >
              Password
            </InputLabel>
            <OutlinedInput
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="outlined-adornment-password"
              onChange={handlePasswordChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            disabled={!username || !password}
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={logIn}
          >
            Login
          </Button>
        </form>
        <p>
          Don&#39;t have an account? <NavLink to="/register">Sign up</NavLink>
        </p>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onDismissAlert: PropTypes.func.isRequired,
  error: PropTypes.bool,
  message: PropTypes.string,
  history: PropTypes.shape(historyPropTypes).isRequired,
};

Login.defaultProps = {
  error: false,
  message: '',
};

const mapStateToProps = (state) => ({
  error: state.users.err.error,
  message: state.users.err.message,
});

const mapDispatchToProps = (dispatch) => ({
  onLogin: (username, password) => dispatch(login(username, password)),
  onDismissAlert: () => dispatch(dismissAlert()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
