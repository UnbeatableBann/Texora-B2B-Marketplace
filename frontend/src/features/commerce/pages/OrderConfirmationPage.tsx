import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { getOrder } from '../../../services/commerceService';
import { CheckCircle2, Package, Truck } from 'lucide-react';

export const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getOrder(Number(id))
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div style={{ padding: '4rem 0', textAlign: 'center', color: '#666' }}>Loading order details...</div>;
  if (!order) return <div style={{ padding: '4rem 0', textAlign: 'center', color: '#666' }}>Order not found</div>;

  return (
    <div className="container-custom" style={{ padding: '4rem 0', maxWidth: '800px' }}>
      
      {/* Success Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <CheckCircle2 size={40} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Order Confirmed!</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>Thank you for your purchase. Your order has been placed successfully.</p>
      </div>

      {/* Order Details Card */}
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', marginBottom: '2.5rem' }}>
        
        {/* Top summary row */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Order Number</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{order.order_number}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Status</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
              <Package size={14} /> {order.status}
            </div>
          </div>
        </div>

        {/* Items */}
        <div style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Items Ordered</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.items.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f4f4f5', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {item.primary_image_url ? (
                    <img src={item.primary_image_url} alt="img" style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/cloth/cotton.png'; }} />
                  ) : (
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#e5e5e5', borderRadius: '6px' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                    <div style={{ color: '#666', fontSize: '0.85rem' }}>Qty: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700 }}>${(item.purchase_price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#666' }}>Total Paid</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>${order.total_amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Next Steps / Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/orders" className="btn-secondary" style={{ padding: '0.875rem 2rem', textDecoration: 'none' }}>
          View All Orders
        </Link>
        <Link to="/marketplace" className="btn-primary" style={{ padding: '0.875rem 2rem', textDecoration: 'none' }}>
          Continue Shopping
        </Link>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center', color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <Truck size={16} /> You will receive an email update when your order ships.
      </div>
    </div>
  );
};
