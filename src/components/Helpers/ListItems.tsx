import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import GroupIcon from '@material-ui/icons/Group';
import Badge from '@material-ui/core/Badge';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import WarningIcon from '@material-ui/icons/Warning';
import React from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
// @ts-ignore
import { RootState } from '../../store.ts';
// @ts-ignore
import type { Book } from '../../types.ts';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

interface OwnProps {
  show: boolean;
  history: any;
  books: [Book];
}

type Props = OwnProps & RootState;

const MainListItems: React.FC<OwnProps> = (props: Props) => {
  const { show, books } = props;
  const history = useHistory();

  const classes = useStyles();

  const display = show ? 'flex' : 'none';
  return (
    <div style={{ display }}>
      <div className={classes.root}>
        <ListItem
          button
          component={Link}
          data-testid="manage-users"
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
          data-testid="manage-books"
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
          data-testid="manage-overdue-books"
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

const mapStateToProps = (state: RootState) => ({
  books: state.books.books.filter(
    (book: Book) => new Date(book.owedBy?.dueDate).getTime() < new Date().getTime()
  ),
});

export default connect<RootState, OwnProps>(mapStateToProps)(MainListItems);
