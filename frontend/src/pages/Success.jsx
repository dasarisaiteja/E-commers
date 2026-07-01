import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state passed from checkout router
  const { orderId, totalAmount, itemsCount } = location.state || {
    orderId: 'SIMULATED-ORDER-' + Math.floor(Math.random() * 100000),
    totalAmount: 0.0,
    itemsCount: 0,
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <div style={styles.iconWrapper}>
          <CheckCircle size={64} style={styles.successIcon} />
        </div>

        <h2 style={styles.title}>Payment Successful!</h2>
        <p style={styles.subtitle}>Your order has been placed and is now processing.</p>

        <div style={styles.receiptBox}>
          <div className="receipt-row" style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Order Reference ID</span>
            <span style={styles.receiptValue}>{orderId}</span>
          </div>
          <div className="receipt-row" style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Total Items Purchased</span>
            <span style={styles.receiptValue}>{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</span>
          </div>
          <div className="receipt-row" style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Amount Transacted</span>
            <span style={styles.receiptValueGlow}>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="receipt-row" style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Shipping Speed</span>
            <span style={styles.receiptValue}>Standard Glass Delivery</span>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={() => navigate('/')} className="glass-btn" style={styles.homeBtn}>
            <ShoppingBag size={18} />
            Continue Shopping
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '75vh',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    padding: '50px 40px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.6) 100%)',
  },
  iconWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'rgba(13, 148, 136, 0.08)',
    border: '1px solid rgba(13, 148, 136, 0.2)',
    boxShadow: '0 0 30px rgba(13, 148, 136, 0.15)',
    marginBottom: '30px',
    animation: 'pulse 2s infinite ease-in-out',
  },
  successIcon: {
    color: 'var(--accent-cyan)',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--text-main) 40%, var(--accent-cyan) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
    marginBottom: '35px',
  },
  receiptBox: {
    background: 'rgba(15, 23, 42, 0.04)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    textAlign: 'left',
    marginBottom: '40px',
    border: '1px solid rgba(15, 23, 42, 0.06)',
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.95rem',
  },
  receiptLabel: {
    color: 'var(--text-muted)',
  },
  receiptValue: {
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  receiptValueGlow: {
    fontWeight: '700',
    color: 'var(--accent-cyan)',
    fontSize: '1.1rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
  },
  homeBtn: {
    padding: '12px 28px',
    fontSize: '1rem',
    background: 'linear-gradient(135deg, var(--accent-cyan), var(--primary-glow))',
    color: '#ffffff',
  },
};
