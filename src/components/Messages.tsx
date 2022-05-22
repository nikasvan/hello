import { useXmtpConversation } from 'hooks';
import { useCallback } from 'react';
import styled from 'styled-components';
import MessageInput from './MessageInput';
import MessageBubble from './MessageBubble';
import ConversationHeader from './ConversationHeader';

interface MessagesProps {
  peerEnsName: string | null | undefined;
  peerAddress: string;
}

export default function Messages(props: MessagesProps) {
  const { messages, sendMessage } = useXmtpConversation(props.peerAddress);

  const doSendMessage = useCallback(
    (message: string) => {
      sendMessage(message);
    },
    [sendMessage]
  );

  return (
    <>
      <ConversationHeader peerAddress={props.peerAddress} />
      <List>
        {messages.map((message) => {
          return (
            <MessagePosition
              key={message.id}
              right={props.peerAddress === message.recipientAddress}>
              <MessageBubble
                message={message.content}
                backgroundColor={
                  props.peerAddress === message.recipientAddress
                    ? '#50456f'
                    : '#231A3A'
                }
              />
            </MessagePosition>
          );
        })}
      </List>
      <FixedFooter>
        <MessageInput onSendMessage={doSendMessage} />
      </FixedFooter>
    </>
  );
}

const List = styled.ul`
  display: flex;
  flex-direction: column-reverse;
  margin-top: 96px;
  height: calc(100vh - 96px - 96px);
  overflow: scroll;
  gap: 1rem;
  padding: 1rem;
  width: 100%;
`;

const FixedFooter = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  height: 96px;
  border-top: 2px solid #191027;
`;

const MessagePosition = styled.div`
  max-width: 80%;
  align-self: ${(props: { right: boolean }) =>
    props.right ? 'flex-end' : 'flex-start'};
`;
