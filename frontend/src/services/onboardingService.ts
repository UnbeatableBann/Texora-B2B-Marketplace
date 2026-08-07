import api from './api';

export const submitBuyerProfile = async (data: any) => {
  const response = await api.post('/onboarding/buyer', data);
  return response.data;
};

export const submitSupplierProfile = async (data: any) => {
  const response = await api.post('/onboarding/supplier', data);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get('/onboarding/me');
  return response.data;
};
