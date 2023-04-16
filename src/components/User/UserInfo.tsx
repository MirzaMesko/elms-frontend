/* eslint-disable no-underscore-dangle */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import profilePlaceholder from '../../utils/profile-picture-default-png.png';
// @ts-ignore
import Loading from '../Helpers/Loading.tsx';
// @ts-ignore
import RoleChip from '../Helpers/Chip.tsx';
// @ts-ignore
import type { User } from '../../types.ts';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    padding: '4.5rem 1rem',
    backgroundColor: '#efefef',
    height: '100vh',
    alignItems: 'center',
  },
}));

const UserInfo: React.FC<User> = ({ user }: User) => {
  const classes = useStyles();
  const image = user?.image ? user.image : profilePlaceholder;

  if (!user) {
    return <Loading />;
  }

  return (
    <div className={classes.container}>
      <img src={image} alt="" className="mediumImage" data-testid="user-image" />
      <Typography gutterBottom variant="h4" data-testid="username">
        {user.username}
      </Typography>
      <RoleChip user={user} />
      <Typography gutterBottom variant="subtitle2" data-testid="user-email">
        {user.email}
      </Typography>
      <Typography gutterBottom data-testid="user-name">
        {user.name}
      </Typography>
    </div>
  );
};

export default UserInfo;
