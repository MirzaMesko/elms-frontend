import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import editionPlaceholder from '../utils/edition_placeholder2.png';

const useStyles = makeStyles(() => ({
  image: {
    maxWidth: '50%',
    display: 'inline-flex',
  },
  container: {
    display: 'flex',
    maxHeight: '500px',
    padding: '1rem',
  },
}));

export default function BookDetails(props) {
  const { open, handleClose, book } = props;
  const classes = useStyles();

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
      >
        <div className={classes.container}>
          <img src={book.image || editionPlaceholder} alt="" className={classes.image} />
          <DialogContent>
            <Typography gutterBottom variant="h4">
              {book.title}
            </Typography>
            <Typography gutterBottom variant="subtitle2">
              by {book.author}
            </Typography>
            <Typography gutterBottom>Category: {book.category}</Typography>
            <Typography gutterBottom variant="h6">
              About {book.title}
            </Typography>
            <Typography gutterBottom variant="body1">
              {book.description}
            </Typography>
          </DialogContent>
        </div>

        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            back to books
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

BookDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  book: PropTypes.objectOf(PropTypes.string).isRequired,
};
