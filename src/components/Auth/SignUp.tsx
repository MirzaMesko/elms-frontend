import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import validator from 'validator';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import TextField from '@material-ui/core/TextField';
// import { NavLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { FormControl, OutlinedInput, FormHelperText, InputLabel } from '@material-ui/core';
// @ts-ignore
import { login, register, dismissAlert } from '../../actions/auth.tsx';
// @ts-ignore
import Alert from '../Helpers/Alert.tsx';
// @ts-ignore
import CustomizedSnackbars from '../Helpers/Snackbar.tsx';
import logo from '../../utils/logo.png';
import Copyright from '../Helpers/Copyright';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      marginTop: '150px',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  warning: {
    backgroundColor: 'pink',
    padding: '0.7rem',
    display: 'flex',
    justifyContent: 'center',
  },
}));

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailWarning, setEmailWarning] = useState('');
  const [passwordWarning, setPasswordlWarning] = useState('');
  const [usernameWarning, setUsernameWarning] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');

  const classes = useStyles();
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const { error, message } = useSelector((state: RootState) => state.users.err);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const emailValidator = () => {
    setEmailWarning('');
    const valid = validator.isEmail(email);
    if (!email.length) {
      setEmailWarning('Email Address must not be empty');
    } else if (!valid) {
      setEmailWarning('Email Address is not valid!');
    }
  };

  const passwordValidator = () => {
    setPasswordlWarning('');
    const valid = validator.isStrongPassword(password);
    if (!valid) {
      setPasswordlWarning(
        'Your password must contain at least 8 characters, 1 capital letter, 1 number and 1 symbol.'
      );
    }
  };

  const showSnackbar = (show: boolean, status: string, msg: string) => {
    setSeverity(status);
    setErrMessage(msg);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 6000);
  };

  const signUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!email.length) {
      setEmailWarning('Email Address must not be empty!');
      return;
    }
    if (!username.length) {
      setUsernameWarning('Username must not be empty!');
      return;
    }
    if (!password.length) {
      setPasswordlWarning('Password must not be empty!');
      return;
    }
    if (validator.isEmail(email) && username.length && validator.isStrongPassword(password)) {
      dispatch(register(email, username, password)).then((response: any) => {
        if (response.status !== 201) {
          showSnackbar(true, 'error', response.message);
          return;
        }
        if (response.status === 201) {
          dispatch(login(username, password)).then(() => {
            history.push('/');
          });
        }
      });
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Alert
        show={error}
        title="Error"
        message={message}
        onClose={() => dispatch(dismissAlert())}
      />
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={errMessage} />
      <CssBaseline />
      <div className={classes.paper} data-testid="signup-page">
        <img src={logo} alt="logo" style={{ margin: '0 1rem', paddingTop: '50px' }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 1rem',
          }}
        >
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" data-testid="sign-up-text">
            Sign up
          </Typography>
          <form className={classes.form} data-testid="sign-up-form">
            <TextField
              variant="outlined"
              margin="normal"
              inputProps={{ 'data-testid': 'email-input' }}
              required
              error={emailWarning.length > 2}
              helperText={emailWarning}
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoFocus
              onBlur={emailValidator}
              onChange={handleEmailChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              inputProps={{ 'data-testid': 'username-input' }}
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              error={usernameWarning.length > 2}
              helperText={usernameWarning}
              onBlur={() =>
                !username.length
                  ? setUsernameWarning('Username must not be empty')
                  : setUsernameWarning('')
              }
              onChange={handleUsernameChange}
            />
            <FormControl fullWidth>
              <InputLabel
                htmlFor="outlined-adornment-password"
                required
                margin="dense"
                variant="outlined"
              >
                Password
              </InputLabel>
              <OutlinedInput
                name="password"
                inputProps={{ 'data-testid': 'password-input' }}
                type={showPassword ? 'text' : 'password'}
                id="outlined-adornment-password"
                onBlur={passwordValidator}
                value={password}
                error={passwordWarning.length > 2}
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
              <FormHelperText id="my-helper-text" error={passwordWarning.length > 2}>
                {passwordWarning}
              </FormHelperText>
            </FormControl>

            <Button
              type="submit"
              data-testid="signup-button"
              fullWidth
              variant="contained"
              disabled={!username || !password || !email}
              color="primary"
              className={classes.submit}
              onClick={signUp}
            >
              Sign Up
            </Button>
          </form>
          <p data-testid="login-message">
            Have an account?{' '}
            <a href="/login" data-testid="login-link">
              Log in now.
            </a>
          </p>
        </div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Register;
