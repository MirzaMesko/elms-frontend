import React from 'react';
import Typography from '@material-ui/core/Typography';
// @ts-ignore
import Notification from '../Notfication/Notification.tsx';
// @ts-ignore
import type { User, NotificationType } from '../../types.ts';

interface Props {
  user: User;
  dismissNotification: () => void;
}

const NotificationsContainer: React.FC<Props> = ({ user, dismissNotification }: Props) =>
  !user.notifications?.length ? (
    <Typography className="centered" data-testid="no-notifications">
      Nothing to show here yet.
    </Typography>
  ) : (
    user.notifications
      .map((n: NotificationType) => (
        <Notification notification={n} dismiss={dismissNotification} key={n.timestamp} />
      ))
      .reverse()
  );

export default NotificationsContainer;
