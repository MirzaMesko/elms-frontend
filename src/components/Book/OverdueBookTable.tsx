/* eslint-disable no-underscore-dangle */
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
// @ts-ignore
import BookContainer from './BookContainer.tsx';
// @ts-ignore
import Confirm from '../Helpers/Confirm.tsx';
// @ts-ignore
import UserContainer from '../User/UserContainer.tsx';
// @ts-ignore
import EmailDialogue from '../Dialogues/EmailDialogue.tsx';
// @ts-ignore
import CustomizedSnackbars from '../Helpers/Snackbar.tsx';
// @ts-ignore
import EnhancedTableHead from '../Helpers/EnhancedTableHead.tsx';
// @ts-ignore
import { showSnackbarMessage } from '../../actions/books.tsx';
// @ts-ignore
import { notifyUser } from '../../actions/users.tsx';
// @ts-ignore
import { sendEmail } from '../../actions/email.tsx';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { Book, User } from '../../types.ts';
// @ts-ignore
import OverdueBookTableBody from './OverdueBookTableBody.tsx';

const headCells = [
  { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
  { id: 'author', numeric: false, disablePadding: false, label: 'Author' },
  { id: 'serNo', numeric: false, disablePadding: false, label: 'Serial No' },
  { id: 'owed by', numeric: false, disablePadding: false, label: 'Owed by' },
  { id: 'due on', numeric: false, disablePadding: false, label: 'Due on' },
  { id: 'actions', numeric: true, disablePadding: false, label: 'Actions' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '95%',
    margin: '0 auto',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  large: {
    width: '45px',
    height: '65px',
  },
}));

interface Props {
  books: [Book];
}

const EnhancedTable: React.FC<Props> = ({ books }: Props) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('username');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedBook, setSelectedBook] = React.useState<Book | undefined>();
  const [selectedUser, setSelectedUser] = React.useState<User | undefined>({});
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [openBookDetails, setOpenBookDetails] = React.useState(false);
  const [chosenBook, setChosenBook] = React.useState(null);
  const [openUserDetails, setOpenUserDetails] = React.useState(false);
  const [showEmailDialogue, setShowEmailDialogue] = React.useState(false);

  const dispatch: AppDispatch = useDispatch();
  const { token, authUser, users } = useSelector((state: RootState) => state.users);
  const { roles } = authUser;

  const handleRequestSort = (event: any, property: React.SetStateAction<string>) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSendEmail = (email: string, subject: string, text: string) => {
    dispatch(sendEmail(token, roles, email, subject, text)).then(
      (resp: { status: number; message: any }) => {
        if (resp.status !== 200) {
          dispatch(showSnackbarMessage('error', resp.message));
        }
        if (resp.status === 200) {
          setShowEmailDialogue(false);
          dispatch(
            showSnackbarMessage(
              'success',
              `A email reminder that "${selectedBook.title}" by "${
                selectedBook.author
              }" is overdue was sent to ${
                users?.filter((u: { _id: any }) => u._id === selectedBook.owedBy.userId)[0].username
              }.`
            )
          );
        }
      }
    );
  };

  const onConfirmNotify = (book: React.SetStateAction<undefined>) => {
    setSelectedBook(book);
    setShowConfirm(true);
  };

  const sendReminder = (book: Book) => {
    setShowConfirm(false);
    dispatch(
      notifyUser(
        token,
        roles,
        book.owedBy.userId,
        `"${book.title}" by "${book.author}" is overdue. Please return it as soon as possible!`
      )
    ).then((response: { status: number; message: any }) => {
      if (response.status !== 200) {
        dispatch(showSnackbarMessage('error', response.message));
      }
      if (response.status === 200) {
        dispatch(
          showSnackbarMessage(
            'success',
            `A reminder that "${book.title}" by "${book.author}" is overdue was sent to ${
              users?.filter((u: { _id: any }) => u._id === selectedBook.owedBy.userId)[0].username
            }.`
          )
        );
      }
    });
  };

  const onShowBookDetails = (book: Book) => {
    setChosenBook(book._id);
    setTimeout(() => {
      setOpenBookDetails(true);
    }, 200);
  };

  const onShowUserDetails = (u: React.SetStateAction<{}>) => {
    setOpenUserDetails(true);
    setSelectedUser(u);
  };

  const setEmailInfo = (book: React.SetStateAction<undefined>, u: React.SetStateAction<{}>[]) => {
    setSelectedUser(u[0]);
    setSelectedBook(book);
    setShowEmailDialogue(true);
  };

  return (
    <div className={classes.root}>
      <CustomizedSnackbars />
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography
            variant="h6"
            id="tableTitle"
            component="div"
            data-testid="overdue-book-table-title"
          >
            Overdue Books
          </Typography>
        </Toolbar>
        {!books.length ? (
          <div
            style={{ display: 'flex', justifyContent: 'center' }}
            data-testid="no-results-message"
          >
            <p>No overdue books to display.</p>
          </div>
        ) : (
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="medium"
              aria-label="sticky table"
              stickyHeader
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                isLibrarian={roles.includes('Librarian')}
                headCells={headCells}
              />
              <Confirm
                show={showConfirm}
                title="Are you sure?"
                message={
                  selectedBook
                    ? `${
                        users?.filter((u: { _id: any }) => u._id === selectedBook.owedBy.userId)[0]
                          .username
                      } will be notified that ${selectedBook.title.toUpperCase()} by ${
                        selectedBook.author
                      }, serial number ${selectedBook.serNo} is overdue!`
                    : ''
                }
                cancel={() => setShowConfirm(false)}
                confirm={() => sendReminder(selectedBook)}
                confirmText="send notification"
                cancelText="cancel"
              />
              <OverdueBookTableBody
                users={users}
                books={books}
                authUser={authUser}
                page={page}
                order={order}
                orderBy={orderBy}
                rowsPerPage={rowsPerPage}
                onShowUserDetails={onShowUserDetails}
                onShowBookDetails={onShowBookDetails}
                onConfirmNotify={onConfirmNotify}
                setEmailInfo={setEmailInfo}
              />
              <EmailDialogue
                show={showEmailDialogue}
                close={() => setShowEmailDialogue(false)}
                emailSubject="Reminder of an overdue book"
                emailText={`You received this email because the following book: "${selectedBook?.title}" by "${selectedBook?.author}" is overdue. Please return it as soon as possible!\n\nBest regards,\nYour ELMS team`}
                sendEmail={handleSendEmail}
                recepientsEmail={selectedUser.email}
              />
              <BookContainer
                open={openBookDetails}
                handleClose={() => setOpenBookDetails(false)}
                bookId={chosenBook}
              />
              <UserContainer
                open={openUserDetails}
                handleClose={() => setOpenUserDetails(false)}
                user={selectedUser}
              />
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 15, 25]}
              component="div"
              count={books.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              data-testid="table-pagination"
            />
          </TableContainer>
        )}
      </Paper>
    </div>
  );
};

export default EnhancedTable;
