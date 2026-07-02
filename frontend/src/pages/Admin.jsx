import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Trash2, Edit3, Plus, X, 
  RefreshCw, Package, CircleDollarSign, 
  Layers, AlertTriangle, ArrowLeft, Save
} from 'lucide-react';

const API_BASE = 'http://localhost:5001/api/products';

export default function Admin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Catalog state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding, product object if editing

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Keyboards');
  const [imageUrl, setImageUrl] = useState('');
  const [stockCount, setStockCount] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const categories = ['Keyboards', 'Audio', 'Monitors', 'Wearables', 'Accessories'];

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        throw new Error('Failed to fetch store catalog.');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchProducts();
    }
  }, [user]);

  // Open modal for Adding new product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Keyboards');
    setImageUrl('');
    setStockCount('');
    setFormError('');
    setActionSuccess('');
    setModalOpen(true);
  };

  // Open modal for Editing a product
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category);
    setImageUrl(product.imageUrl);
    setStockCount(product.stockCount.toString());
    setFormError('');
    setActionSuccess('');
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  // Handle Form Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setActionSuccess('');

    if (!name || !description || !price || !category || !imageUrl || stockCount === '') {
      setFormError('Please fill out all product details.');
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      setFormError('Please enter a valid price (greater than 0).');
      return;
    }

    if (isNaN(stockCount) || Number(stockCount) < 0) {
      setFormError('Please enter a valid stock count (0 or higher).');
      return;
    }

    setSubmitting(true);
    const payload = {
      name,
      description,
      price: Number(price),
      category,
      imageUrl,
      stockCount: Number(stockCount),
    };

    try {
      const url = editingProduct ? `${API_BASE}/${editingProduct._id}` : API_BASE;
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      setActionSuccess(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      fetchProducts();
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Product
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to permanently remove this product from the database?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      // Refresh list
      fetchProducts();
    } catch (err) {
      alert(`Error deleting product: ${err.message}`);
    }
  };

  // 1. Access Denied Screen (Security Guard)
  if (!user || !user.isAdmin) {
    return (
      <div style={styles.accessDeniedContainer}>
        <div className="glass-panel" style={styles.accessDeniedCard}>
          <div style={styles.shieldWrapper}>
            <ShieldAlert size={64} style={{ color: 'var(--secondary-glow)' }} />
          </div>
          <h2 style={styles.deniedTitle}>Admin Access Denied</h2>
          <p style={styles.deniedSubtitle}>
            This zone is restricted to administrative personnel only. Your credentials do not grant access to product catalogs edit tools.
          </p>
          <button onClick={() => navigate('/')} className="glass-btn" style={{ marginTop: '20px' }}>
            <ArrowLeft size={16} /> Return to Shop
          </button>
        </div>
      </div>
    );
  }

  // 2. Metrics Statistics
  const totalStock = products.reduce((acc, item) => acc + item.stockCount, 0);
  const lowStockCount = products.filter(item => item.stockCount <= 5).length;
  const uniqueCategories = new Set(products.map(item => item.category)).size;

  return (
    <div style={styles.container}>
      {/* Admin Panel Header */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.pageTitle}>Admin Dashboard</h1>
          <p style={styles.pageSubtitle}>Update catalog inventory, add new products, or clear listings</p>
        </div>
        <button onClick={handleOpenAdd} className="glass-btn" style={styles.addBtn}>
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Admin Analytics Grid */}
      <div style={styles.metricsGrid}>
        <div className="glass-panel" style={styles.metricCard}>
          <div style={styles.metricIconRow}>
            <Package size={24} style={{ color: 'var(--primary-glow)' }} />
            <span style={styles.metricLabel}>Total Items</span>
          </div>
          <span style={styles.metricValue}>{products.length}</span>
        </div>

        <div className="glass-panel" style={styles.metricCard}>
          <div style={styles.metricIconRow}>
            <CircleDollarSign size={24} style={{ color: 'var(--accent-cyan)' }} />
            <span style={styles.metricLabel}>Total Inventory Quantity</span>
          </div>
          <span style={styles.metricValue}>{totalStock} units</span>
        </div>

        <div className="glass-panel" style={styles.metricCard}>
          <div style={styles.metricIconRow}>
            <Layers size={24} style={{ color: 'var(--secondary-glow)' }} />
            <span style={styles.metricLabel}>Active Categories</span>
          </div>
          <span style={styles.metricValue}>{uniqueCategories}</span>
        </div>

        <div className="glass-panel" style={{ 
          ...styles.metricCard, 
          borderColor: lowStockCount > 0 ? 'rgba(219, 39, 119, 0.4)' : 'var(--border-glass)' 
        }}>
          <div style={styles.metricIconRow}>
            <AlertTriangle size={24} style={{ color: lowStockCount > 0 ? 'var(--secondary-glow)' : 'var(--accent-cyan)' }} />
            <span style={styles.metricLabel}>Critical Low Stock</span>
          </div>
          <span style={styles.metricValue}>{lowStockCount} items</span>
        </div>
      </div>

      {/* Main product management grid */}
      <div style={styles.catalogSection}>
        <h3 style={styles.sectionHeading}>Product Database Catalog</h3>
        
        {loading ? (
          <div style={styles.loadingWrapper}>
            <RefreshCw className="animate-spin" size={32} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--primary-glow)' }} />
            <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Syncing with inventory...</p>
          </div>
        ) : error ? (
          <div style={styles.errorWrapper}>
            <p style={{ color: 'var(--secondary-glow)' }}>Failed to load catalog: {error}</p>
            <button onClick={fetchProducts} className="glass-btn" style={{ marginTop: '16px' }}>Retry Sync</button>
          </div>
        ) : products.length === 0 ? (
          <div style={styles.emptyWrapper}>
            <p style={{ color: 'var(--text-muted)' }}>Store catalog database is empty.</p>
            <button onClick={handleOpenAdd} className="glass-btn" style={{ marginTop: '16px' }}>Create First Product</button>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {products.map((product) => (
              <div key={product._id} className="glass-panel" style={styles.managementCard}>
                <div style={styles.cardImageContainer}>
                  <img src={product.imageUrl} alt={product.name} style={styles.cardImage} />
                  <span className="glass-badge" style={styles.cardCategoryBadge}>{product.category}</span>
                </div>
                
                <div style={styles.cardDetails}>
                  <h4 style={styles.productName} title={product.name}>{product.name}</h4>
                  <p style={styles.productDesc}>{product.description}</p>
                  
                  <div style={styles.metaRow}>
                    <div style={styles.metaCol}>
                      <span style={styles.metaLabel}>Retail Price</span>
                      <span style={styles.metaValuePrice}>${product.price.toFixed(2)}</span>
                    </div>
                    <div style={styles.metaCol}>
                      <span style={styles.metaLabel}>Warehouse Stock</span>
                      <span style={{ 
                        ...styles.metaValueStock,
                        color: product.stockCount <= 5 ? 'var(--secondary-glow)' : 'var(--text-main)'
                      }}>
                        {product.stockCount} units
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <button 
                    onClick={() => handleOpenEdit(product)} 
                    className="glass-btn-secondary" 
                    style={styles.editBtn}
                    title="Edit Item details"
                  >
                    <Edit3 size={15} />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)} 
                    className="glass-btn-secondary" 
                    style={styles.deleteBtn}
                    title="Delete item"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Glassmorphic Edit/Add Form Modal Overlay */}
      {modalOpen && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div className="glass-panel" style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingProduct ? 'Edit Aura Product' : 'Add Aura Product'}</h3>
              <button onClick={handleCloseModal} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            {formError && <div style={styles.formErrorAlert}>{formError}</div>}
            {actionSuccess && <div style={styles.formSuccessAlert}>{actionSuccess}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aura Prism Monitor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input"
                  disabled={submitting}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="glass-input"
                    style={{ cursor: 'pointer' }}
                    disabled={submitting}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Price (USD)</label>
                  <input
                    type="text"
                    placeholder="e.g. 199.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="glass-input"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    className="glass-input"
                    disabled={submitting}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or relative"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="glass-input"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="Premium glass-morphic features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input"
                  style={{ ...styles.textarea, minHeight: '90px' }}
                  disabled={submitting}
                />
              </div>

              <button type="submit" className="glass-btn" style={styles.submitBtn} disabled={submitting}>
                {submitting ? (
                  <RefreshCw className="animate-spin" size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    <Save size={16} />
                    <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
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
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--text-main) 30%, var(--primary-glow) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '6px',
  },
  pageSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  addBtn: {
    padding: '12px 20px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  metricCard: {
    padding: '24px',
  },
  metricIconRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  metricLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  metricValue: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'var(--text-main)',
  },
  catalogSection: {
    marginBottom: '40px',
  },
  sectionHeading: {
    fontSize: '1.35rem',
    fontWeight: '700',
    marginBottom: '24px',
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
  },
  errorWrapper: {
    textAlign: 'center',
    padding: '60px 0',
  },
  emptyWrapper: {
    textAlign: 'center',
    padding: '60px 0',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    border: '1px dashed rgba(15, 23, 42, 0.1)',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  managementCard: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
  },
  cardImageContainer: {
    position: 'relative',
    height: '160px',
    background: 'rgba(0,0,0,0.03)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardCategoryBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: '2',
  },
  cardDetails: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
  },
  productName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-main)',
    marginBottom: '6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
    marginTop: 'auto',
    borderTop: '1px solid rgba(15, 23, 42, 0.06)',
    paddingTop: '12px',
  },
  metaCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: '2px',
  },
  metaValuePrice: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  metaValueStock: {
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  cardActions: {
    display: 'flex',
    borderTop: '1px solid rgba(15, 23, 42, 0.08)',
    background: 'rgba(255, 255, 255, 0.3)',
  },
  editBtn: {
    flex: '1',
    borderRadius: '0',
    padding: '12px',
    border: 'none',
    borderRight: '1px solid rgba(15, 23, 42, 0.08)',
    fontSize: '0.85rem',
    background: 'none',
  },
  deleteBtn: {
    flex: '1',
    borderRadius: '0',
    padding: '12px',
    border: 'none',
    fontSize: '0.85rem',
    color: 'rgba(219, 39, 119, 0.8)',
    background: 'none',
  },
  // Modal overlay
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: '200',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '550px',
    padding: '30px',
    background: 'rgba(255, 255, 255, 0.9)',
    animation: 'fadeIn 0.25s ease-out forwards',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
    paddingBottom: '12px',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  textarea: {
    fontFamily: 'inherit',
    resize: 'none',
  },
  submitBtn: {
    marginTop: '10px',
    width: '100%',
    padding: '12px',
  },
  formErrorAlert: {
    background: 'rgba(219, 39, 119, 0.08)',
    border: '1px solid rgba(219, 39, 119, 0.2)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#db2777',
    fontSize: '0.85rem',
    marginBottom: '15px',
    textAlign: 'center',
  },
  formSuccessAlert: {
    background: 'rgba(13, 148, 136, 0.08)',
    border: '1px solid rgba(13, 148, 136, 0.2)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--accent-cyan)',
    fontSize: '0.85rem',
    marginBottom: '15px',
    textAlign: 'center',
  },
  // Access Denied styles
  accessDeniedContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '75vh',
    padding: '20px',
  },
  accessDeniedCard: {
    width: '100%',
    maxWidth: '480px',
    padding: '50px 30px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.6) 100%)',
  },
  shieldWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'rgba(219, 39, 119, 0.08)',
    border: '1px solid rgba(219, 39, 119, 0.2)',
    boxShadow: '0 0 30px rgba(219, 39, 119, 0.15)',
    marginBottom: '30px',
  },
  deniedTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    marginBottom: '12px',
  },
  deniedSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '10px',
  },
};
