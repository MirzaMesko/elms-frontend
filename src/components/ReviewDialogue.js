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
  const { show, close, addReview } = props;
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
  }, [show]);

  const handleClose = () => {
    setOpen(false);
    close();
    resetInput();
  };

  const onAddReview = () => {
    if (!text) {
      setTextWarning('This filed must not be empty');
      return;
    }
    addReview(text);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Compose review</DialogTitle>
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
              !text.length ? setTextWarning('This field must not be empty') : setTextWarning('')
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
        <Button onClick={onAddReview} color="primary">
          add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ReviewDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  addReview: PropTypes.func.isRequired,
};

export default ReviewDialog;
