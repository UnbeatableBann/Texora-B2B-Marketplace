import { Link } from 'react-router';
import { ShoppingCart, Heart, ShieldCheck, MapPin, Clock, Star, Box } from 'lucide-react';
import { useCartStore } from '../../commerce/useCartStore';
import { useState } from 'react';

export const ProductCard = ({ product }: { product: any }) => {
  const addToCart = useCartStore(state => state.addToCart);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart(product.id, product.min_order_quantity || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link 
      to={`/products/${product.id}`} 
      className="card-custom" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        padding: '0',
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'var(--card-bg)'
      }}
    >
      {/* Wishlist Button (Future) */}
      <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', zIndex: 10, cursor: 'pointer', color: 'var(--fg-secondary)', transition: 'color 0.2s, transform 0.2s' }} className="hover-color-primary">
        <Heart size={18} />
      </button>

      {/* Product Image */}
      <div style={{ height: '260px', backgroundColor: 'var(--bg-color)', width: '100%', overflow: 'hidden', position: 'relative' }}>
        {product.primary_image_url ? (
          <img src={product.primary_image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--fg-secondary)', fontSize: '0.85rem' }}>No Image Available</div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Category Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-color)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {product.category?.name || 'Uncategorized'}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4', color: 'var(--fg-color)' }}>
          {product.name}
        </h3>

        {/* Supplier Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--fg-secondary)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--fg-color)' }}>{product.supplier?.name || 'Global Textiles Inc'}</span>
            <ShieldCheck size={14} style={{ color: 'var(--success-color)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning-color)', fontWeight: 600 }}><Star size={12} fill="currentColor" /> 4.8</span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> New York, USA</span>
          </div>
        </div>

        {/* Data Points */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto', fontSize: '0.85rem', color: 'var(--fg-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-color)', paddingBottom: '0.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Box size={14}/> MOQ</span>
            <span style={{ fontWeight: 600, color: 'var(--fg-color)' }}>{product.min_order_quantity || 1} units</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-color)', paddingBottom: '0.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14}/> Lead Time</span>
            <span style={{ fontWeight: 600, color: 'var(--fg-color)' }}>7-14 Days</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem' }}>
            <span>Availability</span>
            <span style={{ fontWeight: 600, color: product.inventory_count > 0 ? 'var(--success-color)' : 'var(--error-color)' }}>
              {product.inventory_count > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: '1' }}>${product.price.toFixed(2)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--fg-secondary)', marginTop: '4px' }}>per unit</div>
          </div>
          
          <button 
            className="btn-primary" 
            style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem', borderRadius: '8px' }}
            onClick={handleAddToCart}
            disabled={isAdding || product.inventory_count <= 0}
          >
            <ShoppingCart size={16} />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>

      </div>
    </Link>
  );
};
