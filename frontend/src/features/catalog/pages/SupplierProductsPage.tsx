import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getProducts } from '../../../services/catalogService';
import { useAuthStore } from '../../auth/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const SupplierProductsPage = () => {
  const user = useAuthStore(state => state.user);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getProducts(undefined, user.id)
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading products...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Manage Products</h1>
        <Link to="/dashboard/supplier/products/new">
          <Button className="cursor-pointer">Add New Product</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <h2 className="text-xl font-medium text-slate-700 mb-4">You have no products yet.</h2>
          <Link to="/dashboard/supplier/products/new">
            <Button className="cursor-pointer">Create Your First Product</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map(product => (
            <Card key={product.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded overflow-hidden">
                    {product.primary_image_url ? (
                      <img src={product.primary_image_url} alt="img" className="w-full h-full object-cover"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Img</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">{product.name}</h3>
                    <div className="text-sm text-slate-500 font-medium mt-1">
                      ${product.price.toFixed(2)} <span className="mx-2 text-slate-300">|</span> Stock: {product.stock_quantity}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wide">
                    {product.status}
                  </span>
                  <Link to={`/dashboard/supplier/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm" className="cursor-pointer">Edit</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
