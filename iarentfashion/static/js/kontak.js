// static/js/kontak.js

class KontakApp {
    constructor() {
        this.isLoggedIn = window.djangoData.isLoggedIn;
        this.urls = window.djangoData.urls;
        this.csrfToken = window.djangoData.csrfToken;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadWishlist();
        this.loadCart();
        console.log('Kontak App initialized');
    }

    setupEventListeners() {
        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmit();
            });
        }

        // Initialize tooltips
        this.initTooltips();
    }

    initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Fungsi untuk validasi form
    validateForm(formData) {
        if (!formData.name.trim()) {
            this.showNotification('Harap masukkan nama lengkap.', 'danger');
            return false;
        }
        if (!formData.email.trim()) {
            this.showNotification('Harap masukkan email.', 'danger');
            return false;
        }
        if (!this.isValidEmail(formData.email)) {
            this.showNotification('Harap masukkan email yang valid.', 'danger');
            return false;
        }
        if (!formData.phone.trim()) {
            this.showNotification('Harap masukkan nomor telepon.', 'danger');
            return false;
        }
        if (!formData.subject) {
            this.showNotification('Harap pilih subjek pesan.', 'danger');
            return false;
        }
        if (!formData.message.trim()) {
            this.showNotification('Harap tulis pesan Anda.', 'danger');
            return false;
        }
        if (formData.message.length < 10) {
            this.showNotification('Pesan harus minimal 10 karakter.', 'danger');
            return false;
        }
        return true;
    }

    // Fungsi untuk validasi email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Handle contact form submission
    handleContactFormSubmit() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        if (this.validateForm(formData)) {
            this.sendContactMessage(formData);
        }
    }

    // Send contact message to server
    sendContactMessage(formData) {
        // Simulasi pengiriman ke backend
        // Dalam implementasi real, gunakan fetch ke endpoint Django
        console.log('Pesan dikirim ke admin:', formData);
        
        // Simpan pesan ke localStorage (simulasi database)
        const messages = JSON.parse(localStorage.getItem('adminMessages')) || [];
        const newMessage = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            timestamp: new Date().toISOString(),
            status: 'unread'
        };
        
        messages.push(newMessage);
        localStorage.setItem('adminMessages', JSON.stringify(messages));
        
        this.showNotification('Pesan berhasil dikirim! Kami akan membalas dalam 1x24 jam.', 'success');
        document.getElementById('contactForm').reset();
        
        return true;
    }

    // Fungsi untuk menampilkan notifikasi
    showNotification(message, type = 'success') {
        // Hapus notifikasi sebelumnya jika ada
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `custom-notification alert alert-${type} alert-dismissible fade show`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1050;
            min-width: 300px;
        `;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove setelah 5 detik
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // ===== FUNGSI WISHLIST (LocalStorage) =====
    addToWishlist(productId) {
        const product = this.products?.[productId];
        if (!product) return;

        // Ambil wishlist dari localStorage
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Cek apakah produk sudah ada di wishlist
        const existingItemIndex = wishlist.findIndex(item => item.id == productId);
        
        if (existingItemIndex === -1) {
            // Tambahkan produk ke wishlist
            const productToAdd = {
                id: productId,
                name: product.name,
                category: product.category,
                price: product.price,
                image: product.image
            };
            
            wishlist.push(productToAdd);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update tampilan wishlist
            this.loadWishlist();
            
            // Tampilkan notifikasi sukses
            this.showNotification(`${product.name} berhasil ditambahkan ke wishlist!`, 'success');
        } else {
            // Produk sudah ada di wishlist
            this.showNotification('Produk ini sudah ada di wishlist Anda!', 'info');
        }
    }

    loadWishlist() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const wishlistCount = document.getElementById('wishlistCount');
        const wishlistItems = document.getElementById('wishlistItems');
        
        // Update jumlah wishlist
        if (wishlistCount) wishlistCount.textContent = wishlist.length;
        
        // Update isi dropdown wishlist
        if (wishlistItems) {
            if (wishlist.length === 0) {
                wishlistItems.innerHTML = '<p class="text-muted text-center mb-0">Wishlist Anda kosong</p>';
            } else {
                let wishlistHTML = '';
                wishlist.forEach(item => {
                    wishlistHTML += `
                        <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                            <div class="d-flex align-items-center">
                                <img src="${item.image}" alt="${item.name}" class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
                                <div>
                                    <h6 class="fw-semibold mb-0 small">${item.name}</h6>
                                    <small class="text-muted">${item.category}</small>
                                </div>
                            </div>
                            <div class="text-end">
                                <span class="text-primary fw-bold small">${item.price}</span>
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="kontakApp.removeFromWishlist(${item.id})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
                wishlistItems.innerHTML = wishlistHTML;
            }
        }
    }

    removeFromWishlist(productId) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist = wishlist.filter(item => item.id != productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        this.loadWishlist();
        
        // Tampilkan notifikasi
        this.showNotification('Produk berhasil dihapus dari wishlist!', 'success');
    }

    // ===== FUNGSI KERANJANG (LocalStorage) =====
    addToCart(productId) {
        const product = this.products?.[productId];
        if (!product) return;

        // Ambil cart dari localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Cek apakah produk sudah ada di cart
        const existingItemIndex = cart.findIndex(item => item.id == productId);
        
        if (existingItemIndex === -1) {
            // Tambahkan produk baru ke cart
            const productToAdd = {
                id: productId,
                name: product.name,
                category: product.category,
                price: product.price,
                image: product.image,
                quantity: 1
            };
            
            cart.push(productToAdd);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update tampilan cart
            this.loadCart();
            
            // Tampilkan notifikasi sukses
            this.showNotification(`${product.name} berhasil ditambahkan ke keranjang!`, 'success');
        } else {
            // Update quantity produk yang sudah ada
            cart[existingItemIndex].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            this.loadCart();
            
            // Tampilkan notifikasi
            this.showNotification('Jumlah produk di keranjang telah diperbarui!', 'success');
        }
    }

    loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        
        // Hitung total item di cart
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCount) cartCount.textContent = totalItems;
        
        // Update isi dropdown cart
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="text-muted text-center mb-0">Keranjang Anda kosong</p>';
            } else {
                let cartHTML = '';
                let totalPrice = 0;
                
                cart.forEach(item => {
                    const itemTotal = this.parsePrice(item.price) * item.quantity;
                    totalPrice += itemTotal;
                    
                    cartHTML += `
                        <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                            <div class="d-flex align-items-center">
                                <img src="${item.image}" alt="${item.name}" class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
                                <div>
                                    <h6 class="fw-semibold mb-0 small">${item.name}</h6>
                                    <small class="text-muted">${item.category}</small>
                                    <div class="d-flex align-items-center mt-1">
                                        <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="kontakApp.updateCartQuantity(${item.id}, -1)">-</button>
                                        <span class="mx-2 small">${item.quantity}</span>
                                        <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="kontakApp.updateCartQuantity(${item.id}, 1)">+</button>
                                    </div>
                                </div>
                            </div>
                            <div class="text-end">
                                <span class="text-primary fw-bold small">Rp ${itemTotal.toLocaleString('id-ID')}</span>
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="kontakApp.removeFromCart(${item.id})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
                
                // Tambahkan total harga
                cartHTML += `
                    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                        <span class="fw-bold">Total:</span>
                        <span class="fw-bold text-primary">Rp ${totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                `;
                
                cartItems.innerHTML = cartHTML;
            }
        }
    }

    parsePrice(priceString) {
        // Convert price string to number (handle different formats)
        if (typeof priceString === 'number') return priceString;
        
        const numberString = priceString.toString().replace(/[^\d]/g, '');
        return parseInt(numberString) || 0;
    }

    updateCartQuantity(productId, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id == productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            
            // Hapus item jika quantity <= 0
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            this.loadCart();
        }
    }

    removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id != productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.loadCart();
        
        // Tampilkan notifikasi
        this.showNotification('Produk berhasil dihapus dari keranjang!', 'success');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.kontakApp = new KontakApp();
});

// Global functions untuk compatibility
function addToWishlist(productId) {
    window.kontakApp.addToWishlist(productId);
}

function addToCart(productId) {
    window.kontakApp.addToCart(productId);
}

function loadWishlist() {
    window.kontakApp.loadWishlist();
}

function loadCart() {
    window.kontakApp.loadCart();
}