import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useAuth } from '@/data/hooks/useAuth';
import * as S from './styles';

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
    <S.Container>
      <S.Header>
        <S.HeaderContent>
          <S.UserInfo>
            <S.UserName>Welcome, {user.name}</S.UserName>
          </S.UserInfo>
          <S.LogoutButton onClick={handleLogout}>Logout</S.LogoutButton>
        </S.HeaderContent>
      </S.Header>
      <S.Main>{children}</S.Main>
    </S.Container>
  );
}
