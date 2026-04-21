from django.contrib.auth.models import User
from api.models import Category, MenuItem

# Superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("✅ Superuser: admin / admin123")
else:
    print("ℹ️  admin already exists")

# Test user
if not User.objects.filter(username='testuser').exists():
    User.objects.create_user('testuser', 'test@example.com', 'test123')
    print("✅ Test user: testuser / test123")
else:
    print("ℹ️  testuser already exists")

# Categories
category_names = ['Breakfast', 'Hot Dishes', 'Soups', 'Salads', 'Side Dishes', 'Desserts', 'Drinks']
cat_map = {}
for name in category_names:
    obj, _ = Category.objects.get_or_create(name=name)
    cat_map[name] = obj

# Menu items
items = [
    ('Omelette',        1200, 'Breakfast'),
    ('Pancakes',         850, 'Breakfast'),
    ('Cottage Cheese',  1150, 'Breakfast'),
    ('Rice Porridge',    900, 'Breakfast'),
    ('Oatmeal',         1000, 'Breakfast'),
    ('Fried Eggs',       900, 'Breakfast'),
    ('Steak',           3500, 'Hot Dishes'),
    ('Chicken Steak',   2800, 'Hot Dishes'),
    ('Pasta',           3200, 'Hot Dishes'),
    ('Lagman',          2200, 'Hot Dishes'),
    ('Plov',            2500, 'Hot Dishes'),
    ('Beshbarmak',      3800, 'Hot Dishes'),
    ('Borsch',          1500, 'Soups'),
    ('Chicken Soup',    1300, 'Soups'),
    ('Caesar Salad',    1800, 'Salads'),
    ('Greek Salad',     1600, 'Salads'),
    ('Mashed Potatoes',  700, 'Side Dishes'),
    ('French Fries',     800, 'Side Dishes'),
    ('Cheesecake',      1200, 'Desserts'),
    ('Ice Cream',        900, 'Desserts'),
    ('Green Tea',        500, 'Drinks'),
    ('Fresh Juice',      900, 'Drinks'),
]

for name, price, cat_name in items:
    MenuItem.objects.get_or_create(
        name=name,
        defaults={
            'price': price,
            'category': cat_map[cat_name],
            'is_available': True
        }
    )

print(f"✅ {MenuItem.objects.count()} menu items ready")
print("✅ Seed complete!")