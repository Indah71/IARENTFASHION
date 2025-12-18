// static/js/dress.js

class DressApp {
    constructor() {
        this.isLoggedIn = window.djangoData.isLoggedIn;
        this.products = window.djangoData.products;
        this.urls = window.djangoData.urls;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadWishlist();
        this.loadCart();
        console.log('Dress App initialized');
    }

    setupEventListeners() {
        // Event listener untuk modal keranjang
        const cartModal = document.getElementById("cartModal");
        if (cartModal) {
            cartModal.addEventListener("show.bs.modal", () => {
                this.showCart();
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

    // CSRF token untuk Django
    getCSRFToken() {
        return window.djangoData.csrfToken;
    }

    // FUNCTION CEK LOGIN
    checkLoginBeforeAction(action, callback) {
        if (!this.isLoggedIn) {
            alert('⚠️ Silakan login terlebih dahulu untuk ' + action);
            window.location.href = this.urls.login + '?next=' + encodeURIComponent(window.location.pathname);
            return false;
        }
        if (callback) callback();
        return true;
    }

    // Navigasi ke Detail Produk
    goToDetail(productId) {
        console.log("Navigating to detail:", productId);
        window.location.href = this.urls.productDetail.replace('0', productId);
    }

    // TAMBAH KE KERANJANG - DENGAN PROTEKSI LOGIN (SERVER)
    addToCart(productId) {
        const event = window.event;
        if (event) {
            event.stopPropagation(); // Prevent card click
        }

        // CEK LOGIN DULU!
        if (!this.isLoggedIn) {
            alert('⚠️ Silakan login terlebih dahulu untuk menambahkan produk ke keranjang!');
            window.location.href = this.urls.login + '?next=' + encodeURIComponent(window.location.pathname);
            return;
        }

        // Ambil data produk
        const product = this.products[productId];

        if (!product) {
            console.error("Product not found:", productId);
            return;
        }

        // Cek stok
        if (product.stock <= 0) {
            alert('❌ Maaf, produk ini sedang habis stok.');
            return;
        }

        // Kirim ke backend API
        this.sendAddToCartRequest(productId, product, event);
    }

    sendAddToCartRequest(productId, product, event) {
        fetch(this.urls.apiCartAdd, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCSRFToken()
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        })
        .then(response => {
            if (response.status === 401) {
                alert('⚠️ Sesi Anda telah berakhir. Silakan login kembali.');
                window.location.href = this.urls.login + '?next=' + encodeURIComponent(window.location.pathname);
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (data && data.status === 'success') {
                this.handleAddToCartSuccess(product, event);
            } else if (data) {
                alert('❌ ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('❌ Terjadi kesalahan saat menambahkan ke keranjang');
        });
    }

    handleAddToCartSuccess(product, event) {
        alert(`✅ ${product.name}\nBerhasil ditambahkan ke keranjang!`);

        // Visual feedback pada button
        const btn = event?.target.closest(".btn-icon");
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-circle"></i>';
            btn.style.backgroundColor = "#28a745";
            btn.style.color = "white";
            btn.style.borderColor = "#28a745";

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.backgroundColor = "";
                btn.style.color = "";
                btn.style.borderColor = "";
            }, 2000);
        }
    }

    // TAMBAH KE WISHLIST - DENGAN PROTEKSI LOGIN (SERVER)
    addToWishlist(productId) {
        const event = window.event;
        if (event) {
            event.stopPropagation();
        }

        // CEK LOGIN DULU!
        if (!this.isLoggedIn) {
            alert('⚠️ Silakan login terlebih dahulu untuk menambahkan ke wishlist!');
            window.location.href = this.urls.login + '?next=' + encodeURIComponent(window.location.pathname);
            return;
        }

        fetch(this.urls.apiWishlistAdd, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCSRFToken()
            },
            body: JSON.stringify({
                product_id: productId
            })
        })
        .then(response => {
            if (response.status === 401) {
                alert('⚠️ Sesi Anda telah berakhir. Silakan login kembali.');
                window.location.href = this.urls.login + '?next=' + encodeURIComponent(window.location.pathname);
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (data && data.status === 'success') {
                alert('✅ ' + data.message);
            } else if (data) {
                alert('❌ ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('❌ Terjadi kesalahan');
        });
    }

    // Tampilkan isi keranjang di modal (SERVER)
    showCart() {
        if (!this.isLoggedIn) {
            this.renderLoginRequired();
            return;
        }

        this.fetchCartData();
    }

    renderLoginRequired() {
        const cartContent = document.getElementById("cart-content");
        if (cartContent) {
            cartContent.innerHTML = `
                <div class="cart-empty">
                    <i class="bi bi-lock"></i>
                    <h5>Login Required</h5>
                    <p>Silakan login untuk melihat keranjang Anda</p>
                    <a href="${this.urls.login}" class="btn btn-dark rounded-pill mt-3">Login Sekarang</a>
                </div>
            `;
        }
    }

    fetchCartData() {
        fetch(this.urls.apiCartItems)
            .then(response => {
                if (response.status === 401) {
                    window.location.href = this.urls.login;
                    return null;
                }
                return response.json();
            })
            .then(data => {
                this.renderCartModal(data);
            })
            .catch(error => {
                console.error('Error:', error);
                this.renderCartModal({ items: [] });
            });
    }

    renderCartModal(data) {
        const cartContent = document.getElementById("cart-content");
        const totalItems = document.getElementById("cart-total-items");

        if (!cartContent) return;

        if (!data.items || data.items.length === 0) {
            cartContent.innerHTML = `
                <div class="cart-empty">
                    <i class="bi bi-cart-x"></i>
                    <h5>Keranjang Kosong</h5>
                    <p>Belum ada item di keranjang Anda</p>
                </div>
            `;
            if (totalItems) totalItems.textContent = "0 items";
        } else {
            let cartHTML = "";
            data.items.forEach((item, index) => {
                cartHTML += `
                    <div class="cart-item">
                        <div class="row align-items-center">
                            <div class="col-2">
                                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                            </div>
                            <div class="col-6">
                                <h6 class="fw-semibold mb-1">${item.name}</h6>
                                <small class="text-muted">${item.price}</small>
                                <div class="mt-1">
                                    <small class="text-muted">Qty: ${item.quantity}</small>
                                </div>
                            </div>
                            <div class="col-4 text-end">
                                <button class="remove-item" onclick="dressApp.removeFromCartServer(${item.id})" title="Hapus dari keranjang">
                                    <i class="bi bi-trash"></i> Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            cartContent.innerHTML = cartHTML;
            if (totalItems) totalItems.textContent = `${data.items.length} item${data.items.length > 1 ? 's' : ''}`;
        }
    }

    // Hapus item dari keranjang (SERVER)
    removeFromCartServer(productId) {
        if (!confirm('Hapus item ini dari keranjang?')) {
            return;
        }

        fetch(this.urls.apiCartRemove, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCSRFToken()
            },
            body: JSON.stringify({
                product_id: productId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('✅ ' + data.message);
                this.showCart();
            } else {
                alert('❌ ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('❌ Terjadi kesalahan');
        });
    }

    // Lanjut belanja
    continueShopping() {
        const cartModal = bootstrap.Modal.getInstance(document.getElementById("cartModal"));
        if (cartModal) {
            cartModal.hide();
        }
    }

    // Checkout - DENGAN PROTEKSI LOGIN
    checkout() {
        if (!this.isLoggedIn) {
            alert('⚠️ Silakan login terlebih dahulu untuk melakukan checkout!');
            window.location.href = this.urls.login + '?next=' + encodeURIComponent(this.urls.checkout);
            return;
        }

        // Redirect ke halaman checkout
        window.location.href = this.urls.checkout;
    }

    // ===== FUNGSI WISHLIST (LocalStorage) =====
    addToWishlistLocal(productId) {
        const product = this.products[productId];
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
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="dressApp.removeFromWishlist(${item.id})">
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
    addToCartLocal(productId) {
        const product = this.products[productId];
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
                                        <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="dressApp.updateCartQuantity(${item.id}, -1)">-</button>
                                        <span class="mx-2 small">${item.quantity}</span>
                                        <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="dressApp.updateCartQuantity(${item.id}, 1)">+</button>
                                    </div>
                                </div>
                            </div>
                            <div class="text-end">
                                <span class="text-primary fw-bold small">Rp ${itemTotal.toLocaleString('id-ID')}</span>
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="dressApp.removeFromCartLocal(${item.id})">
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

    removeFromCartLocal(productId) {
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

    // Function untuk redirect ke login
    redirectToLogin(reason) {
        localStorage.setItem('loginReason', reason);
        window.location.href = this.urls.login;
    }

    handleSewaClick() {
        this.redirectToLogin('sewa');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dressApp = new DressApp();
});

// Global functions untuk HTML onclick attributes
function goToDetail(productId) {
    window.dressApp.goToDetail(productId);
}

function addToCart(productId) {
    window.dressApp.addToCart(productId);
}

function addToWishlist(productId) {
    window.dressApp.addToWishlist(productId);
}

function addToWishlistLocal(productId) {
    window.dressApp.addToWishlistLocal(productId);
}

function addToCartLocal(productId) {
    window.dressApp.addToCartLocal(productId);
}

function continueShopping() {
    window.dressApp.continueShopping();
}

function checkout() {
    window.dressApp.checkout();
}

function handleSewaClick() {
    window.dressApp.handleSewaClick();
}

function showCart() {
    window.dressApp.showCart();
}

function removeFromCart(productId) {
    window.dressApp.removeFromCartLocal(productId);
}