import { useCallback, useEffect, useState, useMemo } from 'react';
import { Conversation, Message, Stream } from '@xmtp/xmtp-js';
import { useXmtp } from './useXmtp';
import { XmtpStatus } from 'contexts/XmtpContext';

export enum ConversationStatus {
  waitingForClient = 'waiting for client',
  loadingPeer = 'loading peer bundle',
  noPeerAvailable = 'no peer available',
  loadingConversation = 'loading conversation',
  loadingMessages = 'loading messages',
  noMessages = 'no messages',
  ready = 'ready',
  somethingWentWrong = 'something went wrong!',
}

export function useXmtpConversation(peerAddress: string | null | undefined) {
  const { client: xmtp, status: xmtpStatus } = useXmtp();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[] | undefined>(undefined);
  const [stream, setStream] = useState<Stream<Message> | null>(null);
  const [isPeerInitialized, setIsPeerInitialized] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    const check = async () => {
      if (xmtp !== null) {
        if (peerAddress) {
          try {
            const result = await xmtp.canMessage(peerAddress);
            setIsPeerInitialized(result || false);
          } catch (err) {
            console.error('Caught an error with xmtp.canMessage');
            setIsPeerInitialized(false);
          }
        }
      }
    };
    check();
  }, [xmtp, peerAddress]);

  useEffect(() => {
    const getConvo = async () => {
      if (!xmtp || !peerAddress || !isPeerInitialized) {
        return;
      }
      const result = await xmtp.conversations.newConversation(peerAddress);
      setConversation(result);
    };
    getConvo();
  }, [xmtp, peerAddress, isPeerInitialized]);

  // First we fetch the most recent 100 messages
  useEffect(() => {
    const listMessages = async () => {
      if (!conversation) return;
      const msgs = await conversation.messages({ pageSize: 100 });
      setMessages(msgs);
    };
    listMessages();
  }, [conversation]);

  // Then we tell xmtp to continue streaming us messages from the conversation.
  useEffect(() => {
    const streamMessages = async () => {
      if (!conversation) return;
      const messageStream = conversation.streamMessages();
      // Save the stream in state so we can stop the stream when the component unmounts.
      setStream(messageStream);
      for await (const msg of messageStream) {
        setMessages((prevState) => {
          return (prevState || []).concat([msg]);
        });
      }
    };
    streamMessages();
  }, [conversation, peerAddress]);

  // When the component unmounts we stop the message stream.
  useEffect(() => {
    return () => {
      stream && stream.return();
    };
  }, [stream]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!conversation) return;
      await conversation.send(message);
    },
    [conversation]
  );

  const status = useMemo(() => {
    if (xmtpStatus !== XmtpStatus.ready)
      return ConversationStatus.waitingForClient;
    if (isPeerInitialized === undefined) return ConversationStatus.loadingPeer;
    if (isPeerInitialized === false) return ConversationStatus.noPeerAvailable;
    if (conversation === null) return ConversationStatus.loadingConversation;
    if (messages === undefined) return ConversationStatus.loadingMessages;
    if (messages.length === 0) return ConversationStatus.noMessages;
    if (messages.length > 0) return ConversationStatus.ready;
    console.log('xmtp is', xmtp);
    console.log('isPeerInitialized is', isPeerInitialized);
    console.log('conversation is', conversation);
    console.log('messages is', messages);
    return ConversationStatus.somethingWentWrong;
  }, [xmtp, isPeerInitialized, conversation, messages]);

  return {
    conversation,
    messages: messages || [],
    isLoading: messages === undefined,
    status,
    sendMessage,
  };
}
