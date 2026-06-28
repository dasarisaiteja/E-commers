import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api/products';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) {
          throw new Error('Product not found or database connection error');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
    }
  };

  const handleBuyNow = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div style={styles.centerWrapper}>
        <RefreshCw className="animate-spin" size={32} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--primary-glow)' }} />
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Retrieving product files...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.centerWrapper}>
        <AlertTriangle size={48} style={{ color: 'var(--secondary-glow)', marginBottom: '16px' }} />
        <p style={{ color: 'var(--secondary-glow)', fontSize: '1.1rem' }}>{error || 'Product not found'}</p>
        <button onClick={() => navigate('/')} className="glass-btn" style={{ marginTop: '20px' }}>
          <ArrowLeft size={16} /> Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Back Button on Top Left */}
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      {/* Main product detail panel */}
      <div className="glass-panel" style={styles.detailCard}>
        <div style={styles.layout}>
          {/* Product Image Column */}
          <div style={styles.imageColumn}>
            <img src={product.imageUrl} alt={product.name} style={styles.productImage} />
          </div>

          {/* Product Details Column */}
          <div style={styles.detailsColumn}>
            <span className="glass-badge" style={styles.categoryBadge}>{product.category}</span>
            <h1 style={styles.productName}>{product.name}</h1>
            
            {/* Rating and Stock Row */}
            <div style={styles.metaRow}>
              <div style={styles.ratingBox}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(product.rating) ? 'gold' : 'none'}
                    stroke={i < Math.floor(product.rating) ? 'gold' : 'var(--text-muted)'}
                  />
                ))}
                <span style={styles.ratingValue}>{product.rating.toFixed(1)} / 5</span>
              </div>
              
              <span style={{
                ...styles.stockStatus,
                color: product.stockCount > 0 ? 'var(--accent-cyan)' : 'var(--secondary-glow)'
              }}>
                {product.stockCount > 0 ? `${product.stockCount} items in stock` : 'Temporarily Out of Stock'}
              </span>
            </div>

            {/* Price display */}
            <div style={styles.priceContainer}>
              <span style={styles.priceLabel}>Price:</span>
              <span style={styles.priceValue}>${product.price.toFixed(2)}</span>
            </div>

            {/* Complete product description */}
            <div style={styles.descriptionContainer}>
              <h3 style={styles.descriptionTitle}>About this item</h3>
              <p style={styles.descriptionText}>{product.description}</p>
            </div>

            {product.stockCount > 0 ? (
              <div style={styles.purchaseControls}>
                {/* Quantity adjustments */}
                <div style={styles.quantitySection}>
                  <span style={styles.controlLabel}>Quantity:</span>
                  <div style={styles.qtyBox}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={styles.qtyBtn}
                    >
                      -
                    </button>
                    <span style={styles.qtyValue}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      style={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Purchase CTA buttons */}
                <div style={styles.actionRow}>
                  <button onClick={handleAddToCart} className="glass-btn-secondary" style={styles.cartBtn}>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button onClick={handleBuyNow} className="glass-btn" style={styles.buyBtn}>
                    <ShieldCheck size={18} />
                    Buy Now
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.outOfStockAlert}>
                This product is currently out of stock. Check back soon!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px 20px 60px',
    minHeight: '75vh',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'var(--transition-smooth)',
    width: 'fit-content',
  },
  detailCard: {
    padding: '40px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.05) 100%)',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
  },
  imageColumn: {
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border-glass)',
    height: '420px',
    background: 'rgba(0,0,0,0.1)',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  detailsColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  categoryBadge: {
    width: 'fit-content',
    marginBottom: '15px',
  },
  productName: {
    fontSize: '2.2rem',
    fontWeight: '800',
    marginBottom: '15px',
    color: 'white',
    lineHeight: '1.2',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '15px',
  },
  ratingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  ratingValue: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: 'var(--text-glow)',
    marginLeft: '6px',
  },
  stockStatus: {
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    marginBottom: '25px',
  },
  priceLabel: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
  },
  priceValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'white',
  },
  descriptionContainer: {
    marginBottom: '30px',
  },
  descriptionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '10px',
    color: 'white',
  },
  descriptionText: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
  },
  purchaseControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: 'auto',
  },
  quantitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  controlLabel: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  qtyBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    border: '1px solid var(--border-glass)',
    padding: '4px',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    width: '32px',
    height: '32px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  },
  qtyValue: {
    fontSize: '1rem',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
  actionRow: {
    display: 'flex',
    gap: '15px',
  },
  cartBtn: {
    flex: '1',
    padding: '14px',
    fontSize: '1rem',
  },
  buyBtn: {
    flex: '1.2',
    padding: '14px',
    fontSize: '1rem',
    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)',
  },
  outOfStockAlert: {
    padding: '15px',
    background: 'rgba(236, 72, 153, 0.08)',
    border: '1px solid rgba(236, 72, 153, 0.2)',
    borderRadius: '12px',
    color: '#f472b6',
    fontSize: '0.95rem',
    textAlign: 'center',
  },
  centerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '150px 0',
    textAlign: 'center',
  },
};
