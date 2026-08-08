import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { register as registerUser, login } from '../../../services/authService';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { useState } from 'react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useAuthStore } from '../useAuthStore';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['buyer', 'supplier'])
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'buyer' }
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  
  const setToken = useAuthStore(state => state.setToken);
  const fetchUser = useAuthStore(state => state.fetchUser);

  const selectedRole = useWatch({ control, name: 'role' });

  const redirectUrl = searchParams.get('redirect') || '/';

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      // Auto login after registration
      const loginResponse = await login({ email: data.email, password: data.password });
      setToken(loginResponse.access_token, loginResponse.refresh_token);
      await fetchUser();
      navigate(redirectUrl);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
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
        <source src="/bg1.mp4" type="video/mp4" />
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem', textAlign: 'center' }}>Create Account</h2>
          <p style={{ color: '#666', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1rem' }}>Join Texora to start buying or selling.</p>
          
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
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>I want to...</label>
              <select {...register('role')} className="input-custom" style={{ padding: '0.6rem 0.75rem', fontSize: '0.9rem' }}>
                <option value="buyer">Buy Textiles</option>
                <option value="supplier">Sell Textiles</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ marginTop: '0.25rem', width: '100%', padding: '0.6rem 0.75rem', fontSize: '0.95rem' }}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
            <span style={{ padding: '0 0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          </div>

          <GoogleSignInButton role={selectedRole as 'buyer' | 'supplier'} />

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#666' }}>
            Already have an account? <Link to={`/login${redirectUrl !== '/' ? `?redirect=${redirectUrl}` : ''}`} style={{ color: 'var(--primary-color)', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
