import MobileMenu from 'components/MobileMenu';
import MobileMessagesHeader from 'components/MobileMessagesHeader';
import MobileStatusCard from 'components/MobileStatusCard';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
interface ComingSoonProps {
  text: string;
}

const ComingSoon = ({ text }: ComingSoonProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const openMenu = useCallback(() => setShowMenu(true), [setShowMenu]);
  const closeMenu = useCallback(() => setShowMenu(false), [setShowMenu]);

  return (
    <Page>
      <MobileMenu onClickClose={closeMenu} showMenu={showMenu} />
      <MobileMessagesHeader onMenuClick={openMenu} titleText={text} />
      <Centered>
        <MobileStatusCard
          title="Feature is coming soon..."
          isLoading={false}
          isError={false}
          errorText=""
          subtitle=""
          buttonText="Go Back to Conversations"
        />
      </Centered>
    </Page>
  );
};

const Page = styled.div`
  height: 100%;
  width: 100vw;
  background: #100817;
  display: flex;
  flex-direction: column;
`;

const Centered = styled.div`
  margin: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 100px;
  padding: 24px;
`;

export default ComingSoon;
