import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import GroupIcon from '@material-ui/icons/Group';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { history as historyPropTypes } from 'history-prop-types';
import PropTypes from 'prop-types';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const MainListItems = (props) => {
  const { show, history } = props;

  const classes = useStyles();

  const display = show ? 'flex' : 'none';
  return (
    <div style={{ display }}>
      <div className={classes.root}>
        <ListItem
          button
          component={Link}
          to="/manage/users"
          selected={history.location.pathname === '/manage/users'}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Users" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/manage/books"
          selected={history.location.pathname === '/manage/books'}
        >
          <ListItemIcon>
            <MenuBookIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Books" />
        </ListItem>
      </div>
    </div>
  );
};

MainListItems.propTypes = {
  show: PropTypes.bool.isRequired,
  history: PropTypes.shape(historyPropTypes).isRequired,
};

export default withRouter(MainListItems);
