import { useEffect, useState } from 'react';
import { getProducts } from '../../../services/catalogService';
import { getRecommendations } from '../../../services/aiService';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, LayoutGrid, List, ChevronRight, X, SlidersHorizontal } from 'lucide-react';

export const MarketplacePage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      getProducts(),
      getRecommendations()
    ])
      .then(([productsData]) => {
        setProducts(productsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const FilterContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--fg-color)' }}>
          <Filter size={20} style={{ color: 'var(--fg-secondary)' }} /> Filters
        </h2>
        <button 
          className="mobile-filter-btn btn-secondary" 
          onClick={() => setIsMobileFilterOpen(false)} 
          style={{ padding: '0.5rem', border: 'none' }}
        >
          <X size={24} />
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Category Filter */}
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--fg-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['All Fabrics', 'Cotton', 'Silk', 'Linen', 'Polyester', 'Denim'].map(cat => (
              <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: 'var(--fg-color)', fontWeight: cat === 'All Fabrics' ? 600 : 500 }}>
                <input type="checkbox" defaultChecked={cat === 'All Fabrics'} style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }} /> {cat}
              </label>
            ))}
          </div>
        </div>
        
        {/* Price Filter */}
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--fg-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price Range</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="number" placeholder="Min" className="input-custom" style={{ padding: '0.75rem', fontSize: '0.9rem' }} />
            <span style={{ color: 'var(--fg-secondary)' }}>-</span>
            <input type="number" placeholder="Max" className="input-custom" style={{ padding: '0.75rem', fontSize: '0.9rem' }} />
          </div>
        </div>

        {/* Minimum Order Filter */}
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--fg-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Minimum Order</h3>
          <select className="input-custom" style={{ padding: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}>
            <option>Any MOQ</option>
            <option>Under 100 units</option>
            <option>100 - 500 units</option>
            <option>500+ units</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--fg-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: 'var(--fg-color)' }}>
            <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }} /> In Stock Only
          </label>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}>Clear</button>
          <button className="btn-primary" style={{ flex: 2, padding: '1rem', fontSize: '1rem' }} onClick={() => setIsMobileFilterOpen(false)}>Apply Filters</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-custom marketplace-container" style={{ padding: '3rem 2rem', display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>
      
      {/* Desktop Sidebar Filters */}
      <aside style={{ width: '280px', flexShrink: 0 }} className="desktop-search">
        <FilterContent />
      </aside>

      {/* Mobile Bottom Sheet Filters Overlay */}
      <div 
        className={`mobile-overlay ${isMobileFilterOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileFilterOpen(false)}
      />
      
      {/* Mobile Bottom Sheet Filters */}
      <div className={`mobile-bottom-sheet ${isMobileFilterOpen ? 'open' : ''}`}>
        <FilterContent />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
        
        {/* Header & Sticky Search/Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="desktop-search">
            <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--fg-color)', letterSpacing: '-0.02em', fontFamily: 'var(--font-family-heading)' }}>Marketplace</h1>
            <p style={{ color: 'var(--fg-secondary)', margin: 0, fontSize: '1.1rem' }}>Discover premium textiles from top suppliers worldwide.</p>
          </div>
          
          <div className="sticky-mobile-search" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flex: 1, gap: '0.75rem', minWidth: '100%' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={20} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--fg-secondary)' }} />
                <input 
                  type="text" 
                  className="input-custom" 
                  placeholder="Search materials, colors..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '44px', height: '52px', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', fontSize: '1.05rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} 
                />
              </div>
              
              <button 
                className="mobile-filter-btn btn-secondary" 
                onClick={() => setIsMobileFilterOpen(true)}
                style={{ height: '52px', padding: '0 1.25rem', backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', display: 'none', alignItems: 'center', justifyContent: 'center' }}
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--fg-secondary)', fontWeight: 600 }}>Sort by:</span>
                <select className="input-custom" style={{ height: '40px', padding: '0 1rem', width: 'auto', border: 'none', backgroundColor: 'transparent', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>New Arrivals</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--card-bg)' }} className="desktop-search">
                <button onClick={() => setViewMode('grid')} style={{ padding: '0.5rem 0.75rem', background: viewMode === 'grid' ? 'var(--bg-color)' : 'transparent', border: 'none', cursor: 'pointer', borderRight: '1px solid var(--border-color)', color: viewMode === 'grid' ? 'var(--primary-color)' : 'var(--fg-secondary)' }}><LayoutGrid size={18} /></button>
                <button onClick={() => setViewMode('list')} style={{ padding: '0.5rem 0.75rem', background: viewMode === 'list' ? 'var(--bg-color)' : 'transparent', border: 'none', cursor: 'pointer', color: viewMode === 'list' ? 'var(--primary-color)' : 'var(--fg-secondary)' }}><List size={18} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--fg-secondary)', fontSize: '1.1rem' }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: '6rem 0', textAlign: 'center', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--fg-color)' }}>No products found</h3>
            <p style={{ color: 'var(--fg-secondary)' }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', gap: '2rem' }}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '4rem' }}>
              <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }} disabled>Previous</button>
              <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>1</button>
              <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>2</button>
              <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>3</button>
              <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Next <ChevronRight size={16} /></button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
