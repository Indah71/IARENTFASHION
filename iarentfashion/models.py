# from django.db import models
# from django.core.validators import MinValueValidator

# class User(models.Model):
#     ROLE_CHOICES = [
#         ('customer', 'Customer'),
#         ('admin', 'Admin'),
#     ]
    
#     username = models.CharField(max_length=100, unique=True)
#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=255)
#     full_name = models.CharField(max_length=255)
#     phone = models.CharField(max_length=15, blank=True, null=True)
#     address = models.TextField(blank=True, null=True)
#     role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'users'
    
#     def __str__(self):
#         return self.username


# class Category(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     description = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         db_table = 'categories'
#         verbose_name_plural = 'Categories'
    
#     def __str__(self):
#         return self.name


# class Product(models.Model):
#     name = models.CharField(max_length=255)
#     description = models.TextField()
#     price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
#     stock = models.IntegerField(validators=[MinValueValidator(0)])
#     image = models.ImageField(upload_to='products/', blank=True, null=True)
#     category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'products'
    
#     def __str__(self):
#         return self.name


# class Review(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
#     rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])  # 1-5 stars
#     comment = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         db_table = 'reviews'
#         unique_together = ('user', 'product')  # Satu user hanya bisa review 1x per product
    
#     def __str__(self):
#         return f"Review {self.product.name} by {self.user.username}"


# class Inspiration(models.Model):
#     name = models.CharField(max_length=255)
#     description = models.TextField()
#     image = models.ImageField(upload_to='inspirations/')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'inspirations'
    
#     def __str__(self):
#         return self.name


# class Cart(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'carts'
    
#     def __str__(self):
#         return f"Cart {self.user.username}"
    
#     def get_total_price(self):
#         """Hitung total harga semua item di keranjang"""
#         total = sum(item.get_subtotal() for item in self.items.all())
#         return total


# class CartItem(models.Model):
#     cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     quantity = models.IntegerField(validators=[MinValueValidator(1)])
#     added_at = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         db_table = 'cart_items'
#         unique_together = ('cart', 'product')  # Satu product hanya muncul 1x di keranjang
    
#     def __str__(self):
#         return f"{self.product.name} x {self.quantity}"
    
#     def get_subtotal(self):
#         """Hitung subtotal (harga x quantity)"""
#         return self.product.price * self.quantity


# class Order(models.Model):
#     STATUS_CHOICES = [
#         ('pending', 'Pending'),
#         ('paid', 'Paid'),
#         ('shipped', 'Shipped'),
#         ('delivered', 'Delivered'),
#         ('cancelled', 'Cancelled'),
#     ]
    
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
#     order_number = models.CharField(max_length=50, unique=True)
#     total_price = models.DecimalField(max_digits=12, decimal_places=2)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
#     shipping_address = models.TextField()
#     phone = models.CharField(max_length=15)
#     notes = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'orders'
#         ordering = ['-created_at']
    
#     def __str__(self):
#         return f"Order {self.order_number}"


# class OrderItem(models.Model):
#     order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     quantity = models.IntegerField()
#     price = models.DecimalField(max_digits=12, decimal_places=2)  # Harga saat pemesanan
    
#     class Meta:
#         db_table = 'order_items'
    
#     def __str__(self):
#         return f"{self.product.name} x {self.quantity}"
    
#     def get_subtotal(self):
#         return self.price * self.quantity

# models.py → VERSI FINAL & 100% KOMPATIBEL DENGAN AUTH_USER_MODEL!









# from django.db import models
# from django.core.validators import MinValueValidator
# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from django.utils import timezone


# # ================== CUSTOM USER MANAGER ==================
# class UserManager(BaseUserManager):
#     def create_user(self, username, email, password=None, full_name=None, **extra_fields):
#         if not username:
#             raise ValueError('Username wajib diisi!')
#         if not email:
#             raise ValueError('Email wajib diisi!')
        
#         email = self.normalize_email(email)
#         user = self.model(
#             username=username,
#             email=email,
#             full_name=full_name or '',
#             **extra_fields
#         )
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, username, email, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
#         extra_fields.setdefault('role', 'admin')

#         return self.create_user(username, email, password, **extra_fields)


# # ================== CUSTOM USER MODEL ==================
# class User(AbstractBaseUser, PermissionsMixin):
#     ROLE_CHOICES = [
#         ('customer', 'Customer'),
#         ('admin', 'Admin'),
#     ]
    
