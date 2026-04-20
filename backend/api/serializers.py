from rest_framework import serializers
from .models import Address, CartItem, Category, MenuItem, Order
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
    
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model= Address
        fields = ['id', 'address_type', 'street', 'building', 'apartment', 'entrance', 'floor', 'phone_number', 'special_instructions', 'is_default', 'created_at']
        read_only_fields= ['id', 'created_at']

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

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'total_amount',
            'delivery_address',
            'payment_method',
            'status',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']
        
class CartItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'menu_item', 'quantity']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()