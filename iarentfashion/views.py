from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Avg, Q
from django.db import models
import json
from django.utils import timezone  # Tambahkan ini di atas
from .models import Product, Order, OrderItem, ProductSize

# IMPORT MODELS
from .models import Product, Category, Inspiration, Review, Order, Cart, CartItem, User

# ================================
# HALAMAN UTAMA
# ================================

def beranda(request):
    """Halaman beranda"""
    try:
        # PERBAIKAN: Hapus filter stock__gt=0
        products = Product.objects.all()[:6]
        categories = Category.objects.all()
        inspirasi = Inspiration.objects.all()[:4]
        
        context = {
            'products': products,
            'categories': categories,
            'inspirasi': inspirasi,
        }
        return render(request, 'iarentfashion/beranda.html', context)
    except Exception as e:
        print(f"Error in beranda: {e}")
        context = {
            'products': [],
            'categories': [],
            'inspirasi': [],
        }
        return render(request, 'iarentfashion/beranda.html', context)

def products(request):
    """Halaman produk"""
    # PERBAIKAN: Hapus filter stock__gt=0
    products = Product.objects.all()
    category = request.GET.get('category')
    if category:
        products = products.filter(category__name__icontains=category)

    context = {
        'products': products,
        'current_category': category,
    }
    return render(request, 'iarentfashion/koleksi.html', context)

from django.shortcuts import render, get_object_or_404
from django.db.models import Avg, Sum
from .models import Product, Review, ProductSize

def product_detail(request, id):
    """Halaman detail produk"""
    product = get_object_or_404(Product, id=id)
    reviews = Review.objects.filter(product=product)
    
    # Hitung average rating
    average_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
    
    # Get related products
    related_products = Product.objects.filter(
        category=product.category
    ).exclude(id=product.id)[:4]
    
    # Hitung TOTAL STOK dari semua ukuran (menggunakan method dari model)
    total_stock = product.get_total_stock()
    
    # Get available sizes dengan stok
    available_sizes = ProductSize.objects.filter(product=product, stock__gt=0)
    
    # Siapkan data produk untuk JSON
    product_data = {
        'id': product.id,
        'name': product.name,
        'price': float(product.price),
        'stock': total_stock,  # Gunakan total stok dari ProductSize
        'category': product.category.name,
        'description': product.description,
        'available_sizes': [
            {
                'size': size.size.name,
                'stock': size.stock
            } for size in available_sizes
        ]
    }

    context = {
        'product': product,
        'reviews': reviews,
        'average_rating': round(average_rating, 1),
        'related_products': related_products,
        'total_stock': total_stock,
        'available_sizes': available_sizes,
        'product_json': product_data  # Data untuk JavaScript
    }
    
    return render(request, 'iarentfashion/detail.html', context)

def inspirasi(request):
    """Halaman inspirasi"""
    try:
        jas_inspirasi = Inspiration.objects.filter(name__icontains='jas')[:4]
        dress_inspirasi = Inspiration.objects.filter(name__icontains='dress')[:4]
        aksesoris_inspirasi = Inspiration.objects.filter(name__icontains='aksesoris')[:4]
        kebaya_inspirasi = Inspiration.objects.filter(name__icontains='kebaya')[:4]
        footwear_inspirasi = Inspiration.objects.filter(name__icontains='footwear')[:4]
        
        context = {
            'jas_inspirasi': jas_inspirasi,
            'dress_inspirasi': dress_inspirasi,
            'aksesoris_inspirasi': aksesoris_inspirasi,
            'kebaya_inspirasi': kebaya_inspirasi,
            'footwear_inspirasi': footwear_inspirasi,
        }
        
        return render(request, 'iarentfashion/inspirasi.html', context)
    except Exception as e:
        print(f"Error in inspirasi: {e}")
        context = {
            'jas_inspirasi': [],
            'dress_inspirasi': [],
            'aksesoris_inspirasi': [],
            'kebaya_inspirasi': [],
            'footwear_inspirasi': [],
        }
        return render(request, 'iarentfashion/inspirasi.html', context)

# ================================
# HALAMAN KATEGORI
# ================================

def koleksi(request):
    """Halaman koleksi semua produk"""
    try:
        products = Product.objects.all()
        category = request.GET.get('category')
        search = request.GET.get('search')
        sort = request.GET.get('sort', 'name')

        if category:
            products = products.filter(category__name=category)

        if search:
            products = products.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )

        if sort == 'price_low':
            products = products.order_by('price')
        elif sort == 'price_high':
            products = products.order_by('-price')
        elif sort == 'newest':
            products = products.order_by('-created_at')
        else:
            products = products.order_by('name')

        return render(request, 'iarentfashion/koleksi.html', {
            'products': products,
            'current_category': category,
            'current_search': search,
            'current_sort': sort
        })
    except Exception as e:
        print(f"Error in koleksi view: {e}")
        return render(request, 'iarentfashion/koleksi.html', {'products': []})
    
