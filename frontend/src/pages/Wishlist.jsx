import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import './Wishlist.css';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistAPI.getWishlist();
      setItems(res.data.items);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await wishlistAPI.removeFromWishlist(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      alert('移除失敗');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      alert('已加入購物車！');
    } catch (error) {
      alert(error.response?.data?.error || '加入失敗');
    }
  };

  if (loading) {
    return <div className="wishlist-page"><div className="loading">載入中...</div></div>;
  }

  return (
    <div className="wishlist-page">
      <h1><Heart size={28} /> 我的收藏</h1>
      
      {items.length === 0 ? (
        <div className="empty-state">
          <Heart size={80} strokeWidth={1} />
          <h2>收藏清單是空的</h2>
          <p>將喜歡的商品加入收藏，方便隨時查看</p>
          <Link to="/products" className="btn btn-primary">探索商品</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map(item => (
            <div key={item.id} className="wishlist-card">
              <Link to={`/products/${item.product.id}`} className="wishlist-image">
                <img src={item.product.image_url || 'https://via.placeholder.com/200'} alt={item.product.name} />
              </Link>
              <div className="wishlist-info">
                <span className="wishlist-category">{item.product.category_name}</span>
                <Link to={`/products/${item.product.id}`} className="wishlist-name">
                  {item.product.name}
                </Link>
                <span className="wishlist-price">NT$ {item.product.price.toLocaleString()}</span>
              </div>
              <div className="wishlist-actions">
                <button 
                  className="add-cart-btn"
                  onClick={() => handleAddToCart(item.product.id)}
                  disabled={item.product.stock === 0}
                >
                  <ShoppingCart size={18} />
                  {item.product.stock > 0 ? '加入購物車' : '已售完'}
                </button>
                <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
