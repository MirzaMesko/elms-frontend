import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const labels = ['Useless', 'Poor', 'Ok', 'Good', 'Excellent'];

const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
  },
});

interface Props {
  name: string;
  onClick: (value: number | null) => void;
  currentRating: number;
}

const Ratings: React.FC<Props> = ({ name, currentRating, onClick }: Props) => {
  const [value, setValue] = React.useState<number | null>(0);
  const [hover, setHover] = React.useState(-1);
  const classes = useStyles();

  const r: number = Math.round(currentRating) - 1;

  const handleRate = (newValue: number | null) => {
    setValue(newValue);
    onClick(newValue);
  };

  return (
    <div data-testid="rating">
      {name === 'read-only' ? (
        <div className={classes.root}>
          <Rating name="read-only" value={currentRating} readOnly precision={1} />
          {currentRating !== null && <Box ml={2}>{labels[r]}</Box>}
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
          {value !== null && <Box ml={2}>{hover !== -1 ? hover : value}</Box>}
        </div>
      )}
    </div>
  );
};

export default Ratings;
