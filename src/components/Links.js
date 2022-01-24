import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import Card from './Card';

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

export default function Links(props) {
  const { roles, user } = props;
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <div style={{ height: '150px', backgroundColor: 'lightBlue', width: '100%', padding: '20px' }}>
      <Typography className={classes.title}>Hello {user}</Typography>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid
          item
          xs={12}
          md={4}
          style={{
            display:
              Object.values(roles).includes('Admin') || Object.values(roles).includes('Librarian')
                ? 'flex'
                : 'none',
            marginLeft: '16px',
            marginTop: '30px',
          }}
        >
          <RouterLink to="/manage/users" className={classes.link && classes.linkActive}>
            <Paper className={fixedHeightPaper}>
              <Card title="Manage Users " text="Add, edit or remove users from Elms" />
            </Paper>
          </RouterLink>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          style={{
            display:
              Object.values(roles).includes('Admin') || Object.values(roles).includes('Librarian')
                ? 'flex'
                : 'none',
            marginLeft: '16px',
            marginTop: '30px',
          }}
        >
          <RouterLink to="/manage/books" className={classes.link && classes.linkActive}>
            <Paper className={fixedHeightPaper}>
              <Card title="Manage Books " text="Add, edit or remove books from Elms" />
            </Paper>
          </RouterLink>
        </Grid>
      </Grid>
    </div>
  );
}

Links.propTypes = {
  roles: PropTypes.objectOf(PropTypes.string).isRequired,
  user: PropTypes.string.isRequired,
};
