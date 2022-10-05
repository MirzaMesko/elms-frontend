import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import UserDialog from '../Dialogues/UserDialogue.tsx';
// @ts-ignore
import Confirm from '../Helpers/Confirm.tsx';
// @ts-ignore
import UserContainer from './UserContainer.tsx';
// @ts-ignore
import EnhancedTableHead from '../Helpers/EnhancedTableHead.tsx';
// @ts-ignore
import { getUsers, deleteUser } from '../../actions/users.tsx';
// @ts-ignore
import Loading from '../Helpers/Loading.tsx';
// @ts-ignore
import Error from '../Helpers/Error.tsx';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { User } from '../../types.ts';
// @ts-ignore
import UserTableBody from './UserTableBody.tsx';

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
}

type Props = OwnProps & RootState & AppDispatch;

const EnhancedTable: React.FC<OwnProps> = ({ users, onShowSnackbar }: Props) => {
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

  const dispatch: AppDispatch = useDispatch();
  const { token, authUser, loadingUsers, err } = useSelector((state: RootState) => state.users);
  const isLibrarian: boolean = authUser?.roles.includes('Librarian');

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
    dispatch(deleteUser(authUser.roles, selectedUser._id, token)).then((response: any) => {
      if (response.status === 200) {
        setShowDeleteConfirm(false);
        dispatch(getUsers(token));
      }
    });
  };

  const onShowUserDetails = (user: User) => {
    setOpenUserDetails(true);
    setChosenUser(user);
  };

  if (loadingUsers) {
    return <Loading />;
  }

  if (err.error) {
    return <Error message={err.message} />;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography variant="h6" id="tableTitle" component="div" data-testid="user-table-title">
            Users
          </Typography>
        </Toolbar>
        {!users.length ? (
          <div
            style={{ display: 'flex', justifyContent: 'center' }}
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
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                isLibrarian={isLibrarian}
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
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
                cancel={() => setShowDeleteConfirm(false)}
                confirm={onDelete}
                confirmText="delete"
                cancelText="cancel"
              />
              <UserTableBody
                users={users}
                authUser={authUser}
                page={page}
                order={order}
                orderBy={orderBy}
                rowsPerPage={rowsPerPage}
                onShowUserDetails={onShowUserDetails}
                onEdit={onEdit}
                onConfirmDelete={onConfirmDelete}
              />
              <UserContainer
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
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
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
