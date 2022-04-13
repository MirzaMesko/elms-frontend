/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import StarsIcon from '@material-ui/icons/Stars';
import AddCommentIcon from '@material-ui/icons/AddComment';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import editionPlaceholder from '../utils/edition_placeholder2.png';
import Ratings from './Rating';
import CustomizedSnackbars from './Snackbar';
import ReviewsContainer from './ReviewsContainer';
import ReviewDialog from './ReviewDialogue';
import { getBooks, addNewRating, addReview } from '../actions/books';

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
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '0.3rem',
  },
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: '#3f51b5',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

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
  const classes = useStyles();

  const showSnackbar = (show, status, message) => {
    setSeverity(status);
    setErrMessage(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 3000);
  };

  const rateBook = (ratingValue) => {
    setShowRatingDialogue(false);
    onRateBook(token, authUserRoles, book._id, user[0]._id, ratingValue).then((response) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(true, 'success', 'Thank you for your rating.');
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
        onGetBooks(token);
      }
    });
  };

  React.useEffect(() => {
    if (book?.rating?.length) {
      const ratings =
        book.rating.map((r) => r.rating).reduce((a, b) => a + b, 0) / book.rating.length;
      setBookRating(ratings);
    } else {
      setBookRating(0);
    }
  }, [book.rating]);

  return (
    <div>
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
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
      >
        <div className={classes.container}>
          <img src={book.image || editionPlaceholder} alt="" className={classes.image} />
          <DialogContent>
            <div className={classes.firstRow}>
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
            <ReviewsContainer currentRating={bookRating} reviews={book.reviews} />
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
    </div>
  );
}

BookDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onRateBook: PropTypes.func.isRequired,
  onReviewBook: PropTypes.func.isRequired,
  onGetBooks: PropTypes.func.isRequired,
  book: PropTypes.objectOf(PropTypes.string, PropTypes.number, PropTypes.objectOf(PropTypes.string))
    .isRequired,
  authUserRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.objectOf(PropTypes.string, PropTypes.number, PropTypes.objectOf(PropTypes.string))
    .isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  authUserRoles: state.users.authUser.roles,
  user: state.users.users.filter((u) => u.username === state.users.authUser.username),
});

const mapDispatchToProps = (dispatch) => ({
  onRateBook: (token, authUserRoles, bookId, userId, newRating) =>
    dispatch(addNewRating(token, authUserRoles, bookId, userId, newRating)),
  onReviewBook: (token, authUserRoles, bookId, userId, review) =>
    dispatch(addReview(token, authUserRoles, bookId, userId, review)),
  onGetBooks: (token) => dispatch(getBooks(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookDetails);
