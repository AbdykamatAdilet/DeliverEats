from rest_framework import serializers
from .models import Address, CartItem
from django.contrib.auth.models import User

class CheckoutSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=['card', 'cash', 'kaspi', 'apple_pay'])
    special_instructions = serializers.CharField(max_length=500, required=False, allow_blank=True)
    use_bonuses = serializers.BooleanField(default=False)
    estimated_delivery_time = serializers.DateTimeField(read_only=True)

    def validate_address_id(self, value):
        request=self.context.get('request')
        if not Address.objects.filter(id=value, user= request.user).exists():
            raise serializers.ValidationError("Address does not exist or does not belong to you")
        return value
    
    def validate_payment_method(self,value):
        if value not in ['card', 'cash', 'kaspi', 'apple_pay']:
            raise serializers.ValidationError("Invalid payment method")
        return value
    
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model= Address
        fields = ['id', 'address_type', 'street', 'building', 'apartment', 'entrance', 'floor', 'phone_number', 'special_instructions', 'is_default', 'created_at']
        read_only_fields= ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'menu_item', 'quantity']
        read_only_fields = ['id']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
