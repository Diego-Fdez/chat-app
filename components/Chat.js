import styled from '@emotion/styled';
import { Avatar } from '@mui/material';
import { useContext } from 'react';
import getRecipientEmail from '../utils/getRecipientEmail';
import FirebaseContext from '../context/firebaseContext';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, where } from 'firebase/firestore';
import { useRouter } from 'next/router';

const Chat = ({ id, users }) => {
  const { user, firebase } = useContext(FirebaseContext);
  const router = useRouter();

  /* A query to the firebase database. */
  const query = collection(firebase.db, 'users');
  where('email', '==', getRecipientEmail(users, user));
  const [recipientSnapshot] = useCollection(query);

  /* Getting the data from the firebase database. */
  const recipient = recipientSnapshot?.docs?.[1]?.data();

  /* Getting the email of the recipient. */
  const recipientEmail = getRecipientEmail(users, user);

  /**
   * When the user clicks the button, the user will be redirected to the chat page.
   */
  const handleEnterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={handleEnterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #09152383;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
