import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@material-ui/core';

const Error = ({ message }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="300px"
  >
    <Typography>Something went wrong. Please try again later.</Typography>
    <Typography>{message}</Typography>
  </Box>
);

Error.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Error;
