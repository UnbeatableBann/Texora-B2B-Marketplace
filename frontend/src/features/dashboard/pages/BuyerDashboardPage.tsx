import { useEffect, useState } from 'react';
import { getMyProfile } from '../../../services/onboardingService';
import { getOrders } from '../../../services/commerceService';
import { getPersonalizedRecommendations } from '../../../services/aiService';
import { Link } from 'react-router';
import { ProductCard } from '../../catalog/components/ProductCard';
import { Sparkles, History, Compass, ShoppingCart } from 'lucide-react';

export const BuyerDashboardPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyProfile(), getOrders(), getPersonalizedRecommendations().catch(() => [])])
      .then(([profileData, ordersData, recsData]) => {
        setProfile(profileData);
        setOrders(ordersData);
        setRecommendations(recsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--fg-secondary)', fontSize: '1.1rem' }}>Loading dashboard...</div>;

  return (
    <div className="container-custom" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '3rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--fg-color)' }}>Buyer Dashboard</h1>
        <p style={{ color: 'var(--fg-secondary)', margin: 0, fontSize: '1.1rem' }}>Welcome back, {profile?.company_name || 'Buyer'}</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
        
        {/* Recent Orders */}
        <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg-color)' }}>
              <History size={20} style={{ color: 'var(--fg-secondary)' }} /> Recent Orders
            </h2>
            <Link to="/orders" style={{ fontSize: '0.95rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>View All</Link>
          </div>
          <div style={{ padding: '2rem' }}>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--fg-secondary)', textAlign: 'center', padding: '2rem 0' }}>You haven't placed any orders yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.slice(0, 3).map((order) => (
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

        {/* Quick Links */}
        <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg-color)' }}>
              <Compass size={20} style={{ color: 'var(--fg-secondary)' }} /> Quick Links
            </h2>
          </div>
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Link to="/marketplace" className="hover-border-primary" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s', backgroundColor: 'var(--bg-color)' }}>
              <div style={{ backgroundColor: 'rgba(74, 96, 124, 0.1)', color: 'var(--info-color)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Compass size={24} /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--fg-color)' }}>Browse Marketplace</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--fg-secondary)' }}>Find new textiles and materials</div>
              </div>
            </Link>
            <Link to="/cart" className="hover-border-primary" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s', backgroundColor: 'var(--bg-color)' }}>
              <div style={{ backgroundColor: 'rgba(216, 144, 32, 0.1)', color: 'var(--warning-color)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingCart size={24} /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--fg-color)' }}>Shopping Cart</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--fg-secondary)' }}>Review your pending items</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2.25rem', fontWeight: 700, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg-color)' }}>
            <Sparkles size={28} style={{ color: 'var(--primary-color)' }} /> Recommended for You
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {recommendations.slice(0, 4).map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
