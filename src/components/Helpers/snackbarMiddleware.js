import { closeSnackbarMessage } from '../../actions/books.tsx';

// eslint-disable-next-line no-unused-vars
const snackbarMiddleware = (storeAPI) => (next) => (action) => {
  if (action.type === 'SHOW_SNACKBAR_MESSAGE') {
    setTimeout(() => {
      closeSnackbarMessage();
    }, 5000);
  }
  return next(action);
};

export default snackbarMiddleware;
