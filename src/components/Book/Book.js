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
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import editionPlaceholder from '../../utils/edition_placeholder2.png';
import Ratings from '../Helpers/Rating';
import { LightTooltip } from '../Helpers/Tooltip';
import CustomizedSnackbars from '../Helpers/Snackbar';
import ReviewsContainer from '../Review/ReviewsContainer';
import ReviewDialog from '../Dialogues/ReviewDialogue';
import { getBooks, addNewRating, addReview, updateReview } from '../../actions/books';

const useStyles = makeStyles(() => ({
  image: {
    maxWidth: '50%',
    display: 'inline-flex',
  },
  container: {
    display: 'flex',
    maxHeight: '500px',
    padding: '1rem',
  },
}));

function BookDetails(props) {
  const {
    open,
    handleClose,
    book,
    onRateBook,
    token,
    authUserRoles,
    user,
    onGetBooks,
    onReviewBook,
  } = props;
  const [showRatingDialogue, setShowRatingDialogue] = React.useState(false);
  const [showReviewDialogue, setShowReviewDialogue] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [bookRating, setBookRating] = React.useState(0);
  const [bookReviews, setBookReviews] = React.useState(book.reviews);

  const dispatch = useDispatch();
  const classes = useStyles();

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

  const rateBook = (ratingValue) => {
    setShowRatingDialogue(false);
    onRateBook(token, authUserRoles, book._id, user[0]._id, ratingValue).then((response) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(true, 'success', 'Thank you for your rating.');
        calculateRating(response.data.rating);
        onGetBooks(token);
      }
    });
  };

  const reviewBook = (review) => {
    setShowReviewDialogue(false);
    onReviewBook(token, authUserRoles, book._id, user[0]._id, review).then((response) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(true, 'success', 'Thank you for your review.');
        setBookReviews(response.data.reviews);
        onGetBooks(token);
      }
    });
  };

  const delReview = (id) => {
    const afterDelete = bookReviews.filter((r) => r._id !== id);
    dispatch(updateReview(token, authUserRoles, book._id, afterDelete)).then((response) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(true, 'success', 'The review has been deleted.');
        setBookReviews(afterDelete);
        onGetBooks(token);
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
    dispatch(updateReview(token, authUserRoles, book._id, afterEdit)).then((response) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(true, 'success', 'The review has been edited.');
        setBookReviews(afterEdit);
        onGetBooks(token);
      }
    });
  };

  React.useEffect(() => {
    if (book?.rating) {
      calculateRating(book.rating);
    } else {
      setBookRating(0);
    }
    setBookReviews(book.reviews);
  }, [book.rating, book.reviews]);

  return (
    <>
      <Dialog open={showRatingDialogue} onClose={() => setShowRatingDialogue(false)}>
        <CustomizedSnackbars show={openSnackbar} severity={severity} message={errMessage} />
        <ReviewDialog
          show={showReviewDialogue}
          close={() => setShowReviewDialogue(false)}
          addReview={reviewBook}
        />
        <DialogContent style={{ padding: '1rem 3rem' }}>
          <Ratings name="hover-feedback" onClick={rateBook} />
        </DialogContent>
      </Dialog>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
      >
        <div className={classes.container}>
          <img src={book.image || editionPlaceholder} alt="" className={classes.image} />
          <DialogContent>
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
                    onClick={() => setShowRatingDialogue(true)}
                    color="primary"
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
                    onClick={() => setShowReviewDialogue(true)}
                    color="primary"
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
  onGetBooks: PropTypes.func.isRequired,
  book: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.string,
      category: PropTypes.string,
      description: PropTypes.string,
      owedBy: PropTypes.arrayOf(PropTypes.string),
      reviews: PropTypes.arrayOf(PropTypes.string),
      rating: PropTypes.number,
      author: PropTypes.string,
      _id: PropTypes.string,
    })
  ).isRequired,
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
