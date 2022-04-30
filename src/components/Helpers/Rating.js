import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
  },
});

function Ratings(props) {
  const { name, currentRating, onClick } = props;
  const [value, setValue] = React.useState(4);
  const [hover, setHover] = React.useState(-1);
  const classes = useStyles();

  const handleRate = (newValue) => {
    setValue(newValue);
    onClick(newValue);
  };

  return (
    <div>
      {name === 'read-only' ? (
        <div className={classes.root}>
          <Rating name="read-only" value={currentRating} readOnly precision={0.5} />
          {currentRating !== null && (
            <Box ml={2}>{labels[hover !== -1 ? hover : currentRating]}</Box>
          )}
        </div>
      ) : (
        <div className={classes.root}>
          <Rating
            value={value}
            size="large"
            name={name}
            precision={0.5}
            onChange={(event, newValue) => {
              handleRate(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
          />
          {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
        </div>
      )}
    </div>
  );
}

Ratings.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  currentRating: PropTypes.number,
};

Ratings.defaultProps = {
  currentRating: 0,
};

export default Ratings;
