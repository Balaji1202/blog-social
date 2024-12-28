import styled from 'styled-components';
import { IconType } from 'react-icons';

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: ${(props) => props.color}15;
  color: ${(props) => props.color};
`;

const Title = styled.h3`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
`;

interface StatsCardProps {
  title: string;
  value: number;
  icon: IconType;
  color: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <Card>
      <IconWrapper color={color}>
        <Icon size={20} />
      </IconWrapper>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </Card>
  );
}
