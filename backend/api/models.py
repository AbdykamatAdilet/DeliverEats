from django.db import models
from django.contrib.auth.models import User


class Address(models.Model):
    ADDRESS_TYPES = [
        ('home', 'Home'),
        ('work', 'Work'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPES, default='home')
    street = models.CharField(max_length=255)
    building = models.CharField(max_length=50, blank=True, null=True)
    apartment = models.CharField(max_length=50, blank=True, null=True)
    entrance = models.CharField(max_length=10, blank=True, null=True)
    floor = models.CharField(max_length=5, blank=True, null=True)
    phone_number = models.CharField(max_length=20)
    special_instructions = models.TextField(blank=True, max_length=200)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        parts = [self.street]
        if self.building:
            parts.append(self.building)
        if self.apartment:
            parts.append(f"apt {self.apartment}")
        return ", ".join(parts)

    def save(self, *args, **kwargs):
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True)\
                .exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# Custom manager – satisfies requirement: "1 custom model manager"
class AvailableItemManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_available=True)


class MenuItem(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # ForeignKey #1
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    is_available = models.BooleanField(default=True)

    # FIX: manager was defined but never assigned to the model
    available = AvailableItemManager()
    objects = models.Manager()

    def __str__(self):
        return self.name


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Cart of {self.user.username}"


class CartItem(models.Model):
    # ForeignKey #2
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'menu_item')

    def __str__(self):
        return f"{self.menu_item.name} x {self.quantity}"


class Order(models.Model):
    PAYMENT_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('kaspi', 'Kaspi Pay'),
        ('apple_pay', 'Apple Pay'),
    ]

    ORDER_STATUS = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('delivering', 'Delivering'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_address = models.TextField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='cash')
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"



class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.menu_item.name} x {self.quantity}"