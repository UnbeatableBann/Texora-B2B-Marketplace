import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getCategory, getProducts } from '../../../services/catalogService';
import { ProductCard } from '../components/ProductCard';
import { CategoryNav } from '../components/CategoryNav';

export const CategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    Promise.all([
      getCategory(id),
      getProducts(id)
    ])
    .then(([catData, prodData]) => {
      setCategory(catData);
      setProducts(prodData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {category ? category.name : 'Category'}
        </h1>
        <p className="text-slate-500">
          {category?.description || `Explore our selection of ${category?.name || ''} fabrics.`}
        </p>
      </div>

      <CategoryNav />

      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100 mt-6">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
