import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../auth/useAuthStore';
import { getMyProfile } from '../../../services/onboardingService';

export const DashboardPage = () => {
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await getMyProfile();
        if (user?.role === 'supplier') {
          navigate('/dashboard/supplier');
        } else {
          navigate('/dashboard/buyer');
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          navigate('/onboarding');
        }
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [navigate, user]);

  return <div className="p-8 text-slate-500">Loading dashboard...</div>;
};
