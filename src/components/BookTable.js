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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import React from 'react';
import FormDialog from './FormDialogue';
import Confirm from './Confirm';
import { getBooks, deleteBook } from '../actions/books';

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
  { id: 'year', numeric: true, disablePadding: false, label: 'Year' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'publisher', numeric: false, disablePadding: false, label: 'Publisher' },
  { id: 'serNo', numeric: false, disablePadding: false, label: 'Serial No' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>{null}</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'left'}
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
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
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
  const [showEditDialogue, setShowEditDialogue] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState();
  const [isHovering, setIsHovering] = React.useState({ show: false, index: 0 });
  const [showConfirmDelete, setShowDeleteConfirm] = React.useState(false);

  const { books, onShowSnackbar, roles, token, onDeleteBook, onGetBooks } = props;

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
    onDeleteBook(Object.values(roles), selectedBook._id, token).then((response) => {
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        onShowSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        onShowSnackbar(true, 'success', `Book deleted`);
        setShowDeleteConfirm(false);
        onGetBooks(token);
      }
    });
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, books.length - page * rowsPerPage);

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
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={books.length}
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
                {stableSort(books, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((book, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <>
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          // eslint-disable-next-line no-underscore-dangle
                          key={book._id}
                          onMouseEnter={() => setIsHovering({ show: true, index })}
                          onMouseLeave={() => setIsHovering({ show: false, index })}
                        >
                          <TableCell padding="checkbox">
                            {Object.values(roles).includes('Librarian') &&
                              (isHovering.show && isHovering.index === index ? (
                                <div>
                                  <IconButton aria-label="edit" onClick={() => onEdit(book)}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    aria-label="edit"
                                    onClick={() => onConfirmDelete(book)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </div>
                              ) : null)}
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row">
                            {book.title}
                          </TableCell>
                          <TableCell align="left">{book.author}</TableCell>
                          <TableCell align="left">{book.year}</TableCell>
                          <TableCell align="left">{book.description.slice(0, 60)}...</TableCell>
                          <TableCell align="left">{book.publisher}</TableCell>
                          <TableCell align="left">{book.serNo}</TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                {emptyRows > 0 ? (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                ) : null}
                <FormDialog
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
  roles: PropTypes.objectOf(PropTypes.string).isRequired,
  token: PropTypes.string.isRequired,
  onDeleteBook: PropTypes.func.isRequired,
  onGetBooks: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  roles: state.users.authUser.roles,
});

const mapDispatchToProps = (dispatch) => ({
  onDeleteBook: (roles, id, token) => dispatch(deleteBook(roles, id, token)),
  onGetBooks: (token) => dispatch(getBooks(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedTable);
