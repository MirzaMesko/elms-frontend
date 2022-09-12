import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  },
}));

const Loading: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root} data-testid="loading">
      <CircularProgress />
    </div>
  );
};

export default Loading;
