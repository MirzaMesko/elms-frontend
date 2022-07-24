/* eslint-disable react/jsx-fragments */
import Typography from '@material-ui/core/Typography';
import React from 'react';
// @ts-ignore
import Title from './Title.tsx';

interface Props {
  title: string;
  text: string;
}

const Card: React.FC<Props> = ({ title, text }: Props) => (
  <React.Fragment>
    <Title>{title}</Title>
    <Typography>{text}</Typography>
  </React.Fragment>
);

export default Card;
