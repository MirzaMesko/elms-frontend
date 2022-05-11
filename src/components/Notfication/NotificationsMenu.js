import * as React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  notification: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
  },
}));

function NotificationsMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { notifications, username, badgeContent, resetBadge } = props;
  const classes = useStyles();

  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    resetBadge();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToNotifications = () => {
    history.push(`/users/settings/${username}/notifications`);
    handleClose();
  };

  return (
    <div>
      <IconButton
        color="inherit"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={badgeContent} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        style={{ maxWidth: '50%' }}
      >
        {!notifications?.length ? (
          <MenuItem onClick={handleClose}>
            <Typography style={{ marginLeft: '1rem' }}>No new notifications.</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem onClick={goToNotifications} key={notification.timestamp}>
              <div className={classes.notification}>
                <Typography>
                  {notification.message.slice(0, 70)}
                  {notification.message.length > 70 && '...'}
                </Typography>
                <Typography variant="subtitle1" style={{ color: '#AAA' }}>
                  {new Date(notification.timestamp).toDateString()},{' '}
                  {new Date(notification.timestamp).getUTCHours()}:
                  {new Date(notification.timestamp).getMinutes()}
                </Typography>
              </div>
            </MenuItem>
          ))
        )}
        <Divider />
        <MenuItem onClick={goToNotifications}>
          <ListItemText className="centered">See all notifications</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}

NotificationsMenu.defaultProps = {
  notifications: [],
};

NotificationsMenu.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  username: PropTypes.string.isRequired,
  badgeContent: PropTypes.number.isRequired,
  resetBadge: PropTypes.func.isRequired,
};

export default NotificationsMenu;
