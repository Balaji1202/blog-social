import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/data/hooks/useAuth';
import * as S from './styles';

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      console.log('Login successful, redirecting to dashboard');
      router.replace('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <S.Container>
      <S.Title>Welcome Back</S.Title>
      <S.Form onSubmit={handleSubmit}>
        <S.Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <S.Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <S.ErrorText>{error.message}</S.ErrorText>}
        <S.Button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </S.Button>
      </S.Form>
    </S.Container>
  );
}
