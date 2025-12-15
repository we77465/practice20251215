import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getFeatured(),
          productsAPI.getCategories()
        ]);
        setFeaturedProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      await addToCart(productId);
      alert('已加入購物車！');
    } catch (error) {
      alert(error.response?.data?.error || '加入失敗');
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-accent">專業</span>爬蟲寵物專賣店
          </h1>
          <p className="hero-subtitle">
            提供最優質的蛇類、蜥蜴、守宮、陸龜及飼養用品<br />
            讓您的爬蟲寵物擁有最好的生活品質
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              立即選購 <ArrowRight size={20} />
            </Link>
            <Link to="/products?category=3" className="btn btn-secondary">
              熱門守宮
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1597526061814-c7e3540cc3b8?w=600" alt="Gecko" />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>健康保證</h3>
              <p>所有寵物皆經過健康檢查，提供完善售後保障</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Truck size={32} />
              </div>
              <h3>專業運送</h3>
              <p>恆溫包裝運送，確保寵物安全抵達</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Star size={32} />
              </div>
              <h3>品質保證</h3>
              <p>嚴選優質繁殖場，基因純正有保障</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Headphones size={32} />
              </div>
              <h3>專業諮詢</h3>
              <p>提供飼養諮詢服務，新手也能輕鬆上手</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>商品分類</h2>
            <Link to="/products" className="view-all">查看全部 <ArrowRight size={18} /></Link>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link to={`/products?category=${cat.id}`} key={cat.id} className="category-card">
                <div className="category-image">
                  <img src={cat.image_url || 'https://via.placeholder.com/300'} alt={cat.name} />
                </div>
                <div className="category-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>精選商品</h2>
            <Link to="/products" className="view-all">查看全部 <ArrowRight size={18} /></Link>
          </div>
          {loading ? (
            <div className="loading">載入中...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>準備好迎接您的爬蟲寵物了嗎？</h2>
            <p>加入會員即可享有專屬優惠與最新商品通知</p>
            {!user && (
              <Link to="/register" className="btn btn-primary btn-lg">
                立即註冊
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-icon">🦎</span>
              <span className="logo-text">爬蟲專賣店</span>
              <p>專業爬蟲寵物專賣店，提供最優質的服務</p>
            </div>
            <div className="footer-links">
              <h4>快速連結</h4>
              <Link to="/products">全部商品</Link>
              <Link to="/products?category=1">蛇類</Link>
              <Link to="/products?category=2">蜥蜴</Link>
              <Link to="/products?category=3">守宮</Link>
            </div>
            <div className="footer-links">
              <h4>客戶服務</h4>
              <a href="#">常見問題</a>
              <a href="#">運送說明</a>
              <a href="#">退換貨政策</a>
              <a href="#">聯絡我們</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 爬蟲專賣店 All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
