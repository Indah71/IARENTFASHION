// static/js/tentang.js

class TentangApp {
    constructor() {
        this.isLoggedIn = window.djangoData.isLoggedIn;
        this.urls = window.djangoData.urls;
        this.csrfToken = window.djangoData.csrfToken;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAnimations();
        this.loadWishlist();
        this.loadCart();
        console.log('Tentang App initialized');
    }

    setupEventListeners() {
        // Navbar scroll behavior
        this.setupNavbarScroll();
        
        // Initialize tooltips
        this.initTooltips();
    }

    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

        // Sequential animation for feature boxes
        const featureBoxes = document.querySelectorAll('.feature-box');
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        featureBoxes.forEach(box => {
            featureObserver.observe(box);
        });

        // Smooth page load
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    }

    setupNavbarScroll() {
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) return;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.style.transform = 'translateY(0)';
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.transition = 'transform 0.3s ease';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }

    initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
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
            this.showNotification('success', 'Berhasil!', `${product.name} berhasil ditambahkan ke wishlist!`);
        } else {
            // Produk sudah ada di wishlist
            this.showNotification('info', 'Produk Sudah Ada', 'Produk ini sudah ada di wishlist Anda!');
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
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="tentangApp.removeFromWishlist(${item.id})">
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
        this.showNotification('success', 'Berhasil!', 'Produk berhasil dihapus dari wishlist!');
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
            this.showNotification('success', 'Berhasil!', `${product.name} berhasil ditambahkan ke keranjang!`);
        } else {
            // Update quantity produk yang sudah ada
            cart[existingItemIndex].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            this.loadCart();
            
            // Tampilkan notifikasi
            this.showNotification('success', 'Berhasil!', 'Jumlah produk di keranjang telah diperbarui!');
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
                                        <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="tentangApp.updateCartQuantity(${item.id}, -1)">-</button>
                                        <span class="mx-2 small">${item.quantity}</span>
                                        <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="tentangApp.updateCartQuantity(${item.id}, 1)">+</button>
                                    </div>
                                </div>
                            </div>
                            <div class="text-end">
                                <span class="text-primary fw-bold small">Rp ${itemTotal.toLocaleString('id-ID')}</span>
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="tentangApp.removeFromCart(${item.id})">
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
        this.showNotification('success', 'Berhasil!', 'Produk berhasil dihapus dari keranjang!');
    }

    // Helper function untuk notifikasi
    showNotification(icon, title, text) {
        // Jika SweetAlert2 tersedia
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: icon,
                title: title,
                text: text,
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            // Fallback ke alert biasa
            alert(`${title}: ${text}`);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.tentangApp = new TentangApp();
});

// Global functions untuk compatibility
function addToWishlist(productId) {
    window.tentangApp.addToWishlist(productId);
}

function addToCart(productId) {
    window.tentangApp.addToCart(productId);
}

function loadWishlist() {
    window.tentangApp.loadWishlist();
}

function loadCart() {
    window.tentangApp.loadCart();
}