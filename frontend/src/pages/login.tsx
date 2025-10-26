import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    clearError();

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {/* Logo/Title */}
        <h1 className="text-3xl font-bold text-center text-[#2c3e50] mb-2">
          EduSync
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to your account
        </p>

        {/* Error Alert */}
        {(error || authError) && (
          <div className="mb-4">
            <Alert
              variant="error"
              message={error || authError || ''}
              onDismiss={() => {
                setError(null);
                clearError();
              }}
            />
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        {/* Link to Signup */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#2c3e50] font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
