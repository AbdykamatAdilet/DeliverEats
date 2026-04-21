from rest_framework import serializers
from .models import Address, CartItem, Category, MenuItem, Order, OrderItem
from django.contrib.auth.models import User


class CheckoutSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=['card', 'cash', 'kaspi', 'apple_pay'])
    special_instructions = serializers.CharField(required=False, allow_blank=True)
    use_bonuses = serializers.BooleanField(default=False)

    def validate_address_id(self, value):
        request = self.context.get('request')
        if not Address.objects.filter(id=value, user=request.user).exists():
            raise serializers.ValidationError("Invalid address")
        return value

class PaymentSerializer(serializers.Serializer):
    payment_method = serializers.ChoiceField(choices=['card', 'cash', 'kaspi', 'apple_pay'])
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    order_id = serializers.IntegerField()

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id', 'address_type', 'street', 'building', 'apartment',
            'entrance', 'floor', 'phone_number', 'special_instructions',
            'is_default', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'category', 'category_name', 'is_available']


class CartItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'menu_item', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'menu_item', 'quantity']


class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='menu_item.name', read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'name', 'quantity', 'price_at_time', 'subtotal']

    def get_subtotal(self, obj):
        return obj.quantity * obj.price_at_time

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'total_amount', 'delivery_address',
            'payment_method', 'status', 'created_at', 'items'
        ]
        read_only_fields = ['id', 'user', 'created_at']


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)