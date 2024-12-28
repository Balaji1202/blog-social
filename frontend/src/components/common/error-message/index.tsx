import styled from 'styled-components';
import { ErrorText } from '../typography';

const ErrorContainer = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background-color: #fee2e2;
  margin-top: 1rem;
`;

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <ErrorContainer>
      <ErrorText>{message}</ErrorText>
    </ErrorContainer>
  );
}
