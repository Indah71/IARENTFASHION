// static/js/jas.js

class JasApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('Jas App initialized');
        this.setupEventListeners();
        this.loadCartCount();
    }

    setupEventListeners() {
        // Event delegation untuk card produk
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (card && !e.target.closest('.btn')) {
                // Cari product ID dari card
                const buttons = card.querySelectorAll('[onclick*="goToDetail"]');
                if (buttons.length > 0) {
                    const onclickAttr = buttons[0].getAttribute('onclick');
                    const match = onclickAttr.match(/goToDetail\((\d+)\)/);
                    if (match) {
                        const productId = parseInt(match[1]);
                        this.goToDetail(productId);
                    }
                }
            }
        });

        // Event untuk modal cart
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.addEventListener('show.bs.modal', () => {
                this.showCart();
            });
        }
    }

    // CSRF token untuk Django
    getCSRFToken() {
        return window.djangoData.csrfToken;
    }

    // FUNCTION CEK LOGIN
    checkLoginBeforeAction(action) {
        if (!window.djangoData.isLoggedIn) {
            alert('⚠️ Silakan login terlebih dahulu untuk ' + action);
            window.location.href = window.djangoData.urls.login + '?next=' + encodeURIComponent(window.location.pathname);
            return false;
        }
        return true;
    }

    // FUNCTION PERGI KE DETAIL PRODUK
    goToDetail(productId) {
        console.log('Navigating to product detail:', productId);
        
        // Redirect ke halaman detail produk
        window.location.href = `/product/${productId}/`;
    }

    // TAMBAH KE KERANJANG
    addToCart(productId, size = null) {
        // Cegah event bubbling
        if (window.event) {
            window.event.stopPropagation();
            window.event.preventDefault();
        }

        // CEK LOGIN DULU
        if (!this.checkLoginBeforeAction('menambahkan produk ke keranjang')) {
            return;
        }

        // Kirim request ke server
        this.sendAddToCartRequest(productId, size);
    }

    sendAddToCartRequest(productId, size) {
        fetch(window.djangoData.urls.apiCartAdd, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCSRFToken()
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1,
                size: size
            })
        })
        .then(response => {
            if (response.status === 401) {
                throw new Error('SESSION_EXPIRED');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                this.handleAddToCartSuccess(data.message, data.cart_count);
            } else {
                this.showError(data.message || 'Gagal menambahkan ke keranjang');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.message === 'SESSION_EXPIRED') {
                this.showSessionExpired();
            } else {
                this.showError('Terjadi kesalahan saat menambahkan ke keranjang');
            }
        });
    }

    handleAddToCartSuccess(message, cartCount) {
        this.showSuccess(message);
        this.updateCartCount(cartCount);
        
        // Visual feedback pada button
        const btn = window.event?.target?.closest(".btn");
        if (btn) {
            this.animateButtonSuccess(btn);
        }
    }

    animateButtonSuccess(btn) {
        const originalHTML = btn.innerHTML;
        const originalBg = btn.style.backgroundColor;
        const originalColor = btn.style.color;
        const originalBorder = btn.style.borderColor;

        btn.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        btn.style.backgroundColor = "#28a745";
        btn.style.color = "white";
        btn.style.borderColor = "#28a745";
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.backgroundColor = originalBg;
            btn.style.color = originalColor;
            btn.style.borderColor = originalBorder;
            btn.disabled = false;
        }, 2000);
    }

    // Tampilkan isi keranjang di modal
    showCart() {
        if (!window.djangoData.isLoggedIn) {
            this.renderLoginRequired();
            return;
        }

        this.fetchCartData();
    }

    renderLoginRequired() {
        const cartContent = document.getElementById("cart-content");
        if (cartContent) {
            cartContent.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-lock display-4 text-muted"></i>
                    <h5 class="mt-3">Login Diperlukan</h5>
                    <p class="text-muted">Silakan login untuk melihat keranjang Anda</p>
                    <a href="${window.djangoData.urls.login}" class="btn btn-dark rounded-pill mt-2">Login Sekarang</a>
                </div>
            `;
        }
    }

    fetchCartData() {
        fetch(window.djangoData.urls.apiCartItems)
            .then(response => {
                if (response.status === 401) {
                    this.renderLoginRequired();
                    return null;
                }
                return response.json();
            })
            .then(cartData => {
                if (cartData) {
                    this.renderCartContent(cartData);
                }
            })
            .catch(error => {
                console.error('Error fetching cart:', error);
                this.renderCartContent({ items: [] });
            });
    }

    renderCartContent(cartData) {
        const cartContent = document.getElementById("cart-content");
        const cartTotalItems = document.getElementById("cart-total-items");
        const cartTotalPrice = document.getElementById("cart-total-price");

        if (!cartContent) return;

        if (!cartData || !cartData.items || cartData.items.length === 0) {
            cartContent.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-cart-x display-1 text-muted"></i>
                    <h5 class="mt-3">Keranjang Kosong</h5>
                    <p class="text-muted">Belum ada produk di keranjang Anda</p>
                </div>
            `;
            if (cartTotalItems) cartTotalItems.textContent = "0 items";
            if (cartTotalPrice) cartTotalPrice.textContent = "Rp 0";
            return;
        }

        let totalItems = 0;
        let totalPrice = 0;

        const cartItemsHTML = cartData.items.map(item => {
            const itemTotal = item.price * item.quantity;
            totalItems += item.quantity;
            totalPrice += itemTotal;

            return `
                <div class="cart-item border-bottom pb-3 mb-3">
                    <div class="row align-items-center">
                        <div class="col-3">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" style="height: 80px; object-fit: cover;">
                        </div>
                        <div class="col-6">
                            <h6 class="mb-1">${item.name}</h6>
                            ${item.size ? `<p class="text-muted small mb-1">Ukuran: ${item.size}</p>` : ''}
                            <p class="text-primary fw-bold mb-1">Rp ${item.price.toLocaleString('id-ID')}</p>
                            <div class="quantity-controls d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary" onclick="jasApp.updateQuantity(${item.cart_item_id}, ${item.quantity - 1})">-</button>
                                <span class="mx-3">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary" onclick="jasApp.updateQuantity(${item.cart_item_id}, ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div class="col-3 text-end">
                            <p class="fw-bold text-primary">Rp ${itemTotal.toLocaleString('id-ID')}</p>
                            <button class="btn btn-sm btn-outline-danger" onclick="jasApp.removeFromCart(${item.cart_item_id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        cartContent.innerHTML = cartItemsHTML;
        if (cartTotalItems) cartTotalItems.textContent = `${totalItems} ${totalItems > 1 ? 'items' : 'item'}`;
        if (cartTotalPrice) cartTotalPrice.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    }

    // Update quantity item di keranjang
    updateQuantity(cartItemId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(cartItemId);
            return;
        }

        fetch(window.djangoData.urls.apiCartUpdate, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCSRFToken()
            },
            body: JSON.stringify({
                cart_item_id: cartItemId,
                quantity: newQuantity
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showCart(); // Refresh cart display
                this.updateCartCount(data.cart_count);
            }
        })
        .catch(error => {
            console.error('Error updating quantity:', error);
            this.showError('Gagal memperbarui quantity');
        });
    }

    // Hapus item dari keranjang
    removeFromCart(cartItemId) {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini dari keranjang?')) {
            return;
        }

        fetch(window.djangoData.urls.apiCartRemove, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCSRFToken()
            },
            body: JSON.stringify({
                cart_item_id: cartItemId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showCart(); // Refresh cart display
                this.updateCartCount(data.cart_count);
                this.showSuccess('Produk berhasil dihapus dari keranjang');
            }
        })
        .catch(error => {
            console.error('Error removing item:', error);
            this.showError('Gagal menghapus produk dari keranjang');
        });
    }

    // Update cart count di navbar
    updateCartCount(count) {
        const cartCountElements = document.querySelectorAll('#cartCount');
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline' : 'none';
        });
    }

    // Load cart count dari server
    loadCartCount() {
        if (window.djangoData.isLoggedIn) {
            // Anda bisa menambahkan API untuk mengambil cart count
            // Untuk sementara, set ke 0
            this.updateCartCount(0);
        }
    }

    // TAMBAH KE WISHLIST
    addToWishlist(productId) {
        // Cegah event bubbling
        if (window.event) {
            window.event.stopPropagation();
            window.event.preventDefault();
        }

        if (!this.checkLoginBeforeAction('menambahkan ke wishlist')) {
            return;
        }

        fetch(window.djangoData.urls.apiWishlistAdd, {
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
                throw new Error('SESSION_EXPIRED');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.success) {
                this.showSuccess(data.message);
            } else if (data) {
                this.showError(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.message === 'SESSION_EXPIRED') {
                this.showSessionExpired();
            } else {
                this.showError('Terjadi kesalahan');
            }
        });
    }

    // Fungsi lanjut belanja
    continueShopping() {
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (cartModal) {
            cartModal.hide();
        }
    }

    // Fungsi checkout
    checkout() {
        if (!window.djangoData.isLoggedIn) {
            this.checkLoginBeforeAction('melakukan checkout');
            return;
        }
        window.location.href = window.djangoData.urls.sewa;
    }

    // UTILITY FUNCTIONS
    showSuccess(message) {
        alert('✅ ' + message);
    }

    showError(message) {
        alert('❌ ' + message);
    }

    showSessionExpired() {
        alert('⚠️ Sesi Anda telah berakhir. Silakan login kembali.');
        window.location.href = window.djangoData.urls.login + '?next=' + encodeURIComponent(window.location.pathname);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.jasApp = new JasApp();
    console.log('Jas App loaded successfully');
});

// Global functions untuk HTML onclick attributes
function goToDetail(productId) {
    if (window.jasApp) {
        window.jasApp.goToDetail(productId);
    } else {
        // Fallback jika app belum loaded
        console.log('Fallback: Going to product detail:', productId);
        window.location.href = `/product/${productId}/`;
    }
}

function addToCart(productId) {
    if (window.jasApp) {
        window.jasApp.addToCart(productId);
    } else {
        // Fallback sederhana
        if (confirm('Tambahkan produk ke keranjang?')) {
            alert('Produk berhasil ditambahkan ke keranjang!');
        }
    }
}

function addToWishlist(productId) {
    if (window.jasApp) {
        window.jasApp.addToWishlist(productId);
    } else {
        // Fallback sederhana
        alert('Fitur wishlist akan tersedia setelah login!');
    }
}

function continueShopping() {
    if (window.jasApp) {
        window.jasApp.continueShopping();
    }
}

function checkout() {
    if (window.jasApp) {
        window.jasApp.checkout();
    } else {
        window.location.href = '/sewa/';
    }
}

// Fallback untuk card click (jika ada masalah dengan event delegation)
document.addEventListener('DOMContentLoaded', function() {
    // Backup event listener untuk card click
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Jika yang diklik bukan button, cari product ID
            if (!e.target.closest('.btn')) {
                const buttons = this.querySelectorAll('[onclick*="goToDetail"]');
                if (buttons.length > 0) {
                    const onclickAttr = buttons[0].getAttribute('onclick');
                    const match = onclickAttr.match(/goToDetail\((\d+)\)/);
                    if (match) {
                        const productId = parseInt(match[1]);
                        goToDetail(productId);
                    }
                }
            }
        });
    });
});