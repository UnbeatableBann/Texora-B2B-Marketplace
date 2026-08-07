import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login } from '../../../services/authService';
import { useAuthStore } from '../useAuthStore';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });
  const setToken = useAuthStore(state => state.setToken);
  const fetchUser = useAuthStore(state => state.fetchUser);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  const redirectUrl = searchParams.get('redirect') || '/';

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      setToken(response.access_token);
      await fetchUser();
      navigate(redirectUrl);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--fg-color)' }}>
      <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', backgroundColor: '#fff' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--primary-color)', textDecoration: 'none' }}>
          <img src="/texora-logo.png" alt="Texora Logo" style={{ height: '36px', width: 'auto' }} />
          Texora.
        </Link>
      </header>
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card-custom" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: '2rem' }}>Sign in to continue to Texora.</p>
          
          {error && <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email</label>
              <input
                {...register('email')}
                type="email"
                className="input-custom"
                placeholder="you@example.com"
              />
              {errors.email && <p style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.email.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Password</label>
              <input
                {...register('password')}
                type="password"
                className="input-custom"
                placeholder="••••••••"
              />
              {errors.password && <p style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.password.message}</p>}
            </div>
            
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ marginTop: '0.5rem', width: '100%', padding: '0.875rem' }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
            Don't have an account? <Link to={`/register${redirectUrl !== '/' ? `?redirect=${redirectUrl}` : ''}`} style={{ color: 'var(--primary-color)', fontWeight: 500, textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
