from flask import Blueprint

auth_bp = Blueprint('auth', __name__)
products_bp = Blueprint('products', __name__)
cart_bp = Blueprint('cart', __name__)
wishlist_bp = Blueprint('wishlist', __name__)
orders_bp = Blueprint('orders', __name__)
admin_bp = Blueprint('admin', __name__)

from routes.auth import *
from routes.products import *
from routes.cart import *
from routes.wishlist import *
from routes.orders import *
from routes.admin import *
