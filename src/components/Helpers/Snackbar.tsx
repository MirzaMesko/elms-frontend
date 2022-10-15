import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
import {
  closeSnackbarMessage,
  // @ts-ignore
} from '../../actions/books.tsx';

function Alert(props: any) {
  return <MuiAlert elevation={11} variant="filled" {...props} />;
}

const CustomizedSnackbars: React.FC = () => {
  const { show, severity, message } = useSelector((state: RootState) => state.books.snackbar);
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = React.useState(show);

  const handleClose = (event: React.SyntheticEvent<any>, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbarMessage());
  };

  React.useEffect(() => {
    setOpen(show);
  }, [show]);

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={5000}
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
