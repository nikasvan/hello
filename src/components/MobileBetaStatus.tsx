import styled from 'styled-components';

export default function MobileBetaStatus() {
  return (
    <BottomRight>
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
`;
