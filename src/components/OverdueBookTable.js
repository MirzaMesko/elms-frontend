/* eslint-disable no-underscore-dangle */
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EmailIcon from '@material-ui/icons/Email';
import PropTypes from 'prop-types';
import React from 'react';
import BookDetails from './Book';
import Confirm from './Confirm';
import UserDetails from './User';
import EmailDialogue from './EmailDialogue';
import CustomizedSnackbars from './Snackbar';
import { getBooks } from '../actions/books';
import { notifyUser } from '../actions/users';
import { sendEmail } from '../actions/email';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
  { id: 'author', numeric: false, disablePadding: false, label: 'Author' },
  { id: 'serNo', numeric: false, disablePadding: false, label: 'Serial No' },
  { id: 'owed by', numeric: false, disablePadding: false, label: 'Owed By' },
  { id: 'due on', numeric: false, disablePadding: false, label: 'Due on' },
  { id: 'actions', numeric: true, disablePadding: false, label: 'Actions' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, isLibrarian } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell> </TableCell>
        {headCells.map((headCell) =>
          !isLibrarian && (headCell.id === 'actions' || headCell.id === 'serNo') ? null : (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'center' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          )
        )}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  isLibrarian: PropTypes.bool.isRequired,
};

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
  // const [showEditDialogue, setShowEditDialogue] = React.useState(false);
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

  // eslint-disable-next-line no-unused-vars
  const { books, onShowSnackbar, roles, token, onNotifyUser, users, onSendEmail } = props;

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
  };

  const handleSendEmail = (email, subject, text) => {
    onSendEmail(token, roles, email, subject, text).then((resp) => {
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
    onNotifyUser(
      token,
      roles,
      book.owedBy.userId,
      `"${book.title}" by "${book.author}" is overdue. Please return it as soon as possible!`
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
        // onGetUsers(token);
        // onGetBooks(token);
      }
    });
  };

  const onShowBookDetails = (book) => {
    setOpenBookDetails(true);
    setChosenBook(book);
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
                {stableSort(books, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((book, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <>
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
                            id={labelId}
                            onClick={() => onShowBookDetails(book)}
                            style={{ cursor: 'pointer' }}
                          >
                            {book.title}
                          </TableCell>
                          <TableCell
                            align="left"
                            onClick={() => onShowBookDetails(book)}
                            style={{ cursor: 'pointer' }}
                          >
                            {book.author}
                          </TableCell>
                          {roles.length === 1 && roles[0] === 'Member' ? null : (
                            <TableCell
                              align="left"
                              onClick={() => onShowBookDetails(book)}
                              style={{ cursor: 'pointer' }}
                            >
                              {book.serNo}
                            </TableCell>
                          )}
                          {users?.map((u) => {
                            let userInfo = <></>;
                            if (u._id === book.owedBy.userId) {
                              userInfo = (
                                <TableCell
                                  id={labelId}
                                  onClick={() => onShowUserDetails(u)}
                                  style={{ cursor: 'pointer' }}
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
                              return userInfo;
                            }
                            return userInfo;
                          })}
                          <TableCell id={labelId}>{book.owedBy.dueDate}</TableCell>

                          {roles.includes('Librarian') && (
                            <TableCell align="center">
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                }}
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
                                <IconButton aria-label="edit" onClick={() => onConfirmNotify(book)}>
                                  <NotificationsIcon fontSize="small" />
                                </IconButton>
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
                      </>
                    );
                  })}
                {emptyRows > 0 ? (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                ) : null}
                <BookDetails
                  open={openBookDetails}
                  handleClose={() => setOpenBookDetails(false)}
                  book={chosenBook}
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
  onShowSnackbar: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  token: PropTypes.string.isRequired,
  onNotifyUser: PropTypes.func.isRequired,
  onSendEmail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  roles: state.users.authUser.roles,
  users: state.users.users,
});

const mapDispatchToProps = (dispatch) => ({
  onGetBooks: (token) => dispatch(getBooks(token)),
  onSendEmail: (token, authUserRoles, email, subject, text) =>
    dispatch(sendEmail(token, authUserRoles, email, subject, text)),
  onNotifyUser: (token, authUserRoles, userId, message) =>
    dispatch(notifyUser(token, authUserRoles, userId, message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedTable);
