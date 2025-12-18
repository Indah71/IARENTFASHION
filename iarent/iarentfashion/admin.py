from django.contrib import admin
from .models import User, Category, Size, Product, ProductSize, Review, Inspiration, Cart, CartItem, Order, OrderItem

# ================== INLINE ADMIN UNTUK PRODUCT SIZE ==================
class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 1
    min_num = 1

# ================== PRODUCT ADMIN ==================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'get_total_stock', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ProductSizeInline]
    
    def get_total_stock(self, obj):
        return obj.get_total_stock()
    get_total_stock.short_description = 'Total Stock'

# ================== SIZE ADMIN ==================
@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

# ================== PRODUCT SIZE ADMIN ==================
@admin.register(ProductSize)
class ProductSizeAdmin(admin.ModelAdmin):
    list_display = ['product', 'size', 'stock']
    list_filter = ['size', 'product__category']
    search_fields = ['product__name']
    list_editable = ['stock']

# ================== USER ADMIN ==================
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'full_name', 'role', 'is_active']
    list_filter = ['role', 'is_active']
    search_fields = ['username', 'email', 'full_name']

# ================== CATEGORY ADMIN ==================
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

# ================== REVIEW ADMIN ==================
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['product__name', 'user__username']

# ================== INSPIRATION ADMIN ==================
@admin.register(Inspiration)
class InspirationAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

# ================== CART ADMIN ==================
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at']
    search_fields = ['user__username']

# ================== CART ITEM ADMIN ==================
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['product', 'cart', 'size', 'quantity', 'added_at']
    list_filter = ['size']
    search_fields = ['product__name', 'cart__user__username']

# ================== ORDER ADMIN ==================
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'total_price', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_number', 'user__username']
    readonly_fields = ('created_at', 'updated_at')
    inlines = [OrderItemInline]

# ================== ORDER ITEM ADMIN ==================
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'size', 'quantity', 'price']
    list_filter = ['size']
    search_fields = ['order__order_number', 'product__name']