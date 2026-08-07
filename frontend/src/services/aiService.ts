import api from './api';

export const sendChatMessage = async (message: string) => {
  const response = await api.post('/ai/chat', { message, context: {} });
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

export const getPersonalizedRecommendations = async () => {
  const response = await api.get('/recommendations/personalized');
  return response.data;
};

export const getRecentlyViewed = async () => {
  const response = await api.get('/recommendations/recently-viewed');
  return response.data;
};

export const getSimilarProducts = async (productId: string) => {
  const response = await api.get(`/catalog/products/${productId}/similar`);
  return response.data;
};
