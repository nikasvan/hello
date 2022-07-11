import styled from 'styled-components';
import ArrowLeftWhite from '../../public/assets/images/ArrowLeftWhite.svg';
import FixedHeader from './FixedHeader';
import Image from 'next/image';
import useCopyClipboard from 'hooks/useCopyClipboard';

interface MessagesHeaderProps {
  titleText: string;
  onMenuClick: () => unknown;
  onClickBack: () => unknown;
}

export default function MessagesHeader({
  titleText,
  onMenuClick,
  onClickBack,
}: MessagesHeaderProps) {
  const [isCopied, doCopy] = useCopyClipboard();
  return (
    <FixedHeader>
      <Menu
        width={30}
        height={30}
        src={'/assets/images/MobileWhiteHamburgerMenu.svg'}
        onClick={onMenuClick}
      />
      {isCopied || (
        <UserDisplay onClick={() => doCopy(titleText)}>
          {shortAddress(titleText)}
        </UserDisplay>
      )}
      {isCopied && <Copied>Copied!</Copied>}
      <GoBack
        width={20}
        height={20}
        src={ArrowLeftWhite}
        onClick={onClickBack}
      />
    </FixedHeader>
  );
}

const UserDisplay = styled.h1`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  letter-spacing: -0.01em;
  color: #ffffff;
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 16px;
  cursor: pointer;
  :hover {
    margin-bottom: 4px;
  }
`;

const Copied = styled(UserDisplay)`
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
`;

const GoBack = styled(Image)`
  cursor: pointer;
`;

const Menu = styled(Image)`
  cursor: pointer;
`;

function shortAddress(str: string): string {
  if (str.length > 20) {
    return str.slice(0, 6) + '...' + str.slice(-5);
  } else return str;
}
