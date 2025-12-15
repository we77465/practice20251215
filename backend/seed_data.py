"""
種子資料腳本 - 初始化爬蟲專賣店資料
"""
from app import create_app
from models import db
from models.user import User
from models.product import Product, Category

def seed_data():
    app = create_app()
    
    with app.app_context():
        # 清除現有資料
        db.drop_all()
        db.create_all()
        
        print("正在建立種子資料...")
        
        # 建立管理員帳號
        admin = User(
            email='admin@reptile-shop.com',
            name='系統管理員',
            phone='0912345678',
            is_admin=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        
        # 建立測試用戶
        user = User(
            email='user@test.com',
            name='測試用戶',
            phone='0987654321',
            address='台北市中正區測試路1號'
        )
        user.set_password('user123')
        db.session.add(user)
        
        # 建立分類
        categories = [
            Category(
                name='蛇類',
                description='各種蛇類，包含球蟒、玉米蛇等',
                image_url='https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400'
            ),
            Category(
                name='蜥蜴',
                description='鬆獅蜥、鬣蜥等蜥蜴',
                image_url='https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=400'
            ),
            Category(
                name='守宮',
                description='豹紋守宮、肥尾守宮等',
                image_url='https://images.unsplash.com/photo-1597526061814-c7e3540cc3b8?w=400'
            ),
            Category(
                name='陸龜',
                description='蘇卡達、赫曼等陸龜',
                image_url='https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400'
            ),
            Category(
                name='飼養用品',
                description='飼養箱、加熱設備、食物等',
                image_url='https://images.unsplash.com/photo-1585095595205-e68428a9b78c?w=400'
            )
        ]
        
        for category in categories:
            db.session.add(category)
        
        db.session.flush()  # 取得分類 ID
        
        # 建立商品
        products = [
            # 蛇類
            Product(
                name='球蟒 - 原色',
                description='健康活潑的球蟒幼體，性格溫馴，非常適合新手飼養。已穩定進食冷凍鼠。',
                price=3500,
                stock=5,
                image_url='https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600',
                category_id=categories[0].id,
                species='Python regius',
                origin='人工繁殖',
                age='3個月',
                gender='公'
            ),
            Product(
                name='球蟒 - 蜘蛛基因',
                description='漂亮的蜘蛛基因球蟒，花紋獨特，健康有保障。',
                price=8000,
                stock=3,
                image_url='https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600',
                category_id=categories[0].id,
                species='Python regius',
                origin='人工繁殖',
                age='6個月',
                gender='母'
            ),
            Product(
                name='玉米蛇 - 橘色',
                description='亮麗的橘色玉米蛇，性格溫和，容易照顧。',
                price=2500,
                stock=8,
                image_url='https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600',
                category_id=categories[0].id,
                species='Pantherophis guttatus',
                origin='人工繁殖',
                age='4個月',
                gender='公'
            ),
            
            # 蜥蜴
            Product(
                name='鬆獅蜥 - 橘黃色',
                description='漂亮的橘黃色鬆獅蜥，已馴化，可上手互動。',
                price=4500,
                stock=4,
                image_url='https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=600',
                category_id=categories[1].id,
                species='Pogona vitticeps',
                origin='人工繁殖',
                age='5個月',
                gender='母'
            ),
            Product(
                name='藍舌石龍子',
                description='印尼藍舌石龍子，個性溫和，適合入門。',
                price=5500,
                stock=3,
                image_url='https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=600',
                category_id=categories[1].id,
                species='Tiliqua gigas',
                origin='進口',
                age='8個月',
                gender='公'
            ),
            
            # 守宮
            Product(
                name='豹紋守宮 - 高黃',
                description='高品質高黃豹紋守宮，色彩鮮豔，活潑健康。',
                price=2000,
                stock=10,
                image_url='https://images.unsplash.com/photo-1597526061814-c7e3540cc3b8?w=600',
                category_id=categories[2].id,
                species='Eublepharis macularius',
                origin='人工繁殖',
                age='3個月',
                gender='公'
            ),
            Product(
                name='豹紋守宮 - 暴風雪',
                description='稀有暴風雪基因豹紋守宮，純白色澤，非常漂亮。',
                price=6000,
                stock=2,
                image_url='https://images.unsplash.com/photo-1597526061814-c7e3540cc3b8?w=600',
                category_id=categories[2].id,
                species='Eublepharis macularius',
                origin='人工繁殖',
                age='6個月',
                gender='母'
            ),
            Product(
                name='肥尾守宮 - 原色',
                description='可愛的肥尾守宮，尾巴肥厚，個性溫順。',
                price=3500,
                stock=5,
                image_url='https://images.unsplash.com/photo-1597526061814-c7e3540cc3b8?w=600',
                category_id=categories[2].id,
                species='Hemitheconyx caudicinctus',
                origin='人工繁殖',
                age='4個月',
                gender='公'
            ),
            
            # 陸龜
            Product(
                name='蘇卡達象龜 - 幼體',
                description='健康的蘇卡達幼龜，胃口極佳，成長快速。',
                price=8000,
                stock=3,
                image_url='https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600',
                category_id=categories[3].id,
                species='Centrochelys sulcata',
                origin='人工繁殖',
                age='6個月',
                gender='未定'
            ),
            Product(
                name='赫曼陸龜',
                description='歐洲赫曼陸龜，體型適中，適合居家飼養。',
                price=12000,
                stock=2,
                image_url='https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600',
                category_id=categories[3].id,
                species='Testudo hermanni',
                origin='進口',
                age='1年',
                gender='公'
            ),
            
            # 飼養用品
            Product(
                name='爬蟲飼養箱 60x40x40cm',
                description='高品質玻璃飼養箱，含網蓋，適合中小型爬蟲。',
                price=1800,
                stock=15,
                image_url='https://images.unsplash.com/photo-1585095595205-e68428a9b78c?w=600',
                category_id=categories[4].id,
                species='',
                origin='台灣製造',
                age='',
                gender=''
            ),
            Product(
                name='陶瓷加熱燈 100W',
                description='高效能陶瓷加熱燈，無光線，適合夜間使用。',
                price=450,
                stock=20,
                image_url='https://images.unsplash.com/photo-1585095595205-e68428a9b78c?w=600',
                category_id=categories[4].id,
                species='',
                origin='進口',
                age='',
                gender=''
            ),
            Product(
                name='UVB 燈管 10.0',
                description='專業爬蟲用 UVB 燈管，幫助鈣質吸收。',
                price=680,
                stock=12,
                image_url='https://images.unsplash.com/photo-1585095595205-e68428a9b78c?w=600',
                category_id=categories[4].id,
                species='',
                origin='進口',
                age='',
                gender=''
            ),
            Product(
                name='冷凍乳鼠 (10入)',
                description='高品質急速冷凍乳鼠，營養完整。',
                price=200,
                stock=50,
                image_url='https://images.unsplash.com/photo-1585095595205-e68428a9b78c?w=600',
                category_id=categories[4].id,
                species='',
                origin='台灣',
                age='',
                gender=''
            )
        ]
        
        for product in products:
            db.session.add(product)
        
        db.session.commit()
        print("種子資料建立完成！")
        print(f"  - 管理員帳號: admin@reptile-shop.com / admin123")
        print(f"  - 測試帳號: user@test.com / user123")
        print(f"  - 分類數量: {len(categories)}")
        print(f"  - 商品數量: {len(products)}")


if __name__ == '__main__':
    seed_data()
