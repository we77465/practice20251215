import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { ordersAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const statusIcons = {
  pending: <Clock size={18} />,
  confirmed: <CheckCircle size={18} />,
  shipped: <Truck size={18} />,
  delivered: <CheckCircle size={18} />,
  cancelled: <XCircle size={18} />
};

const statusLabels = {
  pending: '待處理',
  confirmed: '已確認',
  shipped: '已出貨',
  delivered: '已送達',
  cancelled: '已取消'
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ordersAPI.getOrders()
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(formData);
      updateUser(res.data.user);
      alert('更新成功！');
    } catch (err) {
      alert(err.response?.data?.error || '更新失敗');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="user-card">
          <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          {user?.is_admin && <span className="admin-badge">管理員</span>}
        </div>
        
        <nav className="profile-nav">
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <Package size={20} /> 訂單紀錄
          </button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            個人資料
          </button>
        </nav>
      </div>

      <div className="profile-content">
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h1>訂單紀錄</h1>
            {loading ? (
              <div className="loading">載入中...</div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <Package size={60} strokeWidth={1} />
                <p>尚無訂單紀錄</p>
                <Link to="/products" className="btn btn-primary">開始購物</Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span className="order-id">訂單 #{order.id}</span>
                      <span className={`order-status status-${order.status}`}>
                        {statusIcons[order.status]}
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map(item => (
                        <span key={item.id} className="item-preview">
                          {item.product_name} x{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 3 && <span>+{order.items.length - 3} 項商品</span>}
                    </div>
                    <div className="order-footer">
                      <span className="order-date">
                        {new Date(order.created_at).toLocaleDateString('zh-TW')}
                      </span>
                      <span className="order-total">
                        總計: NT$ {order.total_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-edit-section">
            <h1>個人資料</h1>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>姓名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>電話</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>地址</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                />
              </div>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? '儲存中...' : '儲存變更'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
