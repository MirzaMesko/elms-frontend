/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import StarsIcon from '@material-ui/icons/Stars';
import AddCommentIcon from '@material-ui/icons/AddComment';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
// @ts-ignore
import ReviewsContainer from '../Review/ReviewsContainer.tsx';
import editionPlaceholder from '../../utils/edition_placeholder2.png';
// @ts-ignore
import Loading from '../Helpers/Loading.tsx';
// @ts-ignore
import { LightTooltip } from '../Helpers/Tooltip.tsx';
// @ts-ignore
import type { Book, Review } from '../../types.ts';
// @ts-ignore
import { RootState } from '../../store.ts';

interface Props {
  open: boolean;
  close: () => void;
  showReviewDialog: () => void;
  showRatingDialog: () => void;
  loading: boolean;
  book: Book;
  bookRating: number;
  bookReviews: [Review];
  delReview: () => void;
  editReview: () => void;
}

const BookDetails: React.FC<Props> = ({
  open,
  close,
  showReviewDialog,
  showRatingDialog,
  loading,
  book,
  bookRating,
  bookReviews,
  delReview,
  editReview,
}: Props) => {
  const { users, authUser } = useSelector((state: RootState) => state.users);
  return (
    <Dialog onClose={close} aria-labelledby="customized-dialog-title" open={open} maxWidth="md">
      <div className="dialogueContainer">
        <img src={book.image || editionPlaceholder} alt="" className="largeImage" />
        <DialogContent>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="spaceBetween">
                <Typography gutterBottom variant="h4">
                  {book.title}
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <LightTooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title="Rate this book"
                  >
                    <IconButton aria-label="edit" color="primary" onClick={showRatingDialog}>
                      <StarsIcon fontSize="large" />
                    </IconButton>
                  </LightTooltip>
                  <LightTooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title="Add review for this book"
                  >
                    <IconButton aria-label="edit" color="primary" onClick={showReviewDialog}>
                      <AddCommentIcon fontSize="large" />
                    </IconButton>
                  </LightTooltip>
                </div>
              </div>

              <Typography gutterBottom variant="subtitle2">
                by {book.author}
              </Typography>
              <Typography gutterBottom>Category: {book.category}</Typography>
              <ReviewsContainer
                currentRating={bookRating}
                reviews={bookReviews}
                onDelete={delReview}
                onEdit={editReview}
                authUser={authUser.username}
                users={users}
              />
              <Typography gutterBottom variant="h6">
                About {book.title}
              </Typography>
              <Typography gutterBottom variant="body1">
                {book.description}
              </Typography>
            </>
          )}
        </DialogContent>
      </div>
      <DialogActions>
        <Button autoFocus onClick={close}>
          back
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookDetails;
