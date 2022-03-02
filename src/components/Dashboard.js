import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import MainListItems from './ListItems';
import { getCurrentUser } from '../actions/users';
import BasicMenu from './Menu';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Elms
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
    color: 'white',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    minHeight: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    paddingLeft: '0px',
    paddingRight: '0px',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    '&:hover': { backgroundColor: '#abc' },
  },
  fixedHeight: {
    height: 150,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    color: 'red',
    textDecoration: 'none',
  },
  linkActive: {
    fontWeight: 'bold',
    color: 'red',
    textDecoration: 'none',
  },
}));

function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const toggleDrawerOpen = () => {
    setOpen(!open);
  };

  const wrapper = React.createRef();
  const { onLogout, children, roles, userAvatar, username } = props;
  const isAdmin = roles.includes('Admin') || roles.includes('Librarian');

  const logout = () => {
    onLogout();
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawerOpen}
            className={clsx(classes.menuButton)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            <RouterLink
              to="/"
              activeStyle={{
                fontWeight: 'bold',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Elms
            </RouterLink>
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={0} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <BasicMenu userAvatar={userAvatar} onLogout={logout} username={username} />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <List style={{ marginTop: '55px', alignItems: 'center', justifyContent: 'flex-end' }}>
          <MainListItems show={isAdmin} />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <div ref={wrapper}>{children}</div>
          <Box pt={28}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}

Dashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
  userAvatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

Dashboard.defaultProps = {
  roles: ['Member'],
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  userAvatar: state.users.authUser.image,
  username: state.users.authUser.username,
});

const mapDispatchToProps = (dispatch) => ({
  onGetCurrentUser: (token) => dispatch(getCurrentUser(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
