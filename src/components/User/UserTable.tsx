import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import Fade from '@material-ui/core/Fade';
import DeleteIcon from '@material-ui/icons/Delete';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import React from 'react';
import { connect, useDispatch } from 'react-redux';
// @ts-ignore
import UserDialog from '../Dialogues/UserDialogue.tsx';
import Confirm from '../Helpers/Confirm';
// @ts-ignore
import UserDetails from './User.tsx';
import EnhancedTableHead from '../Helpers/EnhancedTableHead';
import { getUsers, deleteUser } from '../../actions/users';
import * as helpers from '../Helpers/helpers';
import { LightTooltip } from '../Helpers/Tooltip';
import Loading from '../Helpers/Loading';
import Error from '../Helpers/Error';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { User } from '../../types.ts';

const headCells = [
  { id: 'username', numeric: false, disablePadding: false, label: 'Username' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'roles', numeric: true, disablePadding: false, label: 'Roles' },
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
  users: [User];
  onShowSnackbar: () => void;
  roles: Array<string>;
  token: string;
  loadingUsers: boolean;
  error: {
    error: boolean;
    message: string;
  };
}

type Props = OwnProps & RootState & AppDispatch;

const EnhancedTable: React.FC<OwnProps> = (props: Props) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('username');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showEditDialogue, setShowEditDialogue] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>();
  const [showConfirmDelete, setShowDeleteConfirm] = React.useState(false);
  const [openUserDetails, setOpenUserDetails] = React.useState(false);
  const [chosenUser, setChosenUser] = React.useState({});

  const { users, onShowSnackbar, roles, token, loadingUsers, error } = props;

  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const isLibrarian: boolean = roles.includes('Librarian');

  const handleRequestSort = (event: any, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onEdit = (user: User | null) => {
    setSelectedUser(user);
    setShowEditDialogue(!showEditDialogue);
  };

  const onConfirmDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const onDelete = () => {
    // eslint-disable-next-line no-underscore-dangle
    dispatch(deleteUser(roles, selectedUser._id, token)).then((response: any) => {
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        onShowSnackbar(true, 'error', response.message);
      }
      if (response.status === 200) {
        onShowSnackbar(true, 'success', `User deleted`);
        setShowDeleteConfirm(false);
        dispatch(getUsers(token));
      }
    });
  };

  const onShowUserDetails = (user: User) => {
    setOpenUserDetails(true);
    setChosenUser(user);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

  if (loadingUsers) {
    return <Loading />;
  }

  if (error.error) {
    return <Error message={error.message} />;
  }

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
                isLibrarian={isLibrarian}
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                // rowCount={users.length}
                headCells={headCells}
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
                {helpers
                  .stableSort(users, helpers.getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user: User) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={user.username}>
                      <TableCell
                        onClick={() => onShowUserDetails(user)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Avatar
                          src={user.image}
                          alt={user.username}
                          {...helpers.stringAvatar(`${user.username} ${user.name}`)}
                        >
                          {user.username.slice(0, 1)}
                        </Avatar>
                      </TableCell>
                      <TableCell
                        component="th"
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
                        {Object.values(user.roles).map((item) => (
                          <Chip
                            // eslint-disable-next-line no-underscore-dangle
                            key={item + user._id}
                            icon={helpers.setIcon(item)}
                            size="small"
                            label={`${item}`}
                            color={helpers.roleColor(item)}
                            style={{ margin: '3px' }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        {roles.includes('Admin') && (
                          <>
                            <LightTooltip
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title="Lend or return books"
                            >
                              <IconButton
                                aria-label="edit"
                                // eslint-disable-next-line no-underscore-dangle
                                onClick={() => history.push(`/users/lend&return/${user._id}`)}
                              >
                                <CompareArrowsIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                            <LightTooltip
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title="Edit user"
                            >
                              <IconButton aria-label="edit" onClick={() => onEdit(user)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                            <LightTooltip
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title="Delete user"
                            >
                              <IconButton aria-label="edit" onClick={() => onConfirmDelete(user)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </LightTooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
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
                <UserDialog
                  title="Edit User"
                  show={showEditDialogue}
                  close={() => onEdit(null)}
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
};

const mapStateToProps = (state: RootState) => ({
  token: state.users.token,
  roles: state.users.authUser.roles,
  loadingUsers: state.users.loading,
  error: state.users.err,
});

export default connect<RootState>(mapStateToProps)(EnhancedTable);
