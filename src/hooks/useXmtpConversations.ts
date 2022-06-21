import { useEffect, useMemo, useReducer, useState } from 'react';
import { useXmtp } from './useXmtp';
import { Conversation, Stream } from '@xmtp/xmtp-js';
import { useMetrics } from './useMetrics';

export enum ConversationsStatus {
  loading = 'loading',
  empty = 'no conversations',
  ready = 'ready',
}

export function useXmtpConversations() {
  const { recordConversationsEvents } = useMetrics();
  const { client: xmtp } = useXmtp();
  const [conversations, dispatchConversations] = useReducer(
    addConversation,
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stream, setStream] = useState<Stream<Conversation> | null>(null);

  // First we list the existing conversations for our account.
  useEffect(() => {
    const listConversations = async () => {
      if (!xmtp) return;
      let convs: Conversation[] = [];
      try {
        convs = await xmtp.conversations.list();
      } catch (error) {
        console.error('Caught an error with xmtp.conversations.list');
      }
      try {
        recordConversationsEvents(convs);
      } catch (error) {
        console.error('Caught an error with recording conversations');
      }

      dispatchConversations(convs);
      setIsLoading(false);
    };
    listConversations();
  }, [xmtp, recordConversationsEvents]);

  // Then we tell xmtp to stream us new conversations.
  useEffect(() => {
    const synchronizeConvos = async () => {
      if (!xmtp) return;
      let conversationsStream: Stream<Conversation> | null = null;
      try {
        conversationsStream = await xmtp.conversations.stream();
      } catch (error) {
        console.error('Caught an error with xmtp.conversations.stream');
      }

      // Save the stream so we can stop it when the component unmounts.
      setStream(conversationsStream);
      if (conversationsStream) {
        for await (const conversation of conversationsStream) {
          dispatchConversations([conversation]);
        }
      }
    };
    synchronizeConvos();
  }, [xmtp]);

  // Stop the conversations stream when the component unmounts.
  useEffect(() => {
    return () => {
      stream && stream.return();
    };
  }, [stream]);

  const status = useMemo(() => {
    if (isLoading) return ConversationsStatus.loading;
    if (!isLoading && Object.keys(conversations).length === 0)
      return ConversationsStatus.empty;
    return ConversationsStatus.ready;
  }, [isLoading, conversations]);

  return { conversations, status };
}

const addConversation = (
  state: Record<string, Conversation>,
  incoming: Conversation[]
) => {
  const newState: Record<string, Conversation> = {};
  const onlyNew = incoming.reduce((acc, incomingConversation) => {
    if (state[incomingConversation.peerAddress]) return acc;
    return { ...acc, [incomingConversation.peerAddress]: incomingConversation };
  }, newState);
  return Object.assign({}, state, onlyNew);
};
