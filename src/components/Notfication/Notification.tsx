import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
// @ts-ignore
import type { NotificationType } from '../../types.ts';

interface OwnProps {
  notification: NotificationType;
  dismiss: (notification: NotificationType) => void;
}

const useStyles = makeStyles(() => ({
  notification: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    padding: '1rem 1rem',
    margin: '0 auto',
    borderBottom: '1px solid #CCC',
  },
  button: {
    padding: '0.1rem 1rem',
  },
}));

const Notification: React.FC<OwnProps> = (props: OwnProps) => {
  const { notification, dismiss } = props;
  const classes = useStyles();
  return (
    <div
      className={classes.notification}
      data-testid="notification"
      style={{ backgroundColor: notification.seen === 'false' ? '#FFF' : '#f5f5f5' }}
    >
      <Typography variant="h5" data-testid="notification-message">
        {notification.message}
      </Typography>
      <div className="spaceBetween">
        <Typography
          variant="subtitle1"
          style={{ color: '#AAA' }}
          data-testid="notification-timestamp"
        >
          {new Date(notification.timestamp).toDateString()},{' '}
          {new Date(notification.timestamp).getUTCHours()}:
          {new Date(notification.timestamp).getMinutes()}
        </Typography>
        <Button
          className={classes.button}
          variant="outlined"
          size="small"
          onClick={() => dismiss(notification)}
          data-testid="notification-dismiss-button"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
};

export default Notification;
