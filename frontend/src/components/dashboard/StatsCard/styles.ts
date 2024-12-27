import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const IconWrapper = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: ${(props) => props.$color}15;
  color: ${(props) => props.$color};
`;

export const Title = styled.h3`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

export const Value = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
`;
