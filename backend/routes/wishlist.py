from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.cart import WishlistItem
from models.product import Product
from routes import wishlist_bp

@wishlist_bp.route('', methods=['GET'])
@jwt_required()
def get_wishlist():
    user_id = get_jwt_identity()
    items = WishlistItem.query.filter_by(user_id=user_id).order_by(WishlistItem.added_at.desc()).all()
    
    return jsonify({
        'items': [item.to_dict() for item in items],
        'count': len(items)
    })


@wishlist_bp.route('', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    product_id = data.get('product_id')
    
    if not product_id:
        return jsonify({'error': '請指定商品'}), 400
    
    product = Product.query.get(product_id)
    if not product or not product.is_active:
        return jsonify({'error': '商品不存在'}), 404
    
    # 檢查是否已在收藏清單
    existing = WishlistItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing:
        return jsonify({'error': '商品已在收藏清單中'}), 400
    
    item = WishlistItem(user_id=user_id, product_id=product_id)
    db.session.add(item)
    db.session.commit()
    
    return jsonify({
        'message': '已加入收藏',
        'item': item.to_dict()
    }), 201


@wishlist_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(item_id):
    user_id = get_jwt_identity()
    item = WishlistItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not item:
        return jsonify({'error': '收藏項目不存在'}), 404
    
    db.session.delete(item)
    db.session.commit()
    
    return jsonify({'message': '已移除收藏'})


@wishlist_bp.route('/check/<int:product_id>', methods=['GET'])
@jwt_required()
def check_wishlist(product_id):
    user_id = get_jwt_identity()
    item = WishlistItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    
    return jsonify({'in_wishlist': item is not None, 'item_id': item.id if item else None})
