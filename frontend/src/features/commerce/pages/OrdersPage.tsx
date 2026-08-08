import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../../services/commerceService';
import { useAuthStore } from '../../auth/useAuthStore';
import { Package } from 'lucide-react';

export const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div style={{ padding: '4rem 0', textAlign: 'center', color: '#666' }}>Loading orders...</div>;

  return (
    <div className="container-custom" style={{ padding: '2rem 0', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>
        {user?.role === 'supplier' ? 'Incoming Orders' : 'My Orders'}
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <Package size={48} color="#ccc" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#333' }}>No orders found.</h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>{user?.role === 'supplier' ? 'You have no incoming orders yet.' : 'You have not placed any orders yet.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid var(--border-color)', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Order {order.order_number}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#333' }}>
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg-color)' }}>${order.total_amount.toFixed(2)}</div>
                </div>
                <div>
                  {user?.role === 'supplier' ? (
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="input-custom"
                      style={{ padding: '0.4rem 0.75rem', height: 'auto', backgroundColor: '#fff' }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PREPARING">PREPARING</option>
                      <option value="READY_FOR_DISPATCH">READY_FOR_DISPATCH</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  ) : (
                    <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
                      {order.status}
                    </span>
                  )}
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '64px', height: '64px', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        {item.primary_image_url && <img src={item.primary_image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="img" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/cloth/cotton.png'; }} />}
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#111' }}>{item.product_name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#111' }}>
                        ${(item.purchase_price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