def jas(request):
    """Halaman kategori jas"""
    try:
        category = get_object_or_404(Category, name__iexact="JAS")
        products = Product.objects.filter(category=category)
        for product in products:
            product.total_stock = product.get_total_stock()  # Gunakan method yang sama dengan detail
        
        return render(request, 'iarentfashion/jas.html', {
            'products': products,
            'category': category
        })
    except Exception as e:
        print(f"Error in jas: {e}")
        return render(request, 'iarentfashion/jas.html', {'products': []})

def dress(request):
    """Halaman kategori dress"""
    try:
        category = get_object_or_404(Category, name__iexact="DRESS")
        products = Product.objects.filter(category=category)
        for product in products:
            product.total_stock = product.get_total_stock()
        
        return render(request, 'iarentfashion/dress.html', {
            'products': products,
            'category': category
        })
    except Exception as e:
        print(f"Error in dress: {e}")
        return render(request, 'iarentfashion/dress.html', {'products': []})

def kebaya(request):
    """Halaman kategori kebaya"""
    try:
        category = get_object_or_404(Category, name__iexact="KEBAYA")
        products = Product.objects.filter(category=category)
        for product in products:
            product.total_stock = product.get_total_stock()
        
        return render(request, 'iarentfashion/kebaya.html', {
            'products': products,
            'category': category
        })
    except Exception as e:
        print(f"Error in kebaya: {e}")
        return render(request, 'iarentfashion/kebaya.html', {'products': []})

def footwear(request):
    """Halaman kategori footwear"""
    try:
        category = get_object_or_404(Category, name__iexact="FOOTWEAR")
        products = Product.objects.filter(category=category)
        for product in products:
            product.total_stock = product.get_total_stock()
        
        return render(request, 'iarentfashion/footwear.html', {
            'products': products,
            'category': category
        })
    except Exception as e:
        print(f"Error in footwear: {e}")
        return render(request, 'iarentfashion/footwear.html', {'products': []})

def aksesoris(request):
    """Halaman kategori aksesoris"""
    try:
        category = get_object_or_404(Category, name__iexact="AKSESORIS")
        products = Product.objects.filter(category=category)
        for product in products:
            product.total_stock = product.get_total_stock()
        
        return render(request, 'iarentfashion/aksesoris.html', {
            'products': products,
            'category': category
        })
    except Exception as e:
        print(f"Error in aksesoris: {e}")
        return render(request, 'iarentfashion/aksesoris.html', {'products': []})
# ================================
# HALAMAN INFORMASI
# ================================

def kontak(request):
    """Halaman kontak"""
    return render(request, 'iarentfashion/kontak.html')

def tentang(request):
    """Halaman tentang kami"""
    return render(request, 'iarentfashion/tentang.html')

def review(request):
    """Halaman review dengan filter"""
    try:
        rating_filter = request.GET.get('rating')
        reviews_list = Review.objects.select_related('user', 'product').order_by('-created_at')
        
        if rating_filter and rating_filter.isdigit():
            rating_value = int(rating_filter)
            if rating_value > 0:
                reviews_list = reviews_list.filter(rating=rating_value)
        
        total_reviews = reviews_list.count()
        average_rating = reviews_list.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        
        all_reviews = Review.objects.all()
        rating_distribution = []
        for rating in range(5, 0, -1):
            count = all_reviews.filter(rating=rating).count()
            percentage = (count / all_reviews.count() * 100) if all_reviews.count() > 0 else 0
            rating_distribution.append({
                'rating': rating,
                'count': count,
                'percentage': round(percentage, 1)
            })
        
        context = {
            'reviews': reviews_list,
            'total_reviews': total_reviews,
            'average_rating': round(average_rating, 1),
            'rating_distribution': rating_distribution,
            'current_rating_filter': rating_filter or '0',
        }
        
        return render(request, 'iarentfashion/review.html', context)
        
    except Exception as e:
        print(f"Error in review: {e}")
        context = {
            'reviews': [],
            'total_reviews': 0,
            'average_rating': 0,
            'rating_distribution': [],
            'current_rating_filter': '0',
        }
        return render(request, 'iarentfashion/review.html', context)

# ================================
# HALAMAN USER
# ================================

