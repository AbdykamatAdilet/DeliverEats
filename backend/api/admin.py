from django.contrib import admin
from .models import Address, Category, MenuItem, Order, OrderItem, Cart, CartItem

admin.site.register(Category)
admin.site.register(MenuItem)
admin.site.register(Cart)
admin.site.register(CartItem)

admin.site.register(OrderItem)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_amount', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method')
    search_fields = ('user__username',)
    ordering = ('-created_at',)


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'address_type', 'street', 'building', 'apartment', 'is_default', 'created_at')
    list_filter = ('address_type', 'is_default')
    search_fields = ('user__username', 'street', 'building')
    ordering = ('-created_at',)