#     username = models.CharField(max_length=100, unique=True)
#     email = models.EmailField(unique=True)
#     full_name = models.CharField(max_length=255)
#     phone = models.CharField(max_length=15, blank=True, null=True)
#     address = models.TextField(blank=True, null=True)
#     role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    
#     # WAJIB UNTUK CUSTOM USER!
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     objects = UserManager()
    
#     USERNAME_FIELD = 'username'
#     REQUIRED_FIELDS = ['email', 'full_name']  # Field wajib saat createsuperuser
    
#     class Meta:
#         db_table = 'users'
    
#     def __str__(self):
#         return self.username


# # ================== MODEL LAINNYA (SUDAH BENAR!) ==================
# class Category(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     description = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         db_table = 'categories'
#         verbose_name_plural = 'Categories'
    
#     def __str__(self):
#         return self.name


# class Product(models.Model):
#     name = models.CharField(max_length=255)
#     description = models.TextField()
#     price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
#     stock = models.IntegerField(validators=[MinValueValidator(0)])
#     image = models.ImageField(upload_to='products/', blank=True, null=True)
#     category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'products'
    
#     def __str__(self):
#         return self.name


# class Review(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
#     rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
#     comment = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         db_table = 'reviews'
#         unique_together = ('user', 'product')
    
#     def __str__(self):
#         return f"{self.rating}★ by {self.user.username}"


# class Inspiration(models.Model):
#     name = models.CharField(max_length=255)
#     description = models.TextField()
#     image = models.ImageField(upload_to='inspirations/')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'inspirations'
    
#     def __str__(self):
#         return self.name


# class Cart(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'carts'
    
#     def __str__(self):
#         return f"Keranjang {self.user.username}"
    
#     def get_total_price(self):
#         return sum(item.get_subtotal() for item in self.items.all())


# class CartItem(models.Model):
#     SIZE_CHOICES = [
#         ('XS', 'XS'),
#         ('S', 'S'),
#         ('M', 'M'),
#         ('L', 'L'),
#         ('XL', 'XL'),
#         ('XXL', 'XXL'),
#         ('36', '36'),
#         ('37', '37'),
#         ('38', '38'),
#         ('39', '39'),
#         ('40', '40'),
#         ('41', '41'),
#         ('42', '42'),
#         ('43', '43'),
#         ('44', '44'),
#         ('45', '45'),
#         ('T/A', 'T/A'),  # Untuk aksesoris
#     ]
    
#     cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     quantity = models.IntegerField(validators=[MinValueValidator(1)])
#     size = models.CharField(max_length=10, choices=SIZE_CHOICES, default='M')
#     added_at = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         db_table = 'cart_items'
#         unique_together = ('cart', 'product', 'size')
    
#     def __str__(self):
#         return f"{self.product.name} ({self.size}) x {self.quantity}"
    
#     def get_subtotal(self):
#         return self.product.price * self.quantity


# class Order(models.Model):
#     STATUS_CHOICES = [
#         ('pending', 'Pending'),
#         ('paid', 'Paid'),
#         ('shipped', 'Shipped'),
#         ('delivered', 'Delivered'),
#         ('cancelled', 'Cancelled'),
#     ]
    
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
#     order_number = models.CharField(max_length=50, unique=True)
#     total_price = models.DecimalField(max_digits=12, decimal_places=2)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
#     shipping_address = models.TextField()
#     phone = models.CharField(max_length=15)
#     notes = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'orders'
#         ordering = ['-created_at']
    
#     def __str__(self):
#         return f"Order {self.order_number}"


# class OrderItem(models.Model):
#     SIZE_CHOICES = [
#         ('XS', 'XS'),
#         ('S', 'S'),
#         ('M', 'M'),
#         ('L', 'L'),
#         ('XL', 'XL'),
#         ('XXL', 'XXL'),
#         ('36', '36'),
#         ('37', '37'),
#         ('38', '38'),
#         ('39', '39'),
#         ('40', '40'),
#         ('41', '41'),
#         ('42', '42'),
#         ('43', '43'),
#         ('44', '44'),
#         ('45', '45'),
#         ('T/A', 'T/A'),
#     ]
    
#     order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     quantity = models.IntegerField()
#     price = models.DecimalField(max_digits=12, decimal_places=2)
#     size = models.CharField(max_length=10, choices=SIZE_CHOICES, default='M')
    
#     class Meta:
#         db_table = 'order_items'
    
#     def __str__(self):
#         return f"{self.product.name} ({self.size}) x {self.quantity}"
    
#     def get_subtotal(self):
#         return self.price * self.quantity


