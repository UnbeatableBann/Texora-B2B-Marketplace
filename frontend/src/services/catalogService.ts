import api from './api';

// Simple in-memory cache for production-like performance on the frontend
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const fetchWithCache = async (key: string, fetcher: () => Promise<any>) => {
  const now = Date.now();
  // Return cached data if valid
  if (cache[key] && now - cache[key].timestamp < CACHE_TTL) {
    return Promise.resolve(cache[key].data);
  }
  const data = await fetcher();
  cache[key] = { data, timestamp: now };
  return data;
};

export const getCategories = async () => {
  return fetchWithCache('categories', async () => {
    const response = await api.get('/catalog/categories');
    return response.data;
  });
};

export const getCategory = async (id: string) => {
  const response = await api.get(`/catalog/categories/${id}`);
  return response.data; // Don't cache single entities to ensure fresh details
};

export const getProducts = async (categoryId?: string, supplierId?: number, skip: number = 0, limit: number = 100) => {
  const params: any = { skip, limit };
  if (categoryId) params.category_id = categoryId;
  if (supplierId) params.supplier_id = supplierId;
  
  const cacheKey = `products_${categoryId || 'all'}_${supplierId || 'all'}_${skip}_${limit}`;
  return fetchWithCache(cacheKey, async () => {
    const response = await api.get('/catalog/products', { params });
    return response.data;
  });
};

export const getProduct = async (id: string) => {
  const response = await api.get(`/catalog/products/${id}`);
  return response.data; // Don't cache single entities to ensure fresh details
};

export const getTrendingProducts = async () => {
  return fetchWithCache('trending_products', async () => {
    const response = await api.get('/catalog/products/trending');
    return response.data;
  });
};

export const getHotSellingProducts = async () => {
  return fetchWithCache('hot_selling_products', async () => {
    const response = await api.get('/catalog/products/hot-selling');
    return response.data;
  });
};

export const getRecommendedProducts = async () => {
  return fetchWithCache('recommended_products', async () => {
    const response = await api.get('/recommendations');
    if (response.data && response.data.items) {
      return response.data.items.map((item: any) => ({
        ...item.product,
        recommendation_reason: item.reason
      }));
    }
    return response.data;
  });
};
