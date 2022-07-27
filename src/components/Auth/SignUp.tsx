import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import validator from 'validator';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import TextField from '@material-ui/core/TextField';
import { NavLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { FormControl, OutlinedInput, FormHelperText, InputLabel } from '@material-ui/core';
// @ts-ignore
import { login, register, dismissAlert } from '../../actions/auth.tsx';
import Alert from '../Helpers/Alert';
// @ts-ignore
import CustomizedSnackbars from '../Helpers/Snackbar.tsx';
import logo from '../../utils/logo.png';
import Copyright from '../Helpers/Copyright';
// @ts-ignore
import { AppDispatch } from '../../store.ts';

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
  warning: {
    backgroundColor: 'pink',
    padding: '0.7rem',
    display: 'flex',
    justifyContent: 'center',
  },
}));

interface OwnProps {
  onLogin: () => void;
  onDismissAlert: () => void;
  error: any;
  message: any;
  history: any;
}

type Props = OwnProps & AppDispatch;

const Register: React.FC<OwnProps> = (props: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailWarning, setEmailWarning] = useState('');
  const [passwordWarning, setPasswordlWarning] = useState('');
  const [usernameWarning, setUsernameWarning] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');

  const classes = useStyles();

  const { error, history, message, onDismissAlert, onLogin } = props;

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
      props.onRegister(email, username, password).then((response: any) => {
        if (response.status !== 201) {
          showSnackbar(true, 'error', response.message);
          return;
        }
        if (response.status === 201) {
          onLogin(username, password).then(() => {
            history.push('/');
          });
        }
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Alert show={error} title="Error" message={message} onClose={onDismissAlert} />
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={errMessage} />
      <CssBaseline />
      <div className={classes.paper}>
        <img src={logo} alt="logo" style={{ marginBottom: '2rem' }} />
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
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
        <p>
          Have an account? <NavLink to="/login">Log in now.</NavLink>
        </p>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onLogin: (username: string, password: string) => dispatch(login(username, password)),
  onRegister: (email: string, username: string, password: string) =>
    dispatch(register(email, username, password)),
  onDismissAlert: () => dispatch(dismissAlert()),
});

export default connect<AppDispatch>(null, mapDispatchToProps)(Register);
