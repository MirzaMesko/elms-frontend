/* eslint-disable react/button-has-type */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import IconButton from '@material-ui/core/IconButton';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {
  addBook,
  getBooks,
  editBook,
  showSnackbarMessage,
  // @ts-ignore
} from '../../actions/books.tsx';
// @ts-ignore
import Confirm from '../Helpers/Confirm.tsx';
// @ts-ignore
import BasicSelect from '../Helpers/Select.tsx';
import editionPlaceholder from '../../utils/edition_placeholder2.png';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { Book } from '../../types.ts';

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '90vw',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: '-4.5rem',
  },
  cameraIcon: {
    color: '#f5f5f5',
    backgroundColor: 'rgb(0, 0, 0, 0.2)',
    padding: '5px',
    fontSize: '48',
    borderRadius: '20%',
  },
}));

const categoryOptions = [
  'All books',
  'Politics',
  'History',
  'Romance',
  'Science Fiction & Fantasy',
  'Biographies',
  'Classics',
  'Course books',
];

interface OwnProps {
  show: boolean;
  close: () => void;
  title: string;
  book: Book;
}

type Props = OwnProps & RootState;

const BookDialog: React.FC<OwnProps> = ({ show, close, title, book }: Props) => {
  const maxNumber = 69;
  const classes = useStyles();

  const [images, setImages] = React.useState<any>([]);
  const [state, setState] = React.useState({
    bookId: '',
    bookTitle: '',
    author: '',
    year: '',
    image: editionPlaceholder,
    description: '',
    publisher: '',
    serNo: '',
    category: '',
    keepInfo: false,
    open: show,
    openConfirm: false,
  });

  const dispatch: AppDispatch = useDispatch();
  const { token, authUser } = useSelector((reduxState: RootState) => reduxState.users);
  const { roles } = authUser;

  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    // data for submit
    // eslint-disable-next-line no-console
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
    setState({ ...state, image: imageList[0].dataURL });
  };

  const handleChange = (event: { target: { name: string; value: string | boolean } }) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleCategoryChange = (selectedCategory: string) => {
    setState({ ...state, category: selectedCategory });
  };

  const handleKeepInfoChange = (event: { target: { name: any; checked: boolean } }) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const resetInput = () => {
    setState({
      ...state,
      bookId: '',
      bookTitle: '',
      author: '',
      year: '',
      image: editionPlaceholder,
      description: '',
      publisher: '',
      serNo: '',
      category: '',
      keepInfo: false,
      open: false,
      openConfirm: false,
    });
    setImages([]);
  };

  const handleClose = () => {
    close();
    resetInput();
    dispatch(getBooks(token));
  };

  const onAddNewBook = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!state.bookTitle || !state.author || !state.serNo || !state.year) {
      dispatch(showSnackbarMessage('error', 'Please fill in the required fileds!'));
      return;
    }
    dispatch(
      addBook(
        roles,
        state.bookTitle,
        state.author,
        state.year,
        state.description,
        state.category,
        state.image,
        state.publisher,
        state.serNo,
        token
      )
    ).then((response: any) => {
      if (response.status === 201) {
        if (!state.keepInfo) {
          handleClose();
        }
      }
    });
  };

  const onEditSingleBook = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    dispatch(
      editBook(
        roles,
        state.bookId,
        state.bookTitle,
        state.author,
        state.year,
        state.description,
        state.category,
        state.image,
        state.publisher,
        state.serNo,
        token
      )
    ).then((response: any) => {
      if (response.status === 200) {
        handleClose();
      }
    });
  };

  const showConfirm = () => {
    if (state.bookTitle?.length || state.author?.length) {
      setState({ ...state, openConfirm: true });
    } else {
      handleClose();
    }
  };

  React.useEffect(() => {
    setState({ ...state, open: show });
    if (book?.title) {
      setState({
        ...state,
        bookId: book._id,
        bookTitle: book.title,
        author: book.author,
        year: book.year,
        image: book.image || editionPlaceholder,
        description: book.description,
        publisher: book.publisher,
        serNo: book.serNo,
        category: book.category,
        keepInfo: false,
        open: show,
      });
    }
  }, [show, book]);

  return (
    <Dialog
      open={state.open}
      onClose={showConfirm}
      aria-labelledby="form-dialog-title"
      className={classes.container}
    >
      <Confirm
        show={state.openConfirm}
        title="Are you sure?"
        message="Entered input will be lost. Are you sure you want to cancel?"
        cancel={handleClose}
        confirm={() => setState({ ...state, openConfirm: false })}
        cancelText="confirm cancel"
        confirmText="continue editing"
      />
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>Please fill in the following information.</DialogContentText>
        <div style={{ display: 'flex' }}>
          <div>
            <input type="image" id="image" alt="Login" src={state.image} className="mediumImage" />
            <div className={classes.content}>
              <ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber}>
                {({ onImageUpload, dragProps }) => (
                  <div>
                    <IconButton onClick={onImageUpload} {...dragProps}>
                      <CameraAltIcon
                        className={classes.cameraIcon} />
                    </IconButton>                  
                    </div>
                )}
              </ImageUploading>
            </div>
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title*"
              defaultValue={state.bookTitle}
              type="text"
              fullWidth
              name="bookTitle"
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="author"
              defaultValue={state.author}
              label="Author*"
              type="text"
              fullWidth
              name="author"
              onChange={handleChange}
            />

            <BasicSelect
              onChange={handleCategoryChange}
              selected={state.category || 'All books'}
              options={categoryOptions}
              label="Category"
            />
            <TextField
              margin="dense"
              id="publisher"
              label="Publisher"
              type="text"
              defaultValue={state.publisher}
              fullWidth
              name="publisher"
              onChange={handleChange}
            />
            <div style={{ display: 'flex' }}>
              <TextField
                margin="dense"
                id="serNo"
                label="Serial No*"
                type="text"
                defaultValue={state.serNo}
                name="serNo"
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="year"
                label="Year*"
                type="year"
                defaultValue={state.year}
                style={{ marginLeft: '5px' }}
                name="year"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <TextField
          margin="dense"
          id="outlined-multiline-flexible"
          multiline
          label="Description"
          type="text"
          defaultValue={state.description}
          fullWidth
          name="description"
          onChange={handleChange}
        />
        {title.includes('Add') && (
          <FormControlLabel
            control={
              <Switch
                checked={state.keepInfo}
                onChange={handleKeepInfoChange}
                name="keepInfo"
                color="primary"
              />
            }
            label="save entered input for another entry"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={showConfirm} color="primary">
          Cancel
        </Button>
        <Button onClick={title.includes('Edit') ? onEditSingleBook : onAddNewBook} color="primary">
          {title.includes('Edit') ? 'Save Changes' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default BookDialog;
