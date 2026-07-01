import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCartItems, 
  selectCartCount, 
  selectCartTotal, 
  updateQuantity, 
  removeFromCart, 
  clearCart 
} from './redux/slices/cartSlice';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import ProductDetails from './pages/ProductDetails';

// Icons
import { ShoppingCart, LogOut, User, X, Plus, Minus, Trash2, ShieldAlert } from 'lucide-react';

function NavigationHeader({ onCartOpen }) {
  const { user, logout } = useAuth();
  const cartCount = useSelector(selectCartCount);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthClick = () => {
    if (user) {
      logout();
      navigate('/');
    } else {
      navigate('/auth', { state: { from: location.pathname } });
    }
  };

  return (
    <header className="glass-panel app-header" style={styles.header}>
      <Link to="/" style={styles.logo}>
        <div style={styles.logoOrb}></div>
        <span style={styles.logoText}>AURA</span>
        <span className="logo-subtext" style={styles.logoSubtext}>GLASS</span>
      </Link>

      <div className="app-nav-actions" style={styles.navActions}>
        {/* Auth status panel */}
        {user ? (
          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <User size={14} style={{ color: 'var(--accent-cyan)' }} />
              <span style={styles.userName}>{user.name}</span>
            </div>
            <button onClick={handleAuthClick} className="glass-btn-secondary" style={styles.authBtn}>
              <LogOut size={14} />
              Logout
            </button>
          </div>
        ) : (
          <button onClick={handleAuthClick} className="glass-btn" style={styles.authBtn}>
            <User size={14} />
            Sign In
          </button>
        )}

        {/* Cart trigger button */}
        <button onClick={onCartOpen} className="glass-btn-secondary" style={styles.cartTrigger}>
          <ShoppingCart size={18} />
          <span>Cart</span>
          {cartCount > 0 && (
            <span style={styles.cartBadge}>{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}

function CartSidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div style={styles.sidebarOverlay} onClick={onClose}>
      <div 
        className="glass-panel sidebar-cart" 
        style={styles.sidebarCart} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.sidebarCartHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={20} style={{ color: 'var(--primary-glow)' }} />
            <h3 style={{ fontSize: '1.25rem' }}>Your Cart</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div style={styles.sidebarEmpty}>
            <ShoppingCart size={48} style={{ color: 'var(--text-muted)', opacity: '0.3', marginBottom: '16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Your cart is empty.</p>
            <button onClick={onClose} className="glass-btn" style={{ marginTop: '20px' }}>
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Cart Items */}
            <div style={styles.cartItemsScrollContainer}>
              {cartItems.map((item) => (
                <div key={item._id} style={styles.cartItemCard}>
                  <img src={item.imageUrl} alt={item.name} style={styles.cartItemImage} />
                  <div style={styles.cartItemDetails}>
                    <h4 style={styles.cartItemName}>{item.name}</h4>
                    <span style={styles.cartItemPrice}>${item.price.toFixed(2)}</span>
                    
                    {/* Quantity controls */}
                    <div style={styles.quantityControls}>
                      <button 
                        onClick={() => dispatch(updateQuantity({ productId: item._id, quantity: item.quantity - 1 }))}
                        style={styles.qtyBtn}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={styles.qtyValue}>{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(updateQuantity({ productId: item._id, quantity: item.quantity + 1 }))}
                        style={styles.qtyBtn}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => dispatch(removeFromCart(item._id))}
                    style={styles.deleteItemBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Sidebar Cart Footer */}
            <div style={styles.sidebarCartFooter}>
              <div style={styles.sidebarTotalRow}>
                <span>Total Amount:</span>
                <span style={styles.sidebarTotalValue}>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={styles.footerActionRow}>
                <button 
                  onClick={() => dispatch(clearCart())} 
                  className="glass-btn-secondary" 
                  style={{ flexGrow: 1, padding: '12px' }}
                >
                  Clear Cart
                </button>
                <button 
                  onClick={handleCheckoutClick} 
                  className="glass-btn" 
                  style={{ flexGrow: 2, padding: '12px' }}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MainAppLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      {/* Dynamic Background Glowing Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Sticky Header Nav */}
      <NavigationHeader onCartOpen={() => setCartOpen(true)} />

      {/* Slide-out Shopping Cart */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Core Pages Content */}
      <main style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </main>

      {/* Sticky Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Aura Glass E-Commerce. All rights reserved. Simulating MERN with high-end glass aesthetics.</p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainAppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    position: 'sticky',
    top: '20px',
    margin: '0 auto 20px',
    maxWidth: '1200px',
    width: 'calc(100% - 40px)',
    zIndex: '100',
    borderRadius: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoOrb: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary-glow), var(--secondary-glow))',
    boxShadow: '0 0 10px rgba(139, 92, 246, 0.6)',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    letterSpacing: '2px',
  },
  logoSubtext: {
    fontSize: '0.8rem',
    fontWeight: '400',
    color: 'var(--accent-cyan)',
    letterSpacing: '1px',
    borderLeft: '1px solid rgba(15, 23, 42, 0.15)',
    paddingLeft: '8px',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    color: 'var(--text-glow)',
    background: 'rgba(15, 23, 42, 0.03)',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-glass)',
  },
  userName: {
    fontWeight: '500',
  },
  authBtn: {
    fontSize: '0.85rem',
    padding: '8px 14px',
  },
  cartTrigger: {
    fontSize: '0.85rem',
    padding: '8px 14px',
    position: 'relative',
    display: 'flex',
    gap: '8px',
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: 'linear-gradient(135deg, var(--secondary-glow), var(--primary-glow))',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    boxShadow: '0 0 8px rgba(236, 72, 153, 0.5)',
  },
  mainContent: {
    minHeight: '75vh',
    position: 'relative',
    zIndex: '1',
  },
  sidebarOverlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: '200',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  sidebarCart: {
    width: '100%',
    maxWidth: '430px',
    height: '100%',
    borderRadius: '0',
    borderTopLeftRadius: '24px',
    borderBottomLeftRadius: '24px',
    borderRight: 'none',
    borderTop: 'none',
    borderBottom: 'none',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'rgba(255, 255, 255, 0.85)',
    animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  },
  sidebarCartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
    paddingBottom: '15px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  sidebarEmpty: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemsScrollContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    paddingRight: '5px',
    marginBottom: '20px',
  },
  cartItemCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.45)',
    border: '1px solid rgba(15, 23, 42, 0.06)',
    borderRadius: '14px',
    position: 'relative',
  },
  cartItemImage: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  cartItemDetails: {
    flexGrow: 1,
  },
  cartItemName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-main)',
    marginBottom: '4px',
  },
  cartItemPrice: {
    fontSize: '0.85rem',
    color: 'var(--accent-cyan)',
    fontWeight: '500',
    display: 'block',
    marginBottom: '8px',
  },
  quantityControls: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(15, 23, 42, 0.04)',
    padding: '4px 8px',
    borderRadius: '8px',
    border: '1px solid rgba(15, 23, 42, 0.06)',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: '0.85rem',
    fontWeight: '600',
    minWidth: '15px',
    textAlign: 'center',
  },
  deleteItemBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(219, 39, 119, 0.7)',
    cursor: 'pointer',
    alignSelf: 'center',
    transition: 'var(--transition-smooth)',
  },
  sidebarCartFooter: {
    borderTop: '1px solid rgba(15, 23, 42, 0.08)',
    paddingTop: '20px',
  },
  sidebarTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '1.05rem',
    color: 'var(--text-muted)',
  },
  sidebarTotalValue: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  footerActionRow: {
    display: 'flex',
    gap: '12px',
  },
  footer: {
    textAlign: 'center',
    padding: '40px 20px',
    marginTop: '60px',
    borderTop: '1px solid rgba(15, 23, 42, 0.06)',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    position: 'relative',
    zIndex: '1',
  },
};
