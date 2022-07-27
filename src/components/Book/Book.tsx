/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import StarsIcon from '@material-ui/icons/Stars';
import AddCommentIcon from '@material-ui/icons/AddComment';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import editionPlaceholder from '../../utils/edition_placeholder2.png';
// @ts-ignore
import Ratings from '../Helpers/Rating.tsx';
// @ts-ignore
import { LightTooltip } from '../Helpers/Tooltip.tsx';
// @ts-ignore
import CustomizedSnackbars from '../Helpers/Snackbar.tsx';
// @ts-ignore
import ReviewsContainer from '../Review/ReviewsContainer.tsx';
// @ts-ignore
import ReviewDialog from '../Dialogues/ReviewDialogue.tsx';
// @ts-ignore
import Loading from '../Helpers/Loading.tsx';
// @ts-ignore
import Error from '../Helpers/Error.tsx';
import {
  getBooks,
  addNewRating,
  addReview,
  updateReview,
  getBookById,
  // @ts-ignore
} from '../../actions/books.tsx';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { User, Book } from '../../types.ts';

interface OwnProps {
  open: boolean;
  handleClose: () => void;
  addNewRating: () => Promise<any>;
  onReviewBook: () => Promise<any>;
  getBookById: () => Promise<any>;
  addReview: () => Promise<any>;
  getBooks: () => Promise<any>;
  updateReview: () => Promise<any>;
  bookId: string;
  authUserRoles: string[];
  token: string;
  user: User;
  err: {
    error: boolean;
    message: string;
  };
}
type Props = RootState & AppDispatch & OwnProps;

const BookDetails: React.FC<OwnProps> = (props: Props) => {
  const {
    open,
    handleClose,
    bookId,
    token,
    authUserRoles,
    user,
    err,
    onReviewBook,
    onUpdateReview,
    onGetBookById,
    onRateBook,
  } = props;

  const [showRatingDialogue, setShowRatingDialogue] = React.useState(false);
  const [showReviewDialogue, setShowReviewDialogue] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [bookRating, setBookRating] = React.useState(0);
  const [bookReviews, setBookReviews] = React.useState<Book.reviews>([]);
  const [book, setBook] = React.useState<Book>({});
  const [error, setError] = React.useState<typeof err>();

  const showSnackbar = (show: boolean, status: string, message: string) => {
    setSeverity(status);
    setErrMessage(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 3000);
  };

  const calculateRating = (ratings: [{ userId: string; rating: number }]) => {
    const rating =
      ratings.map((r: { userId: string; rating: number }) => r.rating).reduce((a, b) => a + b, 0) /
      ratings.length;
    setBookRating(rating);
  };

  const onClose = () => {
    handleClose();
  };

  const rateBook = (ratingValue: number) => {
    setShowRatingDialogue(false);
    onRateBook(token, authUserRoles, book.title, user[0]._id, ratingValue).then(
      (response: { status: number; message: string }) => {
        if (response.status !== 200) {
          showSnackbar(true, 'error', response.message);
        }
        if (response.status === 200) {
          showSnackbar(true, 'success', 'Thank you for your rating.');
          const sum: Array<{ userId: string; rating: number }> | any = [
            ...book.rating,
            { userId: user[0]._id, rating: ratingValue },
          ];
          calculateRating(sum);
        }
      }
    );
  };

  const reviewBook = (review: string) => {
    setShowReviewDialogue(false);
    onReviewBook(token, authUserRoles, book.title, user[0]._id, review).then(
      (response: { status: number; message: string; data: any }) => {
        if (response.status !== 200) {
          showSnackbar(true, 'error', response.message);
        }
        if (response.status === 200) {
          showSnackbar(true, 'success', 'Thank you for your review.');
          setBookReviews([...bookReviews, response.data]);
        }
      }
    );
  };

  const delReview = (id: string) => {
    const afterDelete = bookReviews.filter(
      (r: { userId: string; rating: number; _id: string }) => r._id !== id
    );
    onUpdateReview(token, authUserRoles, book.title, afterDelete).then(
      (response: { status: number; message: string }) => {
        if (response.status !== 200) {
          showSnackbar(true, 'error', response.message);
        }
        if (response.status === 200) {
          showSnackbar(true, 'success', 'The review has been deleted.');
          setBookReviews(afterDelete);
        }
      }
    );
  };

  const editReview = (id: string, text: string) => {
    const afterEdit = bookReviews.map((r: { _id: string }) => {
      if (r._id === id) {
        return { ...r, review: text };
      }
      return r;
    });
    onUpdateReview(token, authUserRoles, book.title, afterEdit).then(
      (response: { status: number; message: string }) => {
        if (response.status !== 200) {
          showSnackbar(true, 'error', response.message);
        }
        if (response.status === 200) {
          showSnackbar(true, 'success', 'The review has been edited.');
          setBookReviews(afterEdit);
        }
      }
    );
  };

  const fetchBook = (id: string) => {
    setLoading(true);
    onGetBookById(token, id).then(
      (response: {
        status: number;
        message: any;
        data: { rating: [{ userId: string; rating: number }]; reviews: any };
      }) => {
        if (response.status !== 200) {
          setError({ error: true, message: response.message });
          setLoading(false);
        }
        if (response.status === 200) {
          setBook(response.data);
          if (response.data?.rating) {
            calculateRating(response.data.rating);
          } else {
            setBookRating(0);
          }
          setBookReviews(response.data.reviews);
          setLoading(false);
        }
      }
    );
  };

  React.useEffect(() => {
    if (bookId) {
      fetchBook(bookId);
    }
  }, [bookId]);

  if (error?.error) {
    return <Error message={error.message} />;
  }

  return (
    <>
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={errMessage} />
      <ReviewDialog
        show={showReviewDialogue}
        close={() => setShowReviewDialogue(false)}
        addReview={reviewBook}
        title="Compose new review"
      />
      <Dialog open={showRatingDialogue} onClose={() => setShowRatingDialogue(false)}>
        <DialogContent style={{ padding: '1rem 3rem' }}>
          <Ratings name="hover-feedback" onClick={rateBook} />
        </DialogContent>
      </Dialog>
      <Dialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md">
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
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => setShowRatingDialogue(true)}
                      >
                        <StarsIcon fontSize="large" />
                      </IconButton>
                    </LightTooltip>
                    <LightTooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      title="Add review for this book"
                    >
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => setShowReviewDialogue(true)}
                      >
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
          <Button autoFocus onClick={handleClose}>
            back
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  token: state.users.token,
  authUserRoles: state.users.authUser.roles,
  user: state.users.users.filter((u: User) => u.username === state.users.authUser.username),
  books: state.books.books,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onRateBook: (
    token: string,
    authUserRoles: { x: string },
    bookId: string,
    userId: string,
    newRating: number
  ) => dispatch(addNewRating(token, authUserRoles, bookId, userId, newRating)),
  onReviewBook: (
    token: string,
    authUserRoles: { x: string },
    bookId: string,
    userId: string,
    review: string
  ) => dispatch(addReview(token, authUserRoles, bookId, userId, review)),
  onUpdateReview: (token: string, authUserRoles: { x: string }, title: string, afterDelete: []) =>
    dispatch(updateReview(token, authUserRoles, title, afterDelete)),
  onGetBooks: (token: string) => dispatch(getBooks(token)),
  onGetBookById: (token: string, id: string) => dispatch(getBookById(token, id)),
});

export default connect<RootState, AppDispatch, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(BookDetails);
