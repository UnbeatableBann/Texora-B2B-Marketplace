import api from './api';

export const getCart = async () => {
  const response = await api.get('/commerce/cart');
  return response.data;
};

export const addToCart = async (productId: number, quantity: number) => {
  const response = await api.post('/commerce/cart/items', { product_id: productId, quantity });
  return response.data;
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await api.patch(`/commerce/cart/items/${itemId}`, { quantity });
  return response.data;
};

export const removeCartItem = async (itemId: number) => {
  const response = await api.delete(`/commerce/cart/items/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/commerce/cart');
  return response.data;
};

export const checkout = async (shippingAddress: any) => {
  const response = await api.post('/commerce/checkout', { shipping_address: shippingAddress });
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/commerce/orders');
  return response.data;
};

export const getOrder = async (orderId: number) => {
  const response = await api.get(`/commerce/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await api.patch(`/commerce/orders/${orderId}`, { status });
  return response.data;
};
