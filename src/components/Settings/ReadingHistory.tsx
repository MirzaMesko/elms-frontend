/* eslint-disable no-underscore-dangle */
import React from 'react';
import Typography from '@material-ui/core/Typography';
// @ts-ignore
import ConciseBook from '../Book/ConciseBook.tsx';
// @ts-ignore
import type { User, Book } from '../../types.ts';

interface Props {
  user: User;
  books: [Book];
}

const ReadingHistory: React.FC<Props> = ({ user, books }: Props) =>
  !user.readingHistory?.length ? (
    <Typography className="centered">No reading history for this user.</Typography>
  ) : (
    user.readingHistory
      .map((bookId: string) => {
        const match = books.filter((book: { _id: string }) => book._id === bookId);
        return match.map((owedBook: Book) => <ConciseBook book={owedBook} key={owedBook._id} />);
      })
      .reverse()
  );

export default ReadingHistory;
