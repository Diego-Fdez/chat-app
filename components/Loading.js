import styled from '@emotion/styled';

const Loader = () => {
  return (
    <Container>
      <Music>
        <Bar></Bar>
        <Bar></Bar>
        <Bar></Bar>
        <Bar></Bar>
        <Bar></Bar>
        <Bar></Bar>
        <Bar></Bar>
        <Bar></Bar>
        <Bar></Bar>
        <Bar></Bar>
      </Music>
    </Container>
  );
};

export default Loader;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Music = styled.div`
  width: 300px;
  height: 200px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
`;

const Bar = styled.div`
  width: 12px;
  height: 10px;
  border-radius: 10px;
  background-color: #fff;
  animation: loader 1.5s ease-in-out infinite;

  @keyframes loader {
    0%,
    100% {
      height: 2px;
    }

    50% {
      height: 80px;
    }
  }

  &:nth-child(1) {
    background-color: #40b7ad;
    animation-delay: 1s;
  }

  &:nth-child(2) {
    background-color: #88f8ef;
    animation-delay: 0.8s;
  }

  &:nth-child(3) {
    background-color: rgba(43, 87, 115, 0.814);
    animation-delay: 0.6s;
  }

  &:nth-child(4) {
    background-color: rgba(81, 91, 239, 0.7);
    animation-delay: 0.4s;
  }

  &:nth-child(5) {
    background-color: rgba(31, 38, 135, 0.7);
    animation-delay: 0.2s;
  }

  &:nth-child(6) {
    background-color: rgba(31, 38, 135, 0.7);
    animation-delay: 0.2s;
  }

  &:nth-child(7) {
    background-color: rgba(81, 91, 239, 0.7);
    animation-delay: 0.4s;
  }

  &:nth-child(8) {
    background-color: rgba(43, 87, 115, 0.814);
    animation-delay: 0.6s;
  }

  &:nth-child(9) {
    background-color: #88f8ef;
    animation-delay: 0.8s;
  }

  &:nth-child(10) {
    background-color: #40b7ad;
    animation-delay: 1s;
  }
`;
