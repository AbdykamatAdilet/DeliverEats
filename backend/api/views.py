from multiprocessing.managers import Token

from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Address, MenuItem, Order
from .serializers import AddressSerializer, CheckoutSerializer,  MenuItemSerializer, OrderSerializer
from .models import Cart, CartItem, MenuItem, Order, OrderItem
from .serializers import CartItemSerializer

@api_view(['GET'])
def menu_list(request):
    search = request.GET.get('search', '')
    items = MenuItem.available.filter(name__icontains=search)
    serializer = MenuItemSerializer(items, many=True)
    return Response(serializer.data)

class OrderListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class OrderDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        order = get_object_or_404(Order, id=pk, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
    def patch(self, request, pk):
        order = get_object_or_404(Order, id=pk, user=request.user)
        if order.status == 'pending':
            order.status = 'cancelled'
            order.save()
            return Response({'message': 'Order cancelled successfully'})
        return Response({'error': 'Cannot cancel this order'}, status=400)
class AddressListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        addresses = Address.objects.filter(user=request.user)
        serializer = AddressSerializer(addresses, many=True)

        default_address = None
        for addr in serializer.data:
            if addr['is_default']:
                default_address = addr
                break

        return Response({
            'addresses': serializer.data,
            'default_address': default_address
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = AddressSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddressDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk, user):
        return get_object_or_404(Address, pk=pk, user=user)
    
    def get(self, request, pk):
        address = self.get_object(pk, request.user)
        return Response(AddressSerializer(address).data)

    def put(self, request, pk):
        address = self.get_object(pk, request.user)
        serializer = AddressSerializer(address, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, pk):
        address = self.get_object(pk, request.user)
        address.delete()
        return Response(
            {'message': 'Address deleted successfully'}, 
            status=status.HTTP_204_NO_CONTENT
        )
    
class CartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        items = cart.items.all()
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)

        menu_item_id = request.data.get('menu_item')
        quantity = int(request.data.get('quantity', 1))

        menu_item = get_object_or_404(MenuItem, id=menu_item_id)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            menu_item=menu_item,
            defaults={'quantity': 0}
        )

        item.quantity += quantity
        item.save()

        return Response({
            'message': 'Item added to cart',
            'cart_items': CartItemSerializer(cart.items.all(), many=True).data
        }, status=status.HTTP_201_CREATED)
    
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=401)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key
        })
        
@api_view(['PATCH'])  
@permission_classes([IsAuthenticated])
def set_default_address(request, pk):
    address = get_object_or_404(Address, pk=pk, user=request.user)
    
    if address.is_default:
        return Response(
            {'message': 'This address is already the default.', 'address_id': address.id},
            status=status.HTTP_200_OK
        )
    
    address.is_default = True
    address.save()
    
    return Response(
        {
            'message': 'Default address updated successfully',
            'address_id': address.id,
            'address_summary': str(address)  
        },
        status=status.HTTP_200_OK
    )

#Вот здесь я (Адилет) добавил функцию для получения профиля пользователя, 
# которая возвращает его имя, email и дату регистрации. 
# Это может быть полезно для отображения информации о пользователе в его профиле или для других целей в приложении.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'date_joined': user.date_joined
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, pk):
    cart = get_object_or_404(Cart, user=request.user)
    item = get_object_or_404(CartItem, pk=pk, cart=cart)

    item.delete()
    return Response({'message': 'Item removed'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
            }
        })

    return Response({'error': 'Invalid credentials'}, status=401)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_checkout(request):
    serializer = CheckoutSerializer(data=request.data, context={'request': request})

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    cart = get_object_or_404(Cart, user=request.user)
    cart_items = cart.items.select_related('menu_item').all()

    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=400)

    data = serializer.validated_data
    address = get_object_or_404(Address, id=data['address_id'], user=request.user)

    total = sum(item.menu_item.price * item.quantity for item in cart_items)

    order = Order.objects.create(
        user=request.user,
        total_amount=total,
        delivery_address=str(address),
        payment_method=data['payment_method'],
        status='pending'
    )

    OrderItem.objects.bulk_create([
        OrderItem(
            order=order,
            menu_item=i.menu_item,
            quantity=i.quantity,
            price_at_time=i.menu_item.price,
        )
        for i in cart_items
    ])

    cart_items.delete()

    return Response({
        'message': 'Order created',
        'order_id': order.id,
        'total': str(order.total_amount),
    }, status=201)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    cart = get_object_or_404(Cart, user=request.user)
    cart.items.all().delete()
    return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)