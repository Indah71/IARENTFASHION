// static/js/footwear.js

class FootwearApp {
    constructor() {
        this.isLoggedIn = window.djangoData.isLoggedIn;
        this.products = window.djangoData.products;
        this.urls = window.djangoData.urls;
        this.csrfToken = window.djangoData.csrfToken;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadWishlist();
        this.loadCart();
        console.log('Footwear App initialized');
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

        // Kirim ke backend API
        this.sendAddToCartRequest(productId, product, event);
    }

    sendAddToCartRequest(productId, product, event) {
        fetch(this.urls.apiCartAdd, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.csrfToken
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
            if (data && data.success) {
                this.handleAddToCartSuccess(product, data.cart_count, event);
            } else if (data) {
                alert('❌ ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('❌ Terjadi kesalahan saat menambahkan ke keranjang');
        });
    }

    handleAddToCartSuccess(product, cartCount, event) {
        alert(`✅ ${product.name}\nBerhasil ditambahkan ke keranjang!`);

        // Update cart count
        this.updateCartCount(cartCount);

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

    // Update cart count
    updateCartCount(count) {
        const cartCountElements = document.querySelectorAll('#cartCount, .cart-count');
        cartCountElements.forEach(element => {
            if (count !== undefined) {
                element.textContent = count;
                element.style.display = count > 0 ? 'inline' : 'none';
            }
        });
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
                'X-CSRFToken': this.csrfToken
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
            if (data && data.success) {
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
        const cartTotalItems = document.getElementById("cart-total-items");
        const cartTotalPrice = document.getElementById("cart-total-price");

        if (!cartContent) return;

        if (!data.items || data.items.length === 0) {
            cartContent.innerHTML = `
                <div class="cart-empty text-center py-5">
                    <i class="bi bi-cart-x display-1 text-muted"></i>
                    <h5 class="mt-3">Keranjang Kosong</h5>
                    <p class="text-muted">Belum ada produk di keranjang Anda</p>
                </div>
            `;
            if (cartTotalItems) cartTotalItems.textContent = "0 items";
            if (cartTotalPrice) cartTotalPrice.textContent = "Rp 0";
        } else {
            let cartHTML = "";
            let totalItems = 0;
            let totalPrice = 0;

            data.items.forEach((item) => {
                const itemTotal = item.price * item.quantity;
                totalItems += item.quantity;
                totalPrice += itemTotal;

                cartHTML += `
                    <div class="cart-item border-bottom pb-3 mb-3">
                        <div class="row align-items-center">
                            <div class="col-3">
                                <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                            </div>
                            <div class="col-6">
                                <h6 class="mb-1">${item.name}</h6>
                                ${item.size ? `<p class="text-muted small mb-1">Ukuran: ${item.size}</p>` : ''}
                                <p class="text-primary fw-bold mb-1">Rp ${item.price.toLocaleString('id-ID')}</p>
                                <div class="quantity-controls d-flex align-items-center">
                                    <button class="btn btn-sm btn-outline-secondary" onclick="footwearApp.updateQuantity(${item.cart_item_id}, ${item.quantity - 1})">-</button>
                                    <span class="mx-3">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary" onclick="footwearApp.updateQuantity(${item.cart_item_id}, ${item.quantity + 1})">+</button>
                                </div>
                            </div>
                            <div class="col-3 text-end">
                                <p class="fw-bold text-primary">Rp ${itemTotal.toLocaleString('id-ID')}</p>
                                <button class="btn btn-sm btn-outline-danger" onclick="footwearApp.removeFromCart(${item.cart_item_id})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });

            cartContent.innerHTML = cartHTML;
            if (cartTotalItems) cartTotalItems.textContent = `${totalItems} ${totalItems > 1 ? 'items' : 'item'}`;
            if (cartTotalPrice) cartTotalPrice.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
        }
    }

    // Update quantity item di keranjang
    updateQuantity(cartItemId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(cartItemId);
            return;
        }

        fetch(this.urls.apiCartUpdate, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.csrfToken
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
        });
    }

    // Hapus item dari keranjang (SERVER)
    removeFromCart(cartItemId) {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini dari keranjang?')) {
            return;
        }

        fetch(this.urls.apiCartRemove, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.csrfToken
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
            alert('✅ ' + data.message);
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
            window.location.href = this.urls.login + '?next=' + encodeURIComponent(this.urls.sewa);
            return;
        }

        // Redirect ke halaman checkout
        window.location.href = this.urls.sewa;
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
                                    <small class="text-muted">Footwear</small>
                                </div>
                            </div>
                            <div class="text-end">
                                <span class="text-primary fw-bold small">${item.price}</span>
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="footwearApp.removeFromWishlist(${item.id})">
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
                                    <small class="text-muted">Footwear</small>
                                    <div class="d-flex align-items-center mt-1">
                                        <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="footwearApp.updateCartQuantityLocal(${item.id}, -1)">-</button>
                                        <span class="mx-2 small">${item.quantity}</span>
                                        <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="footwearApp.updateCartQuantityLocal(${item.id}, 1)">+</button>
                                    </div>
                                </div>
                            </div>
                            <div class="text-end">
                                <span class="text-primary fw-bold small">Rp ${itemTotal.toLocaleString('id-ID')}</span>
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="footwearApp.removeFromCartLocal(${item.id})">
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

    updateCartQuantityLocal(productId, change) {
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
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.footwearApp = new FootwearApp();
});

// Global functions untuk HTML onclick attributes
function goToDetail(productId) {
    window.footwearApp.goToDetail(productId);
}

function addToCart(productId) {
    window.footwearApp.addToCart(productId);
}

function addToWishlist(productId) {
    window.footwearApp.addToWishlist(productId);
}

function addToWishlistLocal(productId) {
    window.footwearApp.addToWishlistLocal(productId);
}

function addToCartLocal(productId) {
    window.footwearApp.addToCartLocal(productId);
}

function continueShopping() {
    window.footwearApp.continueShopping();
}

function checkout() {
    window.footwearApp.checkout();
}

function showCart() {
    window.footwearApp.showCart();
}