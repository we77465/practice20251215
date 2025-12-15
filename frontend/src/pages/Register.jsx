import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('密碼不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密碼至少需要 6 個字元');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || '註冊失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-logo">🦎</span>
          <h1>建立帳號</h1>
          <p>加入我們，開始選購您的爬蟲寵物</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>姓名 *</label>
            <div className="input-wrapper">
              <User size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="請輸入姓名"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <div className="input-wrapper">
              <Mail size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="請輸入 Email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>電話</label>
            <div className="input-wrapper">
              <Phone size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="請輸入電話（選填）"
              />
            </div>
          </div>

          <div className="form-group">
            <label>密碼 *</label>
            <div className="input-wrapper">
              <Lock size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="請輸入密碼（至少6字元）"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>確認密碼 *</label>
            <div className="input-wrapper">
              <Lock size={20} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="請再次輸入密碼"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '註冊中...' : '註冊'}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="auth-footer">
          <p>已有帳號？ <Link to="/login">立即登入</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
