/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import CustomizedSnackbars from '../Helpers/Snackbar.tsx';
// @ts-ignore
import ReviewDialog from '../Dialogues/ReviewDialogue.tsx';
// @ts-ignore
import RatingDialog from '../Dialogues/RatingDialogue.tsx';
// @ts-ignore
import BookDetails from './Book.tsx';
// @ts-ignore
import { calculateRating } from '../Helpers/helpers';
// @ts-ignore
import Error from '../Helpers/Error.tsx';
import {
  addNewRating,
  addReview,
  getBookById,
  updateReview,
  // @ts-ignore
} from '../../actions/books.tsx';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { User, Book } from '../../types.ts';

interface OwnProps {
  open: boolean;
  handleClose: () => void;
  bookId: string;
  err: {
    error: boolean;
    message: string;
  };
}

const BookContainer: React.FC<OwnProps> = ({ open, handleClose, bookId, err }: OwnProps) => {
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

  const dispatch: AppDispatch = useDispatch();
  const { token, users, authUser } = useSelector((state: RootState) => state.users);
  const user = users.filter((u: User) => u.username === authUser.username);

  const showSnackbar = (show: boolean, status: string, message: string) => {
    setSeverity(status);
    setErrMessage(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 3000);
  };

  const rateBook = (ratingValue: number) => {
    setShowRatingDialogue(false);
    dispatch(addNewRating(token, authUser.roles, book.title, user[0]._id, ratingValue)).then(
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
          const rating = calculateRating(sum);
          setBookRating(rating);
        }
      }
    );
  };

  const reviewBook = (review: string) => {
    setShowReviewDialogue(false);
    dispatch(addReview(token, authUser.roles, book.title, user[0]._id, review)).then(
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
    dispatch(updateReview(token, authUser.roles, book.title, afterDelete)).then(
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
    dispatch(updateReview(token, authUser.roles, book.title, afterEdit)).then(
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

  const fetchBook = async (id: string) => {
    setLoading(true);
    await dispatch(getBookById(token, id))
      .then(
        (response: {
          status: number;
          message: any;
          data: { rating: [{ userId: string; rating: number }]; reviews: any };
        }) => {
          if (response?.status === 200) {
            setBook(response.data);
            if (response.data?.rating) {
              const rating = calculateRating(response.data.rating);
              setBookRating(rating);
            } else {
              setBookRating(0);
            }
            setBookReviews(response.data.reviews);
            setLoading(false);
          }
        }
      )
      .catch((e: any) => {
        setError({ error: true, message: e.response.message });
        setLoading(false);
      });
  };

  React.useEffect(() => {
    let isMounted = true;
    if (bookId && isMounted) {
      fetchBook(bookId);
    }
    return () => {
      isMounted = false;
      setBook({});
    };
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
      <RatingDialog
        open={showRatingDialogue}
        close={() => setShowRatingDialogue(false)}
        rate={rateBook}
      />
      <BookDetails
        open={open}
        close={handleClose}
        bookReviews={bookReviews}
        bookRating={bookRating}
        book={book}
        loading={loading}
        delReview={delReview}
        editReview={editReview}
        showReviewDialog={() => setShowReviewDialogue(true)}
        showRatingDialog={() => setShowRatingDialogue(true)}
      />
    </>
  );
};

export default BookContainer;
