/* eslint-disable react/jsx-fragments */
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import Title from './Title';

export default function Section(props) {
  const { title, text } = props;
  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Typography>{text}</Typography>
    </React.Fragment>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
