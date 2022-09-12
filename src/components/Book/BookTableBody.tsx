/* eslint-disable no-underscore-dangle */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import Fade from '@material-ui/core/Fade';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as helpers from '../Helpers/helpers';
// @ts-ignore
import { LightTooltip } from '../Helpers/Tooltip.tsx';
// @ts-ignore
import type { Book } from '../../types.ts';

const useStyles = makeStyles(() => ({
  large: {
    width: '45px',
    height: '65px',
  },
}));

interface Props {
  books: [Book];
  rowsPerPage: number;
  order: string;
  orderBy: string;
  page: number;
  onShowBookDetails: (book: Book) => void;
  authUser: {
    roles: Array<string>;
  };
  onEdit: (book: Book) => void;
  onConfirmDelete: (book: Book) => void;
}

const BookTableBody: React.FC<Props> = ({
  books,
  rowsPerPage,
  order,
  orderBy,
  page,
  onShowBookDetails,
  authUser,
  onConfirmDelete,
  onEdit,
}: Props) => {
  const classes = useStyles();
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, books.length - page * rowsPerPage);

  return (
    <TableBody>
      {helpers
        .stableSort(books, helpers.getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((book: Book) => (
          <TableRow hover role="checkbox" tabIndex={0} key={book._id + book._id}>
            <TableCell
              onClick={() => onShowBookDetails(book)}
              style={{ cursor: 'pointer' }}
              key={book.title + book._id}
            >
              <Avatar src={book.image} alt={book.title} variant="square" className={classes.large}>
                {book.title.slice(0, 1)}
              </Avatar>
            </TableCell>
            <TableCell
              onClick={() => onShowBookDetails(book)}
              style={{ cursor: 'pointer' }}
              key={book._id + book.title}
            >
              {book.title}
            </TableCell>
            <TableCell
              align="left"
              onClick={() => onShowBookDetails(book)}
              style={{ cursor: 'pointer' }}
              key={book._id + book.author}
            >
              {book.author}
            </TableCell>
            <TableCell
              align="left"
              onClick={() => onShowBookDetails(book)}
              style={{ cursor: 'pointer' }}
              key={book._id + book.year}
            >
              {book.year}
            </TableCell>
            <TableCell
              align="left"
              onClick={() => onShowBookDetails(book)}
              style={{ cursor: 'pointer' }}
              key={book._id + book.description.slice(0, 4)}
            >
              {book.description.slice(0, 60)}...
            </TableCell>
            <TableCell
              align="left"
              onClick={() => onShowBookDetails(book)}
              style={{ cursor: 'pointer' }}
              key={book._id + book.publisher}
            >
              {book.publisher}
            </TableCell>
            {!authUser.roles.includes('Admin' || 'Librarian') ? null : (
              <TableCell
                align="left"
                onClick={() => onShowBookDetails(book)}
                style={{ cursor: 'pointer' }}
                key={book._id + book.serNo}
              >
                {book.serNo}
              </TableCell>
            )}
            {authUser.roles.includes('Librarian') && (
              <TableCell align="center">
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                  key={book._id}
                >
                  <LightTooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title="Edit book"
                  >
                    <IconButton aria-label="edit" onClick={() => onEdit(book)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </LightTooltip>

                  <LightTooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title="Delete book"
                  >
                    <IconButton aria-label="edit" onClick={() => onConfirmDelete(book)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </LightTooltip>
                </span>
              </TableCell>
            )}
          </TableRow>
        ))}
      {emptyRows > 0 ? (
        <TableRow style={{ height: 53 * emptyRows }}>
          <TableCell colSpan={6} key={2} />
        </TableRow>
      ) : null}
    </TableBody>
  );
};

export default BookTableBody;
