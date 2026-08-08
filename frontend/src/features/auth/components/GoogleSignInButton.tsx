import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { googleAuth } from '../../../services/authService';
import { useAuthStore } from '../useAuthStore';
import { useNavigate, useSearchParams } from 'react-router';

interface Props {
  role?: 'buyer' | 'supplier';
}

export const GoogleSignInButton = ({ role = 'buyer' }: Props) => {
  const [error, setError] = useState('');
  const setToken = useAuthStore(state => state.setToken);
  const fetchUser = useAuthStore(state => state.fetchUser);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const handleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const response = await googleAuth(credentialResponse.credential, role);
        if (response && response.access_token) {
          setToken(response.access_token, response.refresh_token);

          await fetchUser();
          navigate(redirectUrl);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Google sign-in failed');
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {error && <div style={{ color: '#b91c1c', fontSize: '0.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>{error}</div>}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin 
          onSuccess={handleSuccess} 
          onError={() => setError('Google authentication cancelled or failed')}
          shape="rectangular"
          theme="outline"
          size="large"
          text="continue_with"
        />
      </div>
    </div>
  );
};
