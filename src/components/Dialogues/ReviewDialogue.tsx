/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface OwnProps {
  show: boolean;
  close: () => void;
  title: string;
  addReview: (text: string) => Promise<any>;
  onEdit: (id: string, text: string) => Promise<any>;
  review: {
    _id: string;
    userId: string;
    timestamp: string;
    review: string;
  };
  text: string;
}

const ReviewDialog: React.FC<OwnProps> = (props: OwnProps) => {
  const { show, close, addReview, review, title, onEdit } = props;
  const [open, setOpen] = React.useState(show);
  const [text, setText] = React.useState('');
  const [textWarning, setTextWarning] = React.useState('');

  const handleTextChange = (event: { target: { value: string } }) => {
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
    resetInput();
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
    <div data-testid="review-dialog">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        style={{ maxWidth: '80vw', margin: '0 auto' }}
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent data-testid="review-dialog-content">
          <div className="dialogueContainer">
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
    </div>
  );
};

export default ReviewDialog;
