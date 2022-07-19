import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
// import PropTypes from 'prop-types';
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import MainListItems from './Helpers/ListItems';
// @ts-ignore
import BasicMenu from './Menu.tsx';
// @ts-ignore
import NotificationsMenu from './Notfication/NotificationsMenu.tsx';
import Copyright from './Helpers/Copyright';
// @ts-ignore
import { RootState } from '../store.ts';
// @ts-ignore
import type { User } from '../types.ts';

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

// type User = {
//   _id: string;
//   username: string;
//   roles: { x: string };
//   email: string;
//   password: string;
//   name: string;
//   bio?: string;
//   image: string;
//   owedBooks?: [];
//   readingHistory?: [];
//   notifications?: [
//     {
//       timestamp: string;
//       message: string;
//       seen: string;
//     }
//   ];
//   refreshToken: string;
// };

interface OwnProps {
  onLogout: () => void;
  children: React.Component<any, any>;
  roles: string[];
  userAvatar: string;
  username: string;
  users: [User];
  NotificationType: {
    timestamp: string;
    message: string;
    seen: string;
  };
  wrapperType: React.RefObject<HTMLDivElement>;
}

const Dashboard: React.FC<OwnProps> = (props: OwnProps) => {
  const {
    onLogout,
    children,
    roles,
    userAvatar,
    username,
    users,
    NotificationType,
    wrapperType,
  } = props;

  const classes = useStyles();
  const [open, setOpen] = React.useState<boolean>(false);
  const [newNotifications, setNewNotifications] = React.useState<any>([]);
  const toggleDrawerOpen = () => {
    setOpen(!open);
  };

  const wrapper: typeof wrapperType = React.createRef();
  const isAdmin: boolean = roles.includes('Admin') || roles.includes('Librarian');

  const currentUser: User | undefined = users.filter((u: User) => u.username === username)[0];

  const logout = () => {
    onLogout();
  };

  const seeNotifications = () => {
    setNewNotifications([]);
  };

  React.useEffect(() => {
    if (currentUser && currentUser.notifications) {
      const notSeenNotifications: any = currentUser?.notifications.filter(
        (n: typeof NotificationType) => n.seen === 'false'
      );
      if (notSeenNotifications?.length > 0) {
        setNewNotifications(notSeenNotifications);
      }
    }
  }, [users]);

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
          <NotificationsMenu
            badgeContent={newNotifications?.length || 0}
            notifications={currentUser?.notifications
              ?.slice(currentUser?.notifications.length - 3)
              .reverse()}
            username={username}
            resetBadge={seeNotifications}
          />
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
          <Box pt={18}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  token: state.users.token,
  userAvatar: state.users.authUser.image,
  username: state.users.authUser.username,
  users: state.users.users,
});

export default connect<RootState>(mapStateToProps)(Dashboard);
