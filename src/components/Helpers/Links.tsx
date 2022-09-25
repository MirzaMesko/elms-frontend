/* eslint-disable no-underscore-dangle */
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
// @ts-ignore
import Card from './Card.tsx';
import background from '../../utils/row-of-books.png';
// @ts-ignore
import type { RootState } from '../../store.ts';
// @ts-ignore
import type { User, Book } from '../../types.ts';

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
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  divider: {
    height: '150px',
    backgroundImage: `url(${background})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'repeat',
    width: '100%',
    padding: '20px',
  },
}));

const Links: React.FC = () => {
  const classes = useStyles();

  const { books } = useSelector((state: RootState) => state.books);
  const { authUser, users } = useSelector((state: RootState) => state.users);
  const { roles } = authUser;

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <div className={classes.divider}>
      <Typography className={classes.title}>Hello {authUser.username}</Typography>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          md={4}
          style={{
            display: roles.includes('Admin') ? 'flex' : 'none',
            marginLeft: '16px',
            marginTop: '30px',
          }}
        >
          <RouterLink to="/manage/users" className={classes.link && classes.linkActive}>
            <Paper className={fixedHeightPaper}>
              <Card title="Manage Users " text="Add, edit or remove users from Elms" />
              <AvatarGroup max={8}>
                {users.map((u: User) => (
                  <Avatar src={u.image} key={u._id}>
                    {u.username.slice(0, 1)}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Paper>
          </RouterLink>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          style={{
            display: roles.includes('Librarian') ? 'flex' : 'none',
            marginLeft: '16px',
            marginTop: '30px',
          }}
        >
          <RouterLink to="/manage/books" className={classes.link && classes.linkActive}>
            <Paper className={fixedHeightPaper}>
              <Card title="Manage Books " text="Add, edit or remove books from Elms" />
              <AvatarGroup max={8}>
                {books.map((book: Book) => (
                  <Avatar src={book.image} key={book._id}>
                    {book.title.slice(0, 1)}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Paper>
          </RouterLink>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          style={{
            display:
              !roles.includes('Admin') && !Object.values(roles).includes('Librarian')
                ? 'flex'
                : 'none',
            marginLeft: '16px',
            marginTop: '30px',
          }}
        >
          <RouterLink to="/manage/books" className={classes.link && classes.linkActive}>
            <Paper className={fixedHeightPaper}>
              <Card title="Search books & more " text="Find the book you're looking for" />
              <AvatarGroup max={8}>
                {books.map((book: Book) => (
                  <Avatar src={book.image} key={book._id}>
                    {book.title.slice(0, 1)}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Paper>
          </RouterLink>
        </Grid>
      </Grid>
    </div>
  );
};

export default Links;
