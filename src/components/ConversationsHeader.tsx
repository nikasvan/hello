import styled from 'styled-components';
import Menu from '../../public/assets/images/MobileWhiteHamburgerMenu.svg';
import NewConversation from '../../public/assets/images/MobileNewConversation.svg';
import Image from 'next/image';
import FixedHeader from './FixedHeader';

interface ConversationsHeaderProps {
  onClickMenu: () => unknown;
  onClickNewConversation: () => unknown;
  activeCategory: string;
}

export default function ConversationsHeader(props: ConversationsHeaderProps) {
  return (
    <FixedHeader>
      <ClickableImage
        src={Menu}
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
    </FixedHeader>
  );
}

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
