import * as React from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
// @ts-ignore
import type { NotificationType } from '../../types.ts';

const useStyles = makeStyles(() => ({
  notification: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
  },
}));

interface OwnProps {
  notifications: Array<NotificationType>;
  username: string;
  badgeContent: number;
  resetBadge: () => void;
  history: any;
}

const NotificationsMenu: React.FC<OwnProps> = (props: OwnProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { notifications, username, badgeContent, resetBadge, history } = props;
  const classes = useStyles();

  const handleClick = (event: { currentTarget: any }) => {
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
    <div data-testid="notifications-menu">
      <IconButton
        color="inherit"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        data-testid="notifications-icon"
      >
        <Badge data-testid="notifications-badge" badgeContent={badgeContent} color="secondary">
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
        data-testid="menu"
      >
        {!notifications?.length ? (
          <MenuItem onClick={handleClose}>
            <Typography style={{ marginLeft: '1rem' }} data-testid="no-notifications-message">
              No new notifications.
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              onClick={goToNotifications}
              key={notification.timestamp}
              data-testid={`notification-${notification.message}`}
            >
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
        <MenuItem onClick={goToNotifications} data-testid="see-notifications-link">
          <ListItemText className="centered">See all notifications</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default NotificationsMenu;
