/* eslint-disable no-underscore-dangle */
import React from 'react';
import Chip from '@material-ui/core/Chip';
import * as helpers from './helpers';
// @ts-ignore
import type { User } from '../../types.ts';

interface Props {
  user: User;
}

const RoleChip: React.FC<Props> = ({ user }: Props) =>
  user.roles &&
  Object.values(user.roles).map((item: any) => (
    <Chip
      key={item + user._id}
      icon={helpers.setIcon(item)}
      size="small"
      label={item}
      color={helpers.roleColor(item)}
      style={{ margin: '3px' }}
      data-testid="user-roles"
    />
  ));

export default RoleChip;
