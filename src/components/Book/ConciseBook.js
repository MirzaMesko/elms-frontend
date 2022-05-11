/* eslint-disable no-underscore-dangle */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import WarningIcon from '@material-ui/icons/Warning';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Button from '@material-ui/core/Button';
import editionPlaceholder from '../../utils/edition_placeholder.png';

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

const ConciseBook = (props) => {
  const { onReturnBook, book, lend, onNotifyUser, sendOverdueReminder } = props;
  const classes = useStyles();

  const isOverdue = new Date(book.owedBy?.dueDate).getTime() < new Date().getTime();

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
            {lend || onReturnBook ? (
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
            ) : null}
          </div>
          <div className="spaceBetween">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Typography variant="subtitle1">{book.title}</Typography>
              <Typography variant="subtitle1" style={{ color: '#AAA', marginLeft: '0.4rem' }}>
                by {book.author}
              </Typography>
            </div>

            {(lend || onReturnBook) && book.owedBy?.dueDate.length > 1 && (
              <Typography
                style={{
                  padding: '0.3rem 1rem',
                  fontStyle: 'italic',
                  color: isOverdue ? 'red' : '#3f51b5',
                }}
              >
                Due on {book.owedBy.dueDate}
              </Typography>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ConciseBook.propTypes = {
  book: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.string,
      category: PropTypes.string,
      available: PropTypes.string,
      description: PropTypes.string,
      dueDate: PropTypes.string,
      owedBy: PropTypes.objectOf(PropTypes.string),
      reviews: PropTypes.arrayOf(PropTypes.string),
      reservedBy: PropTypes.arrayOf(PropTypes.string),
      rating: PropTypes.number,
      author: PropTypes.string,
    })
  ),
  onReturnBook: PropTypes.func,
  lend: PropTypes.func,
  onNotifyUser: PropTypes.func,
  sendOverdueReminder: PropTypes.func,
};

ConciseBook.defaultProps = {
  onReturnBook: null,
  lend: null,
  onNotifyUser: null,
  sendOverdueReminder: null,
  book: {},
};

export default ConciseBook;
