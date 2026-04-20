from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, RegexValidator

ORDER_STATUS = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('delivering', 'Delivering'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

class Address(models.Model):
    ADDRESS_TYPES = [
        ('home', 'Home'),
        ('work', 'Work'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPES, default='home')
    street = models.CharField(max_length=255, validators=[MinLengthValidator(5)])
    building = models.CharField(max_length=50, blank=True, null=True)
    apartment = models.CharField(max_length=50, blank=True, null=True)
    entrance = models.CharField(max_length=10, blank=True, null=True)
    floor = models.CharField(max_length=5, blank=True, null=True)
    phone_number = models.CharField(
        max_length=20,
        validators=[RegexValidator(regex=r'^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$')]
    )
    special_instructions = models.TextField(blank=True, max_length=200)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True)\
                .exclude(pk=self.pk).update(is_default=False)

    def __str__(self):
        return f"{self.user.username} - {self.street}"


class MenuItem(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Cart of {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.menu_item.name} x {self.quantity}"


class Order(models.Model):
    PAYMENT_CHOICES = [
        ('cash',      'Cash'),
        ('card',      'Card'),
        ('kaspi',     'Kaspi Pay'),
        ('apple_pay', 'Apple Pay'),
    ]
    user             = models.ForeignKey(User, on_delete=models.CASCADE)
    total_amount     = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_address = models.TextField()
    payment_method   = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='cash')
    status           = models.CharField(max_length=20, default='pending')
    created_at       = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)