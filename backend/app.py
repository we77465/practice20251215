from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from models import db, jwt

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # 初始化擴展
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    Migrate(app, db)
    
    # 註冊 Blueprints
    from routes import auth_bp, products_bp, cart_bp, wishlist_bp, orders_bp, admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(wishlist_bp, url_prefix='/api/wishlist')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # 健康檢查端點
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': '爬蟲專賣店 API 運行中'}
    
    # 建立資料表
    with app.app_context():
        db.create_all()
    
    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
