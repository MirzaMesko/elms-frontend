/* eslint-disable no-underscore-dangle */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Ratings from '../Helpers/Rating';
import ReviewCard from './Review';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    border: 'none',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    paddingTop: '0.3rem',
  },
}));

function ReviewsContainer(props) {
  const { currentRating, reviews, onDelete, onEdit } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion style={{ border: 'none', boxShadow: 'none' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="spaceBetween">
            <Ratings name="read-only" currentRating={currentRating} />
            <Typography className={classes.heading}>Reviews ({reviews.length})</Typography>
          </div>
        </AccordionSummary>
        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
          {!reviews.length ? (
            <AccordionDetails className="centered">
              <Typography>Be the first to review this book.</Typography>
            </AccordionDetails>
          ) : (
            reviews.map((review) => (
              <AccordionDetails key={review._id}>
                <ReviewCard review={review} onDelete={onDelete} onEdit={onEdit} />
              </AccordionDetails>
            ))
          )}
        </div>
      </Accordion>
    </div>
  );
}

ReviewsContainer.defaultProps = {
  reviews: [],
};

ReviewsContainer.propTypes = {
  currentRating: PropTypes.number.isRequired,
  reviews: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ReviewsContainer;
