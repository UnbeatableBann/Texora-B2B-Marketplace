import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login } from '../../../services/authService';
import { useAuthStore } from '../useAuthStore';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { useState } from 'react';

import { GoogleSignInButton } from './GoogleSignInButton';

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
      setToken(response.access_token, response.refresh_token);
      await fetchUser();
      navigate(redirectUrl);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ 
      position: 'relative',
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      color: 'var(--fg-color)',
      overflow: 'hidden'
    }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1
        }}
      >
        <source src="/bg2.mp4" type="video/mp4" />
      </video>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: -1
      }}></div>
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflowY: 'auto' }}>
        <div className="card-custom" style={{ margin: 'auto', width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.75rem', fontWeight: 800, textDecoration: 'none', color: 'var(--primary-color)' }}>
              <img src="/texora-logo.png" alt="Texora Logo" style={{ height: '28px' }} />
              Texora.
            </Link>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem', textAlign: 'center' }}>Welcome Back</h2>
          <p style={{ color: '#666', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1rem' }}>Sign in to continue to Texora.</p>
          
          {error && <div style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Email</label>
              <input
                {...register('email')}
                type="email"
                className="input-custom"
                placeholder="you@example.com"
                style={{ padding: '0.6rem 0.75rem', fontSize: '0.9rem' }}
              />
              {errors.email && <p style={{ color: '#b91c1c', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Password</label>
              <input
                {...register('password')}
                type="password"
                className="input-custom"
                placeholder="••••••••"
                style={{ padding: '0.6rem 0.75rem', fontSize: '0.9rem' }}
              />
              {errors.password && <p style={{ color: '#b91c1c', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password.message}</p>}
            </div>
            
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ marginTop: '0.25rem', width: '100%', padding: '0.6rem 0.75rem', fontSize: '0.95rem' }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
            <span style={{ padding: '0 0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          </div>

          <GoogleSignInButton role="buyer" />

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#666' }}>
            Don't have an account? <Link to={`/register${redirectUrl !== '/' ? `?redirect=${redirectUrl}` : ''}`} style={{ color: 'var(--primary-color)', fontWeight: 500, textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
