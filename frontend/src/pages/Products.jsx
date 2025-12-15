import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    productsAPI.getCategories().then(res => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, per_page: 12 };
        if (categoryId) params.category_id = categoryId;
        if (searchQuery) params.search = searchQuery;
        
        const res = await productsAPI.getProducts(params);
        setProducts(res.data.products);
        setTotal(res.data.total);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, searchQuery, page]);

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId) {
      params.set('category', catId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search');
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
    setPage(1);
  };

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

  const selectedCategory = categories.find(c => c.id === parseInt(categoryId));

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>{selectedCategory ? selectedCategory.name : '全部商品'}</h1>
        <p>共 {total} 件商品</p>
      </div>

      <div className="products-container">
        <aside className="products-sidebar">
          <div className="sidebar-section">
            <h3><Filter size={18} /> 商品分類</h3>
            <ul className="category-list">
              <li>
                <button 
                  className={!categoryId ? 'active' : ''}
                  onClick={() => handleCategoryChange(null)}
                >
                  全部商品
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button 
                    className={categoryId === String(cat.id) ? 'active' : ''}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <form className="sidebar-section search-form" onSubmit={handleSearch}>
            <h3><Search size={18} /> 搜尋商品</h3>
            <div className="search-input-group">
              <input 
                type="text" 
                name="search"
                placeholder="輸入關鍵字..."
                defaultValue={searchQuery}
              />
              <button type="submit">
                <Search size={18} />
              </button>
            </div>
          </form>
        </aside>

        <main className="products-main">
          {loading ? (
            <div className="loading">載入中...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>沒有找到符合條件的商品</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
