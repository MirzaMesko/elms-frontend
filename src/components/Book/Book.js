/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
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
import Ratings from '../Helpers/Rating';
import { LightTooltip } from '../Helpers/Tooltip';
import CustomizedSnackbars from '../Helpers/Snackbar';
import ReviewsContainer from '../Review/ReviewsContainer';
import ReviewDialog from '../Dialogues/ReviewDialogue';
import Loading from '../Helpers/Loading';
import Error from '../Helpers/Error';
import { getBooks, addNewRating, addReview, updateReview, getBookById } from '../../actions/books';

function BookDetails(props) {
  const { open, handleClose, bookId, onRateBook, token, authUserRoles, user, onReviewBook } = props;
  const [showRatingDialogue, setShowRatingDialogue] = React.useState(false);
  const [showReviewDialogue, setShowReviewDialogue] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [bookRating, setBookRating] = React.useState(0);
  const [bookReviews, setBookReviews] = React.useState({});
  const [book, setBook] = React.useState({});
  const [error, setError] = React.useState({});

  const dispatch = useDispatch();

  const showSnackbar = (show, status, message) => {
    setSeverity(status);
    setErrMessage(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 3000);
  };

  const calculateRating = (ratings) => {
    const rating = ratings.map((r) => r.rating).reduce((a, b) => a + b, 0) / ratings.length;
    setBookRating(rating);
  };

  const onClose = () => {
    handleClose();
  };

  const rateBook = (ratingValue) => {
    setShowRatingDialogue(false);
    onRateBook(token, authUserRoles, book.title, user[0]._id, ratingValue).then((response) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(true, 'success', 'Thank you for your rating.');
        const sum = [...book.rating, { userId: user[0]._id, rating: ratingValue }];
        calculateRating(sum);
      }
    });
  };

  const reviewBook = (review) => {
    setShowReviewDialogue(false);
    onReviewBook(token, authUserRoles, book.title, user[0]._id, review).then((response) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(true, 'success', 'Thank you for your review.');
        setBookReviews([...bookReviews, response.data]);
      }
    });
  };

  const delReview = (id) => {
    const afterDelete = bookReviews.filter((r) => r._id !== id);
    dispatch(updateReview(token, authUserRoles, book.title, afterDelete)).then((response) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(true, 'success', 'The review has been deleted.');
        setBookReviews(afterDelete);
      }
    });
  };

  const editReview = (id, text) => {
    const afterEdit = bookReviews.map((r) => {
      if (r._id === id) {
        return { ...r, review: text };
      }
      return r;
    });
    dispatch(updateReview(token, authUserRoles, book.title, afterEdit)).then((response) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(true, 'success', 'The review has been edited.');
        setBookReviews(afterEdit);
      }
    });
  };

  const fetchBook = (id) => {
    setLoading(true);
    dispatch(getBookById(token, id)).then((response) => {
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
    });
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
}

BookDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onRateBook: PropTypes.func.isRequired,
  onReviewBook: PropTypes.func.isRequired,
  bookId: PropTypes.string.isRequired,
  authUserRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      roles: PropTypes.objectOf(PropTypes.string),
      _id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  authUserRoles: state.users.authUser.roles,
  user: state.users.users.filter((u) => u.username === state.users.authUser.username),
  books: state.books.books,
});

const mapDispatchToProps = (dispatch) => ({
  onRateBook: (token, authUserRoles, bookId, userId, newRating) =>
    dispatch(addNewRating(token, authUserRoles, bookId, userId, newRating)),
  onReviewBook: (token, authUserRoles, bookId, userId, review) =>
    dispatch(addReview(token, authUserRoles, bookId, userId, review)),
  onGetBooks: (token) => dispatch(getBooks(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookDetails);
