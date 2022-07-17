import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';

function LinkTab(props) {
  const history = useHistory();
  const { href, username, label } = props;
  return (
    <Tab
      component="a"
      label={label}
      onClick={(event) => {
        event.preventDefault();
        if (!window.history.href?.includes(`${href}`)) {
          history.push(`/users/settings/${username}/${href}`);
        }
      }}
      {...props}
    />
  );
}

LinkTab.propTypes = {
  href: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default LinkTab;
