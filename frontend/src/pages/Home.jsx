import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ShoppingCart, ArrowRight, Star, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api/products';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State variables for filter and products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter conditions
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Available categories
  const categories = ['All', 'Keyboards', 'Audio', 'Monitors', 'Wearables', 'Accessories'];

  // Fetch products based on filters
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (category && category !== 'All') queryParams.append('category', category);
      if (minPrice > 0) queryParams.append('minPrice', minPrice);
      if (maxPrice < 1000) queryParams.append('maxPrice', maxPrice);
      if (sortBy) queryParams.append('sortBy', sortBy);

      const response = await fetch(`${API_BASE}?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to retrieve products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run search when filters change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce typing input

    return () => clearTimeout(delayDebounce);
  }, [search, category, minPrice, maxPrice, sortBy]);

  const handleBuyNow = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    navigate('/checkout');
  };

  return (
    <div style={styles.container}>
      {/* Header hero section */}
      <div className="glass-panel hero-section" style={styles.heroSection}>
        <h1 className="hero-title" style={styles.heroTitle}>Futuristic Glass E-Market</h1>
        <p className="hero-subtitle" style={styles.heroSubtitle}> frosted premium tech gadgets & ambient desk setups </p>
      </div>

      <div className="home-main-layout" style={styles.mainLayout}>
        {/* Filter panel sidebar */}
        <div className="glass-panel home-sidebar" style={styles.sidebar}>
          <div 
            style={styles.sidebarHeader} 
            className="home-sidebar-header"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <SlidersHorizontal size={20} style={{ color: 'var(--primary-glow)' }} />
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Filters</h3>
            </div>
            <span className="mobile-filter-toggle-icon">
              {showFilters ? 'Hide' : 'Show'}
            </span>
          </div>

          <div className={`home-filters-body ${showFilters ? 'show-mobile' : ''}`}>

          {/* Search bar inside filters */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Search Catalog</label>
            <div style={styles.searchWrapper}>
              <Search size={18} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input"
                style={styles.searchInputCustom}
              />
            </div>
          </div>

          {/* Category buttons list */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Category</label>
            <div style={styles.categoryGrid}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="glass-btn-secondary"
                  style={{
                    ...styles.categoryBtn,
                    background: category === cat ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(219, 39, 119, 0.15))' : 'rgba(255, 255, 255, 0.4)',
                    borderColor: category === cat ? 'var(--primary-glow)' : 'rgba(15, 23, 42, 0.08)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div style={styles.filterGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={styles.filterLabel}>Price Range</label>
              <span style={styles.priceRangeLabel}>${minPrice} - ${maxPrice === 1000 ? '1000+' : maxPrice}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={styles.slider}
              />
            </div>
          </div>

          {/* Sorting */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input"
              style={styles.selectInput}
            >
              <option value="newest">Newest Releases</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          </div>
        </div>

        {/* Product Grid Panel */}
        <div style={styles.productSection}>
          {loading ? (
            <div style={styles.centerWrapper}>
              <RefreshCw className="animate-spin" size={32} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--primary-glow)' }} />
              <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Fetching premium items...</p>
            </div>
          ) : error ? (
            <div style={styles.centerWrapper}>
              <p style={{ color: 'var(--secondary-glow)' }}>Error loading catalog: {error}</p>
              <button onClick={fetchProducts} className="glass-btn" style={{ marginTop: '16px' }}>Retry Connection</button>
            </div>
          ) : products.length === 0 ? (
            <div style={styles.centerWrapper}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No products found matching filters.</p>
              <button onClick={() => { setSearch(''); setCategory('All'); setMinPrice(0); setMaxPrice(1000); }} className="glass-btn-secondary" style={{ marginTop: '16px' }}>Clear Filters</button>
            </div>
          ) : (
            <div style={styles.productGrid}>
              {products.map((product) => (
                <div key={product._id} className="glass-panel" style={styles.productCard}>
                  <div 
                    style={{ ...styles.imageContainer, cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <img src={product.imageUrl} alt={product.name} style={styles.productImage} />
                    <span className="glass-badge" style={styles.cardBadge}>{product.category}</span>
                  </div>
                  <div style={styles.cardBody}>
                    <h4 
                      style={{ ...styles.productName, cursor: 'pointer' }}
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.name}
                    </h4>
                    <p 
                      style={{ ...styles.productDesc, cursor: 'pointer' }}
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.description}
                    </p>
                    
                    {/* Stars and Stock */}
                    <div style={styles.metaRow}>
                      <div style={styles.ratingBox}>
                        <Star size={14} fill="gold" stroke="gold" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: product.stockCount > 0 ? 'var(--accent-cyan)' : 'var(--secondary-glow)' }}>
                        {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of Stock'}
                      </span>
                    </div>

                    <div style={styles.footerRow}>
                      <span style={styles.productPrice}>${product.price.toFixed(2)}</span>
                      <div style={styles.cardActions}>
                        <button
                          onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
                          disabled={product.stockCount <= 0}
                          className="glass-btn-secondary"
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                          title="Add to Cart"
                        >
                          <ShoppingCart size={15} />
                        </button>
                        <button
                          onClick={() => handleBuyNow(product)}
                          disabled={product.stockCount <= 0}
                          className="glass-btn"
                          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                        >
                          Buy Now
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
  heroSection: {
    padding: '50px 30px',
    textAlign: 'center',
    marginBottom: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.6) 100%)',
  },
  heroTitle: {
    fontSize: '2.8rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--text-main) 30%, var(--primary-glow) 75%, var(--secondary-glow) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px',
  },
  heroSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
    fontWeight: '400',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '30px',
  },
  sidebar: {
    padding: '24px',
    height: 'fit-content',
    position: 'sticky',
    top: '90px',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
    paddingBottom: '10px',
  },
  filterGroup: {
    marginBottom: '24px',
  },
  filterLabel: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
  },
  searchWrapper: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  searchInputCustom: {
    paddingLeft: '38px',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  categoryBtn: {
    padding: '8px 10px',
    fontSize: '0.85rem',
    borderRadius: '8px',
    textAlign: 'center',
  },
  priceRangeLabel: {
    fontSize: '0.9rem',
    color: 'var(--accent-cyan)',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    accentColor: 'var(--primary-glow)',
    background: 'rgba(15, 23, 42, 0.1)',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  selectInput: {
    cursor: 'pointer',
  },
  productSection: {
    minHeight: '400px',
  },
  centerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 0',
    textAlign: 'center',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: '180px',
    width: '100%',
    background: 'rgba(0,0,0,0.03)',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  cardBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: '2',
  },
  cardBody: {
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
  },
  productName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: 'var(--text-main)',
  },
  productDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    marginBottom: '15px',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '38px',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  ratingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    borderTop: '1px solid rgba(15, 23, 42, 0.08)',
    paddingTop: '12px',
  },
  productPrice: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
};
