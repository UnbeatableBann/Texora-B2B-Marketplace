import { useEffect, useState } from 'react';
import { getMyProfile } from '../../../services/onboardingService';
import { getOrders } from '../../../services/commerceService';
import { getProducts } from '../../../services/catalogService';
import { Link } from 'react-router';
import { Package, Inbox, AlertTriangle, LayoutDashboard, PlusCircle } from 'lucide-react';

export const SupplierDashboardPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyProfile(), getOrders(), getProducts()])
      .then(([profileData, ordersData, productsData]) => {
        setProfile(profileData);
        setOrders(ordersData);
        // Ensure we only look at this supplier's products, in a real app this would be an API filter
        setProducts(productsData.filter((p: any) => p.supplier_id === profileData.id));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--fg-secondary)', fontSize: '1.1rem' }}>Loading dashboard...</div>;

  const pendingOrders = orders.filter(o => ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_DISPATCH'].includes(o.status));
  const lowStockProducts = products.filter(p => p.inventory_count < 10);

  return (
    <div className="container-custom" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '3rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--fg-color)' }}>Supplier Dashboard</h1>
          <p style={{ color: 'var(--fg-secondary)', margin: 0, fontSize: '1.1rem' }}>Welcome back, {profile?.company_name || 'Supplier'}</p>
        </div>
        <Link to="/dashboard/supplier/products/new" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', fontSize: '1.05rem' }}>
          <PlusCircle size={20} /> Add Product
        </Link>
      </div>
      
      {/* Top: Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
        {[
          { label: 'Pending Orders', value: pendingOrders.length, icon: Inbox, color: 'var(--warning-color)', bg: 'rgba(216, 144, 32, 0.1)' },
          { label: 'Total Products', value: products.length, icon: Package, color: 'var(--info-color)', bg: 'rgba(74, 96, 124, 0.1)' },
          { label: 'Low Stock', value: lowStockProducts.length, icon: AlertTriangle, color: 'var(--error-color)', bg: 'rgba(181, 74, 74, 0.1)' },
          { label: 'Total Revenue', value: `$${orders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}`, icon: LayoutDashboard, color: 'var(--success-color)', bg: 'rgba(45, 122, 66, 0.1)' },
        ].map((metric, i) => (
          <div key={i} className="card-custom" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', border: `1px solid ${metric.bg.replace('0.1', '0.2')}` }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: metric.bg, color: metric.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <metric.icon size={32} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', color: 'var(--fg-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{metric.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--fg-color)', fontFamily: 'var(--font-family-heading)' }}>{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle: Quick Actions */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--fg-color)' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          {[
            { label: 'View Incoming Orders', desc: 'Process new and pending orders', link: '/orders' },
            { label: 'Manage Inventory', desc: 'Update stock levels and pricing', link: '/dashboard/supplier/inventory' },
            { label: 'Product Catalog', desc: 'Edit or remove existing products', link: '/dashboard/supplier/products' },
            { label: 'Profile Settings', desc: 'Update company details', link: '/onboarding' },
          ].map((action, i) => (
            <Link key={i} to={action.link} className="card-custom hover-border-primary" style={{ padding: '2rem', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.15rem', color: 'var(--fg-color)' }}>{action.label}</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{action.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom: Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem' }}>
        
        {/* Recent Orders */}
        <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--fg-color)' }}>Recent Orders</h2>
            <Link to="/orders" style={{ fontSize: '0.95rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>View All</Link>
          </div>
          <div style={{ padding: '2rem' }}>
            {orders.length === 0 ? (
              <div style={{ color: 'var(--fg-secondary)', textAlign: 'center', padding: '2rem 0' }}>No recent orders.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.slice(0, 4).map(order => (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--fg-color)', marginBottom: '0.25rem' }}>{order.order_number}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--fg-secondary)' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--fg-color)' }}>${order.total_amount.toFixed(2)}</div>
                      <div className="badge badge-new" style={{ marginTop: '6px' }}>{order.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--fg-color)' }}>Low Stock Alerts</h2>
            <Link to="/dashboard/supplier/inventory" style={{ fontSize: '0.95rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Manage</Link>
          </div>
          <div style={{ padding: '2rem' }}>
            {lowStockProducts.length === 0 ? (
              <div style={{ color: 'var(--fg-secondary)', textAlign: 'center', padding: '2rem 0' }}>Inventory levels look good.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {lowStockProducts.slice(0, 4).map(product => (
                  <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ width: '56px', height: '56px', backgroundColor: 'var(--bg-color)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        {product.primary_image_url && <img src={product.primary_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--fg-color)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--error-color)', fontWeight: 600, marginTop: '4px' }}>{product.inventory_count} remaining</div>
                      </div>
                    </div>
                    <Link to={`/dashboard/supplier/products/${product.id}/edit`} className="btn-secondary" style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}>Update</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