@login_required
def profile(request):
    """Halaman profile user yang lengkap"""
    user = request.user
    
    # Hitung statistik user
    total_orders = Order.objects.filter(user=user).count()
    pending_orders = Order.objects.filter(user=user, status='pending').count()
    completed_orders = Order.objects.filter(user=user, status='delivered').count()
    
    # Get recent orders
    recent_orders = Order.objects.filter(user=user).order_by('-created_at')[:5]
    
    if request.method == 'POST':
        # Handle profile update
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        
        # Update user data
        if full_name:
            user.full_name = full_name
        if email:
            user.email = email
        if phone:
            user.phone = phone
        if address:
            user.address = address
            
        try:
            user.save()
            messages.success(request, 'Profile berhasil diperbarui!')
            return redirect('profile')
        except Exception as e:
            messages.error(request, f'Gagal update profile: {str(e)}')
    
    context = {
        'user': user,
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'completed_orders': completed_orders,
        'recent_orders': recent_orders,
    }
    
    return render(request, 'iarentfashion/profile.html', context) 

from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# @login_required
# def sewa(request):
#     """
#     View untuk halaman checkout
#     """
#     context = {
#         'title': 'Sewa - IA Rent Fashion',
#     }
#     return render(request, 'iarent
#fashion/sewa.html', context)

@login_required
def sewa(request):
    """
    View untuk halaman checkout - PERBAIKAN LENGKAP
    """
    try:
        # Ambil cart user yang sedang login
        cart = Cart.objects.get(user=request.user)
        cart_items = CartItem.objects.filter(cart=cart).select_related('product', 'product__category')
        
        # Debug: Cek apakah cart ada isinya
        print(f"🛒 SEWA VIEW - User: {request.user.username}")
        print(f"📦 Total items di cart: {cart_items.count()}")
        
        if cart_items.count() == 0:
            print("⚠️ WARNING: Cart kosong!")
        
        # Konversi semua ke float
        total_harga = 0
        
        for item in cart_items:
            price = float(item.product.price)
            quantity = item.quantity
            total_harga += price * quantity
            
            # Debug setiap item
            image_status = "✅ Ada" if item.product.image else "❌ Tidak ada"
            image_url = item.product.image.url if item.product.image else "No image"
            print(f"  ✓ {item.product.name} | Qty: {quantity} | Size: {item.size} | Image: {image_status} ({image_url})")
        
        deposit = total_harga * 0.10
        total_bayar = total_harga + deposit
        
        print(f"💰 Total Harga: Rp {total_harga:,.0f}")
        print(f"💵 Deposit (10%): Rp {deposit:,.0f}")
        print(f"💳 Total Bayar: Rp {total_bayar:,.0f}")
        
        context = {
            'cart_items': cart_items,
            'total_harga': total_harga,
            'deposit': deposit,
            'total_bayar': total_bayar,
        }
        return render(request, 'iarentfashion/sewa.html', context)
        
    except Cart.DoesNotExist:
        print(f"❌ Cart tidak ditemukan untuk user: {request.user.username}")
        context = {
            'cart_items': [],
            'total_harga': 0,
            'deposit': 0,
            'total_bayar': 0,
        }
        return render(request, 'iarentfashion/sewa.html', context)
        
    except Exception as e:
        print(f"❌ Error di sewa view: {e}")
        import traceback
        traceback.print_exc()
        context = {
            'cart_items': [],
            'total_harga': 0,
            'deposit': 0,
            'total_bayar': 0,
        }
        return render(request, 'iarentfashion/sewa.html', context)



@login_required
def cart_view(request):
    """Halaman keranjang belanja - FIXED"""
    try:
        cart_items = CartItem.objects.filter(cart__user=request.user).select_related('product')
        
        total_price = 0
        total_items = 0
        
        for item in cart_items:
            subtotal = item.product.price * item.quantity
            total_price += subtotal
            total_items += item.quantity
            
            # ⭐ TAMBAHKAN: Set size untuk template jika belum ada
            if not hasattr(item, 'size') or not item.size:
                item.size = 'M'  # Default size
        
        context = {
            'cart_items': cart_items,
            'total_price': total_price,
            'total_items': total_items,
        }
        
        return render(request, 'iarentfashion/cart.html', context)
        
    except Exception as e:
        print(f"Error in cart_view: {e}")
        return render(request, 'iarentfashion/cart.html', {
            'cart_items': [],
            'total_price': 0,
            'total_items': 0
        })
        
# ================================
# AUTHENTICATION
# ================================

def login_view(request):
    """Handle user login"""
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            messages.success(request, f'Selamat datang, {user.username}!')
            request.session['show_welcome'] = True
            
            next_url = request.GET.get('next')
            if next_url:
                return redirect(next_url)
            return redirect("beranda")
        else:
            messages.error(request, "Username atau password salah.")

    return render(request, "iarentfashion/login.html")

def logout_view(request):
    """Handle user logout"""
    logout(request)
    messages.success(request, 'Anda telah logout')
    return redirect("beranda")

