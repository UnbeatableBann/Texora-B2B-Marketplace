import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCartStore } from '../useCartStore';
import { ArrowRight, Trash2, ShoppingBag } from 'lucide-react';

export const CartPage = () => {
  const { cart, fetchCart, updateCartItem, removeCartItem, loading } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading && !cart) {
    return <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--fg-secondary)' }}>Loading cart...</div>;
  }

  const items = cart?.items || [];
  const total = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="container-custom" style={{ padding: '3rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 2rem 0', color: 'var(--fg-color)', letterSpacing: '-0.02em' }}>Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--bg-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <ShoppingBag size={32} style={{ color: 'var(--fg-secondary)' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--fg-color)', marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--fg-secondary)', marginBottom: '2rem' }}>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/marketplace" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: '1 / lg:3' }}>
            {items.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', gap: '1.5rem', alignItems: 'stretch' }}>
                
                <div style={{ width: '120px', height: '120px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                  {item.product.primary_image_url ? (
                    <img 
                      src={item.product.primary_image_url} 
                      alt={item.product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/cloth/cotton.png'; }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.8rem', color: 'var(--fg-secondary)' }}>No Image</div>
                  )}
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--fg-color)' }}>{item.product.name}</h3>
                      <div style={{ fontSize: '0.95rem', color: 'var(--fg-secondary)' }}>${item.product.price.toFixed(2)} / unit</div>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--fg-color)' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                      <button 
                        style={{ padding: '0.5rem 1rem', background: 'var(--bg-color)', border: 'none', borderRight: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--fg-color)', fontWeight: 600 }}
                        onClick={() => updateCartItem(item.id, Math.max(0, item.quantity - 1))}
                        className="hover-color-primary"
                      >-</button>
                      <span style={{ padding: '0.5rem 1.25rem', fontSize: '1rem', fontWeight: 600, color: 'var(--fg-color)', backgroundColor: 'var(--card-bg)' }}>{item.quantity}</span>
                      <button 
                        style={{ padding: '0.5rem 1rem', background: 'var(--bg-color)', border: 'none', borderLeft: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--fg-color)', fontWeight: 600 }}
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        className="hover-color-primary"
                      >+</button>
                    </div>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--error-color)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
                      onClick={() => removeCartItem(item.id)}
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div>
            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem', position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: 'var(--fg-color)' }}>Order Summary</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem', fontSize: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--fg-color)' }}>
                  <span style={{ color: 'var(--fg-secondary)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>${total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--fg-color)' }}>
                  <span style={{ color: 'var(--fg-secondary)' }}>Shipping Estimate</span>
                  <span style={{ fontWeight: 600 }}>Calculated at checkout</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--fg-color)' }}>
                  <span style={{ color: 'var(--fg-secondary)' }}>Tax Estimate</span>
                  <span style={{ fontWeight: 600 }}>Calculated at checkout</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '2rem', color: 'var(--fg-color)' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>Estimated Total</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>${total.toFixed(2)}</span>
              </div>
              
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '1.15rem', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};
