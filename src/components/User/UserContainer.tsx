/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import { notifyUser } from '../../actions/users.tsx';
// @ts-ignore
import EmailDialogue from '../Dialogues/EmailDialogue.tsx';
// @ts-ignore
import NotificationDialogue from '../Dialogues/NotificationDialogue.tsx';
// @ts-ignore
import { sendEmail } from '../../actions/email.tsx';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import type { User } from '../../types.ts';
// @ts-ignore
import UserDetails from './User.tsx';
// @ts-ignore
import { showSnackbarMessage } from '../../actions/books.tsx';

interface OwnProps {
  open: boolean;
  handleClose: () => void;
  user: User;
}

type Props = OwnProps & RootState & AppDispatch;

const UserContainer: React.FC<OwnProps> = ({ open, handleClose, user }: Props) => {
  const [showEmailDialogue, setShowEmailDialogue] = React.useState(false);
  const [showNotificationDialogue, setShowNotificationDialogue] = React.useState(false);

  const dispatch: AppDispatch = useDispatch();
  const history: any = useHistory();
  const { token, authUser } = useSelector((state: RootState) => state.users);

  const handleSendEmail = (email: string, subject: string, text: string) => {
    dispatch(sendEmail(token, authUser.roles, email, subject, text)).then((resp: any) => {
      if (resp.status === 200) {
        setShowEmailDialogue(false);
      }
    });
  };

  const handleSendNotification = (text: string) => {
    dispatch(notifyUser(token, authUser.roles, user._id, text)).then((resp: any) => {
      if (resp.status === 200) {
        setShowNotificationDialogue(false);
        dispatch(
          showSnackbarMessage('success', `Your notification has been sent to ${user.username}.`)
        );
      }
    });
  };

  return (
    <>
      <EmailDialogue
        show={showEmailDialogue}
        close={() => setShowEmailDialogue(false)}
        emailSubject=""
        emailText=""
        sendEmail={handleSendEmail}
        recepientsEmail={user.email}
      />
      <NotificationDialogue
        show={showNotificationDialogue}
        close={() => setShowNotificationDialogue(false)}
        sendNotification={handleSendNotification}
      />
      <UserDetails
        open={open}
        user={user}
        handleClose={handleClose}
        showNotificationDialogue={() => setShowNotificationDialogue(true)}
        showEmailDialogue={() => setShowEmailDialogue(true)}
        history={history}
      />
    </>
  );
};

export default UserContainer;
