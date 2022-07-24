import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props: any) {
  return <MuiAlert elevation={11} variant="filled" {...props} />;
}

interface Props {
  show: boolean;
  severity: string;
  message: string;
}

const CustomizedSnackbars: React.FC<Props> = ({ show, severity, message }: Props) => {
  const [open, setOpen] = React.useState(show);

  const handleClose = (event: React.SyntheticEvent<any>, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(show);
  }, [show]);

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomizedSnackbars;
