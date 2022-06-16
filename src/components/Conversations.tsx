import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  ConversationsStatus,
  useActiveTab,
  useDeviceDetect,
  useLocalStorage,
  useXmtp,
  useXmtpConversations,
} from 'hooks';
import Conversation from './Conversation';
import MobileConversationsHeader from './MobileConversationsHeader';
import MobileMenu from './MobileMenu';
import CreateNewConversation from './CreateNewConversation';
import MobileStatusCard from './MobileStatusCard';
import MobileDisclaimerCard from './MobileDisclaimerCard';

import { Conversation as ConversationType } from '@xmtp/xmtp-js/dist/types/src';
import { XmtpStatus } from 'contexts/XmtpContext';
import MobileLoadingPage from 'components/MobileLoadingPage';

export default function Conversations() {
  const { isMobile } = useDeviceDetect();
  const { init, status: xmtpStatus } = useXmtp();
  const { conversations, status } = useXmtpConversations();
  const { visibilityState: isTabVisible } = useActiveTab();
  const [hasInitialized, setHasInitialized] = useLocalStorage('hasInitialized');
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showNewConversation, setShowNewConversation] =
    useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);
  const [timestamped, setTimestamped] = useState<
    Record<string, Date | undefined>
  >({});
  const [numLoaded, setNumLoaded] = useState<number>(0);

  const allConversationsLoaded = useMemo(() => {
    return numLoaded > 0 && numLoaded === Object.entries(conversations).length;
  }, [numLoaded, conversations]);

  const sendNewMessageNotification = useCallback(
    (messages, peerEnsName, peerAddress) => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.recipientAddress !== peerAddress) {
        new Notification(
          `Received new Message from ${peerEnsName || peerAddress}`,
          {
            body: messages[messages.length - 1]?.content,
          }
        );
      }
    },
    []
  );

  const handleConversationStatusEvent = useCallback(
    (ensName, peerAddress, messages, prevMessagesCount) => {
      if (
        messages.length > 0 && !isTabVisible && prevMessagesCount
          ? prevMessagesCount < messages.length
          : false
      ) {
        sendNewMessageNotification(messages, ensName, peerAddress);
      }

      const lastMessage = messages[messages.length - 1];
      const timestamp = lastMessage ? lastMessage.sent : new Date();

      setTimestamped((prevState) => {
        return {
          ...prevState,
          [peerAddress]: timestamp,
        };
      });
      if (!allConversationsLoaded) setNumLoaded((prevState) => prevState + 1);
    },
    [allConversationsLoaded, isTabVisible, sendNewMessageNotification]
  );

  useEffect(() => {
    if (
      Object.keys(conversations).length === Object.keys(timestamped).length &&
      status === ConversationsStatus.ready
    )
      setShowList(true);
  }, [conversations, showList, status, timestamped]);

  const doOpenMenu = () => {
    setShowMenu(true);
  };

  const doCloseMenu = () => {
    setShowMenu(false);
  };

  const doNewConversation = () => {
    setShowNewConversation(true);
  };

  const doCloseCloseNewConversation = useCallback(() => {
    setShowNewConversation(false);
  }, []);

  return (
    <Page>
      <MobileMenu showMenu={showMenu} onClickClose={doCloseMenu} />
      <MobileConversationsHeader
        onClickMenu={doOpenMenu}
        onClickNewConversation={doNewConversation}
        activeCategory={'All Messages'}
      />
      {showNewConversation && (
        <CreateNewConversation close={doCloseCloseNewConversation} />
      )}
      {xmtpStatus !== XmtpStatus.ready && hasInitialized && (
        <Centered>
          <MobileStatusCard
            title="Initialize XMTP Client..."
            subtitle="To begin messaging, you must first initialize the XMTP client by signing a message."
            buttonText="Initialize Client"
            isLoading={xmtpStatus === XmtpStatus.loading}
            isError={xmtpStatus === XmtpStatus.denied}
            errorText={'Signature request cancelled. Try again...'}
            loadingText="Awaiting signature..."
            onClick={init}
          />
        </Centered>
      )}
      {xmtpStatus === XmtpStatus.idle && !hasInitialized && (
        <Centered>
          <MobileDisclaimerCard
            title="Public Beta Release"
            subtitle=""
            errorText="I understand, Continue"
            onClick={() => setHasInitialized(true)}
          />
        </Centered>
      )}
      {status === ConversationsStatus.empty && (
        <Centered>
          <MobileStatusCard
            title="No conversations found."
            subtitle="Send your first message to any ENS name or Eth address. Note: They will first have to sign their own XMTP message, so tell them to get on daopanel.chat! Or message us at trydaopanel.eth to try it out."
            buttonText="Create a Conversation"
            isLoading={false}
            isError={false}
            errorText=""
            loadingText=""
            onClick={doNewConversation}
          />
          <MissingConversations>
            <div>Expected more conversations? </div>
            <GoToXmtp href="https://docs.xmtp.org" target="_blank">
              See disclaimer here.
            </GoToXmtp>
          </MissingConversations>
        </Centered>
      )}
      {xmtpStatus === XmtpStatus.ready &&
        status === ConversationsStatus.loading && <MobileLoadingPage />}
      {status === ConversationsStatus.ready && (
        <List isMobile={isMobile}>
          {sortedByTimestamp(conversations, timestamped).map(
            (peerAddress: string) => {
              return (
                <Conversation
                  onLoadedOrNewMessage={handleConversationStatusEvent}
                  show={showList}
                  key={peerAddress}
                  peerAddress={peerAddress}
                />
              );
            }
          )}
        </List>
      )}
    </Page>
  );
}

const MissingConversations = styled.div`
  margin-top: 1rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  line-height: 1.5;
`;

const GoToXmtp = styled.a`
  color: #f77272;
  margin-left: 0.5rem;
`;

const List = styled.ul<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: scroll;
  height: ${({ isMobile }) => (isMobile ? 'calc(100vh - 200px)' : '100vh')};
  z-index: 10;
`;

const Page = styled.div`
  width: 100vw;
  height: 100%;
`;

const Centered = styled.div`
  margin: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  padding: 24px;
`;

function sortedByTimestamp(
  conversations: Record<string, ConversationType>,
  timestamped: Record<string, Date | undefined>
): string[] {
  const peerAddresses = Object.keys(conversations);
  return peerAddresses.sort((a, b) => {
    const tA = timestamped[a] || -Infinity;
    const tB = timestamped[b] || -Infinity;
    if (tA === tB) return 0;
    if (tA > tB) return -1;
    return 1;
  });
}
