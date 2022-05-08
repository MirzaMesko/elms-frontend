/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

function EmailDialog(props) {
  const { show, close, emailSubject, emailText, sendEmail, recepientsEmail } = props;
  const [open, setOpen] = React.useState(show);
  const [subject, setSubject] = React.useState();
  const [subjectWarning, setSubjectWarning] = React.useState('');
  const [text, setText] = React.useState();
  const [textWarning, setTextWarning] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const resetInput = () => {
    setEmail('');
    setSubject('');
    setText('');
    setSubjectWarning('');
    setTextWarning('');
  };

  React.useEffect(() => {
    setOpen(show);
    setSubject(emailSubject);
    setText(emailText);
    setEmail(recepientsEmail);
  }, [show]);

  const handleClose = () => {
    setOpen(false);
    close();
    resetInput();
  };

  const onSendEmail = () => {
    if (!subject) {
      setSubjectWarning('Subject must not be empty');
      return;
    }
    if (!text) {
      setTextWarning('This filed must not be empty');
      return;
    }
    sendEmail(email, subject, text);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Compose email</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', height: '20rem' }}>
          <div>
            <TextField
              focus="true"
              margin="dense"
              defaultValue={email}
              label="To*"
              type="email"
              disabled
              fullWidth
              onChange={handleEmailChange}
            />
            <TextField
              margin="dense"
              autoComplete="off"
              label="Subject*"
              defaultValue={subject}
              type="text"
              fullWidth
              error={subjectWarning.length > 2}
              helperText={subjectWarning}
              onBlur={() =>
                !subject.length
                  ? setSubjectWarning('Subject must not be empty')
                  : setSubjectWarning('')
              }
              onChange={handleSubjectChange}
            />
            <TextField
              id="outlined-multiline-flexible"
              multiline
              label="Text"
              type="text"
              required
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
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSendEmail} color="primary">
          send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EmailDialog.defaultProps = {
  recepientsEmail: '',
};

EmailDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  emailSubject: PropTypes.string.isRequired,
  emailText: PropTypes.string.isRequired,
  sendEmail: PropTypes.func.isRequired,
  recepientsEmail: PropTypes.string,
};

export default EmailDialog;
