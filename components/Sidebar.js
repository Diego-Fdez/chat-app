import { Avatar, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import MessageIcon from '@mui/icons-material/Message';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import swal from 'sweetalert';
import * as EmailValidator from 'email-validator';
import { useState, useContext } from 'react';
import FirebaseContext from '../context/firebaseContext';
import { collection, addDoc, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';

const Sidebar = () => {
  const { user, firebase } = useContext(FirebaseContext);
  const [email, setEmail] = useState('');
  /* It's creating a reference to the chats collection. */
  const userChatRef = collection(firebase.db, 'chats');
  where('users', '==', user.email);
  /* It's using the useCollection hook to get a snapshot of the chats collection. */
  const [chatsSnapshot] = useCollection(userChatRef);

  /**
   * It's a function that takes an email as an input and checks if it's valid. If it's not valid, it
   * returns an error message. If it's valid, it returns null.
   * @returns null.
   */
  const handleCreateChat = async () => {
    swal({
      content: {
        element: 'input',
        attributes: {
          placeholder: 'Type the email',
          type: 'email',
        },
      },
    }).then((res) => setEmail(res));
    if (email === '') return null;

    /* It's checking if the email is valid, if the chat doesn't already exist, and if the email is not
    the same as the user's email. If all of those conditions are true, it adds a new chat document
    to the chats collection. */
    if (
      EmailValidator.validate(email) &&
      !chatAlreadyExists(email) &&
      email !== user.email
    ) {
      await addDoc(collection(firebase.db, 'chats'), {
        users: [user.email, email],
      });
    }
  };

  /**
   * If the chatsSnapshot object exists, return true if the recipientEmail is found in the users array
   * of any of the chat documents in the chatsSnapshot object.
   * @param recipientEmail - the email of the user you want to chat with
   */
  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <Container>
      <Header>
        <UserAvatar
          src={user?.photoURL}
          alt='user avatar'
          onClick={() => firebase.closeSession()}
        />
        <IconsContainer>
          <IconButton>
            <MessageIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder='Search in chats' />
      </Search>
      <SidebarButton onClick={handleCreateChat}>
        <CreateIcon />
        New chat
      </SidebarButton>
      {/* list of chats */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 350px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.5em;
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
  display: flex;
  position: sticky;
  /* top: 0; */
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
