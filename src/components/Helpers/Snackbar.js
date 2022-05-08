import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';

function Alert(props) {
  return <MuiAlert elevation={11} variant="filled" {...props} />;
}

export default function CustomizedSnackbars(props) {
  const { show, severity, message } = props;
  const [open, setOpen] = React.useState(show);

  const handleClose = (event, reason) => {
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
}

CustomizedSnackbars.propTypes = {
  show: PropTypes.bool.isRequired,
  severity: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};
