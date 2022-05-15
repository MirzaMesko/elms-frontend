/* eslint-disable no-underscore-dangle */
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { connect, useDispatch } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import Fade from '@material-ui/core/Fade';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EmailIcon from '@material-ui/icons/Email';
import PropTypes from 'prop-types';
import React from 'react';
import BookDetails from './Book';
import Confirm from '../Helpers/Confirm';
import UserDetails from '../User/User';
import EmailDialogue from '../Dialogues/EmailDialogue';
import CustomizedSnackbars from '../Helpers/Snackbar';
import EnhancedTableHead from '../Helpers/EnhancedTableHead';
import { getBooks } from '../../actions/books';
import { notifyUser, getUsers } from '../../actions/users';
import { sendEmail } from '../../actions/email';
import * as helpers from '../Helpers/helpers';
import { LightTooltip } from '../Helpers/Tooltip';

const headCells = [
  { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
  { id: 'author', numeric: false, disablePadding: false, label: 'Author' },
  { id: 'serNo', numeric: false, disablePadding: false, label: 'Serial No' },
  { id: 'owed by', numeric: false, disablePadding: false, label: 'Owed By' },
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
}));

function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('username');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedBook, setSelectedBook] = React.useState();
  const [selectedUser, setSelectedUser] = React.useState({});
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [severity, setSeverity] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [openBookDetails, setOpenBookDetails] = React.useState(false);
  const [chosenBook, setChosenBook] = React.useState({});
  const [openUserDetails, setOpenUserDetails] = React.useState(false);
  const [showEmailDialogue, setShowEmailDialogue] = React.useState(false);

  const { books, roles, token, users } = props;

  const dispatch = useDispatch();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showSnackbar = (show, status, message) => {
    setSeverity(status);
    setErrMessage(message);
    setOpenSnackbar(show);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 6000);
    dispatch(getUsers(token));
    dispatch(getBooks(token));
  };

  const handleSendEmail = (email, subject, text) => {
    dispatch(sendEmail(token, roles, email, subject, text)).then((resp) => {
      if (resp.status !== 200) {
        showSnackbar(true, 'error', resp.message);
      }
      if (resp.status === 200) {
        setShowEmailDialogue(false);
        showSnackbar(
          true,
          'success',
          `A email reminder that "${selectedBook.title}" by "${
            selectedBook.author
          }" is overdue was sent to ${
            users?.filter((u) => u._id === selectedBook.owedBy.userId)[0].username
          }.`
        );
      }
    });
  };

  const onConfirmNotify = (book) => {
    setSelectedBook(book);
    setShowConfirm(true);
  };

  const sendReminder = (book) => {
    setShowConfirm(false);
    dispatch(
      notifyUser(
        token,
        roles,
        book.owedBy.userId,
        `"${book.title}" by "${book.author}" is overdue. Please return it as soon as possible!`
      )
    ).then((response) => {
      if (response.status !== 200) {
        showSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        showSnackbar(
          true,
          'success',
          `A reminder that "${book.title}" by "${book.author}" is overdue was sent to ${
            users?.filter((u) => u._id === selectedBook.owedBy.userId)[0].username
          }.`
        );
      }
    });
  };

  const onShowBookDetails = (book) => {
    setTimeout(() => {
      setOpenBookDetails(true);
    }, 200);
    setChosenBook(book._id);
  };

  const onShowUserDetails = (u) => {
    setOpenUserDetails(true);
    setSelectedUser(u);
  };

  const setEmailInfo = (book, u) => {
    setSelectedUser(u[0]);
    setSelectedBook(book);
    setShowEmailDialogue(true);
  };
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, books.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <CustomizedSnackbars show={openSnackbar} severity={severity} message={errMessage} />
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography variant="h6" id="tableTitle" component="div">
            Overdue Books
          </Typography>
        </Toolbar>
        {!books.length ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p>No matches for your search</p>
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
                rowCount={books.length}
                isLibrarian={roles.includes('Librarian')}
                headCells={headCells}
              />
              <Confirm
                show={showConfirm}
                title="Are you sure?"
                message={
                  selectedBook
                    ? `${
                        users?.filter((u) => u._id === selectedBook.owedBy.userId)[0].username
                      } will be notified that ${selectedBook.title.toUpperCase()} by ${
                        selectedBook.author
                      }, serial number ${selectedBook.serNo} is overdue!`
                    : ''
                }
                confirm={() => setShowConfirm(false)}
                cancel={() => sendReminder(selectedBook)}
                confirmText="send notification"
                cancelText="cancel"
              />
              <TableBody>
                {helpers
                  .stableSort(books, helpers.getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((book) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={0}
                      // eslint-disable-next-line no-underscore-dangle
                      key={book._id}
                    >
                      <TableCell
                        onClick={() => onShowBookDetails(book)}
                        style={{ cursor: 'pointer' }}
                        key={book.title.slice(0, 5)}
                      >
                        <Avatar
                          src={book.image}
                          alt={book.title}
                          variant="square"
                          sx={{ width: 56, height: 56 }}
                        >
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
                      {roles.length === 1 && roles[0] === 'Member' ? null : (
                        <TableCell
                          align="left"
                          onClick={() => onShowBookDetails(book)}
                          style={{ cursor: 'pointer' }}
                          key={book.serNo}
                        >
                          {book.serNo}
                        </TableCell>
                      )}
                      {users?.map((u) => {
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
                                  sx={{ width: 56, height: 56 }}
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

                      {roles.includes('Librarian') && (
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
                                    users?.filter((u) => u._id === book.owedBy.userId)
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
                            <EmailDialogue
                              show={showEmailDialogue}
                              close={() => setShowEmailDialogue(false)}
                              emailSubject="Reminder of an overdue book"
                              emailText={`You received this email because the following book: "${selectedBook?.title}" by "${selectedBook?.author}" is overdue. Please return it as soon as possible!\n\nBest regards,\nYour ELMS team`}
                              sendEmail={handleSendEmail}
                              recepientsEmail={selectedUser.email}
                            />
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
                <BookDetails
                  open={openBookDetails}
                  handleClose={() => setOpenBookDetails(false)}
                  bookId={chosenBook}
                />
                <UserDetails
                  open={openUserDetails}
                  handleClose={() => setOpenUserDetails(false)}
                  user={selectedUser}
                />
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component="div"
          count={books.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

EnhancedTable.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  roles: state.users.authUser.roles,
  users: state.users.users,
});

export default connect(mapStateToProps)(EnhancedTable);
