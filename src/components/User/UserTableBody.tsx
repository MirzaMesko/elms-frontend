import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from 'react-router-dom';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import Fade from '@material-ui/core/Fade';
import DeleteIcon from '@material-ui/icons/Delete';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
// @ts-ignore
import { LightTooltip } from '../Helpers/Tooltip.tsx';
// @ts-ignore
import RoleChip from '../Helpers/Chip.tsx';
import * as helpers from '../Helpers/helpers';
// @ts-ignore
import type { User } from '../../types.ts';

interface Props {
  users: [User];
  rowsPerPage: number;
  order: string;
  orderBy: string;
  page: number;
  onShowUserDetails: (user: User) => void;
  authUser: {
    roles: Array<string>;
  };
  onEdit: (user: User) => void;
  onConfirmDelete: (user: User) => void;
}

const UserTableBody: React.FC<Props> = ({
  users,
  rowsPerPage,
  order,
  orderBy,
  page,
  onShowUserDetails,
  authUser,
  onConfirmDelete,
  onEdit,
}: Props) => {
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);
  const history = useHistory();
  return (
    <TableBody data-testid="user-table-body">
      {helpers
        .stableSort(users, helpers.getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((user: User) => (
          <TableRow hover role="checkbox" tabIndex={-1} key={user.username}>
            <TableCell onClick={() => onShowUserDetails(user)} style={{ cursor: 'pointer' }}>
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
              <RoleChip user={user} />
            </TableCell>
            <TableCell>
              {authUser.roles.includes('Admin') && (
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
    </TableBody>
  );
};

export default UserTableBody;
