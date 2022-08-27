import styled from '@emotion/styled';
import moment from 'moment';
import { useContext } from 'react';
import FirebaseContext from '../context/firebaseContext';

const Message = ({ users, message }) => {
  const { user } = useContext(FirebaseContext);

  const TypeOfMessage = users === user ? Sender : Receiver;

  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  );
};

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
  color: #fff;
`;
const Receiver = styled(MessageElement)`
  background-color: #ccc;
  text-align: left;
  color: #202020;
`;

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
