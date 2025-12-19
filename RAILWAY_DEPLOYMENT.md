# 🚀 Railway Deployment Checklist untuk iarent Fashion

## ✅ Konfigurasi yang Sudah Diperbaiki

### settings.py
- [x] SECRET_KEY menggunakan environment variable dengan validasi
- [x] DEBUG mode environment-based
- [x] SSL/HTTPS security headers untuk production
- [x] WhiteNoise static files optimization
- [x] Database support untuk DATABASE_URL (Railway standard)
- [x] ALLOWED_HOSTS flexible dengan environment variable
- [x] ROOT_URLCONF dan WSGI_APPLICATION path diperbaiki

### requirements.txt
- [x] dj-database-url ditambahkan untuk database URL parsing
- [x] python-decouple untuk environment variable management (opsional)
- [x] Semua dependencies yang diperlukan sudah ada

### Procfile
- [x] Menggunakan `iarent.wsgi:application` (bukan config)
- [x] collectstatic dengan --no-input
- [x] migrate command ditambahkan
- [x] gunicorn sebagai production server

---

## 📋 Persiapan Sebelum Deploy ke Railway

### 1. **Environment Variables di Railway Dashboard**
Atur variables berikut di Railway:

```
SECRET_KEY=generate-secret-key-dengan-python
DEBUG=False
ENVIRONMENT=production
ALLOWED_HOSTS=*.railway.app,yourdomain.com
DATABASE_URL=mysql://user:password@host:port/dbname
```

**Cara generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2. **Database Setup**
- Railway menyediakan MySQL service
- Gunakan DATABASE_URL dari Railway MySQL service
- Atau setup MySQL service terpisah dan copy connection string ke DATABASE_URL

### 3. **Static Files & Media**
- WhiteNoise sudah configured untuk serve static files
- Media files akan tersimpan di `/media` folder
- Untuk production, pertimbangkan cloud storage (S3, GCS, etc.)

### 4. **Test Locally Sebelum Deploy**
```bash
# Set environment variables untuk test production
export SECRET_KEY="your-secret-key"
export DEBUG=False
export ENVIRONMENT=production
export DATABASE_URL="mysql://user:pass@localhost:3306/dbname"

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Test dengan gunicorn
gunicorn iarent.wsgi:application
```

### 5. **Deploy Steps**
1. Push code ke GitHub/GitLab
2. Connect repository ke Railway
3. Set environment variables di Railway dashboard
4. Railway akan otomatis:
   - Install dependencies dari requirements.txt
   - Run Procfile command
   - Deploy aplikasi

---

## ⚠️ Hal-Hal Penting

- **Database Backup**: Setup backup sebelum production
- **Email Configuration**: Add email settings untuk production alerts
- **Logging**: Consider menambahkan centralized logging
- **Monitoring**: Setup monitoring dan alerting
- **Security**: 
  - [ ] Change SECRET_KEY di production
  - [ ] Set DEBUG=False
  - [ ] Configure CORS jika diperlukan
  - [ ] Setup firewall rules

---

## 📚 Referensi
- https://docs.railway.app/deploy/deployments
- https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/
- https://whitenoise.readthedocs.io/

