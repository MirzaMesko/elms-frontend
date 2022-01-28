import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
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
import PropTypes from 'prop-types';
import React from 'react';
import FormDialog from './FormDialogue';

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
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [showEditDialogue, setShowEditDialogue] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState();
  const [isHovering, setIsHovering] = React.useState({ show: false, index: 0 });

  const { books, onShowSnackbar } = props;

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

  const onEdit = (user) => {
    setSelectedUser(user);
    setShowEditDialogue(!showEditDialogue);
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
            <TableBody>
              {stableSort(books, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((book, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
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
                        {isHovering.show && isHovering.index === index ? (
                          <IconButton aria-label="edit" onClick={() => onEdit(book)}>
                            <EditIcon />
                          </IconButton>
                        ) : null}
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
                user={selectedUser}
                onShowSnackbar={onShowSnackbar}
              />
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
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
};

export default EnhancedTable;