def register(request):
    """Handle user registration"""
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email", "")
        password = request.POST.get("password")
        full_name = request.POST.get("full_name", "")
        phone = request.POST.get("phone", "")

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username sudah digunakan!")
        elif User.objects.filter(email=email).exists():
            messages.error(request, "Email sudah terdaftar!")
        elif len(password) < 8:
            messages.error(request, "Password minimal 8 karakter!")
        else:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                full_name=full_name,
                phone=phone
            )
            messages.success(request, "Akun berhasil dibuat! Silakan login.")
            return redirect('login')

    return render(request, "iarentfashion/register.html")

# ================================
# API ENDPOINTS
# ================================

@csrf_exempt
@login_required
def api_cart_add(request):
    """Tambah produk ke keranjang DENGAN SIZE"""
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Invalid method"})
    
    try:
        data = json.loads(request.body)
        product_id = int(data.get('product_id'))
        quantity = int(data.get('quantity', 1))
        size = data.get('size', 'M')  # ⭐ TAMBAHKAN INI
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return JsonResponse({"success": False, "message": "Produk tidak ditemukan"})
        
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        # ⭐ PERBAIKI: Tambahkan parameter size
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=size,  # ⭐ TAMBAHKAN INI
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        total_items = CartItem.objects.filter(cart__user=request.user).aggregate(
            total=models.Sum('quantity')
        )['total'] or 0
        
        return JsonResponse({
            "success": True,
            "message": f"{product.name} (Size: {size}) ditambahkan ke keranjang",  # ⭐ TAMBAHKAN SIZE DI MESSAGE
            "cart_count": total_items
        })
        
    except Exception as e:
        print(f"Error in api_cart_add: {e}")
        return JsonResponse({"success": False, "message": f"Error: {str(e)}"})


@csrf_exempt
@login_required
def api_cart_add(request):
    """Tambah produk ke keranjang - FIXED VERSION"""
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Invalid method"})
    
    try:
        data = json.loads(request.body)
        product_id = int(data.get('product_id'))
        quantity = int(data.get('quantity', 1))
        size = data.get('size', 'M')
        
        print(f"🛒 ADD TO CART - User: {request.user}, Product: {product_id}, Size: {size}, Qty: {quantity}")
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return JsonResponse({"success": False, "message": "Produk tidak ditemukan"})
        
        # Dapatkan atau buat cart untuk user
        cart, created = Cart.objects.get_or_create(user=request.user)
        print(f"📦 Cart ID: {cart.id}, Created: {created}")
        
        # Cari item dengan product dan size yang sama
        try:
            cart_item = CartItem.objects.get(
                cart=cart,
                product=product,
                size=size
            )
            # Jika sudah ada, update quantity
            cart_item.quantity += quantity
            cart_item.save()
            action = "updated"
            print(f"📥 Updated existing item: {cart_item.id}, New Qty: {cart_item.quantity}")
        except CartItem.DoesNotExist:
            # Jika belum ada, buat baru
            cart_item = CartItem.objects.create(
                cart=cart,
                product=product,
                quantity=quantity,
                size=size
            )
            action = "added"
            print(f"🆕 Created new item: {cart_item.id}")
        
        # Hitung total items di cart
        total_items = CartItem.objects.filter(cart=cart).aggregate(
            total=models.Sum('quantity')
        )['total'] or 0
        
        print(f"✅ Cart {action} successfully - Total items: {total_items}")
        
        return JsonResponse({
            "success": True,
            "message": f"{product.name} (Size: {size}) ditambahkan ke keranjang",
            "cart_count": total_items,
            "item_id": cart_item.id
        })
        
    except Exception as e:
        print(f"❌ Error in api_cart_add: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({"success": False, "message": f"Error: {str(e)}"})

@csrf_exempt
@login_required
def api_cart_items(request):
    """API untuk mengambil semua item di keranjang - FIXED VERSION"""
    try:
        print(f"🛒 FETCH CART ITEMS - User: {request.user}")
        
        # Dapatkan cart user
        cart = Cart.objects.filter(user=request.user).first()
        
        if not cart:
            print("❌ No cart found for user")
            return JsonResponse({
                'success': True,
                'items': [],
                'total_items': 0,
                'total_price': 0,
            })
        
        cart_items = CartItem.objects.filter(cart=cart).select_related('product')
        print(f"📦 Found {cart_items.count()} items in cart")
        
        items_list = []
        total_price = 0
        total_items = 0

        for item in cart_items:
            print(f"  - Item: {item.product.name}, Qty: {item.quantity}, Size: {getattr(item, 'size', 'M')}")
            
            price = float(item.product.price)
            quantity = item.quantity
            subtotal = price * quantity

            items_list.append({
                'id': item.id,
                'product_id': item.product.id,
                'name': item.product.name,
                'image': item.product.image.url if item.product.image else '/static/img/no-image.jpg',
                'price': price,
                'quantity': quantity,
                'subtotal': subtotal,
                'size': getattr(item, 'size', 'M'),  # Handle jika field size tidak ada
            })

            total_price += subtotal
            total_items += quantity

        print(f"💰 Cart Summary - Items: {total_items}, Total Price: Rp {total_price}")
        
        return JsonResponse({
            'success': True,
            'items': items_list,
            'total_items': total_items,
            'total_price': total_price,
        })

    except Exception as e:
        print(f"❌ ERROR api_cart_items: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({
            'success': False,
            'items': [],
            'total_items': 0,
            'total_price': 0,
            'error': str(e)
        })

