/* eslint-disable no-underscore-dangle */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Button from '@material-ui/core/Button';
import editionPlaceholder from '../utils/edition_placeholder.png';

const useStyles = makeStyles((theme) => ({
  image: {
    height: '80px',
    width: '60px',
    display: 'inline-flex',
    objectFit: 'cover',
  },
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
  centered: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '0.3rem',
  },
}));

const ConciseBook = (props) => {
  const { onReturnBook, book, lend } = props;
  const classes = useStyles();

  if (!book) {
    return <Typography className={classes.centered}>Nothing to show here.</Typography>;
  }

  return (
    <div className={classes.selectedBook} key={book._id}>
      <img src={book.image || editionPlaceholder} alt="" className={classes.image} />
      {book.serNo && (
        <div style={{ marginLeft: '2rem', width: '100%' }}>
          <div className={classes.firstRow}>
            <Typography variant="h6">{book.serNo}</Typography>
            {book.available === 'false' ? (
              <Button variant="outlined" color="primary" onClick={() => onReturnBook(book)}>
                <ArrowBackIcon style={{ marginRight: '0.5rem' }} /> Return
              </Button>
            ) : (
              <Button variant="outlined" color="primary" onClick={() => lend(book)}>
                Lend <ArrowForwardIcon style={{ marginLeft: '0.5rem' }} />
              </Button>
            )}
          </div>
          <div className={classes.firstRow}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Typography variant="subtitle1">{book.title}</Typography>
              <Typography variant="subtitle1" style={{ color: '#AAA', marginLeft: '0.4rem' }}>
                by {book.author}
              </Typography>
            </div>

            {book.owedBy?.dueDate.length > 1 && (
              <Typography
                style={{
                  padding: '0.3rem 1rem',
                  fontStyle: 'italic',
                  color: '#3f51b5',
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
  book: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string), PropTypes.String).isRequired,
  onReturnBook: PropTypes.func.isRequired,
  lend: PropTypes.func.isRequired,
};

export default ConciseBook;
