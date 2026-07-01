import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../redux/slices/cartSlice';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, ShoppingBag, ArrowLeft, Loader } from 'lucide-react';

export default function Checkout() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // If user is not logged in, redirect to auth page with state tracking.
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: '/checkout' } });
    }
  }, [user, navigate]);

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleExpiryChange = (e) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!cardNumber || !cardName || !expiry || !cvv) {
      setError('Please fill in all credit card details.');
      return;
    }

    setSubmitting(true);

    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl,
      }));

      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems,
          totalAmount: cartTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Order submission failed');
      }

      // Success
      dispatch(clearCart());
      navigate('/success', {
        state: {
          orderId: data._id,
          totalAmount: data.totalAmount,
          itemsCount: orderItems.reduce((acc, item) => acc + item.quantity, 0),
        },
      });
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please check inventory stock.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div style={styles.loadingScreen}>
        <Loader size={30} className="animate-spin" style={{ color: 'var(--primary-glow)', animation: 'spin 1.5s linear infinite' }} />
        <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>Checking authorization...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>
        <ArrowLeft size={16} />
        Back to Marketplace
      </button>

      <div className="checkout-layout" style={styles.layout}>
        {/* Checkout Items Summary */}
        <div className="glass-panel" style={styles.summarySection}>
          <h3 style={styles.sectionTitle}>
            <ShoppingBag size={20} style={{ color: 'var(--accent-cyan)' }} />
            Order Summary
          </h3>

          {cartItems.length === 0 ? (
            <div style={styles.emptyCartBox}>
              <p style={{ color: 'var(--text-muted)' }}>No items in checkout.</p>
              <button onClick={() => navigate('/')} className="glass-btn" style={{ marginTop: '16px' }}>
                Shop Products
              </button>
            </div>
          ) : (
            <div style={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item._id} style={styles.itemRow}>
                  <img src={item.imageUrl} alt={item.name} style={styles.itemImage} />
                  <div style={styles.itemDetails}>
                    <h5 style={styles.itemName}>{item.name}</h5>
                    <span style={styles.itemPrice}>
                      ${item.price.toFixed(2)} x {item.quantity}
                    </span>
                  </div>
                  <span style={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div style={styles.priceSummary}>
                <div style={styles.priceRow}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={styles.priceRow}>
                  <span>Shipping</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>FREE</span>
                </div>
                <div style={{ ...styles.priceRow, ...styles.totalPriceRow }}>
                  <span>Total Amount</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Simulation Form */}
        <div style={styles.paymentSection}>
          {/* Glowing Glass Simulated Credit Card */}
          <div className="glass-panel glass-card-visual" style={styles.glassCardVisual}>
            <div style={styles.cardHeaderVisual}>
              <div style={styles.chipVisual}></div>
              <div style={styles.contactlessVisual}></div>
            </div>
            <h4 style={styles.cardNumberVisual}>
              {cardNumber || '•••• •••• •••• ••••'}
            </h4>
            <div style={styles.cardFooterVisual}>
              <div style={styles.cardFooterCol}>
                <span style={styles.cardVisualLabel}>Card Holder</span>
                <span style={styles.cardVisualValue}>{cardName.toUpperCase() || 'YOUR NAME'}</span>
              </div>
              <div style={styles.cardFooterCol}>
                <span style={styles.cardVisualLabel}>Expires</span>
                <span style={styles.cardVisualValue}>{expiry || 'MM/YY'}</span>
              </div>
            </div>
          </div>

          {/* Payment Form input panels */}
          <div className="glass-panel" style={styles.formPanel}>
            <h3 style={styles.sectionTitle}>
              <CreditCard size={20} style={{ color: 'var(--primary-glow)' }} />
              Simulated Payment
            </h3>

            {error && <div style={styles.errorAlert}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Johnathan Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  maxLength={30}
                  className="glass-input"
                  disabled={submitting}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Card Number</label>
                <input
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="glass-input"
                  disabled={submitting}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className="glass-input"
                    disabled={submitting}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>CVV / CVC</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={3}
                    className="glass-input"
                    disabled={submitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="glass-btn"
                style={styles.payBtn}
                disabled={submitting || cartItems.length === 0}
              >
                {submitting ? (
                  'Securing transaction...'
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Pay ${cartTotal.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '80vh',
  },
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 430px',
    gap: '30px',
  },
  summarySection: {
    padding: '30px',
    height: 'fit-content',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
    paddingBottom: '10px',
  },
  emptyCartBox: {
    textAlign: 'center',
    padding: '40px 0',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
    paddingBottom: '15px',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  itemDetails: {
    flexGrow: 1,
  },
  itemName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-main)',
    marginBottom: '4px',
  },
  itemPrice: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  itemTotal: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  priceSummary: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: 'rgba(15, 23, 42, 0.04)',
    padding: '20px',
    borderRadius: '14px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
  },
  totalPriceRow: {
    borderTop: '1px solid rgba(15, 23, 42, 0.1)',
    paddingTop: '12px',
    marginTop: '4px',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  paymentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  glassCardVisual: {
    height: '220px',
    padding: '25px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.3) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 20px 40px rgba(31, 38, 135, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeaderVisual: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipVisual: {
    width: '45px',
    height: '35px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #d97706, #94a3b8)',
    opacity: '0.85',
  },
  contactlessVisual: {
    width: '30px',
    height: '30px',
    background: 'radial-gradient(circle, transparent 40%, rgba(15,23,42,0.1) 60%)',
    borderRadius: '50%',
  },
  cardNumberVisual: {
    fontSize: '1.4rem',
    letterSpacing: '3px',
    fontFamily: 'Courier, monospace',
    color: 'var(--text-main)',
    textAlign: 'center',
    margin: '20px 0',
  },
  cardFooterVisual: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cardFooterCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardVisualLabel: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '4px',
  },
  cardVisualValue: {
    fontSize: '0.9rem',
    fontWeight: '600',
    letterSpacing: '1px',
    color: 'var(--text-main)',
  },
  formPanel: {
    padding: '30px',
  },
  errorAlert: {
    background: 'rgba(219, 39, 119, 0.08)',
    border: '1px solid rgba(219, 39, 119, 0.2)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#db2777',
    fontSize: '0.9rem',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  payBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '1.05rem',
    marginTop: '10px',
    background: 'linear-gradient(135deg, var(--accent-cyan), var(--primary-glow))',
    borderColor: 'rgba(255,255,255,0.3)',
    color: '#ffffff',
  },
};
