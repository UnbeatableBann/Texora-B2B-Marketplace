import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '../useCartStore';
import { useAuthStore } from '../../auth/useAuthStore';
import { checkout } from '../../../services/commerceService';

const shippingSchema = z.object({
  recipient_name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  address_line: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export const CheckoutPage = () => {
  const { cart, fetchCart, loading: cartLoading } = useCartStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      recipient_name: '', phone: '', address_line: '', city: '', state: '', postal_code: '', country: ''
    }
  });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (cartLoading && !cart) return <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--fg-secondary)' }}>Loading checkout...</div>;

  const items = cart?.items || [];
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const total = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);

  const onSubmit = async (data: ShippingFormValues) => {
    if (!useAuthStore.getState().isAuthenticated) {
      // User must sign in for the last step
      navigate('/login?redirect=/checkout');
      return;
    }

    setSubmitting(true);
    try {
      const order = await checkout(data);
      // after successful checkout, cart should be cleared on the server side
      await fetchCart(); // refetch to clear local cart state
      navigate(`/order-confirmation/${order.id}`);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Checkout failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="container-custom" style={{ padding: '3rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 2.5rem 0', color: 'var(--fg-color)', letterSpacing: '-0.02em' }}>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '3rem', alignItems: 'start' }}>
        {/* Shipping Form */}
        <div>
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.5rem 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', color: 'var(--fg-color)' }}>Shipping Information</h2>
            
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Full Name</label>
                <input {...register('recipient_name')} className="input-custom" placeholder="John Doe" />
                {errors.recipient_name && <span style={{ color: 'var(--error-color)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.recipient_name.message}</span>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Phone Number</label>
                <input {...register('phone')} className="input-custom" placeholder="+1 (555) 000-0000" />
                {errors.phone && <span style={{ color: 'var(--error-color)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.phone.message}</span>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Address Line</label>
                <input {...register('address_line')} className="input-custom" placeholder="123 Main St, Apt 4B" />
                {errors.address_line && <span style={{ color: 'var(--error-color)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.address_line.message}</span>}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>City</label>
                  <input {...register('city')} className="input-custom" placeholder="New York" />
                  {errors.city && <span style={{ color: 'var(--error-color)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.city.message}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>State/Province</label>
                  <input {...register('state')} className="input-custom" placeholder="NY" />
                  {errors.state && <span style={{ color: 'var(--error-color)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.state.message}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Postal Code</label>
                  <input {...register('postal_code')} className="input-custom" placeholder="10001" />
                  {errors.postal_code && <span style={{ color: 'var(--error-color)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.postal_code.message}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Country</label>
                  <input {...register('country')} className="input-custom" placeholder="USA" />
                  {errors.country && <span style={{ color: 'var(--error-color)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{errors.country.message}</span>}
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--fg-color)' }}>Order Summary</h2>
            </div>
            
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '400px', overflowY: 'auto' }}>
              {items.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '56px', height: '56px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                      {item.product.primary_image_url && <img src={item.product.primary_image_url} alt="img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--fg-color)' }}>{item.product.name}</div>
                      <div style={{ color: 'var(--fg-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--fg-color)' }}>${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
              
            <div style={{ padding: '2rem', backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--fg-secondary)', fontSize: '1rem' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--fg-color)' }}>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--fg-secondary)', fontSize: '1rem' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600, color: 'var(--success-color)' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--fg-color)' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary-color)' }}>${total.toFixed(2)}</span>
              </div>

              <button type="submit" form="checkout-form" className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: 700 }} disabled={submitting}>
                {submitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
