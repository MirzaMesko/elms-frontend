/* eslint-disable no-underscore-dangle */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
// @ts-ignore
import { AppDispatch } from '../../store.ts';
// @ts-ignore
import type { Book, User } from '../../types.ts';
// @ts-ignore
import ConciseBook from './ConciseBook.tsx';
// @ts-ignore
import CustomizedSnackbars from '../Helpers/Snackbar.tsx';
// @ts-ignore
import { getBooks, returnBook } from '../../actions/books.tsx';
// @ts-ignore
import { getUsers, notifyUser } from '../../actions/users.tsx';

interface Props {
  owedBooks: [string];
  books: [Book];
  token: string;
  authUserRoles: Array<string>;
  user: User;
}

const OwedBooks: React.FC<Props> = (props: Props) => {
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');

  const { owedBooks, books, token, authUserRoles, user } = props;

  const dispatch: AppDispatch = useDispatch();

  const showSnackbar = (
    show: boolean | ((prevState: boolean) => boolean),
    status: string,
    message: string
  ) => {
    setSeverity(status);
    setErrMessage(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 6000);
    dispatch(getBooks(token));
    dispatch(getUsers(token));
  };

  const returnABook = (book: Book) => {
    const newOwedBooks = owedBooks.filter((i) => i !== book._id);
    dispatch(returnBook(token, authUserRoles, book, user, newOwedBooks)).then(
      (resp: { status: number; message: any }) => {
        if (resp.status !== 200) {
          showSnackbar(true, 'error', resp.message);
        }
        if (resp.status === 200) {
          showSnackbar(true, 'success', `Book ${book.title} was returned`);
          if (book.reservedBy[0]) {
            dispatch(
              notifyUser(
                token,
                authUserRoles,
                book.reservedBy[0],
                `${book.title} by ${book.author} is now available.`
              )
            );
          }
        }
      }
    );
  };

  const sendReminder = (book: Book) => {
    dispatch(
      notifyUser(
        token,
        authUserRoles,
        book.owedBy.userId,
        `"${book.title}" by "${book.author}" is overdue. Please return it as soon as possible!`
      )
    ).then((response: { status: number; message: any }) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(
          true,
          'success',
          `A reminder that "${book.title}" by "${book.author}" is overdue was sent to ${user.username}.`
        );
      }
    });
  };

  return !owedBooks.length ? (
    <Typography className="centered">No owed books for this user.</Typography>
  ) : (
    <>
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={errMessage} />
      {owedBooks.map((bookId) => {
        const match = books.filter((book: { _id: string }) => book._id === bookId);
        return match.map((owedBook: Book) => (
          <ConciseBook
            book={owedBook}
            onReturnBook={returnABook}
            sendOverdueReminder={sendReminder}
            key={owedBook._id}
          />
        ));
      })}
    </>
  );
};

export default OwedBooks;
