# # iarentfashion/urls.py → COPY-PASTE INI SAJA!

# from django.urls import path
# from . import views

# urlpatterns = [
#     # Halaman Utama
#     path('', views.beranda, name='beranda'),

#     # Halaman Daftar Produk (2 URL untuk 1 halaman → terbaik!)
#     path('products/', views.products, name='products'),      # URL utama (bisa dipakai di mana saja)
#     path('koleksi/', views.products, name='koleksi'),        # Alias biar link lama tetap jalan

#     # Detail Produk
#     path('product/<int:id>/', views.product_detail, name='product_detail'),

#     # Kategori Produk
#     path('jas/', views.jas, name='jas'),
#     path('dress/', views.dress, name='dress'),
#     path('kebaya/', views.kebaya, name='kebaya'),
#     path('footwear/', views.footwear, name='footwear'),
#     path('aksesoris/', views.aksesoris, name='aksesoris'),

#     # Halaman Informasi
#     path('inspirasi/', views.inspirasi, name='inspirasi'),
#     path('kontak/', views.kontak, name='kontak'),
#     path('tentang/', views.tentang, name='tentang'),
#     path('review/', views.review, name='review'),

#     # Halaman User
#     path('profile/', views.profile, name='profile'),
#     path('pesanan/', views.pesanan, name='pesanan'),
#     path('sewa/', views.sewa, name='sewa'),

#     # Authentication
#     path('login/', views.login_view, name='login'),
#     path('logout/', views.logout_view, name='logout'),
#     path('register/', views.register, name='register'),

#     # API
#     path('api/cart/add/', views.api_cart_add, name='api_cart_add'),
#     path('api/cart/items/', views.api_cart_items, name='api_cart_items'),
#     path('api/cart/update/', views.api_cart_update, name='api_cart_update'),
#     path('api/cart/remove/', views.api_cart_remove, name='api_cart_remove'),
#     path('api/wishlist/add/', views.api_wishlist_add, name='api_wishlist_add'),
#     path('api/contact/submit/', views.api_contact_submit, name='api_contact_submit'),
#     path('api/clear-welcome/', views.clear_welcome_flag, name='clear_welcome'),
#     path('api/review/submit/', views.submit_review, name='submit_review'),
#     path('api/review/submit/', views.submit_review, name='add_review'),  # PAKAI INI KALAU MAU NAMA 'add_review'
    
# ]

# iarentfashion/urls.py → INI VERSI FINAL & AMAN SELAMANYA!

# iarentfashion/urls.py → VERSI FINAL & FIXED!

from django.urls import path
from . import views


urlpatterns = [
    # Halaman Utama
    path('', views.beranda, name='beranda'),
    
    # Koleksi Produk (2 URL untuk 1 view → terbaik!)
    path('products/', views.products, name='products'),      # URL utama
    path('koleksi/', views.products, name='koleksi'),        # Alias (biar link lama tetap jalan)

    # Detail Produk
    path('product/<int:id>/', views.product_detail, name='product_detail'),
    # HAPUS BARIS INI: path('api/kurangi-stok/', views.kurangi_stok, name='kurangi_stok'),

    # Kategori
    path('jas/', views.jas, name='jas'),
    path('dress/', views.dress, name='dress'),
    path('kebaya/', views.kebaya, name='kebaya'),
    path('footwear/', views.footwear, name='footwear'),
    path('aksesoris/', views.aksesoris, name='aksesoris'),

    # Halaman Informasi
    path('inspirasi/', views.inspirasi, name='inspirasi'),
    path('kontak/', views.kontak, name='kontak'),
    path('tentang/', views.tentang, name='tentang'),
    path('review/', views.review, name='review'),

    # Halaman User (wajib login)
    path('profile/', views.profile, name='profile'),
    path('pesanan/', views.pesanan, name='pesanan'),
    path('sewa/', views.sewa, name='sewa'),
    

    # Authentication
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),

    # ================== API ENDPOINTS ==================
    # Keranjang
    path('api/cart/add/', views.api_cart_add, name='api_cart_add'),
    path('api/cart/items/', views.api_cart_items, name='api_cart_items'),
    path('api/cart/update/', views.api_cart_update, name='api_cart_update'),
    path('api/cart/remove/', views.api_cart_remove, name='api_cart_remove'),

    # Wishlist
    path('api/wishlist/add/', views.api_wishlist_add, name='api_wishlist_add'),

    # Review
    path('api/review/submit/', views.submit_review, name='submit_review'),
    # Kalau kamu mau pakai nama 'add_review' juga boleh (untuk kompatibilitas)
    path('api/review/add/', views.submit_review, name='add_review'),

    # Lain-lain
    path('api/contact/submit/', views.api_contact_submit, name='api_contact_submit'),
    path('api/clear-welcome/', views.clear_welcome_flag, name='clear_welcome'),
    path('cart/', views.cart_view, name='cart'),

    path('api/products/<int:product_id>/', views.api_product_detail, name='api_product_detail'),
    path('api/cart/items/', views.api_cart_items, name='api_cart_items'),
     path('profile/', views.profile, name='profile'),
     
    path('api/create-order/', views.create_order, name='api_create_order'),
    path('api/products/<int:product_id>/', views.api_product_detail, name='api_product_detail'),
    path('api/cart/add/', views.api_cart_add, name='api_cart_add'),
    path('api/cart/items/', views.api_cart_items, name='api_cart_items'),
    path('api/cart/update/', views.api_cart_update, name='api_cart_update'),
    path('api/cart/remove/', views.api_cart_remove, name='api_cart_remove'),
    
    # Tambahkan di urls.py
    path('debug/orders/', views.debug_orders, name='debug_orders'),
    path('api/test-order/', views.test_order_api, name='api_test_order'),
    
    path('pesanan/<int:order_id>/cancel/', views.cancel_order, name='cancel_order'),
    path('pesanan/<int:order_id>/detail/', views.order_detail, name='order_detail'),
    
]
