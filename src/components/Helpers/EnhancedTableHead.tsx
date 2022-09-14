import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

interface Props {
  classes: { [name: string]: string };
  onRequestSort: (event: any, property: string) => void;
  isLibrarian: boolean;
  order: 'asc' | 'desc';
  orderBy: string;
  headCells: [
    {
      id: string;
      numeric: boolean;
      disablePadding: boolean;
      label: string;
    }
  ];
}

const EnhancedTableHead: React.FC<Props> = (props: Props) => {
  const { classes, order, orderBy, onRequestSort, headCells, isLibrarian } = props;
  const createSortHandler = (property: string) => (event: any) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead data-testid="table-head">
      <TableRow>
        <TableCell> </TableCell>
        {headCells.map((headCell) =>
          !isLibrarian && (headCell.id === 'serNo' || headCell.id === 'actions') ? null : (
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
};

export default EnhancedTableHead;
