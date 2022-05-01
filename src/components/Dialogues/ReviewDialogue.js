/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

function ReviewDialog(props) {
  const { show, close, addReview, review, title, onEdit } = props;
  const [open, setOpen] = React.useState(show);
  const [text, setText] = React.useState();
  const [textWarning, setTextWarning] = React.useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const resetInput = () => {
    setText('');
    setTextWarning('');
  };

  React.useEffect(() => {
    setOpen(show);
    if (review) {
      setText(review.review);
    }
  }, [show]);

  const handleClose = () => {
    setOpen(false);
    close();
    resetInput();
  };

  const onAddReview = () => {
    if (!text) {
      setTextWarning('This field must not be empty');
      return;
    }
    addReview(text);
  };

  const editReview = () => {
    if (!text) {
      setTextWarning('This field must not be empty');
      return;
    }
    onEdit(review._id, text);
    close();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', width: '30rem' }}>
          <TextField
            id="outlined-multiline-flexible"
            multiline
            label="Text"
            type="text"
            required
            autoFocus
            defaultValue={text}
            error={textWarning.length > 2}
            helperText={textWarning}
            onBlur={() =>
              !text?.length ? setTextWarning('This field must not be empty') : setTextWarning('')
            }
            fullWidth
            onChange={handleTextChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={title.includes('Compose') ? onAddReview : editReview} color="primary">
          {title.includes('Compose') ? 'add' : 'save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ReviewDialog.defaultProps = {
  review: {},
  title: 'Compose review',
  onEdit: () => null,
  addReview: () => null,
};

ReviewDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  title: PropTypes.string,
  addReview: PropTypes.func,
  onEdit: PropTypes.func,
  review: PropTypes.objectOf(PropTypes.string, PropTypes.objectOf(PropTypes.string)),
};

export default ReviewDialog;
