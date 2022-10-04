import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, { useState } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { FormControl, OutlinedInput, InputLabel } from '@material-ui/core';
// @ts-ignore
import { login, dismissAlert } from '../../actions/auth.tsx';
// @ts-ignore
import Alert from '../Helpers/Alert.tsx';
import logo from '../../utils/logo.png';
import Copyright from '../Helpers/Copyright';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';

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

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(true);

  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const { error, message } = useSelector((state: RootState) => state.users.err);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const logIn = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Alert
        show={error}
        title="Error"
        message={message}
        onClose={() => dispatch(dismissAlert())}
      />
      <CssBaseline />
      <div className={classes.paper} data-testid="login-page">
        <img src={logo} alt="logo" style={{ marginBottom: '2rem' }} />
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" data-testid="log-in-text">
          Log in
        </Typography>
        <form className={classes.form} data-testid="log-in-form">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            inputProps={{ 'data-testid': 'username-input' }}
            label="Username"
            value={username}
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
            >
              Password
            </InputLabel>
            <OutlinedInput
              name="password"
              value={password}
              type={showPassword ? 'text' : 'password'}
              id="outlined-adornment-password"
              onChange={handlePasswordChange}
              inputProps={{ 'data-testid': 'password-input' }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOff />}
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
            data-testid="login-button"
          >
            Login
          </Button>
        </form>
        <p data-testid="signup-message">
          Don&#39;t have an account?{' '}
          <a href="/register" data-testid="signup-link">
            Sign up
          </a>
        </p>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Login;
