/* eslint-disable no-underscore-dangle */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    backgroundColor: '#f5f5f5',
    minHeight: '2rem',
    padding: '0.1rem',
    margin: '0 auto',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    padding: '1.2rem',
  },
  pos: {
    marginBottom: 12,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    marginBottom: '0.3rem',
  },
}));

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

function ReviewCard(props) {
  const { review, user } = props;
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <div className={classes.firstRow}>
          <Avatar
            className={classes.small}
            src={user.image}
            alt={user.username}
            {...stringAvatar(`${user.username} ${user.name}`)}
          >
            {user.username.slice(0, 1)}
          </Avatar>
          <Typography variant="subtitle1" color="textSecondary">
            {user.username}
          </Typography>
        </div>

        <Typography className={classes.title}>{review.review}</Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {review.timestamp}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}

ReviewCard.propTypes = {
  review: PropTypes.objectOf(PropTypes.string).isRequired,
  user: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state, props) => ({
  // eslint-disable-next-line no-underscore-dangle
  user: state.users.users.filter((u) => u._id === props.review.userId)[0],
});

export default connect(mapStateToProps)(ReviewCard);
