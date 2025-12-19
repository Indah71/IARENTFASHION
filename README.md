# IARENT FASHION - Django Fashion Rental Application

## Deskripsi Proyek

IARENT FASHION adalah aplikasi web berbasis Django untuk penyewaan pakaian dan aksesori fashion. Aplikasi ini memungkinkan pengguna untuk menyewa berbagai jenis pakaian seperti dress, jas, kebaya, footwear, dan aksesoris dengan sistem keranjang belanja, ulasan produk, dan manajemen pesanan.

## Struktur Proyek

```
IARENTFASHION/
├── manage.py                    # Django management script
├── Procfile                     # Deployment configuration for Heroku
├── requirements.txt             # Python dependencies
├── config/                      # Django project configuration
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py             # Main settings file
│   ├── urls.py                 # Root URL configuration
│   ├── views.py
│   └── wsgi.py
├── iarent/                      # Main Django project directory
│   ├── manage.py
│   ├── iarent/                 # Django settings app
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── iarentfashion/          # Main application
│   │   ├── __init__.py
│   │   ├── admin.py            # Django admin configuration
│   │   ├── apps.py
│   │   ├── models.py           # Database models
│   │   ├── tests.py
│   │   ├── urls.py             # App URL patterns
│   │   ├── views.py            # View functions
│   │   ├── migrations/         # Database migrations
│   │   ├── static/             # Static files (CSS, JS, Images)
│   │   └── templates/          # HTML templates
│   ├── media/                  # User uploaded files
│   └── staticfiles/            # Collected static files
└── .venv/                      # Virtual environment
```

## Model Database

### User Model
- Custom user model dengan AbstractBaseUser
- Field: username, email, full_name, phone, address, role (customer/admin)
- Menggunakan custom UserManager

### Kategori dan Produk
- **Category**: Kategori produk (dress, jas, kebaya, dll.)
- **Size**: Ukuran produk (XS-XXL, 36-45, T/A)
- **Product**: Produk dengan relasi many-to-many ke Size
- **ProductSize**: Tabel junction untuk stok per ukuran

### Fitur Utama
- **Review**: Ulasan produk dengan rating 1-5 bintang
- **Inspiration**: Galeri inspirasi fashion
- **Cart & CartItem**: Sistem keranjang belanja
- **Order & OrderItem**: Sistem pemesanan dengan periode sewa

## Teknologi yang Digunakan

- **Backend**: Django 5.2.8
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript
- **Admin Interface**: Django Jazzmin
- **Deployment**: Gunicorn, Heroku-ready
- **Image Handling**: Pillow
- **Authentication**: Django's built-in auth dengan custom user model

## Dependencies

```
asgiref==3.11.0
Django==5.2.8
django-jazzmin==3.0.1
gunicorn==23.0.0
mysqlclient==2.2.7
packaging==25.0
pillow==12.0.0
PyMySQL==1.1.2
sqlparse==0.5.3
tzdata==2025.2
```

## Konfigurasi Database

Aplikasi menggunakan MySQL dengan konfigurasi environment variables:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('MYSQLDATABASE'),
        'USER': os.getenv('MYSQLUSER'),
        'PASSWORD': os.getenv('MYSQLPASSWORD'),
        'HOST': os.getenv('MYSQLHOST'),
        'PORT': os.getenv('MYSQLPORT'),
    }
}
```

## Fitur Aplikasi

### Untuk Customer:
- Browse produk berdasarkan kategori
- Sistem keranjang belanja
- Pemesanan dengan periode sewa
- Sistem ulasan dan rating produk
- Galeri inspirasi fashion

### Untuk Admin:
- Manajemen produk dan stok
- Manajemen pesanan
- Manajemen pengguna
- Dashboard admin dengan Jazzmin

## Template Pages

Aplikasi memiliki berbagai halaman template:
- beranda.html - Halaman utama
- detail.html - Detail produk
- dress.html, jas.html, kebaya.html, footwear.html, aksesoris.html - Kategori produk
- koleksi.html - Koleksi produk
- sewa.html - Form pemesanan
- pesanan.html - Riwayat pesanan
- review.html - Form ulasan
- login.html - Halaman login
- kontak.html - Halaman kontak
- tentang.html - Tentang kami

## Static Files

- **CSS**: Styling untuk setiap halaman
- **JavaScript**: Interaktivitas frontend
- **Images**: Gambar produk dan inspirasi

## Instalasi dan Setup

1. Clone repository
2. Buat virtual environment: `python -m venv .venv`
3. Aktivasi venv: `.venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Setup database MySQL dan konfigurasi environment variables
6. Jalankan migrations: `python manage.py migrate`
7. Buat superuser: `python manage.py createsuperuser`
8. Jalankan server: `python manage.py runserver`

## Deployment

Aplikasi siap untuk deployment di Heroku dengan Procfile yang sudah dikonfigurasi untuk Gunicorn.

## Catatan

- Model menggunakan custom user model yang kompatibel dengan Django auth
- Sistem penyewaan dengan periode start_date dan end_date
- Stok produk dikelola per ukuran melalui ProductSize model
- Admin interface menggunakan Jazzmin untuk UI yang lebih modern