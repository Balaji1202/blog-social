import styled from 'styled-components';
import { Button as BaseButton } from '@/components/ui/button';
import { Input as BaseInput } from '@/components/ui/input';

export const Container = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

export const Title = styled.h2`
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Input = styled(BaseInput)`
  width: 100%;
`;

export const Button = styled(BaseButton)`
  width: 100%;
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;
