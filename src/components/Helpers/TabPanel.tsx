import React from 'react';
import Box from '@material-ui/core/Box';

interface Props {
  children: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<Props> = ({ children, value, index, ...other }: Props) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`nav-tabpanel-${index}`}
    aria-labelledby={`nav-tab-${index}`}
    {...other}
  >
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

export default TabPanel;
