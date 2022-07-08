import styled from 'styled-components';
import Image from 'next/image';
import Github from './Github';
import MirrorWhite from '../../public/assets/images/mirror-white.png';

interface MobileBetaStatusProps {
  className?: string;
}

export default function MobileBetaStatus({ className }: MobileBetaStatusProps) {
  return (
    <BottomRight className={className}>
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
      <MirrorLink
        href="https://www.mirror.xyz/0xdaopanel.eth"
        target="_blank"
        rel="noreferrer"
      />
      <PublicBeta href="https://docs.xmtp.org/" target="_blank">
        public beta
      </PublicBeta>
    </BottomRight>
  );
}

const MirrorLink = styled.a`
  display: block;
  background-image: url(${MirrorWhite.src});
  background-repeat: no-repeat;
  background-size: contain;
  height: 24px;
  width: 18px;
  margin-left: 3px;
`;

const PublicBeta = styled.a`
  font-weight: 900;
  font-variant: small-caps;
  font-size: 16px;
  display: inline;
  cursor: pointer;
  text-decoration: none;
  color: #f77272;
  margin-left: 10px;
`;

const BottomRight = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  & > a {
    margin-right: 10px;
  }
`;
