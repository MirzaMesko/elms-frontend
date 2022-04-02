import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import GroupIcon from '@material-ui/icons/Group';
import Badge from '@material-ui/core/Badge';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import WarningIcon from '@material-ui/icons/Warning';
import { history as historyPropTypes } from 'history-prop-types';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const MainListItems = (props) => {
  const { show, history, books } = props;

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
        <ListItem
          button
          component={Link}
          to="/manage/overdue books"
          selected={history.location.pathname === '/manage/overdue books'}
        >
          <ListItemIcon>
            <Badge
              badgeContent={books.length}
              color="secondary"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <WarningIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Manage Overdues" />
        </ListItem>
      </div>
    </div>
  );
};

MainListItems.propTypes = {
  show: PropTypes.bool.isRequired,
  history: PropTypes.shape(historyPropTypes).isRequired,
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = (state) => ({
  books: state.books.books.filter(
    (book) => new Date(book.owedBy?.dueDate).getTime() < new Date().getTime()
  ),
});

export default connect(mapStateToProps)(withRouter(MainListItems));
