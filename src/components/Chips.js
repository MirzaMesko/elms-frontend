import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function Chips(props) {
  const classes = useStyles();
  const { label, color } = props;

  return (
    <div className={classes.root}>
      <Chip label={label} color={color} />
    </div>
  );
}

Chips.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};
