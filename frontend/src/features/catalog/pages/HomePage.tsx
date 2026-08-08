import { useEffect, useState } from 'react';
import { getTrendingProducts, getHotSellingProducts, getRecommendedProducts } from '../../../services/catalogService';
import { ProductCard } from '../components/ProductCard';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../auth/useAuthStore';

import { Search, ArrowRight, ShieldCheck, Zap, TrendingUp, CheckCircle2, Box, Star } from 'lucide-react';

export const HomePage = () => {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [hotSellingProducts, setHotSellingProducts] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  let recommendationTitle = "Recommended For You";
  let recommendationSubtitle = "Based on your sourcing preferences";

  if (!user || user.role !== 'buyer' || !user.onboarding_completed) {
    recommendationTitle = "Popular in the Marketplace";
    recommendationSubtitle = "Trending products across all categories";
  }

  const showRecommendations = user?.role !== 'supplier';


  useEffect(() => {
    Promise.all([
      getTrendingProducts().catch(() => []),
      getHotSellingProducts().catch(() => []),
      getRecommendedProducts().catch(() => [])
    ])
      .then(([trending, hot, recommended]) => {
        setTrendingProducts(trending);
        setHotSellingProducts(hot);
        setRecommendedProducts(recommended);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const renderProductGrid = (items: any[]) => {
    if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fg-secondary)' }}>Loading collections...</div>;
    if (items.length === 0) return <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>No products found.</div>;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>
        {items.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--fg-color)' }}>
      {/* 1. Hero Section - Editorial Premium */}
      <section style={{ 
        position: 'relative', 
        padding: '2rem 0',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(rgba(10, 10, 10, 0.5), rgba(10, 10, 10, 0.8)), url("/images/hero-bg.png") no-repeat center center / cover'
      }}>
        <div className="container-custom" style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
          
          <h1 style={{ fontFamily: 'var(--font-family-heading)', fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)', fontWeight: 500, marginBottom: '1.25rem', letterSpacing: '0', color: '#FFFFFF', lineHeight: 1.15, maxWidth: '900px', margin: '0 auto 1.5rem' }}>
            Premium Textiles. Trusted Suppliers. One Marketplace.
          </h1>
          
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3.5rem auto', lineHeight: 1.6, fontWeight: 500, letterSpacing: '0.02em' }}>
            Source Better. Build Better.
          </p>
          
          {/* 2. Large Search as Primary CTA */}
          <div style={{ maxWidth: '700px', margin: '0 auto 2rem auto', position: 'relative' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '50px', padding: '6px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', backdropFilter: 'blur(10px)' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <div style={{ position: 'absolute', top: '50%', left: '1.5rem', transform: 'translateY(-50%)', color: 'var(--fg-secondary)' }}>
                  <Search size={22} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search cotton, silk, linen, or find suppliers..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  style={{ paddingLeft: '4rem', height: '60px', fontSize: '1.1rem', borderRadius: '50px', border: 'none', width: '100%', outline: 'none', backgroundColor: 'transparent', color: 'var(--fg-color)' }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ height: '60px', padding: '0 2.5rem', fontSize: '1rem', fontWeight: 600, margin: 0, borderRadius: '50px' }}>
                Search
              </button>
            </form>

            {/* Quick Suggestions underneath */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginRight: '0.5rem' }}>Popular:</span>
              {['Organic Cotton', 'Silk', 'Linen', 'Recycled Polyester', 'Denim'].map(tag => (
                <span key={tag} onClick={() => { setSearchQuery(tag); navigate(`/marketplace?q=${tag}`); }} style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', transition: 'all 0.2s ease', fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Search Dropdown / Trending */}
            {isSearchFocused && (
              <div style={{ position: 'absolute', top: '85px', left: 0, right: 0, backgroundColor: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', zIndex: 100, textAlign: 'left', padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--fg-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', fontWeight: 700 }}>Trending Materials</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <li onClick={() => navigate('/marketplace?q=Organic Cotton')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg-color)', fontWeight: 500 }}><TrendingUp size={16} color="var(--fg-secondary)" /> Organic Cotton GSM 200</li>
                      <li onClick={() => navigate('/marketplace?q=Recycled Polyester')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg-color)', fontWeight: 500 }}><TrendingUp size={16} color="var(--fg-secondary)" /> Recycled Polyester</li>
                      <li onClick={() => navigate('/marketplace?category=Silk')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg-color)', fontWeight: 500 }}><TrendingUp size={16} color="var(--fg-secondary)" /> Premium Silk Yarn</li>
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--fg-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', fontWeight: 700 }}>Discover Categories</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {['Cotton', 'Silk', 'Linen', 'Denim', 'Organic'].map(cat => (
                        <span key={cat} onClick={() => navigate(`/marketplace?category=${cat}`)} className="badge" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--fg-color)', padding: '8px 16px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>{cat}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
            <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', backgroundColor: '#fff', color: 'var(--fg-color)', border: 'none' }} onClick={() => navigate('/marketplace')}>Explore Collection</button>
            <button className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderColor: 'rgba(255,255,255,0.4)', color: '#fff', backgroundColor: 'rgba(0,0,0,0.2)' }} onClick={() => navigate('/register?role=supplier')}>Become Supplier</button>
          </div>

        </div>
      </section>

      {/* 3. Homepage Statistics */}
      <section style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container-custom" style={{ padding: '3rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--fg-color)' }}>2,500+</div>
              <div style={{ color: 'var(--fg-secondary)', fontSize: '0.95rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>Verified Mills</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--fg-color)' }}>15,000+</div>
              <div style={{ color: 'var(--fg-secondary)', fontSize: '0.95rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>Materials</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--fg-color)' }}>50,000+</div>
              <div style={{ color: 'var(--fg-secondary)', fontSize: '0.95rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>Orders</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--fg-color)' }}>99%</div>
              <div style={{ color: 'var(--fg-secondary)', fontSize: '0.95rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Collections Section */}
      <section className="container-custom" style={{ padding: '6rem 0' }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Curated Collections</h2>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '320px', gap: '2rem', marginTop: '3rem', overflowX: 'auto', paddingBottom: '1.5rem', scrollbarWidth: 'none' }} className="hide-scrollbar">
          
          <div onClick={() => navigate('/marketplace?category=cotton')} style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '400px', backgroundColor: '#e0d8d0' }}>
            <img src="/cloth/cotton.png" alt="Cotton" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-scale" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff' }}>
              <h3 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2rem', fontWeight: 500, marginBottom: '0.5rem' }}>Cotton</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>1,200+ Products</p>
            </div>
          </div>

          <div onClick={() => navigate('/marketplace?category=silk')} style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '400px', backgroundColor: '#e0d8d0' }}>
            <img src="/cloth/slik.png" alt="Silk" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-scale" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff' }}>
              <h3 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2rem', fontWeight: 500, marginBottom: '0.5rem' }}>Silk</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>450+ Products</p>
            </div>
          </div>

          <div onClick={() => navigate('/marketplace?category=linen')} style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '400px', backgroundColor: '#e0d8d0' }}>
            <img src="/cloth/linen.png" alt="Linen" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-scale" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff' }}>
              <h3 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2rem', fontWeight: 500, marginBottom: '0.5rem' }}>Linen</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>850+ Products</p>
            </div>
          </div>

          <div onClick={() => navigate('/marketplace?category=organic')} style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '400px', backgroundColor: '#e0d8d0' }}>
            <img src="/cloth/organic.png" alt="Organic" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-scale" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff' }}>
              <h3 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2rem', fontWeight: 500, marginBottom: '0.5rem' }}>Organic</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>600+ Products</p>
            </div>
          </div>

          <div onClick={() => navigate('/marketplace?category=denim')} style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '400px', backgroundColor: '#e0d8d0' }}>
            <img src="/cloth/denim.png" alt="Denim" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-scale" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff' }}>
              <h3 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2rem', fontWeight: 500, marginBottom: '0.5rem' }}>Denim</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>320+ Products</p>
            </div>
          </div>

          <div onClick={() => navigate('/marketplace?category=polyester')} style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '400px', backgroundColor: '#e0d8d0' }}>
            <img src="/cloth/polyester.png" alt="Polyester" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-scale" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff' }}>
              <h3 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '2rem', fontWeight: 500, marginBottom: '0.5rem' }}>Polyester</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>950+ Products</p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Trending Products */}
      <section className="container-custom" style={{ padding: '0 0 4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Trending Textiles</h2>
          <button className="btn-secondary" onClick={() => navigate('/marketplace')} style={{ border: 'none', padding: '0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
            View all <ArrowRight size={18} />
          </button>
        </div>
        {renderProductGrid(trendingProducts)}
      </section>

      {/* Recommended Products */}
      {showRecommendations && (
        <section className="container-custom" style={{ padding: '0 0 4rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>{recommendationTitle}</h2>
              <p style={{ color: 'var(--fg-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{recommendationSubtitle}</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate('/marketplace')} style={{ border: 'none', padding: '0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
              View all <ArrowRight size={18} />
            </button>
          </div>
          {renderProductGrid(recommendedProducts)}
        </section>
      )}

      {/* Hot Selling Products */}
      <section className="container-custom" style={{ padding: '0 0 6rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Hot Selling Textiles</h2>
          <button className="btn-secondary" onClick={() => navigate('/marketplace')} style={{ border: 'none', padding: '0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
            View all <ArrowRight size={18} />
          </button>
        </div>
        {renderProductGrid(hotSellingProducts)}
      </section>

      {/* 6. Benefits Section */}
      <section style={{ backgroundColor: 'var(--bg-color)', padding: '6rem 0' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            
            <div style={{ backgroundColor: 'var(--card-bg)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(211, 92, 59, 0.1)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', flexShrink: 0 }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Verified Suppliers</h3>
                <p style={{ color: 'var(--fg-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>We rigorously vet every manufacturer. Order with absolute confidence.</p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(45, 122, 66, 0.1)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-color)', flexShrink: 0 }}>
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Quality Assured</h3>
                <p style={{ color: 'var(--fg-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Standardized testing and transparent quality metrics for all listings.</p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(74, 96, 124, 0.1)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info-color)', flexShrink: 0 }}>
                <Box size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Large Inventory</h3>
                <p style={{ color: 'var(--fg-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Access to thousands of ready-to-ship and made-to-order fabrics globally.</p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(216, 144, 32, 0.1)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning-color)', flexShrink: 0 }}>
                <Zap size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Fast Ordering</h3>
                <p style={{ color: 'var(--fg-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Skip the emails. Secure B2B checkout directly on the platform.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section style={{ backgroundColor: 'var(--card-bg)', padding: '8rem 0' }}>
        <div className="container-custom">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '4rem' }}>Trusted by Industry Leaders</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
            <div style={{ backgroundColor: 'var(--bg-color)', padding: '3rem', borderRadius: '16px' }}>
              <div style={{ display: 'flex', gap: '0.2rem', color: 'var(--warning-color)', marginBottom: '1.5rem' }}>
                <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '2.5rem', color: 'var(--fg-color)', fontStyle: 'italic', fontFamily: 'var(--font-family-heading)' }}>
                "We sourced 20,000 yards of organic cotton in under three days. The interface is stunning and the supplier transparency is unmatched in this industry."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--fg-secondary)', fontSize: '1.2rem' }}>AR</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--fg-color)' }}>Anna Rossi</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--fg-secondary)' }}>Head of Production, Milan Apparel</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-color)', padding: '3rem', borderRadius: '16px' }}>
              <div style={{ display: 'flex', gap: '0.2rem', color: 'var(--warning-color)', marginBottom: '1.5rem' }}>
                <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '2.5rem', color: 'var(--fg-color)', fontStyle: 'italic', fontFamily: 'var(--font-family-heading)' }}>
                "Texora changed how we discover new mills. It's like having a premium fabric trade show available 24/7. Extremely fast, and the UX is brilliant."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--fg-secondary)', fontSize: '1.2rem' }}>JH</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--fg-color)' }}>James Harrison</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--fg-secondary)' }}>Sourcing Director, Elevate Brands</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Dark Premium CTA Section */}
      <section style={{ backgroundColor: '#1F2937', color: '#FFFFFF', padding: '7rem 0', textAlign: 'center' }}>
        <div className="container-custom" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '3.5rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.01em', lineHeight: 1.2 }}>
            Ready to Source Better Fabrics?
          </h2>
          <p style={{ color: '#E5E7EB', fontSize: '1.25rem', marginBottom: '3.5rem', lineHeight: 1.6 }}>
            Join the world's most elegant and efficient B2B textile marketplace. Discover premium materials and connect with top-tier suppliers today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <button className="btn-primary" onClick={() => navigate('/marketplace')} style={{ padding: '1.15rem 3rem', fontSize: '1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: '8px' }}>
              Start Browsing
            </button>
            <button className="btn-secondary" onClick={() => navigate('/register?role=supplier')} style={{ padding: '1.15rem 3rem', fontSize: '1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: '8px', borderColor: 'rgba(255,255,255,0.3)', color: '#fff', backgroundColor: 'transparent' }}>
              Become Supplier
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
