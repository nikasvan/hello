import { useCallback, useEffect, useState, useMemo } from 'react';
import { Conversation, Message, Stream } from '@xmtp/xmtp-js';
import { useXmtp } from './useXmtp';
import { XmtpStatus } from 'contexts/XmtpContext';
import { useMetrics } from './useMetrics';

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
  const {
    recordMessagesEvents,
    recordSendMessageEvent,
    recordPeerNotInitializedEvent,
  } = useMetrics();

  useEffect(() => {
    const check = async () => {
      if (xmtp !== null) {
        if (peerAddress) {
          try {
            const result = await xmtp.canMessage(peerAddress);
            if (Boolean(result) === false) {
              try {
                await recordPeerNotInitializedEvent(peerAddress);
              } catch (err) {
                console.error('Caught an error with recordPeerNotInitialized');
              }
            }
            setIsPeerInitialized(result || false);
          } catch (err) {
            console.error('Caught an error with xmtp.canMessage');
            setIsPeerInitialized(false);
          }
        }
      }
    };
    check();
  }, [xmtp, peerAddress, recordPeerNotInitializedEvent]);

  useEffect(() => {
    const getConvo = async () => {
      if (!xmtp || !peerAddress || !isPeerInitialized) {
        return;
      }
      let result: Conversation | null = null;
      try {
        result = await xmtp.conversations.newConversation(peerAddress);
      } catch (error) {
        console.error('Caught an error with xmtp.newConversation');
      }

      setConversation(result);
    };
    getConvo();
  }, [xmtp, peerAddress, isPeerInitialized]);

  // First we fetch the most recent 100 messages
  useEffect(() => {
    const listMessages = async () => {
      if (!conversation) return;
      let msgs: Message[] = [];
      try {
        msgs = await conversation.messages({ pageSize: 100 });
        try {
          recordMessagesEvents(msgs);
        } catch (error) {
          console.error('Caught an error with recordMessagesEvents');
        }
      } catch (error) {
        console.error('Caught an error with xmtp.conversations.messages');
      }
      setMessages(msgs);
    };
    listMessages();
  }, [conversation, recordMessagesEvents]);

  // Then we tell xmtp to continue streaming us messages from the conversation.
  useEffect(() => {
    const streamMessages = async () => {
      if (!conversation) return;
      let messageStream: Stream<Message> | null = null;
      try {
        messageStream = await conversation.streamMessages();
      } catch (error) {
        console.error('Caught an error with xmtp.conversations.streamMessages');
      }

      // Save the stream in state so we can stop the stream when the component unmounts.
      if (messageStream) {
        setStream(messageStream);
        for await (const msg of messageStream) {
          setMessages((prevState) => {
            return (prevState || []).concat([msg]);
          });
        }
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
      try {
        await conversation.send(message);
        try {
          if (xmtp) {
            recordSendMessageEvent(xmtp.address, conversation.peerAddress);
          }
        } catch (error) {
          console.error('Caught an error with recordSendMessageEvent');
        }
      } catch (error) {
        console.error('Caught an error with xmtp.conversations.send');
      }
    },
    [conversation, recordSendMessageEvent, xmtp]
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
    return ConversationStatus.somethingWentWrong;
  }, [xmtpStatus, isPeerInitialized, conversation, messages]);

  return {
    conversation,
    messages: messages || [],
    isLoading: messages === undefined,
    status,
    sendMessage,
  };
}
