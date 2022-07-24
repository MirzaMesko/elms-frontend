import React from 'react';
import { Typography, Box } from '@material-ui/core';

type Msg = {
  message: string;
};

const Error: React.FC<Msg> = ({ message }: Msg) => (
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

export default Error;
