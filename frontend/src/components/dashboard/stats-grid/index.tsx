import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

interface StatsGridProps {
  children: React.ReactNode;
}

export default function StatsGrid({ children }: StatsGridProps) {
  return <Grid>{children}</Grid>;
}
