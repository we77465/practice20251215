import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { productsAPI, wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productsAPI.getProduct(id);
        setProduct(res.data.product);
        
        if (user) {
          const wishlistRes = await wishlistAPI.checkWishlist(id);
          setIsInWishlist(wishlistRes.data.in_wishlist);
          setWishlistItemId(wishlistRes.data.item_id);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      alert('已加入購物車！');
    } catch (error) {
      alert(error.response?.data?.error || '加入失敗');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isInWishlist) {
        await wishlistAPI.removeFromWishlist(wishlistItemId);
        setIsInWishlist(false);
        setWishlistItemId(null);
      } else {
        const res = await wishlistAPI.addToWishlist(product.id);
        setIsInWishlist(true);
        setWishlistItemId(res.data.item.id);
      }
    } catch (error) {
      alert(error.response?.data?.error || '操作失敗');
    }
  };

  if (loading) {
    return <div className="loading-page">載入中...</div>;
  }

  if (!product) {
    return <div className="error-page">商品不存在</div>;
  }

  return (
    <div className="product-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> 返回
      </button>

      <div className="product-detail-container">
        <div className="product-gallery">
          <div className="main-image">
            <img src={product.image_url || 'https://via.placeholder.com/600'} alt={product.name} />
          </div>
        </div>

        <div className="product-info-section">
          <span className="product-category-badge">{product.category_name}</span>
          <h1 className="product-title">{product.name}</h1>
          
          {product.species && (
            <p className="product-species">
              學名: <em>{product.species}</em>
            </p>
          )}

          <div className="product-meta">
            {product.origin && <span>產地: {product.origin}</span>}
            {product.age && <span>年齡: {product.age}</span>}
            {product.gender && <span>性別: {product.gender}</span>}
          </div>

          <div className="product-price-section">
            <span className="price-label">售價</span>
            <span className="price-value">NT$ {product.price.toLocaleString()}</span>
          </div>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">庫存: {product.stock} 隻</span>
            ) : (
              <span className="out-of-stock">已售完</span>
            )}
          </div>

          <div className="product-description">
            <h3>商品描述</h3>
            <p>{product.description}</p>
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus size={18} />
              </button>
            </div>

            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} />
              加入購物車
            </button>

            <button 
              className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
              onClick={handleToggleWishlist}
            >
              <Heart size={20} fill={isInWishlist ? '#ef4444' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
