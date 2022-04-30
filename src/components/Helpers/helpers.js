/* eslint-disable import/prefer-default-export */
import React from 'react';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
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

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stringToColor(string) {
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

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export const roleColor = (item) => {
  if (item === 'Admin') {
    return 'secondary';
  }
  if (item === 'Librarian') {
    return 'primary';
  }
  return 'default';
};

export const setIcon = (item) => {
  if (item === 'Admin') {
    return <VerifiedUserIcon />;
  }
  if (item === 'Librarian') {
    return <AssignmentIndIcon />;
  }
  return <AccountCircleIcon />;
};
