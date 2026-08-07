import { useEffect, useState } from 'react';
import { getProducts } from '../../../services/catalogService';
import api from '../../../services/api';
import { useAuthStore } from '../../auth/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const SupplierInventoryPage = () => {
  const user = useAuthStore(state => state.user);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchInventory = () => {
    if (user?.id) {
      getProducts(undefined, user.id)
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

  const handleUpdateStock = async (productId: number, currentStock: number) => {
    const newStockStr = prompt("Enter new stock quantity:", currentStock.toString());
    if (newStockStr === null) return;
    const newStock = parseInt(newStockStr, 10);
    if (isNaN(newStock) || newStock < 0) {
      alert("Invalid stock quantity.");
      return;
    }
    setUpdating(productId);
    try {
      await api.patch(`/catalog/products/${productId}`, { stock_quantity: newStock });
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Failed to update stock");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading inventory...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-500">
          No products found.
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b">
                    <th className="p-4 font-semibold text-slate-700">Product</th>
                    <th className="p-4 font-semibold text-slate-700">Status</th>
                    <th className="p-4 font-semibold text-slate-700">Stock Quantity</th>
                    <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{product.name}</div>
                        <div className="text-sm text-slate-500">ID: {product.id}</div>
                      </td>
                      <td className="p-4">
                        {product.stock_quantity === 0 ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">OUT OF STOCK</span>
                        ) : product.stock_quantity < 10 ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">LOW STOCK</span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">IN STOCK</span>
                        )}
                      </td>
                      <td className="p-4 font-semibold">
                        {product.stock_quantity}
                      </td>
                      <td className="p-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={updating === product.id}
                          onClick={() => handleUpdateStock(product.id, product.stock_quantity)}
                          className="cursor-pointer"
                        >
                          {updating === product.id ? 'Updating...' : 'Update Stock'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
