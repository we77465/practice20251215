import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Users, BarChart3, Plus, Edit, Trash2, X } from 'lucide-react';
import { adminAPI, productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, productsRes, categoriesRes, ordersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getProducts(),
        productsAPI.getCategories(),
        adminAPI.getOrders()
      ]);
      setStats(statsRes.data.stats);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data.categories);
      setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('確定要刪除此商品？')) return;
    try {
      await adminAPI.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      alert('刪除成功');
    } catch (error) {
      alert(error.response?.data?.error || '刪除失敗');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      alert(error.response?.data?.error || '更新失敗');
    }
  };

  if (loading) {
    return <div className="admin-page"><div className="loading">載入中...</div></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <h2>🦎 管理後台</h2>
        <nav>
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <BarChart3 size={20} /> 儀表板
          </button>
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
            <Package size={20} /> 商品管理
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <ShoppingCart size={20} /> 訂單管理
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && stats && (
          <div className="dashboard">
            <h1>儀表板</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <Package size={32} />
                <div>
                  <span className="stat-value">{stats.total_products}</span>
                  <span className="stat-label">商品總數</span>
                </div>
              </div>
              <div className="stat-card">
                <ShoppingCart size={32} />
                <div>
                  <span className="stat-value">{stats.total_orders}</span>
                  <span className="stat-label">訂單總數</span>
                </div>
              </div>
              <div className="stat-card pending">
                <ShoppingCart size={32} />
                <div>
                  <span className="stat-value">{stats.pending_orders}</span>
                  <span className="stat-label">待處理訂單</span>
                </div>
              </div>
              <div className="stat-card revenue">
                <BarChart3 size={32} />
                <div>
                  <span className="stat-value">NT$ {stats.total_revenue.toLocaleString()}</span>
                  <span className="stat-label">總營收</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-management">
            <div className="section-header">
              <h1>商品管理</h1>
              <button className="add-btn" onClick={() => { setEditingProduct(null); setShowModal(true); }}>
                <Plus size={20} /> 新增商品
              </button>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>圖片</th>
                    <th>名稱</th>
                    <th>分類</th>
                    <th>價格</th>
                    <th>庫存</th>
                    <th>狀態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td><img src={product.image_url || 'https://via.placeholder.com/50'} alt="" className="table-img" /></td>
                      <td>{product.name}</td>
                      <td>{product.category_name}</td>
                      <td>NT$ {product.price.toLocaleString()}</td>
                      <td>{product.stock}</td>
                      <td><span className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}>{product.is_active ? '上架' : '下架'}</span></td>
                      <td>
                        <div className="action-btns">
                          <button onClick={() => { setEditingProduct(product); setShowModal(true); }}><Edit size={16} /></button>
                          <button className="delete" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-management">
            <h1>訂單管理</h1>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>訂單ID</th>
                    <th>收件人</th>
                    <th>金額</th>
                    <th>狀態</th>
                    <th>日期</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.shipping_name}</td>
                      <td>NT$ {order.total_amount.toLocaleString()}</td>
                      <td>
                        <select value={order.status} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}>
                          <option value="pending">待處理</option>
                          <option value="confirmed">已確認</option>
                          <option value="shipped">已出貨</option>
                          <option value="delivered">已送達</option>
                          <option value="cancelled">已取消</option>
                        </select>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString('zh-TW')}</td>
                      <td>{order.shipping_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ProductModal 
          product={editingProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); fetchData(); }}
        />
      )}
    </div>
  );
};

const ProductModal = ({ product, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || 0,
    category_id: product?.category_id || categories[0]?.id || '',
    image_url: product?.image_url || '',
    species: product?.species || '',
    origin: product?.origin || '',
    age: product?.age || '',
    gender: product?.gender || '',
    is_active: product?.is_active ?? true
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (product) {
        await adminAPI.updateProduct(product.id, formData);
      } else {
        await adminAPI.createProduct(formData);
      }
      onSave();
    } catch (error) {
      alert(error.response?.data?.error || '儲存失敗');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? '編輯商品' : '新增商品'}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>商品名稱 *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>分類 *</label>
              <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>價格 *</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>庫存 *</label>
              <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label>圖片網址</label>
            <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group"><label>學名</label><input type="text" value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})} /></div>
            <div className="form-group"><label>產地</label><input type="text" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>年齡</label><input type="text" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} /></div>
            <div className="form-group"><label>性別</label><input type="text" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} /></div>
          </div>
          <div className="form-group">
            <label>描述</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
          </div>
          <div className="form-group checkbox">
            <label><input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} /> 上架中</label>
          </div>
          <button type="submit" className="submit-btn" disabled={saving}>{saving ? '儲存中...' : '儲存'}</button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
