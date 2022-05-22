import styled from 'styled-components';
import Image from 'next/image';
interface LoaderProps {
  height: number;
  width: number;
}
export default function Loader(props: LoaderProps) {
  const { height, width } = props;

  return (
    <Container>
      <Image
        src="/assets/images/MobileLoadingSpinner.png"
        alt="loading"
        width={width}
        height={height}
      />
    </Container>
  );
}

const Container = styled.div`
  animation: spin 1500ms linear infinite;
  width: 20p
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
