import styled from 'styled-components';
import Image from 'next/image';
import Github from './Github';

export default function MobileBetaStatus() {
  return (
    <BottomRight>
      <a href="https://www.daopanel.com/" target="_blank" rel="noreferrer">
        <Image
          src="/assets/images/whiteonly.png"
          width="24"
          height="24"
          alt="white-logo"
        />
      </a>
      <a
        href="https://www.github.com/daopanel"
        target="_blank"
        rel="noreferrer">
        <Github />
      </a>
      <PublicBeta href="https://docs.xmtp.org/" target="_blank">
        public beta
      </PublicBeta>
    </BottomRight>
  );
}

const PublicBeta = styled.a`
  font-weight: 900;
  font-variant: small-caps;
  font-size: 16px;
  display: inline;
  cursor: pointer;
  text-decoration: none;
  color: #f77272;
`;

const BottomRight = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  & > a:first-child {
    opacity: 0.12;
  }
  & > a {
    margin-right: 10px;
  }
`;
