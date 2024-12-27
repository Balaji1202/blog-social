import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/data/hooks/useAuth';

const FormContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

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
    <FormContainer>
      <FormTitle>Welcome Back</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormField>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>
        <FormField>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormField>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
    </FormContainer>
  );
}
