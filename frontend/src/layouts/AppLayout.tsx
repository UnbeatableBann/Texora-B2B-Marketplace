import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '../features/auth/useAuthStore';
import { Search, ShoppingBag, User, Sparkles, Menu, Bell, TrendingUp, History, Store, LayoutGrid } from 'lucide-react';
import { useCartStore } from '../features/commerce/useCartStore';
import { useEffect, useState, useRef } from 'react';

export const AppLayout = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.onboarding_completed && location.pathname !== '/onboarding') {
        navigate('/onboarding', { replace: true });
      } else if (user.onboarding_completed && location.pathname === '/onboarding') {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartItemCount = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  const handleAuthAction = () => {
    if (isAuthenticated) {
      if (user?.role === 'buyer') navigate('/dashboard/buyer');
      else if (user?.role === 'supplier') navigate('/dashboard/supplier');
      else navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const NavLinks = () => {
    const links: any[] = [];
    if (!isAuthenticated) {
      links.push({ path: '/marketplace', label: 'Marketplace', icon: <Store size={20} /> });
      links.push({ path: '/categories', label: 'Categories', icon: <LayoutGrid size={20} /> });
    } else if (user?.role === 'buyer') {
      links.push({ path: '/marketplace', label: 'Marketplace', icon: <Store size={20} /> });
      links.push({ path: '/orders', label: 'Orders' });
    } else if (user?.role === 'supplier') {
      links.push({ path: '/dashboard/supplier/products', label: 'Products' });
      links.push({ path: '/dashboard/supplier/inventory', label: 'Inventory' });
      links.push({ path: '/orders', label: 'Orders' });
      links.push({ path: '/dashboard/supplier', label: 'Dashboard' });
    }

    return (
      <>
        {links.map(link => (
          <Link key={link.path} to={link.path} className={`nav-link ${location.pathname === link.path ? 'active' : ''}`} title={link.label} style={{ display: 'flex', alignItems: 'center' }}>
            {link.icon ? link.icon : link.label}
          </Link>
        ))}
        {!isAuthenticated && (
          <Link to="/ai" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={16} /> AI
          </Link>
        )}
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--fg-color)' }}>
      <header style={{ 
        borderBottom: '1px solid var(--border-color)', 
        backgroundColor: '#FDFBF7',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', gap: '2rem' }}>
          
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--fg-color)', textDecoration: 'none', flexShrink: 0 }}>
            <img src="/texora-logo.png" alt="Texora Logo" style={{ height: '32px', width: 'auto' }} />
            Texora.
          </Link>

          {/* Desktop Search */}
          <div className="desktop-search" style={{ flex: 1, maxWidth: '500px', display: 'none', position: 'relative' }} ref={searchContainerRef}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', color: 'var(--fg-secondary)' }} />
              <input 
                type="text" 
                className="input-custom" 
                placeholder="Search premium textiles, verified mills, or compositions..." 
                style={{ paddingLeft: '38px', height: '36px', borderRadius: '50px', fontSize: '0.9rem', backgroundColor: 'var(--bg-color)' }} 
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>
            
            {/* Intelligent Search Dropdown */}
            {isSearchFocused && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.12)', zIndex: 60, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fg-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Recent Searches</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--fg-color)', cursor: 'pointer', fontSize: '0.9rem' }}><History size={14} color="var(--fg-secondary)" /> organic cotton fabric</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--fg-color)', cursor: 'pointer', fontSize: '0.9rem' }}><History size={14} color="var(--fg-secondary)" /> recycled polyester</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fg-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Trending Categories</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="badge badge-trending" style={{ cursor: 'pointer' }}><TrendingUp size={12} /> Sustainable Denim</span>
                    <span className="badge badge-trending" style={{ cursor: 'pointer' }}><TrendingUp size={12} /> Silk Blends</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {/* Desktop Navigation */}
            <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <NavLinks />
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
              
              {/* Notifications */}
              {isAuthenticated && (
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: 'var(--fg-color)' }}>
                  <Bell size={20} />
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: 'var(--primary-color)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                </button>
              )}

              {/* Cart Icon */}
              {user?.role !== 'supplier' && (
                <button onClick={() => navigate('/cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: 'var(--fg-color)', transition: 'color 0.2s' }} className="hover-color-primary">
                  <ShoppingBag size={20} />
                  {cartItemCount > 0 && (
                    <span style={{
                      position: 'absolute', top: '-6px', right: '-8px',
                      backgroundColor: 'var(--primary-color)', color: '#fff',
                      fontSize: '0.65rem', fontWeight: 700,
                      width: '18px', height: '18px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}
              
              {/* Profile / Auth Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {isAuthenticated ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={handleAuthAction} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-color)', fontWeight: 600 }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} />
                      </div>
                      <span className="desktop-nav">{(user as any)?.company_name || 'Profile'}</span>
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="btn-primary desktop-nav" style={{ padding: '0.5rem 1.25rem', fontSize: '0.95rem', textDecoration: 'none' }}>
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="mobile-menu-btn" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-color)', display: 'none' }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="mobile-nav" style={{ borderTop: '1px solid var(--border-color)', padding: '1rem', backgroundColor: 'var(--card-bg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
              <Search size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--fg-secondary)' }} />
              <input type="text" className="input-custom" placeholder="Search products..." style={{ paddingLeft: '36px', height: '40px' }} />
            </div>
            <NavLinks />
            {!isAuthenticated && (
              <Link to="/login" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>Sign In</Link>
            )}
            {isAuthenticated && (
              <button onClick={() => logout()} className="btn-secondary" style={{ width: '100%' }}>Logout</button>
            )}
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '4rem 0', backgroundColor: 'var(--card-bg)', marginTop: 'auto' }}>
        <div className="container-custom" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/texora-logo.png" alt="Texora Logo" style={{ height: '32px', width: 'auto' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--fg-color)', letterSpacing: '-0.02em' }}>Texora.</h3>
            </div>
            <p style={{ color: 'var(--fg-secondary)', maxWidth: '300px', fontSize: '0.95rem', lineHeight: 1.6 }}>
              The modern B2B marketplace for textiles. Buy and sell premium fabrics in minutes, not days.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <strong style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Platform</strong>
              <Link to="/marketplace" style={{ color: 'var(--fg-secondary)', textDecoration: 'none', fontSize: '0.95rem' }} className="hover-color-primary">Browse</Link>
              <Link to="/login" style={{ color: 'var(--fg-secondary)', textDecoration: 'none', fontSize: '0.95rem' }} className="hover-color-primary">Sell</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <strong style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Company</strong>
              <a href="#" style={{ color: 'var(--fg-secondary)', textDecoration: 'none', fontSize: '0.95rem' }} className="hover-color-primary">About</a>
              <a href="#" style={{ color: 'var(--fg-secondary)', textDecoration: 'none', fontSize: '0.95rem' }} className="hover-color-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
