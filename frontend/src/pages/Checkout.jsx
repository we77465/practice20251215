import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, Phone, FileText, CheckCircle } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    shipping_name: user?.name || '',
    shipping_phone: user?.phone || '',
    shipping_address: user?.address || '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await ordersAPI.createOrder(formData);
      setOrderId(res.data.order.id);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.error || '訂單建立失敗');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <CheckCircle size={80} />
          <h1>訂單成立成功！</h1>
          <p>訂單編號: #{orderId}</p>
          <p>我們會盡快處理您的訂單</p>
          <div className="success-buttons">
            <button onClick={() => navigate('/profile')} className="btn btn-primary">
              查看訂單
            </button>
            <button onClick={() => navigate('/products')} className="btn btn-secondary">
              繼續購物
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <h1>結帳</h1>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>配送資訊</h2>
          
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label><User size={18} /> 收件人姓名 *</label>
            <input
              type="text"
              name="shipping_name"
              value={formData.shipping_name}
              onChange={handleChange}
              placeholder="請輸入收件人姓名"
              required
            />
          </div>

          <div className="form-group">
            <label><Phone size={18} /> 聯絡電話 *</label>
            <input
              type="tel"
              name="shipping_phone"
              value={formData.shipping_phone}
              onChange={handleChange}
              placeholder="請輸入聯絡電話"
              required
            />
          </div>

          <div className="form-group">
            <label><MapPin size={18} /> 配送地址 *</label>
            <textarea
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              placeholder="請輸入完整配送地址"
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label><FileText size={18} /> 備註</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="特殊需求或備註事項（選填）"
              rows={2}
            />
          </div>

          <button type="submit" className="submit-order-btn" disabled={loading}>
            {loading ? '處理中...' : '確認訂購'}
          </button>
        </form>

        <div className="order-summary">
          <h2>訂單明細</h2>
          
          <div className="order-items">
            {items.map(item => (
              <div key={item.id} className="order-item">
                <img src={item.product.image_url || 'https://via.placeholder.com/60'} alt={item.product.name} />
                <div className="order-item-info">
                  <span className="order-item-name">{item.product.name}</span>
                  <span className="order-item-qty">x {item.quantity}</span>
                </div>
                <span className="order-item-price">
                  NT$ {(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>商品小計</span>
              <span>NT$ {total.toLocaleString()}</span>
            </div>
            <div className="total-row">
              <span>運費</span>
              <span className="free">免運費</span>
            </div>
            <div className="total-row final">
              <span>應付金額</span>
              <span className="final-price">NT$ {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
