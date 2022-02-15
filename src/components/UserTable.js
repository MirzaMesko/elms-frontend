import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
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
import Avatar from '@material-ui/core/Avatar';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import FormDialog from './FormDialogue';
import Confirm from './Confirm';
import UserDetails from './User';
import { getUsers, deleteUser } from '../actions/users';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

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
  { id: 'username', numeric: false, disablePadding: false, label: 'Username' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'roles', numeric: false, disablePadding: false, label: 'Roles' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell> </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
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
  const [selectedUser, setSelectedUser] = React.useState();
  const [showConfirmDelete, setShowDeleteConfirm] = React.useState(false);
  const [openUserDetails, setOpenUserDetails] = React.useState(false);
  const [chosenUser, setChosenUser] = React.useState({});

  const { users, onShowSnackbar, roles, token, onDeleteUser, onGetUsers } = props;

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

  const roleColor = (item) => {
    if (item === 'Admin') {
      return 'secondary';
    }
    if (item === 'Librarian') {
      return 'primary';
    }
    return 'default';
  };

  const setIcon = (item) => {
    if (item === 'Admin') {
      return <VerifiedUserIcon />;
    }
    if (item === 'Librarian') {
      return <AssignmentIndIcon />;
    }
    return <AccountCircleIcon />;
  };

  const onEdit = (user) => {
    setSelectedUser(user);
    setShowEditDialogue(!showEditDialogue);
  };

  const onConfirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const onDelete = () => {
    // eslint-disable-next-line no-underscore-dangle
    onDeleteUser(roles, selectedUser._id, token).then((response) => {
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        onShowSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        onShowSnackbar(true, 'success', `User deleted`);
        setShowDeleteConfirm(false);
        onGetUsers(token);
      }
    });
  };

  const onShowUserDetails = (user) => {
    setOpenUserDetails(true);
    setChosenUser(user);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography variant="h6" id="tableTitle" component="div">
            Users
          </Typography>
        </Toolbar>
        {!users.length ? (
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
                rowCount={users.length}
              />
              <Confirm
                show={showConfirmDelete}
                title="Are you sure?"
                message={
                  selectedUser?.username?.length
                    ? `User ${selectedUser.username.toUpperCase()} 
                     will be deleted!`
                    : ''
                }
                confirm={() => setShowDeleteConfirm(false)}
                cancel={onDelete}
                confirmText="delete"
                cancelText="cancel"
              />
              <TableBody>
                {stableSort(users, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={user.username}>
                        <TableCell
                          onClick={() => onShowUserDetails(user)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Avatar
                            src={user.image}
                            alt={user.username}
                            {...stringAvatar(`${user.username} ${user.name}`)}
                          >
                            {user.username.slice(0, 1)}
                          </Avatar>
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          onClick={() => onShowUserDetails(user)}
                          style={{ cursor: 'pointer' }}
                        >
                          {user.username}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => onShowUserDetails(user)}
                          style={{ cursor: 'pointer' }}
                        >
                          {user.email}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => onShowUserDetails(user)}
                          style={{ cursor: 'pointer' }}
                        >
                          {user.name}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => onShowUserDetails(user)}
                          style={{ cursor: 'pointer' }}
                        >
                          {Object.values(user.roles) ? (
                            Object.values(user.roles).map((item) => (
                              <Chip
                                // eslint-disable-next-line no-underscore-dangle
                                key={item + user._id}
                                icon={setIcon(item)}
                                size="small"
                                label={item}
                                color={roleColor(item)}
                                style={{ margin: '3px' }}
                              />
                            ))
                          ) : (
                            <Chip
                              key="Member"
                              icon={setIcon('Member')}
                              size="small"
                              label="Member"
                              color={roleColor('Member')}
                              style={{ margin: '3px' }}
                            />
                          )}
                        </TableCell>
                        <TableCell padding="checkbox">
                          {roles.includes('Admin') && (
                            <>
                              <IconButton aria-label="edit" onClick={() => onEdit(user)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton aria-label="edit" onClick={() => onConfirmDelete(user)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 ? (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                ) : null}
                <UserDetails
                  open={openUserDetails}
                  handleClose={() => setOpenUserDetails(false)}
                  user={chosenUser}
                />
                <FormDialog
                  title="Edit User"
                  show={showEditDialogue}
                  close={() => onEdit()}
                  user={selectedUser}
                  onShowSnackbar={onShowSnackbar}
                />
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
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
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onShowSnackbar: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  token: PropTypes.string.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  onGetUsers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.users.token,
  roles: state.users.authUser.roles,
});

const mapDispatchToProps = (dispatch) => ({
  onDeleteUser: (roles, id, token) => dispatch(deleteUser(roles, id, token)),
  onGetUsers: (token) => dispatch(getUsers(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedTable);
