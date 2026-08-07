import api from './api';

export const getCategories = async () => {
  const response = await api.get('/catalog/categories');
  return response.data;
};

export const getCategory = async (id: string) => {
  const response = await api.get(`/catalog/categories/${id}`);
  return response.data;
};

export const getProducts = async (categoryId?: string, supplierId?: number) => {
  const params: any = {};
  if (categoryId) params.category_id = categoryId;
  if (supplierId) params.supplier_id = supplierId;
  
  const response = await api.get('/catalog/products', { params });
  return response.data;
};

export const getProduct = async (id: string) => {
  const response = await api.get(`/catalog/products/${id}`);
  return response.data;
};
