import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/products/${product.id}`}>
          <img 
            src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'} 
            alt={product.name}
            className="product-image"
          />
        </Link>
        {product.stock === 0 && (
          <div className="out-of-stock-badge">售完</div>
        )}
        <div className="product-actions">
          <button 
            className={`action-btn wishlist-btn ${isInWishlist ? 'active' : ''}`}
            onClick={() => onToggleWishlist?.(product.id)}
            title={isInWishlist ? '移除收藏' : '加入收藏'}
          >
            <Heart size={20} fill={isInWishlist ? '#ef4444' : 'none'} />
          </button>
          <button 
            className="action-btn cart-btn"
            onClick={() => onAddToCart?.(product.id)}
            disabled={product.stock === 0}
            title="加入購物車"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <span className="product-category">{product.category_name}</span>
        <Link to={`/products/${product.id}`} className="product-name">
          {product.name}
        </Link>
        {product.species && (
          <span className="product-species">{product.species}</span>
        )}
        <div className="product-footer">
          <span className="product-price">NT$ {product.price.toLocaleString()}</span>
          <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
            {product.stock > 0 ? `庫存: ${product.stock}` : '已售完'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