@csrf_exempt
@login_required
def api_cart_update(request):
    """API untuk update quantity item di cart"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            quantity = int(data.get('quantity', 1))
            
            print(f"🛒 UPDATE CART - Item: {item_id}, New Qty: {quantity}")
            
            cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
            
            if quantity <= 0:
                cart_item.delete()
                action = "deleted"
            else:
                cart_item.quantity = quantity
                cart_item.save()
                action = "updated"
            
            total_items = CartItem.objects.filter(cart__user=request.user).aggregate(
                total=models.Sum('quantity')
            )['total'] or 0
            
            print(f"✅ Cart item {action} - Total items: {total_items}")
            
            return JsonResponse({
                "success": True, 
                "message": "Cart berhasil diperbarui",
                "cart_count": total_items
            })
        except Exception as e:
            print(f"❌ Error updating cart: {str(e)}")
            return JsonResponse({"success": False, "message": str(e)})
    
    return JsonResponse({"success": False, "message": "Invalid request method"})

@csrf_exempt
@login_required
def api_cart_remove(request):
    """API untuk remove item dari cart"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            
            print(f"🛒 REMOVE FROM CART - Item: {item_id}")
            
            cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
            product_name = cart_item.product.name
            cart_item.delete()
            
            total_items = CartItem.objects.filter(cart__user=request.user).aggregate(
                total=models.Sum('quantity')
            )['total'] or 0
            
            print(f"✅ Item removed: {product_name} - Total items: {total_items}")
            
            return JsonResponse({
                "success": True, 
                "message": "Item berhasil dihapus dari cart",
                "cart_count": total_items
            })
        except Exception as e:
            print(f"❌ Error removing from cart: {str(e)}")
            return JsonResponse({"success": False, "message": str(e)})
    
    return JsonResponse({"success": False, "message": "Invalid request method"})


@csrf_exempt
@login_required
def api_cart_update(request):
    """API untuk update quantity item di cart"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            quantity = int(data.get('quantity', 1))
            
            cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
            
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()
            
            total_items = CartItem.objects.filter(cart__user=request.user).aggregate(
                total=models.Sum('quantity')
            )['total'] or 0
            
            return JsonResponse({
                "success": True, 
                "message": "Cart berhasil diperbarui",
                "cart_count": total_items
            })
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})
    
    return JsonResponse({"success": False, "message": "Invalid request method"})

@csrf_exempt
@login_required
def api_cart_remove(request):
    """API untuk remove item dari cart"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            
            cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
            cart_item.delete()
            
            total_items = CartItem.objects.filter(cart__user=request.user).aggregate(
                total=models.Sum('quantity')
            )['total'] or 0
            
            return JsonResponse({
                "success": True, 
                "message": "Item berhasil dihapus dari cart",
                "cart_count": total_items
            })
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})
    
    return JsonResponse({"success": False, "message": "Invalid request method"})

