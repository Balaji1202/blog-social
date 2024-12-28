import styled from 'styled-components';
import { Button as BaseButton } from '@/components/ui/button';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const UserName = styled.span`
  font-weight: 500;
  color: #1a1a1a;
`;

export const LogoutButton = styled(BaseButton)`
  background: none;
  color: #4b5563;
  padding: 0.5rem 1rem;

  &:hover {
    background: #f3f4f6;
  }
`;
