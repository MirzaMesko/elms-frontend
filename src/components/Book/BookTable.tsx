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
import BookDialog from '../Dialogues/BookDialogue.tsx';
// @ts-ignore
import BookContainer from './BookContainer.tsx';
// @ts-ignore
import EnhancedTableHead from '../Helpers/EnhancedTableHead.tsx';
// @ts-ignore
import Confirm from '../Helpers/Confirm.tsx';
// @ts-ignore
import { getBooks, deleteBook } from '../../actions/books.tsx';
// @ts-ignore
import Loading from '../Helpers/Loading.tsx';
// @ts-ignore
import BookTableBody from './BookTableBody.tsx';
// @ts-ignore
import Error from '../Helpers/Error.tsx';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { Book } from '../../types.ts';

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

interface OwnProps {
  books: [Book];
  onShowSnackbar: () => void;
}

type Props = RootState & AppDispatch & OwnProps;

const EnhancedTable: React.FC<Props> = ({ books, onShowSnackbar }: Props) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('username');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showEditDialogue, setShowEditDialogue] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState<Book>();
  const [showConfirmDelete, setShowDeleteConfirm] = React.useState(false);
  const [openBookDetails, setOpenBookDetails] = React.useState(false);
  const [chosenBookId, setChosenBookId] = React.useState(null);

  const dispatch: AppDispatch = useDispatch();
  const { error, loading } = useSelector((state: RootState) => state.books);
  const { token, authUser } = useSelector((state: RootState) => state.users);

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

  const onEdit = (book: Book | undefined) => {
    setSelectedBook(book);
    setShowEditDialogue(!showEditDialogue);
  };

  const onConfirmDelete = (book: Book) => {
    setSelectedBook(book);
    setShowDeleteConfirm(true);
  };

  const onDelete = () => {
    dispatch(deleteBook(authUser.roles, selectedBook._id, token)).then(
      (response: { status: number; message: any }) => {
        if (response.status !== 200) {
          onShowSnackbar(true, 'error', response.message);
        }
        if (response.status === 200) {
          onShowSnackbar(true, 'success', `Book deleted`);
          setShowDeleteConfirm(false);
          dispatch(getBooks(token));
        }
      }
    );
  };

  const onShowBookDetails = (book: Book) => {
    setChosenBookId(book._id);
    setTimeout(() => {
      setOpenBookDetails(true);
    }, 200);
  };

  if (loading) {
    return <Loading />;
  }

  if (error?.error) {
    return <Error message={error.message} />;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography variant="h6" id="tableTitle" component="div" data-testid="book-table-title">
            Books
          </Typography>
        </Toolbar>
        {!books.length ? (
          <div
            style={{ display: 'flex', justifyContent: 'center', minHeight: '5rem' }}
            data-testid="no-results-message"
          >
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
                isLibrarian={authUser.roles.includes('Librarian')}
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
              <BookTableBody
                books={books}
                authUser={authUser}
                page={page}
                order={order}
                orderBy={orderBy}
                rowsPerPage={rowsPerPage}
                onShowBookDetails={onShowBookDetails}
                onEdit={onEdit}
                onConfirmDelete={onConfirmDelete}
              />
              <BookContainer
                open={openBookDetails}
                handleClose={() => setOpenBookDetails(false)}
                bookId={chosenBookId}
              />
              <BookDialog
                title="Edit Book"
                show={showEditDialogue}
                close={() => onEdit(null)}
                book={selectedBook}
                onShowSnackbar={onShowSnackbar}
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
