from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.user import User
from models.product import Product, Category
from models.order import Order
from routes import admin_bp


def admin_required(fn):
    """檢查用戶是否為管理員的裝飾器"""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({'error': '需要管理員權限'}), 403
        return fn(*args, **kwargs)
    return wrapper


# ========== 商品管理 ==========

@admin_bp.route('/products', methods=['GET'])
@admin_required
def admin_get_products():
    """取得所有商品（包含非活躍的）"""
    products = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify({'products': [p.to_dict() for p in products]})


@admin_bp.route('/products', methods=['POST'])
@admin_required
def admin_create_product():
    """新增商品"""
    data = request.get_json()
    
    # 驗證必填欄位
    required_fields = ['name', 'price', 'category_id']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'請填寫 {field}'}), 400
    
    # 檢查分類是否存在
    category = Category.query.get(data['category_id'])
    if not category:
        return jsonify({'error': '分類不存在'}), 404
    
    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        stock=data.get('stock', 0),
        image_url=data.get('image_url', ''),
        category_id=data['category_id'],
        is_active=data.get('is_active', True),
        species=data.get('species', ''),
        origin=data.get('origin', ''),
        age=data.get('age', ''),
        gender=data.get('gender', '')
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({
        'message': '商品新增成功',
        'product': product.to_dict()
    }), 201


@admin_bp.route('/products/<int:product_id>', methods=['PUT'])
@admin_required
def admin_update_product(product_id):
    """更新商品"""
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': '商品不存在'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = data['price']
    if 'stock' in data:
        product.stock = data['stock']
    if 'image_url' in data:
        product.image_url = data['image_url']
    if 'category_id' in data:
        category = Category.query.get(data['category_id'])
        if not category:
            return jsonify({'error': '分類不存在'}), 404
        product.category_id = data['category_id']
    if 'is_active' in data:
        product.is_active = data['is_active']
    if 'species' in data:
        product.species = data['species']
    if 'origin' in data:
        product.origin = data['origin']
    if 'age' in data:
        product.age = data['age']
    if 'gender' in data:
        product.gender = data['gender']
    
    db.session.commit()
    
    return jsonify({
        'message': '商品更新成功',
        'product': product.to_dict()
    })


@admin_bp.route('/products/<int:product_id>', methods=['DELETE'])
@admin_required
def admin_delete_product(product_id):
    """刪除商品"""
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': '商品不存在'}), 404
    
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'message': '商品已刪除'})


# ========== 分類管理 ==========

@admin_bp.route('/categories', methods=['POST'])
@admin_required
def admin_create_category():
    """新增分類"""
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': '請輸入分類名稱'}), 400
    
    category = Category(
        name=data['name'],
        description=data.get('description', ''),
        image_url=data.get('image_url', '')
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify({
        'message': '分類新增成功',
        'category': category.to_dict()
    }), 201


@admin_bp.route('/categories/<int:category_id>', methods=['PUT'])
@admin_required
def admin_update_category(category_id):
    """更新分類"""
    category = Category.query.get(category_id)
    
    if not category:
        return jsonify({'error': '分類不存在'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        category.name = data['name']
    if 'description' in data:
        category.description = data['description']
    if 'image_url' in data:
        category.image_url = data['image_url']
    
    db.session.commit()
    
    return jsonify({
        'message': '分類更新成功',
        'category': category.to_dict()
    })


@admin_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@admin_required
def admin_delete_category(category_id):
    """刪除分類"""
    category = Category.query.get(category_id)
    
    if not category:
        return jsonify({'error': '分類不存在'}), 404
    
    # 檢查是否有商品使用此分類
    if Product.query.filter_by(category_id=category_id).first():
        return jsonify({'error': '此分類下還有商品，無法刪除'}), 400
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify({'message': '分類已刪除'})


# ========== 訂單管理 ==========

@admin_bp.route('/orders', methods=['GET'])
@admin_required
def admin_get_orders():
    """取得所有訂單"""
    status = request.args.get('status')
    query = Order.query
    
    if status:
        query = query.filter_by(status=status)
    
    orders = query.order_by(Order.created_at.desc()).all()
    
    return jsonify({'orders': [o.to_dict() for o in orders]})


@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def admin_update_order_status(order_id):
    """更新訂單狀態"""
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'error': '訂單不存在'}), 404
    
    data = request.get_json()
    status = data.get('status')
    
    valid_statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if status not in valid_statuses:
        return jsonify({'error': f'無效的狀態，有效狀態: {valid_statuses}'}), 400
    
    order.status = status
    db.session.commit()
    
    return jsonify({
        'message': '訂單狀態已更新',
        'order': order.to_dict()
    })


# ========== 統計數據 ==========

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def admin_get_stats():
    """取得管理儀表板統計數據"""
    total_products = Product.query.count()
    active_products = Product.query.filter_by(is_active=True).count()
    total_orders = Order.query.count()
    pending_orders = Order.query.filter_by(status='pending').count()
    total_users = User.query.count()
    total_categories = Category.query.count()
    
    # 計算總營收
    from sqlalchemy import func
    total_revenue = db.session.query(func.sum(Order.total_amount))\
        .filter(Order.status.in_(['confirmed', 'shipped', 'delivered']))\
        .scalar() or 0
    
    return jsonify({
        'stats': {
            'total_products': total_products,
            'active_products': active_products,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'total_users': total_users,
            'total_categories': total_categories,
            'total_revenue': float(total_revenue)
        }
    })
