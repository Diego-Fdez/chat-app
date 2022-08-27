import styled from '@emotion/styled';
import Head from 'next/head';
import { useContext } from 'react';
import { doc, getDoc, collection, orderBy, getDocs } from 'firebase/firestore';
import firebase from '../../config/firebase';
import FirebaseContext from '../../context/firebaseContext';
import ChatScreen from '../../components/ChatScreen';
import getRecipientEmail from '../../utils/getRecipientEmail';

const Chat = ({ chats, message }) => {
  const chat = JSON.parse(chats);
  const messages = JSON.parse(message);
  const { user } = useContext(FirebaseContext);

  return (
    <Container>
      <Head>
        <title>Chat whit {getRecipientEmail(chat?.users, user)}</title>
      </Head>

      <ChatContainer>
        <ChatScreen chats={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
};

export default Chat;

export async function getServerSideProps(context) {
  const chatRef = doc(firebase.db, 'chats', context.query.id);

  //prep the messages on the server side
  const chatDoc = await getDoc(chatRef, orderBy('timestamp', 'desc'));

  /* Creating a new object with the id and data from the chatDoc. */
  const chat = {
    id: chatDoc?.id,
    ...chatDoc?.data(),
  };

  const querySnapshot = await getDocs(collection(chatRef, 'messages'));

  const messages = [];

  /* Pushing the data from the database into the messages array. */
  querySnapshot.forEach((doc) => {
    messages.push({
      id: doc.id,
      timestamp: doc.data().timestamp?.toDate().getTime(),
      ...doc.data(),
    });
  });

  return {
    props: {
      message: JSON.stringify(messages),
      chats: JSON.stringify(chat),
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
