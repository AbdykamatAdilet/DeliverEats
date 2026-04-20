from rest_framework import serializers
from .models import Address, CartItem, MenuItem, Order, OrderItem
from django.contrib.auth.models import User

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'price', 'description', 'image_url']

class CheckoutSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=['card', 'cash', 'kaspi', 'apple_pay'])
    special_instructions = serializers.CharField(max_length=500, required=False, allow_blank=True)
    use_bonuses = serializers.BooleanField(default=False)
    estimated_delivery_time = serializers.DateTimeField(read_only=True)

    def validate_address_id(self, value):
        request = self.context.get('request')
        if not Address.objects.filter(id=value, user=request.user).exists():
            raise serializers.ValidationError("Address does not exist or does not belong to you")
        return value

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'address_type', 'street', 'building', 'apartment', 'entrance', 'floor', 'phone_number', 'special_instructions', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class CartItemSerializer(serializers.ModelSerializer):
    menu_item_details = MenuItemSerializer(source='menu_item', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'menu_item', 'menu_item_details', 'quantity']
        read_only_fields = ['id']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)