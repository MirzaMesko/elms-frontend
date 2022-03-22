import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

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
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const Notification = (props) => {
  const { notification, dismiss } = props;
  const classes = useStyles();
  return (
    <div
      className={classes.notification}
      style={{ backgroundColor: notification.seen === 'false' ? '#FFF' : '#f5f5f5' }}
    >
      <Typography variant="h5">{notification.message}</Typography>
      <div className={classes.firstRow}>
        <Typography variant="subtitle1" style={{ color: '#AAA' }}>
          {new Date(notification.timestamp).toDateString()},{' '}
          {new Date(notification.timestamp).getUTCHours()}:
          {new Date(notification.timestamp).getMinutes()}
        </Typography>
        <Button
          className={classes.button}
          variant="outlined"
          size="small"
          onClick={() => dismiss(notification)}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
};

Notification.propTypes = {
  notification: PropTypes.objectOf(PropTypes.shape({}), PropTypes.string).isRequired,
  dismiss: PropTypes.func.isRequired,
};

export default Notification;