from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# ================== CUSTOM USER MANAGER ==================
class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, full_name=None, **extra_fields):
        if not username:
            raise ValueError('Username wajib diisi!')
        if not email:
            raise ValueError('Email wajib diisi!')
        
        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            full_name=full_name or '',
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        return self.create_user(username, email, password, **extra_fields)

# ================== CUSTOM USER MODEL ==================
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('admin', 'Admin'),
    ]
    
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'full_name']
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.username

# ================== CATEGORY MODEL ==================
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name

# ================== SIZE MODEL BARU ==================
class Size(models.Model):
    SIZE_CHOICES = [
        ('XS', 'XS'),
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL'),
        ('XXL', 'XXL'),
        ('36', '36'),
        ('37', '37'),
        ('38', '38'),
        ('39', '39'),
        ('40', '40'),
        ('41', '41'),
        ('42', '42'),
        ('43', '43'),
        ('44', '44'),
        ('45', '45'),
        ('T/A', 'T/A'),  # Untuk aksesoris
    ]
    
    name = models.CharField(max_length=10, choices=SIZE_CHOICES, unique=True)
    description = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        db_table = 'sizes'
    
    def __str__(self):
        return self.name

# ================== PRODUCT MODEL ==================
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    sizes = models.ManyToManyField(Size, through='ProductSize')  # Relasi many-to-many dengan Size
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'products'
    
    def __str__(self):
        return self.name
    
    def get_total_stock(self):
        """Total stok semua ukuran"""
        return sum(ps.stock for ps in self.productsizes.all())
    
    def is_in_stock(self, size_name):
        """Cek apakah ukuran tertentu tersedia"""
        try:
            size_stock = self.productsizes.get(size__name=size_name)
            return size_stock.stock > 0
        except ProductSize.DoesNotExist:
            return False

# ================== PRODUCT SIZE MODEL (UNTUK STOK PER UKURAN) ==================
class ProductSize(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='productsizes')
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    stock = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    
    class Meta:
        db_table = 'product_sizes'
        unique_together = ('product', 'size')  # Satu produk hanya punya satu record per ukuran
    
    def __str__(self):
        return f"{self.product.name} - {self.size.name} (Stock: {self.stock})"

# ================== REVIEW MODEL ==================
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reviews'
        unique_together = ('user', 'product')
    
    def __str__(self):
        return f"{self.rating}★ by {self.user.username}"

# ================== INSPIRATION MODEL ==================
class Inspiration(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='inspirations/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'inspirations'
    
    def __str__(self):
        return self.name

# ================== CART MODEL ==================
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'carts'
    
    def __str__(self):
        return f"Keranjang {self.user.username}"
    
    def get_total_price(self):
        return sum(item.get_subtotal() for item in self.items.all())

# ================== CART ITEM MODEL ==================
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    size = models.CharField(max_length=10)  # Menyimpan nama size sebagai string
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cart_items'
        unique_together = ('cart', 'product', 'size')
    
    def __str__(self):
        return f"{self.product.name} ({self.size}) x {self.quantity}"
    
    def get_subtotal(self):
        return self.product.price * self.quantity
    
    def is_available(self):
        """Cek apakah stok masih tersedia untuk ukuran ini"""
        try:
            product_size = self.product.productsizes.get(size__name=self.size)
            return product_size.stock >= self.quantity
        except ProductSize.DoesNotExist:
            return False

# ================== ORDER MODEL ==================
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=50, unique=True)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    
    # ========== FIELD PERIODE SEWA YANG DITAMBAHKAN ==========
    start_date = models.DateField(null=True, blank=True)  # Tanggal mulai sewa
    end_date = models.DateField(null=True, blank=True)    # Tanggal selesai sewa
    rental_days = models.IntegerField(default=1)          # Total hari sewa
    # ========================================================
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_address = models.TextField()
    phone = models.CharField(max_length=15)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order {self.order_number}"
    
    def save(self, *args, **kwargs):
        """Otomatis hitung rental_days jika start_date dan end_date ada"""
        if self.start_date and self.end_date:
            self.rental_days = (self.end_date - self.start_date).days + 1
        super().save(*args, **kwargs)
    
    def get_rental_period_display(self):
        """Format tampilan periode sewa"""
        if self.start_date and self.end_date:
            return f"{self.start_date} sampai {self.end_date} ({self.rental_days} hari)"
        return "Periode tidak tersedia"

# ================== ORDER ITEM MODEL ==================
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    size = models.CharField(max_length=10)  # Menyimpan nama size sebagai string
    
    class Meta:
        db_table = 'order_items'
    
    def __str__(self):
        return f"{self.product.name} ({self.size}) x {self.quantity}"
    
    def get_subtotal(self):
        return self.price * self.quantity