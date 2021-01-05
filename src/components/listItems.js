import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GroupIcon from '@material-ui/icons/Group';
import React from 'react';
import { Link } from 'react-router-dom';

const mainListItems = (
  <div>
    <ListItem button component={Link} to="/manage/users">
      <ListItemIcon>
        <GroupIcon />
      </ListItemIcon>
      <ListItemText primary="Manage Users" />
    </ListItem>
  </div>
);

export default mainListItems;
