import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🦎</span>
          <span className="logo-text">爬蟲專賣店</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>首頁</Link>
          <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>全部商品</Link>
          <Link to="/products?category=1" className="nav-link" onClick={() => setIsMenuOpen(false)}>蛇類</Link>
          <Link to="/products?category=2" className="nav-link" onClick={() => setIsMenuOpen(false)}>蜥蜴</Link>
          <Link to="/products?category=3" className="nav-link" onClick={() => setIsMenuOpen(false)}>守宮</Link>
        </div>

        <div className="navbar-actions">
          {user && (
            <>
              <Link to="/wishlist" className="action-btn" title="收藏清單">
                <Heart size={22} />
              </Link>
              <Link to="/cart" className="action-btn cart-btn" title="購物車">
                <ShoppingCart size={22} />
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
            </>
          )}

          {user ? (
            <div className="user-menu">
              <button 
                className="user-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={22} />
                <span className="user-name">{user.name}</span>
              </button>
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}>
                    <User size={18} /> 會員中心
                  </Link>
                  {user.is_admin && (
                    <Link to="/admin" onClick={() => setIsUserMenuOpen(false)}>
                      <Settings size={18} /> 管理後台
                    </Link>
                  )}
                  <button onClick={() => { logout(); setIsUserMenuOpen(false); }}>
                    <LogOut size={18} /> 登出
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">登入</Link>
          )}

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
