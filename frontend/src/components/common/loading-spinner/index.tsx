import styled from 'styled-components';

const SpinnerWrapper = styled.div`
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 48px;
    height: 48px;
    border: 4px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function LoadingSpinner() {
  return <SpinnerWrapper />;
}
