from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db
from models.user import User
from routes import auth_bp

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 驗證必填欄位
    if not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': '請填寫所有必填欄位'}), 400
    
    # 檢查 email 是否已存在
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': '此 Email 已被註冊'}), 400
    
    # 建立新用戶
    user = User(
        email=data['email'],
        name=data['name'],
        phone=data.get('phone'),
        address=data.get('address')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # 產生 JWT token
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': '註冊成功',
        'user': user.to_dict(),
        'access_token': access_token
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': '請輸入 Email 和密碼'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Email 或密碼錯誤'}), 401
    
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': '登入成功',
        'user': user.to_dict(),
        'access_token': access_token
    })


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'error': '用戶不存在'}), 404
    
    return jsonify({'user': user.to_dict()})


@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'error': '用戶不存在'}), 404
    
    data = request.get_json()
    
    if data.get('name'):
        user.name = data['name']
    if data.get('phone'):
        user.phone = data['phone']
    if data.get('address'):
        user.address = data['address']
    
    db.session.commit()
    
    return jsonify({
        'message': '更新成功',
        'user': user.to_dict()
    })
