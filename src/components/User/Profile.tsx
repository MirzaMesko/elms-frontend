/* eslint-disable no-underscore-dangle */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import profilePlaceholder from '../../utils/profile-picture-default-png.png';
import * as helpers from '../Helpers/helpers';
// @ts-ignore
import Loading from '../Helpers/Loading.tsx';
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

const Profile: React.FC<User> = (props: User) => {
  const classes = useStyles();
  const { user } = props;

  const image = user?.image ? user.image : profilePlaceholder;

  if (!user.username) {
    return <Loading />;
  }

  return (
    <div className={classes.container}>
      <img src={image} alt="" className="mediumImage" />
      <Typography gutterBottom variant="h4">
        {user.username}
      </Typography>
      {Object.values(user.roles).map((item) => (
        <Chip
          key={item + user._id}
          icon={helpers.setIcon(item)}
          size="small"
          label={`${item}`}
          color={helpers.roleColor(item)}
          style={{ margin: '3px' }}
        />
      ))}
      <Typography gutterBottom variant="subtitle2">
        {user.email}
      </Typography>
      <Typography gutterBottom>{user.name}</Typography>
    </div>
  );
};

export default Profile;
