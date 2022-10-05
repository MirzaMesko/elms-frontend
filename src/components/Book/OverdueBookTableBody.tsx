import React from 'react';
/* eslint-disable no-underscore-dangle */
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import Fade from '@material-ui/core/Fade';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EmailIcon from '@material-ui/icons/Email';
import * as helpers from '../Helpers/helpers';
// @ts-ignore
import { LightTooltip } from '../Helpers/Tooltip.tsx';
// @ts-ignore
import type { Book, User } from '../../types.ts';

const useStyles = makeStyles(() => ({
  large: {
    width: '45px',
    height: '65px',
  },
}));

interface Props {
  books: [Book];
  users: [User];
  rowsPerPage: number;
  order: string;
  orderBy: string;
  page: number;
  onShowUserDetails: (user: User) => void;
  onShowBookDetails: (book: Book) => void;
  onConfirmNotify: (book: Book) => void;
  setEmailInfo: (book: Book, user: User) => void;
  authUser: {
    roles: Array<string>;
  };
}

const OverdueBookTableBody: React.FC<Props> = ({
  books,
  users,
  rowsPerPage,
  order,
  orderBy,
  page,
  onShowUserDetails,
  onShowBookDetails,
  authUser,
  onConfirmNotify,
  setEmailInfo,
}: Props) => {
  const classes = useStyles();
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, books.length - page * rowsPerPage);
  return (
    <TableBody data-testid="overdue-book-table-body">
      {helpers
        .stableSort(books, helpers.getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((book: Book) => (
          <TableRow hover role="checkbox" tabIndex={0} key={book._id}>
            <TableCell
              onClick={() => onShowBookDetails(book)}
              style={{ cursor: 'pointer' }}
              key={book.title.slice(0, 5)}
            >
              <Avatar src={book.image} alt={book.title} variant="square" className={classes.large}>
                {book.title.slice(0, 1)}
              </Avatar>
            </TableCell>
            <TableCell
              onClick={() => onShowBookDetails(book)}
              style={{ cursor: 'pointer' }}
              key={book.title.slice(5, 10)}
            >
              {book.title}
            </TableCell>
            <TableCell
              align="left"
              onClick={() => onShowBookDetails(book)}
              style={{ cursor: 'pointer' }}
              key={book.author.slice(0, 5)}
            >
              {book.author}
            </TableCell>
            {authUser.roles.length === 1 && authUser.roles[0] === 'Member' ? null : (
              <TableCell
                align="left"
                onClick={() => onShowBookDetails(book)}
                style={{ cursor: 'pointer' }}
                key={book.serNo}
              >
                {book.serNo}
              </TableCell>
            )}
            {users?.map((u: User) => {
              if (u._id === book.owedBy.userId) {
                return (
                  <TableCell
                    onClick={() => onShowUserDetails(u)}
                    style={{ cursor: 'pointer' }}
                    key={book.owedBy.userId}
                  >
                    <div>
                      <Avatar
                        src={u.image}
                        alt={u.username}
                        variant="square"
                        className={classes.large}
                      >
                        {u.username.slice(0, 1)}
                      </Avatar>
                      {u.username}
                    </div>
                  </TableCell>
                );
              }
              return null;
            })}
            <TableCell key={book.owedBy.dueDate}>{book.owedBy.dueDate}</TableCell>

            {authUser.roles.includes('Librarian') && (
              <TableCell align="center" key={book.owedBy.userId.slice(0, 6)}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <LightTooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title="Send e-mail"
                  >
                    <IconButton
                      aria-label="edit"
                      onClick={() =>
                        setEmailInfo(
                          book,
                          users?.filter((u: { _id: any }) => u._id === book.owedBy.userId)
                        )
                      }
                    >
                      <EmailIcon fontSize="small" />
                    </IconButton>
                  </LightTooltip>
                  <LightTooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title="Send notification"
                  >
                    <IconButton aria-label="edit" onClick={() => onConfirmNotify(book)}>
                      <NotificationsIcon fontSize="small" />
                    </IconButton>
                  </LightTooltip>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      {emptyRows > 0 ? (
        <TableRow style={{ height: 53 * emptyRows }}>
          <TableCell colSpan={6} />
        </TableRow>
      ) : null}
    </TableBody>
  );
};

export default OverdueBookTableBody;
