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
    data-testid="error"
  >
    <Typography data-testid="error-message">
      {message || 'Something went wrong. Please try again.'}
    </Typography>
  </Box>
);

export default Error;
