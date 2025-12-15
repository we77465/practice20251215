from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.cart import CartItem
from models.product import Product
from routes import cart_bp

@cart_bp.route('', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    total = sum(item.product.price * item.quantity for item in cart_items if item.product)
    
    return jsonify({
        'items': [item.to_dict() for item in cart_items],
        'total': float(total),
        'count': len(cart_items)
    })


@cart_bp.route('', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    if not product_id:
        return jsonify({'error': '請指定商品'}), 400
    
    product = Product.query.get(product_id)
    if not product or not product.is_active:
        return jsonify({'error': '商品不存在'}), 404
    
    if product.stock < quantity:
        return jsonify({'error': '庫存不足'}), 400
    
    # 檢查購物車是否已有此商品
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)
    
    db.session.commit()
    
    return jsonify({
        'message': '已加入購物車',
        'item': cart_item.to_dict()
    })


@cart_bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    user_id = get_jwt_identity()
    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not cart_item:
        return jsonify({'error': '購物車項目不存在'}), 404
    
    data = request.get_json()
    quantity = data.get('quantity', 1)
    
    if quantity <= 0:
        db.session.delete(cart_item)
    else:
        if cart_item.product.stock < quantity:
            return jsonify({'error': '庫存不足'}), 400
        cart_item.quantity = quantity
    
    db.session.commit()
    
    return jsonify({'message': '已更新'})


@cart_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    user_id = get_jwt_identity()
    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not cart_item:
        return jsonify({'error': '購物車項目不存在'}), 404
    
    db.session.delete(cart_item)
    db.session.commit()
    
    return jsonify({'message': '已移除'})


@cart_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return jsonify({'message': '購物車已清空'})
