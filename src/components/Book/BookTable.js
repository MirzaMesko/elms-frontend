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
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import Fade from '@material-ui/core/Fade';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import React from 'react';
import BookDialog from '../Dialogues/BookDialogue';
import BookDetails from './Book';
import EnhancedTableHead from '../Helpers/EnhancedTableHead';
import Confirm from '../Helpers/Confirm';
import { getBooks, deleteBook } from '../../actions/books';
import * as helpers from '../Helpers/helpers';
import { LightTooltip } from '../Helpers/Tooltip';
import Loading from '../Helpers/Loading';
import Error from '../Helpers/Error';

const headCells = [
  { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
  { id: 'author', numeric: false, disablePadding: false, label: 'Author' },
  { id: 'year', numeric: true, disablePadding: false, label: 'Year' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'publisher', numeric: false, disablePadding: false, label: 'Publisher' },
  { id: 'serNo', numeric: false, disablePadding: false, label: 'Serial No' },
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
  const [showEditDialogue, setShowEditDialogue] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState();
  const [showConfirmDelete, setShowDeleteConfirm] = React.useState(false);
  const [openBookDetails, setOpenBookDetails] = React.useState(false);
  const [chosenBookId, setChosenBookId] = React.useState(null);

  const {
    books,
    onShowSnackbar,
    roles,
    token,
    onDeleteBook,
    onGetBooks,
    loadingBooks,
    error,
  } = props;

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

  const onEdit = (book) => {
    setSelectedBook(book);
    setShowEditDialogue(!showEditDialogue);
  };

  const onConfirmDelete = (book) => {
    setSelectedBook(book);
    setShowDeleteConfirm(true);
  };

  const onDelete = () => {
    // eslint-disable-next-line no-underscore-dangle
    onDeleteBook(roles, selectedBook._id, token).then((response) => {
      if (response.status !== 200) {
        onShowSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        onShowSnackbar(true, 'success', `Book deleted`);
        setShowDeleteConfirm(false);
        onGetBooks(token);
      }
    });
  };

  const onShowBookDetails = (book) => {
    setChosenBookId(book._id);
    setTimeout(() => {
      setOpenBookDetails(true);
    }, 200);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, books.length - page * rowsPerPage);

  if (loadingBooks) {
    return <Loading />;
  }

  if (error?.error) {
    return <Error message={error.message} />;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography variant="h6" id="tableTitle" component="div">
            Books
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
                show={showConfirmDelete}
                title="Are you sure?"
                message={
                  selectedBook
                    ? `${selectedBook.title.toUpperCase()} by ${
                        selectedBook.author
                      }, serial number ${selectedBook.serNo} will be deleted!`
                    : ''
                }
                confirm={() => setShowDeleteConfirm(false)}
                cancel={onDelete}
                confirmText="delete"
                cancelText="cancel"
              />
              <TableBody>
                {helpers
                  .stableSort(books, helpers.getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((book) => (
                    <TableRow hover role="checkbox" tabIndex={0} key={book._id + book._id}>
                      <TableCell
                        onClick={() => onShowBookDetails(book)}
                        style={{ cursor: 'pointer' }}
                        key={book.title + book._id}
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
                      {roles.length === 1 && roles[0] === 'Member' ? null : (
                        <TableCell
                          align="left"
                          onClick={() => onShowBookDetails(book)}
                          style={{ cursor: 'pointer' }}
                          key={book._id + book.serNo}
                        >
                          {book.serNo}
                        </TableCell>
                      )}
                      {roles.includes('Librarian') && (
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
                <BookDetails
                  open={openBookDetails}
                  handleClose={() => setOpenBookDetails(false)}
                  bookId={chosenBookId}
                />
                <BookDialog
                  title="Edit Book"
                  show={showEditDialogue}
                  close={() => onEdit()}
                  book={selectedBook}
                  onShowSnackbar={onShowSnackbar}
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
  onShowSnackbar: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  token: PropTypes.string.isRequired,
  onDeleteBook: PropTypes.func.isRequired,
  onGetBooks: PropTypes.func.isRequired,
  loadingBooks: PropTypes.bool.isRequired,
  error: PropTypes.shape({
    error: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  roles: state.users.authUser.roles,
  loadingBooks: state.books.loading,
  error: state.books.error,
});

const mapDispatchToProps = (dispatch) => ({
  onDeleteBook: (roles, id, token) => dispatch(deleteBook(roles, id, token)),
  onGetBooks: (token) => dispatch(getBooks(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedTable);
