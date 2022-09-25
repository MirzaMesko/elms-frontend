/* eslint-disable no-underscore-dangle */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// @ts-ignore
import Ratings from '../Helpers/Rating.tsx';
// @ts-ignore
import ReviewCard from './Review.tsx';
// @ts-ignore
import { Review, User } from '../../types.ts';

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

interface Props {
  currentRating: number;
  reviews: [Review];
  onDelete: () => void;
  onEdit: () => void;
  authUser: string;
  users: [User];
}

const ReviewsContainer: React.FC<Props> = (props: Props) => {
  const { currentRating, reviews, onDelete, onEdit, authUser, users } = props;
  const classes = useStyles();

  return (
    <div className={classes.root} data-testid="reviews-container">
      <Accordion style={{ border: 'none', boxShadow: 'none' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          data-testid="expand-icon"
        >
          <div className="spaceBetween">
            <Ratings name="read-only" currentRating={currentRating} />
            <Typography className={classes.heading} data-testid="review-numb">
              Reviews ({reviews.length})
            </Typography>
          </div>
        </AccordionSummary>
        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
          {!reviews.length ? (
            <AccordionDetails className="centered" data-testid="accordion-details">
              <Typography data-testid="no-reviews-message">
                Be the first to review this book.
              </Typography>
            </AccordionDetails>
          ) : (
            reviews.map((review) => (
              <AccordionDetails key={review._id}>
                <ReviewCard
                  review={review}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  authUser={authUser}
                  users={users}
                />
              </AccordionDetails>
            ))
          )}
        </div>
      </Accordion>
    </div>
  );
};

export default ReviewsContainer;
