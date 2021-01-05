import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import FormDialogue from './FormDialogue';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ManageUsers() {
  const classes = useStyles();
  const [openDialogue, setOpenDialogue] = React.useState(false);

  const handleOpen = () => {
    setOpenDialogue(true);
  };

  const handleClose = () => {
    setOpenDialogue(false);
  };

  return (
    <Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={handleOpen}
      >
        New User
      </Button>
      <FormDialogue show={openDialogue} close={handleClose} />
    </Box>
  );
}
