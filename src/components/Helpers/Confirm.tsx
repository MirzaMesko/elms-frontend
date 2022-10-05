import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const styles = (theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children } = props;
  return (
    <MuiDialogTitle disableTypography className="styles.root">
      <Typography variant="h6">{children}</Typography>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

interface ConfirmProps {
  show: boolean;
  title: string;
  message: string;
  confirm: () => void;
  cancel: () => void;
  cancelText: string;
  confirmText: string;
}

const Confirm: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const { show, title, message, confirm, cancel, cancelText, confirmText } = props;
  const [open, setOpen] = React.useState(show);

  React.useEffect(() => {
    setOpen(show);
  }, [show]);

  return (
    <Dialog aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={cancel} color="primary" data-testid="cancel">
          {cancelText}
        </Button>
        <Button onClick={confirm} color="primary" data-testid="confirm">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirm;
