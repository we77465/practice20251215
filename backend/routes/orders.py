from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.order import Order, OrderItem
from models.cart import CartItem
from models.product import Product
from routes import orders_bp

@orders_bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    
    return jsonify({
        'orders': [order.to_dict() for order in orders]
    })


@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    
    if not order:
        return jsonify({'error': '訂單不存在'}), 404
    
    return jsonify({'order': order.to_dict()})


@orders_bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # 取得購物車項目
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    if not cart_items:
        return jsonify({'error': '購物車是空的'}), 400
    
    # 驗證配送資訊
    if not data.get('shipping_name') or not data.get('shipping_address') or not data.get('shipping_phone'):
        return jsonify({'error': '請填寫完整的配送資訊'}), 400
    
    # 計算總金額並檢查庫存
    total_amount = 0
    order_items_data = []
    
    for cart_item in cart_items:
        product = cart_item.product
        if not product or not product.is_active:
            return jsonify({'error': f'商品 {cart_item.product_id} 不存在或已下架'}), 400
        
        if product.stock < cart_item.quantity:
            return jsonify({'error': f'{product.name} 庫存不足'}), 400
        
        item_total = product.price * cart_item.quantity
        total_amount += item_total
        order_items_data.append({
            'product_id': product.id,
            'product_name': product.name,
            'quantity': cart_item.quantity,
            'price_at_time': product.price
        })
    
    # 建立訂單
    order = Order(
        user_id=user_id,
        total_amount=total_amount,
        status='pending',
        shipping_name=data['shipping_name'],
        shipping_phone=data['shipping_phone'],
        shipping_address=data['shipping_address'],
        notes=data.get('notes')
    )
    db.session.add(order)
    db.session.flush()  # 取得 order.id
    
    # 建立訂單項目並更新庫存
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data['product_id'],
            product_name=item_data['product_name'],
            quantity=item_data['quantity'],
            price_at_time=item_data['price_at_time']
        )
        db.session.add(order_item)
        
        # 更新庫存
        product = Product.query.get(item_data['product_id'])
        product.stock -= item_data['quantity']
    
    # 清空購物車
    CartItem.query.filter_by(user_id=user_id).delete()
    
    db.session.commit()
    
    return jsonify({
        'message': '訂單建立成功',
        'order': order.to_dict()
    }), 201


@orders_bp.route('/<int:order_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    
    if not order:
        return jsonify({'error': '訂單不存在'}), 404
    
    if order.status != 'pending':
        return jsonify({'error': '只能取消待處理的訂單'}), 400
    
    # 恢復庫存
    for item in order.items:
        product = Product.query.get(item.product_id)
        if product:
            product.stock += item.quantity
    
    order.status = 'cancelled'
    db.session.commit()
    
    return jsonify({'message': '訂單已取消', 'order': order.to_dict()})
