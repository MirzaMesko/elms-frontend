/* eslint-disable no-underscore-dangle */
import React from 'react';
import Typography from '@material-ui/core/Typography';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import WarningIcon from '@material-ui/icons/Warning';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Button from '@material-ui/core/Button';
import editionPlaceholder from '../../utils/edition_placeholder.png';
// @ts-ignore
import type { Book } from '../../types.ts';

const useStyles = makeStyles((theme) => ({
  search: {
    margin: theme.spacing(3, 0, 2),
    padding: '0.1rem',
  },
  selectedBook: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0.4rem 0',
    padding: '0.2rem',
    borderBottom: '1px solid #DDD',
  },
}));

interface OwnProps {
  book: Book;
  onReturnBook: (book: Book) => void | undefined;
  lend: (book: Book) => void | undefined;
  onNotifyUser: (book: Book) => void | undefined;
  sendOverdueReminder: (book: Book) => void | undefined;
}

const ConciseBook: React.FC<OwnProps> = (props: OwnProps) => {
  const { onReturnBook, book, lend, onNotifyUser, sendOverdueReminder } = props;
  const classes = useStyles();
  const isTaken: string | undefined = book.owedBy?.dueDate;
  const showActionButtons: boolean = lend !== undefined || onReturnBook !== undefined;

  const isOverdue: boolean = isTaken ? new Date(isTaken).getTime() < new Date().getTime() : false;

  if (!book) {
    return <Typography className="centered">Nothing to show here.</Typography>;
  }

  return (
    <div className={classes.selectedBook} key={book._id}>
      <img src={book.image || editionPlaceholder} alt="" className="smallImage" />
      {book.serNo && (
        <div style={{ marginLeft: '2rem', width: '100%' }}>
          <div className="spaceBetween">
            <Typography variant="h6">{book.serNo}</Typography>
            {showActionButtons && (
              <div>
                {book.available === 'false' ? (
                  <div>
                    {onReturnBook ? (
                      <>
                        {isOverdue && (
                          <Button
                            variant="outlined"
                            color="primary"
                            style={{ marginRight: '0.5rem' }}
                            onClick={() => sendOverdueReminder(book)}
                          >
                            <WarningIcon style={{ marginRight: '0.5rem' }} /> send overdue reminder
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => onReturnBook(book)}
                        >
                          <ArrowBackIcon style={{ marginRight: '0.5rem' }} /> Return
                        </Button>
                      </>
                    ) : (
                      <Button variant="outlined" color="primary" onClick={() => onNotifyUser(book)}>
                        <NotificationsIcon style={{ marginRight: '0.5rem' }} /> set notification
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button variant="outlined" color="primary" onClick={() => lend(book)}>
                    Lend <ArrowForwardIcon style={{ marginLeft: '0.5rem' }} />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="spaceBetween">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Typography variant="subtitle1">{book.title}</Typography>
              <Typography variant="subtitle1" style={{ color: '#AAA', marginLeft: '0.4rem' }}>
                by {book.author}
              </Typography>
            </div>

            {showActionButtons && isTaken && (
              <Typography
                style={{
                  padding: '0.3rem 1rem',
                  fontStyle: 'italic',
                  color: isOverdue ? 'red' : '#3f51b5',
                }}
              >
                Due on {isTaken}
              </Typography>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConciseBook;