@csrf_exempt
@login_required
def api_wishlist_add(request):
    """API untuk menambah wishlist"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            product_id = data.get('product_id')
            
            if 'wishlist' not in request.session:
                request.session['wishlist'] = []
            
            if product_id not in request.session['wishlist']:
                request.session['wishlist'].append(product_id)
                request.session.modified = True
                
                return JsonResponse({
                    "success": True, 
                    "message": "Produk berhasil ditambahkan ke wishlist",
                    "wishlist_count": len(request.session['wishlist'])
                })
            else:
                return JsonResponse({
                    "success": False, 
                    "message": "Produk sudah ada di wishlist"
                })
                
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})
    
    return JsonResponse({"success": False, "message": "Invalid request method"})

@csrf_exempt
def api_contact_submit(request):
    """API untuk submit form kontak"""
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")

        return JsonResponse({"status": "success", "message": "Pesan berhasil dikirim"})

    return JsonResponse({"status": "error", "message": "Invalid request"})

@csrf_exempt
@login_required
def submit_review(request):
    """API untuk submit review"""
    if request.method == 'POST':
        try:
            product_id = request.POST.get('product')
            rating = request.POST.get('rating')
            comment = request.POST.get('comment', '').strip()
            
            if not all([product_id, rating, comment]):
                messages.error(request, 'Semua field harus diisi!')
                return redirect('review')
            
            if len(comment) < 10:
                messages.error(request, 'Komentar minimal 10 karakter!')
                return redirect('review')
            
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                messages.error(request, 'Produk tidak ditemukan!')
                return redirect('review')
            
            existing_review = Review.objects.filter(user=request.user, product=product).first()
            if existing_review:
                messages.error(request, 'Anda sudah memberikan review untuk produk ini!')
                return redirect('review')
            
            Review.objects.create(
                user=request.user,
                product=product,
                rating=int(rating),
                comment=comment
            )
            messages.success(request, 'Review berhasil ditambahkan!')
            
        except Exception as e:
            print(f"Error submitting review: {e}")
            messages.error(request, f'Terjadi kesalahan: {str(e)}')
        
        return redirect('review')
    
    return redirect('review')

# ================================
# UTILITY FUNCTIONS
# ================================

@login_required
@csrf_exempt
def clear_welcome_flag(request):
    """Clear welcome flag after showing SweetAlert"""
    if 'show_welcome' in request.session:
        del request.session['show_welcome']
    return JsonResponse({'success': True})


from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Product

def api_product_detail(request, product_id):
    """API untuk mengambil detail produk"""
    try:
        product = get_object_or_404(Product, id=product_id)
        
        data = {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': float(product.price),
            'image': product.image.url if product.image else None,
            'category_name': product.category.name,
            'sizes': [size.name for size in product.sizes.all()],
            'created_at': product.created_at.isoformat(),
        }
        
        return JsonResponse(data)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=404)

    
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db import transaction
from django.utils import timezone
import json
from .models import Order, OrderItem, Product, ProductSize
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json

from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.utils import timezone
import json

from django.db import transaction

@csrf_exempt
def create_order(request):
    """API untuk membuat order baru - DENGAN PENGURANGAN STOK"""
    
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Method tidak diizinkan"}, status=405)
    
    try:
        data = json.loads(request.body)
        print("📥 Data yang diterima:", json.dumps(data, indent=2))
        
        # VALIDASI DATA PERIODE SEWA
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')
        
        if not start_date_str or not end_date_str:
            return JsonResponse({
                "success": False, 
                "error": "Tanggal mulai dan selesai sewa wajib diisi"
            }, status=400)
        
        # KONVERSI KE DATE OBJECT
        from datetime import datetime
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({
                "success": False, 
                "error": "Format tanggal tidak valid. Gunakan format YYYY-MM-DD"
            }, status=400)
        
        # VALIDASI: End date harus setelah start date
        if end_date <= start_date:
            return JsonResponse({
                "success": False, 
                "error": "Tanggal selesai harus setelah tanggal mulai"
            }, status=400)
        
        # HITUNG TOTAL HARI
        rental_days = (end_date - start_date).days + 1
        
        print(f"📅 Periode sewa: {start_date} sampai {end_date} ({rental_days} hari)")
        
        # Validasi cart_items
        cart_items = data.get('cart_items', [])
        if not cart_items:
            return JsonResponse({
                "success": False, 
                "error": "Tidak ada produk dalam pesanan"
            }, status=400)
        
        # ========== VALIDASI STOK SEBELUM MEMPROSES ==========
        for item in cart_items:
            product_id = item.get('product_id')
            size = item.get('size', 'M')
            quantity = int(item.get('quantity', 1))
            
            try:
                product = Product.objects.get(id=product_id)
                
                # Cek stok berdasarkan sistem ProductSize
                if hasattr(product, 'productsizes'):
                    try:
                        product_size = ProductSize.objects.get(product=product, size__name=size)
                        if product_size.stock < quantity:
                            return JsonResponse({
                                "success": False,
                                "error": f"Stok tidak cukup untuk {product.name} ukuran {size}. Stok tersedia: {product_size.stock}"
                            }, status=400)
                    except ProductSize.DoesNotExist:
                        return JsonResponse({
                            "success": False,
                            "error": f"Ukuran {size} tidak tersedia untuk {product.name}"
                        }, status=400)
                else:
                    # Fallback ke stok produk lama
                    if product.stock < quantity:
                        return JsonResponse({
                            "success": False,
                            "error": f"Stok tidak cukup untuk {product.name}. Stok tersedia: {product.stock}"
                        }, status=400)
                        
            except Product.DoesNotExist:
                return JsonResponse({
                    "success": False,
                    "error": f"Produk dengan ID {product_id} tidak ditemukan"
                }, status=400)
        
        # Hitung total price DENGAN PERIODE SEWA
        total_price = 0
        for item in cart_items:
            price_per_day = float(item.get('price', 0))
            quantity = int(item.get('quantity', 1))
            total_price += price_per_day * quantity * rental_days
        
        print(f"💰 Total harga untuk {rental_days} hari: {total_price}")
        
        # Handle user
        user = None
        if request.user.is_authenticated:
            user = request.user
        else:
            # Buat user guest
            email = data.get('email')
            user = User.objects.filter(email=email).first()
            if not user:
                username = f"guest_{email.split('@')[0]}_{int(timezone.now().timestamp())}"
                user = User.objects.create(
                    username=username,
                    email=email,
                    full_name=data.get('full_name', ''),
                    phone=data.get('phone', ''),
                    role='customer'
                )
                user.set_unusable_password()
                user.save()
        
        # Generate order number
        timestamp = timezone.now().strftime('%y%m%d%H%M%S')
        order_number = f"ORD{timestamp}{user.id}"
        
        # ========== BUAT ORDER DAN KURANGI STOK DALAM TRANSACTION ==========
        with transaction.atomic():
            # BUAT ORDER DENGAN PERIODE SEWA
            order = Order.objects.create(
                user=user,
                order_number=order_number,
                total_price=total_price,
                start_date=start_date,
                end_date=end_date,
                rental_days=rental_days,
                shipping_address="Jl. Brigjend H. Hasan Basri, Pangeran, Banjarmasin - Ambil di Toko",
                phone=data.get('phone', ''),
                status='pending',
                notes=data.get('notes', '')
            )
            
            print(f"✅ Order berhasil dibuat dengan periode sewa: {start_date} sampai {end_date}")
            
            # Create Order Items dan KURANGI STOK
            order_items_data = []
            product_ids = [item['product_id'] for item in cart_items if item.get('product_id')]
            
            products_dict = {
                product.id: product 
                for product in Product.objects.filter(id__in=product_ids)
            }
            
            for item in cart_items:
                product_id = item.get('product_id')
                if not product_id:
                    continue
                    
                product = products_dict.get(int(product_id))
                if product:
                    size = item.get('size', 'M')
                    quantity = int(item.get('quantity', 1))
                    
                    # BUAT ORDER ITEM
                    order_items_data.append(OrderItem(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price=float(item.get('price', 0)),
                        size=size
                    ))
                    
                    # ========== KURANGI STOK PRODUK ==========
                    if hasattr(product, 'productsizes'):
                        # Kurangi stok di ProductSize
                        try:
                            product_size = ProductSize.objects.get(product=product, size__name=size)
                            if product_size.stock >= quantity:
                                product_size.stock -= quantity
                                product_size.save()
                                print(f"📦 Stok {product.name} ukuran {size} dikurangi {quantity}. Sisa: {product_size.stock}")
                            else:
                                raise Exception(f"Stok tidak cukup untuk {product.name} ukuran {size}")
                        except ProductSize.DoesNotExist:
                            raise Exception(f"Ukuran {size} tidak ditemukan untuk {product.name}")
                    else:
                        # Fallback: kurangi stok produk lama
                        if product.stock >= quantity:
                            product.stock -= quantity
                            product.save()
                            print(f"📦 Stok {product.name} dikurangi {quantity}. Sisa: {product.stock}")
                        else:
                            raise Exception(f"Stok tidak cukup untuk {product.name}")
            
            # Bulk create order items
            if order_items_data:
                OrderItem.objects.bulk_create(order_items_data)
                print(f"✅ {len(order_items_data)} order items berhasil dibuat")
            else:
                raise Exception("Tidak ada produk yang valid untuk diproses")
            
            # Kosongkan keranjang jika user login
            if request.user.is_authenticated:
                try:
                    cart_items_to_delete = CartItem.objects.filter(cart__user=request.user)
                    deleted_count = cart_items_to_delete.count()
                    cart_items_to_delete.delete()
                    print(f"🗑️ {deleted_count} item keranjang dihapus")
                except Exception as e:
                    print(f"⚠️ Gagal menghapus keranjang: {e}")
        
        return JsonResponse({
            "success": True,
            "message": "Pesanan berhasil dibuat dan stok diperbarui",
            "order_number": order.order_number,
            "order_id": order.id,
            "total_price": total_price,
            "rental_period": f"{start_date} sampai {end_date} ({rental_days} hari)"
        })
    
    except Exception as e:
        print(f"❌ Error create_order: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return JsonResponse({
            "success": False, 
            "error": f"Terjadi kesalahan sistem: {str(e)}"
        }, status=500)
        
@login_required
def pesanan(request):
    """Halaman pesanan user - FIXED VERSION"""
    try:
        print(f"🔍 Loading orders for user: {request.user.username} (ID: {request.user.id})")
        
        # DEBUG: Cek apakah user memiliki order
        user_orders_count = Order.objects.filter(user=request.user).count()
        print(f"📊 Total orders untuk user {request.user.username}: {user_orders_count}")
        
        # OPTIMASI: Gunakan select_related dan prefetch_related dengan benar
        orders = Order.objects.filter(user=request.user).select_related(
            'user'
        ).prefetch_related(
            'items',  # Prefetch order items
            'items__product',  # Prefetch products untuk setiap item
            'items__product__category'  # Prefetch category untuk product
        ).order_by('-created_at')
        
        # Debug: Print order details
        print(f"📦 Found {orders.count()} orders for user {request.user.username}")
        
        for order in orders:
            print(f"   - Order: {order.order_number}, Status: {order.status}, Total: {order.total_price}")
            for item in order.items.all():
                product_name = item.product.name if item.product else 'No Product'
                print(f"     Item: {product_name} x {item.quantity}")
        
        # Hitung statistik - PERBAIKAN: Gunakan status yang sesuai
        total_orders = orders.count()
        pending_orders = orders.filter(status='pending').count()
        completed_orders = orders.filter(status='completed').count()  # Changed from 'delivered'
        
        print(f"📊 Stats - Total: {total_orders}, Pending: {pending_orders}, Completed: {completed_orders}")
        
        context = {
            'orders': orders,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
        }
        
        return render(request, 'iarentfashion/pesanan.html', context)
        
    except Exception as e:
        print(f"❌ Error in pesanan: {e}")
        import traceback
        traceback.print_exc()
        
        context = {
            'orders': [],
            'total_orders': 0,
            'pending_orders': 0,
            'completed_orders': 0,
        }
        return render(request, 'iarentfashion/pesanan.html', context)
     
# Tambahkan di views.py
@csrf_exempt
def test_order_api(request):
    """Endpoint untuk testing API order"""
    if request.method == 'POST':
        print("🧪 Test endpoint diakses")
        print("Headers:", dict(request.headers))
        print("Method:", request.method)
        print("User:", request.user)
        print("Authenticated:", request.user.is_authenticated)
        
        try:
            body = request.body.decode('utf-8')
            print("Body:", body)
        except:
            print("Body: Cannot decode")
        
        return JsonResponse({
            "status": "success", 
            "message": "Test endpoint bekerja",
            "user": str(request.user),
            "authenticated": request.user.is_authenticated
        })
    
    return JsonResponse({"status": "error", "message": "Method not allowed"})


@login_required
def debug_orders(request):
    """Debug endpoint untuk mengecek data pesanan"""
    user = request.user
    
    # Cek semua order untuk user ini
    all_orders = Order.objects.filter(user=user)
    
    debug_info = {
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        },
        'total_orders_in_db': all_orders.count(),
        'orders': []
    }
    
    for order in all_orders:
        order_info = {
            'id': order.id,
            'order_number': order.order_number,
            'status': order.status,
            'total_price': float(order.total_price),
            'created_at': order.created_at.isoformat(),
            'items_count': order.items.count(),
            'items': []
        }
        
        for item in order.items.all():
            item_info = {
                'product_id': item.product.id if item.product else None,
                'product_name': item.product.name if item.product else 'No Product',
                'quantity': item.quantity,
                'price': float(item.price),
                'size': item.size
            }
            order_info['items'].append(item_info)
        
        debug_info['orders'].append(order_info)
    
    return JsonResponse(debug_info)

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

@csrf_exempt
@login_required
# views.py - SIMPLE VERSION
@login_required
def cancel_order(request, order_id):
    """Simple cancel order tanpa JSON"""
    if request.method == "POST":
        try:
            order = get_object_or_404(Order, id=order_id, user=request.user)
            
            if order.status != 'pending':
                messages.error(request, "Hanya bisa membatalkan pesanan yang masih pending")
            else:
                order.status = 'cancelled'
                order.save()
                messages.success(request, "Pesanan berhasil dibatalkan")
                
        except Exception as e:
            messages.error(request, f"Gagal membatalkan: {str(e)}")
    
    return redirect('pesanan')

@login_required
def order_detail(request, order_id):
    """Halaman detail pesanan"""
    try:
        order = get_object_or_404(Order, id=order_id, user=request.user)
        order_items = order.items.all().select_related('product')
        
        context = {
            'order': order,
            'order_items': order_items,
        }
        return render(request, 'iarentfashion/order_detail.html', context)
        
    except Exception as e:
        print(f"Error in order_detail: {e}")
        messages.error(request, "Pesanan tidak ditemukan")
        return redirect('pesanan')