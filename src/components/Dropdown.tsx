import styled from 'styled-components';
import MobileCopyAddress from '../../public/assets/images/MobileCopyAddress';
import useCopyAddress from 'hooks/useCopyClipboard';
import Image from 'next/image';
import { useState } from 'react';

interface DropdownProps {
  address: string;
}

const Dropdown = ({ address }: DropdownProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCopied, copyAddress] = useCopyAddress();

  const handleClick = (e: string | undefined) => {
    copyAddress(e || '');
  };

  return (
    <Container>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu((prevState) => !prevState);
        }}>
        <Image
          src="/assets/images/3-vertical-dots.svg"
          width="20"
          height="20"
          alt="three-dots"
        />
      </button>
      {showMenu && (
        <DropdownWrapper>
          <StyledLink
            onClick={(e) => {
              e.stopPropagation();
              handleClick(address);
            }}>
            <MobileCopyAddress />
            {isCopied ? 'Copied' : 'Copy Address'}
          </StyledLink>
          <StyledEtherscan
            href={`https://etherscan.io/address//${address}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}>
            <Image
              src={'/assets/images/etherscan-logo.svg'}
              width="15"
              height="15"
              alt="etherscan-logo"
            />
            <span>Etherscan</span>
          </StyledEtherscan>
        </DropdownWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  margin-left: 5px;
`;

const DropdownWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 30px;
  border-radius: 4px;
  background-color: #fff;
  width: 128px;
  height: 53px;
  padding: 8px;
`;

const StyledLink = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #9486aa;
  display: flex;
  cursor: pointer;
  transition: color 200ms ease-in-out;
  margin-bottom: 10px;

  //SVG Styling
  :first-child > :first-child {
    stroke: ${({ theme }) => theme.colors.darkPurpleBorder};
    margin-right: 4px;
  }
  &:hover {
    color: ${({ theme }) => theme.colors.darkPurpleBorder};
  }
  > :first-child > :first-child,
  > :first-child > :nth-child(2),
  > :first-child > :nth-child(3) {
    transition: stroke 200ms ease-in-out;
  }
  &:hover > :first-child > :first-child,
  &:hover > :first-child > :nth-child(2),
  &:hover > :first-child > :nth-child(3) {
    stroke: ${({ theme }) => theme.colors.darkPurpleBorder};
  }
  //End SVG Styling
`;

const StyledEtherscan = styled.a`
  display: flex;
  text-decoration: none;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #9486aa;
  &:hover {
    color: ${({ theme }) => theme.colors.darkPurpleBorder};
  }
  & > span:last-child {
    margin-left: 5px;
  }
`;

export default Dropdown;
