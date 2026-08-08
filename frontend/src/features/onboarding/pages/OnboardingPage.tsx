import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../auth/useAuthStore';
import { getMyProfile } from '../../../services/onboardingService';
import { BuyerOnboardingForm } from '../components/BuyerOnboardingForm';
import { SupplierOnboardingForm } from '../components/SupplierOnboardingForm';

export const OnboardingPage = () => {
  const user = useAuthStore(state => state.user);
  const fetchUser = useAuthStore(state => state.fetchUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        await getMyProfile();
        // If successful, they have a profile, ensure user state is updated, then go to dashboard
        await fetchUser();
        navigate('/');
      } catch (err: any) {
        if (err.response?.status === 404) {
          // No profile, stay on this page
          setLoading(false);
        } else {
          // Other error
          setLoading(false);
        }
      }
    };
    if (user && !user.onboarding_completed) {
      checkProfile();
    } else if (user?.onboarding_completed) {
      navigate('/');
    }
  }, [navigate, user, fetchUser]);

  const handleComplete = async () => {
    await fetchUser();
    navigate('/');
  };

  if (loading) return <div style={{ padding: '4rem 0', textAlign: 'center', color: '#666' }}>Loading your profile...</div>;

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '3rem', width: '100%', maxWidth: '600px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem', color: 'var(--fg-color)' }}>
          Welcome to Texora
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          Let's set up your <span style={{ fontWeight: 600, textTransform: 'capitalize', color: 'var(--fg-color)' }}>{user?.role}</span> profile to get started.
        </p>
        
        <div>
          {user?.role === 'buyer' ? (
            <BuyerOnboardingForm onComplete={handleComplete} />
          ) : (
            <SupplierOnboardingForm onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
};
