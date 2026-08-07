import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { getProduct } from '../../../services/catalogService';
import { getSimilarProducts } from '../../../services/aiService';
import { useAuthStore } from '../../auth/useAuthStore';
import { useCartStore } from '../../commerce/useCartStore';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeft, ShoppingCart, Sparkles, Truck, ShieldCheck, CheckCircle, Clock } from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const addToCart = useCartStore(state => state.addToCart);
  
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        getProduct(id),
        getSimilarProducts(id).catch(() => [])
      ])
        .then(([prodData, similarData]) => {
          setProduct(prodData);
          setQuantity(prodData.min_order_quantity || 1);
          setSimilarProducts(similarData);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      navigate('/cart');
    } catch (err) {
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--fg-secondary)' }}>Loading product details...</div>;
  if (!product) return <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--fg-secondary)' }}>Product not found</div>;

  const inStock = product.inventory_count > 0;

  return (
    <div className="container-custom" style={{ padding: '2rem 0' }}>
      <Link to="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--fg-secondary)', fontWeight: 600, marginBottom: '2rem', transition: 'color 0.2s' }} className="hover-color-primary">
        <ArrowLeft size={16} /> Back to Marketplace
      </Link>
      
      {/* 3-Column Layout: Gallery | Information | Purchase Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(350px, 1.25fr) 380px', gap: '3rem', alignItems: 'start' }}>
        
        {/* Column 1: Gallery */}
        <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: '90px' }}>
          {product.primary_image_url ? (
            <img src={product.primary_image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#aaa', fontWeight: 500 }}>No Image Available</span>
          )}
        </div>

        {/* Column 2: Information */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            {product.category && (
              <span className="badge" style={{ backgroundColor: 'rgba(74, 96, 124, 0.1)', color: 'var(--info-color)' }}>
                {product.category.name}
              </span>
            )}
            <span className="badge badge-verified">
              <CheckCircle size={14} /> Verified Supplier
            </span>
          </div>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 1rem 0', lineHeight: 1.2, color: 'var(--fg-color)' }}>{product.name}</h1>
          <div style={{ color: 'var(--fg-secondary)', fontSize: '1rem', fontWeight: 600, marginBottom: '2rem' }}>
            By <span style={{ color: 'var(--fg-color)' }}>{product.supplier?.name || 'Global Textiles Inc'}</span>
          </div>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--fg-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            {product.description || product.short_description || "No detailed description provided by the supplier."}
          </p>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Specifications</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ color: 'var(--fg-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{key.replace(/_/g, ' ')}</div>
                    <div style={{ fontWeight: 600, color: 'var(--fg-color)' }}>{value as string}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Sticky Purchase Panel */}
        <div style={{ position: 'sticky', top: '90px' }}>
          {/* Subtle colored background for purchase panel */}
          <div style={{ backgroundColor: '#FCF8F5', border: '1px solid var(--secondary-color)', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(192, 108, 62, 0.05)' }}>
            
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-color)' }}>
              ${product.price.toFixed(2)}
            </div>
            <div style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              per {product.unit_of_measure || 'unit'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(192, 108, 62, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                <span style={{ color: 'var(--fg-secondary)' }}>Availability</span>
                <span style={{ fontWeight: 600, color: inStock ? 'var(--success-color)' : 'var(--error-color)' }}>{inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                <span style={{ color: 'var(--fg-secondary)' }}>Minimum Order</span>
                <span style={{ fontWeight: 600 }}>{product.min_order_quantity || 1} units</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                <span style={{ color: 'var(--fg-secondary)' }}>Lead Time</span>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> 7-14 Days</span>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--fg-color)' }}>Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(192, 108, 62, 0.3)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--card-bg)' }}>
                <button 
                  style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', borderRight: '1px solid rgba(192, 108, 62, 0.2)', cursor: 'pointer', fontWeight: 600, color: 'var(--fg-color)' }}
                  onClick={() => setQuantity(Math.max(product.min_order_quantity || 1, quantity - 1))}
                >-</button>
                <div style={{ padding: '0.75rem 1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{quantity}</div>
                <button 
                  style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', borderLeft: '1px solid rgba(192, 108, 62, 0.2)', cursor: 'pointer', fontWeight: 600, color: 'var(--fg-color)' }}
                  onClick={() => setQuantity(quantity + 1)}
                >+</button>
              </div>
            </div>

            {(user?.role === 'buyer' || !user) ? (
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '1rem' }} 
                onClick={handleAddToCart} 
                disabled={adding || !inStock}
              >
                <ShoppingCart size={20} />
                {!inStock ? 'Out of Stock' : adding ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
            ) : null}

            <button className="btn-secondary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
              <Sparkles size={18} style={{ color: 'var(--primary-color)' }} /> Ask AI about this product
            </button>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--fg-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Truck size={16} /> Ships within 48 hours</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} /> Buyer Protection Guarantee</div>
            </div>

          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--fg-color)' }}>Similar Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {similarProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
