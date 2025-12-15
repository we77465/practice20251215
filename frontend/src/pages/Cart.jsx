import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { items, total, loading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <div className="cart-page"><div className="loading">載入中...</div></div>;
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <ShoppingBag size={80} strokeWidth={1} />
          <h2>購物車是空的</h2>
          <p>還沒有加入任何商品</p>
          <Link to="/products" className="btn btn-primary">
            開始購物 <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>購物車</h1>
        <button className="clear-btn" onClick={clearCart}>
          <Trash2 size={18} /> 清空購物車
        </button>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <Link to={`/products/${item.product.id}`} className="item-image">
                <img src={item.product.image_url || 'https://via.placeholder.com/100'} alt={item.product.name} />
              </Link>
              
              <div className="item-info">
                <Link to={`/products/${item.product.id}`} className="item-name">
                  {item.product.name}
                </Link>
                <span className="item-category">{item.product.category_name}</span>
                <span className="item-price">NT$ {item.product.price.toLocaleString()}</span>
              </div>

              <div className="item-quantity">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="item-subtotal">
                NT$ {(item.product.price * item.quantity).toLocaleString()}
              </div>

              <button className="remove-btn" onClick={() => removeItem(item.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>訂單摘要</h3>
          
          <div className="summary-row">
            <span>商品小計</span>
            <span>NT$ {total.toLocaleString()}</span>
          </div>
          
          <div className="summary-row">
            <span>運費</span>
            <span className="free-shipping">免運費</span>
          </div>
          
          <div className="summary-total">
            <span>總計</span>
            <span className="total-price">NT$ {total.toLocaleString()}</span>
          </div>

          <button 
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            前往結帳 <ArrowRight size={20} />
          </button>

          <Link to="/products" className="continue-shopping">
            繼續購物
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
