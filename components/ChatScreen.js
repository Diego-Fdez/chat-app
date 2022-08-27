import styled from '@emotion/styled';
import { Avatar, IconButton } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { useContext, useRef, useState } from 'react';
import TimeAgo from 'timeago-react';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection,
  doc,
  orderBy,
  query,
  where,
  serverTimestamp,
  setDoc,
  addDoc,
} from 'firebase/firestore';
import FirebaseContext from '../context/firebaseContext';
import getRecipientEmail from '../utils/getRecipientEmail';
import Message from './Message';

const ChatScreen = ({ chats, messages }) => {
  const { user, firebase } = useContext(FirebaseContext);
  const router = useRouter();
  const [words, setWords] = useState('');
  const endOfMessageRef = useRef(null);

  /* Getting the chat id from the database. */
  const chatRef = doc(firebase.db, 'chats', router.query.id);

  /* Getting the messages from the database. */
  const [messagesSnapshot] = useCollection(
    query(collection(chatRef, 'messages'), orderBy('timestamp', 'asc'))
  );
  /* Getting the recipient's email from the database. */
  const [recipientSnapshot] = useCollection(
    query(
      collection(firebase.db, 'users'),
      where('email', '==', getRecipientEmail(chats.users, user))
    )
  );

  /**
   * If messagesSnapshot is true, then return the messagesSnapshot.docs.map() function, otherwise
   * return the messages.map() function.
   * @returns the messagesSnapshot.docs.map() function.
   */
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          users={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return messages.map((message) => (
        <Message
          key={message.id}
          users={message.user}
          message={{ ...message }}
        />
      ));
    }
  };

  /**
   * It takes the reference to the last message in the chat and scrolls to it.
   */
  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  /**
   * When the user clicks the send button, the message is sent to the database and the input field is
   * cleared.
   * @param e - the event object
   */
  const handleSendMessage = (e) => {
    e.preventDefault();

    try {
      const userCollection = collection(firebase.db, 'users');

      // update last seen
      setDoc(
        doc(userCollection, user.uid),
        {
          lastSeen: serverTimestamp(),
        },
        { merge: true } // update fields if exists
      );
      const messageCollection = collection(
        firebase.db,
        'chats',
        router.query.id,
        'messages'
      );
      addDoc(messageCollection, {
        user: user.email,
        timestamp: serverTimestamp(),
        message: words,
        photoURL: user.photoURL,
      });

      setWords('');
      scrollToBottom();
    } catch (error) {
      console.log(error);
    }
  };

  /* Getting the recipient's email from the database. */
  const recipientEmail = getRecipientEmail(chats.users, user);

  /* Getting the recipient from the database. */
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  return (
    <Container>
      <Header>
        <IconButton>
          <ArrowCircleLeftIcon type='button' onClick={() => router.push('/')} />
        </IconButton>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                'Unavailable'
              )}
            </p>
          ) : (
            <p>Loading last active...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
        <InputContainer>
          <InsertEmoticonIcon />
          <Input
            placeholder='Message'
            type='text'
            value={words}
            onChange={(e) => setWords(e.target.value)}
          />
          <Button
            hidden
            disabled={!words}
            type='submit'
            onClick={handleSendMessage}
          >
            Send Message
          </Button>
          <MicIcon />
        </InputContainer>
      </MessageContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.form`
  display: flex;
  width: 95%;
  margin: auto;
  align-items: center;
  padding: 10px;
  position: absolute;
  bottom: 1px;
  border: 1px solid #40b7ad;
  z-index: 100;

  /* @media (max-width: 350px) {
    width: 70%;
  } */

  @media (max-width: 1080px) {
    width: 80%;
  }
`;

const Input = styled.input`
  flex: 1;
  align-items: center;
  outline: 0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
  background-color: #fff;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  background-color: #40b7ad;
  border: 2px solid #40b7ad;
  color: #202020;
  font-weight: 700;
  transition: color 0.3s;

  :hover {
    color: #fff;
    background-color: transparent;
  }
`;

const Header = styled.div`
  position: sticky;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 15px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;

  SVG {
    font-size: 40px;
    margin-right: 10px;
  }
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #0d2036;
  min-height: 90vh;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const HeaderIcons = styled.div``;
