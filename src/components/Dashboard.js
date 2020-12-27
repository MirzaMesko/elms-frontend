import React from 'react';
import PropTypes from 'prop-types';

export default function Dashboard(props) {
  const { authUser } = props;
  return (
    <div>
      <p>Dashboard</p>
      <p>Hello {authUser} </p>
    </div>
  );
}

Dashboard.propTypes = {
  authUser: PropTypes.string.isRequired,
};
