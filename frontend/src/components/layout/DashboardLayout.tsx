import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/data/hooks/useAuth';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  font-weight: 500;
`;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <UserInfo>
            <UserName>Welcome, {user.name}</UserName>
          </UserInfo>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </HeaderContent>
      </Header>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}
