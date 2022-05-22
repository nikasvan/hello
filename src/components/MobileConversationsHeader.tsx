import styled from 'styled-components';
import MobileMenu from '../../public/assets/images/MobileWhiteHamburgerMenu.svg';
import NewConversation from '../../public/assets/images/MobileNewConversation.svg';
import Image from 'next/image';
import MobileFixedHeader from './MobileFixedHeader';

interface MobileConversationsHeaderProps {
  onClickMenu: () => unknown;
  onClickNewConversation: () => unknown;
  activeCategory: string;
}

export default function MobileConversationsHeader(
  props: MobileConversationsHeaderProps
) {
  return (
    <MobileFixedHeader>
      <FullWidthFlexRow>
        <ClickableImage
          src={MobileMenu}
          alt="menu"
          width={30}
          height={30}
          onClick={props.onClickMenu}
        />
        <ActiveCategory>{props.activeCategory}</ActiveCategory>
        <ClickableImage
          src={NewConversation}
          alt="menu"
          width={20}
          height={20}
          onClick={props.onClickNewConversation}
        />
      </FullWidthFlexRow>
    </MobileFixedHeader>
  );
}

const FullWidthFlexRow = styled.header`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 40px;
`;

const ActiveCategory = styled.h1`
  color: white;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  letter-spacing: -0.01em;
`;

const ClickableImage = styled(Image)`
  cursor: pointer;
`;
