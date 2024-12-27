import { IconType } from 'react-icons';
import * as S from './styles';

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
    <S.Card>
      <S.IconWrapper $color={color}>
        <Icon size={20} />
      </S.IconWrapper>
      <S.Title>{title}</S.Title>
      <S.Value>{value}</S.Value>
    </S.Card>
  );
}
