import { Conversation, Message } from '@xmtp/xmtp-js';
import { useCallback } from 'react';
import { useXmtp } from './useXmtp';

export function useMetrics() {
  const { client } = useXmtp();

  const recordInitEvent = useCallback(async (address: string) => {
    // Hash the address to avoid sending any PII
    const hash = await sha256(address);
    const body = JSON.stringify({ addressHash: hash });
    fetch('/api/metrics/initEvent', { method: 'POST', body });
  }, []);

  const recordPeerNotInitializedEvent = useCallback((peerAddress: string) => {
    const body = JSON.stringify({ peerAddress });
    fetch('/api/metrics/peerNotInitialized', { method: 'POST', body });
  }, []);

  const recordSendMessageEvent = useCallback(
    async (fromAddress: string, toAddress: string) => {
      const fromHash = await sha256(fromAddress);
      const toHash = await sha256(toAddress);
      const body = JSON.stringify({
        fromAddressHash: fromHash,
        toAddressHash: toHash,
      });
      fetch('/api/metrics/sendMessage', { method: 'POST', body });
    },
    []
  );

  const recordMessagesEvents = useCallback(async (messages: Message[]) => {
    const eventData = [];
    for (const message of messages) {
      if (message.senderAddress && message.recipientAddress) {
        // Hash the address to avoid sending any PII
        const fromHash = await sha256(message.senderAddress);
        const toHash = await sha256(message.recipientAddress);
        const idHash = await sha256(message.id);
        eventData.push({
          from_address_hash: fromHash,
          to_address_hash: toHash,
          id_hash: idHash,
        });
      }
    }
    fetch('/api/metrics/messageEvent', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }, []);

  const recordCreateConversationEvent = useCallback(
    async (fromAddress: string, toAddress: string) => {
      const fromHash = await sha256(fromAddress);
      const toHash = await sha256(toAddress);
      const body = JSON.stringify({
        fromAddressHash: fromHash,
        toAddressHash: toHash,
      });
      fetch('/api/metrics/createConversation', { method: 'POST', body });
    },
    []
  );

  const recordConversationsEvents = useCallback(
    async (conversations: Conversation[]) => {
      if (client) {
        const eventData = [];
        for (const convo of conversations) {
          // Hash the address to avoid sending any PII
          const addressAHash = await sha256(client.address);
          const addressBHash = await sha256(convo.peerAddress);
          eventData.push({
            address_a_hash: addressAHash,
            address_b_hash: addressBHash,
          });
        }
        fetch('/api/metrics/conversationEvent', {
          method: 'POST',
          body: JSON.stringify(eventData),
        });
      }
    },
    [client]
  );

  return {
    recordInitEvent,
    recordSendMessageEvent,
    recordMessagesEvents,
    recordCreateConversationEvent,
    recordConversationsEvents,
    recordPeerNotInitializedEvent,
  };
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}
