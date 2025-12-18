// class IARentApp {
//     constructor() {
//         this.init();
//     }

//     init() {
//         this.isLoggedIn = window.djangoData?.isLoggedIn || false;
//         this.urls = window.djangoData?.urls || {};
//         this.csrfToken = window.djangoData?.csrfToken || this.getCookie('csrftoken');

//         console.log('🛒 IA Rent Fashion App siap!', { 
//             loggedIn: this.isLoggedIn,
//             urls: this.urls 
//         });

//         this.updateCartCount();
//         this.updateWishlistCount();
//         this.setupEventListeners();
//         this.setupCartModal();
//     }

//     getCookie(name) {
//         let value = null;
//         if (document.cookie && document.cookie !== '') {
//             document.cookie.split(';').forEach(cookie => {
//                 const c = cookie.trim();
//                 if (c.startsWith(name + '=')) {
//                     value = decodeURIComponent(c.substring(name.length + 1));
//                 }
//             });
//         }
//         return value;
//     }

//     setupEventListeners() {
//         document.addEventListener('click', (e) => {
//             const card = e.target.closest('.product-card');
//             if (card && !e.target.closest('button, a, .btn, .bi')) {
//                 const link = card.querySelector('a[href*="/product/"]') || card.closest('a');
//                 if (link) {
//                     e.preventDefault();
//                     window.location.href = link.href;
//                 }
//             }
//         });
//     }

//     // SETUP MODAL KERANJANG
//     setupCartModal() {
//         const modal = document.getElementById('cartModal');
//         if (modal) {
//             modal.addEventListener('show.bs.modal', () => {
//                 console.log('🔓 Modal cart dibuka - memuat data...');
//                 this.loadCartIntoModal();
//             });
//         } else {
//             console.error('❌ Modal cart tidak ditemukan!');
//         }
//     }

//     // LOAD CART KE MODAL - VERSI PERBAIKI
//     loadCartIntoModal() {
//         const container = document.getElementById('cart-content');
//         const totalItemsEl = document.getElementById('cart-total-items');
//         const totalPriceEl = document.getElementById('cart-total-price');
//         const checkoutBtn = document.getElementById('checkout-btn');
        
//         if (!container) {
//             console.error('❌ Container cart-content tidak ditemukan!');
//             return;
//         }

//         console.log('🛒 Memulai load cart ke modal...');

//         // Tampilkan loading
//         container.innerHTML = `
//             <div class="text-center py-4">
//                 <div class="spinner-border text-primary" role="status">
//                     <span class="visually-hidden">Loading...</span>
//                 </div>
//                 <p class="mt-2 text-muted">Memuat keranjang...</p>
//             </div>`;

//         if (!this.isLoggedIn) {
//             setTimeout(() => {
//                 container.innerHTML = `
//                     <div class="text-center py-5">
//                         <i class="bi bi-lock-fill display-1 text-muted"></i>
//                         <p class="mt-3">Login untuk melihat keranjang</p>
//                         <a href="${this.urls.login}" class="btn btn-primary">Login Sekarang</a>
//                     </div>`;
//                 if (totalItemsEl) totalItemsEl.textContent = '0 items';
//                 if (totalPriceEl) totalPriceEl.textContent = 'Rp 0';
//                 if (checkoutBtn) checkoutBtn.disabled = true;
//             }, 500);
//             return;
//         }

//         // Fetch data cart dari server
//         const apiUrl = this.urls.apiCartItems || '/api/cart/items/';
//         console.log(`📡 Fetching cart dari: ${apiUrl}`);
        
//         fetch(apiUrl)
//             .then(r => {
//                 console.log(`📡 Response status: ${r.status}`);
//                 if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
//                 return r.json();
//             })
//             .then(data => {
//                 console.log('✅ Data cart diterima:', data);
                
//                 if (!data.success) {
//                     console.error('❌ API response tidak success:', data);
//                     container.innerHTML = `
//                         <div class="alert alert-danger text-center">
//                             <i class="bi bi-exclamation-triangle"></i>
//                             <p class="mb-0">Gagal memuat keranjang</p>
//                             <small class="text-muted">${data.error || 'Unknown error'}</small>
//                         </div>`;
//                     return;
//                 }

//                 if (!data.items || data.items.length === 0) {
//                     // Cart kosong
//                     container.innerHTML = `
//                         <div class="text-center py-5 text-muted">
//                             <i class="bi bi-cart-x display-1"></i>
//                             <p class="mt-3">Keranjang kosong</p>
//                             <p class="text-muted small">Silakan tambahkan produk ke keranjang Anda</p>
//                         </div>`;
                    
//                     if (totalItemsEl) totalItemsEl.textContent = '0 items';
//                     if (totalPriceEl) totalPriceEl.textContent = 'Rp 0';
//                     if (checkoutBtn) checkoutBtn.disabled = true;
//                     return;
//                 }

//                 // Tampilkan items di cart
//                 let html = '';
//                 let totalItems = 0;
//                 let totalPrice = 0;

//                 data.items.forEach(item => {
//                     const subtotal = item.price * item.quantity;
//                     totalItems += item.quantity;
//                     totalPrice += subtotal;

//                     html += `
//                         <div class="cart-item-card border rounded bg-white shadow-sm mb-3" data-item-id="${item.id}">
//                             <div class="p-3 d-flex align-items-center gap-3">
//                                 <img src="${item.image}" 
//                                     class="rounded" 
//                                     style="width: 70px; height: 70px; object-fit: cover;" 
//                                     alt="${item.name}"
//                                     onerror="this.src='/static/img/no-image.jpg'">
//                                 <div class="flex-grow-1">
//                                     <h6 class="mb-1 fw-bold text-dark">${item.name}</h6>
//                                     <small class="text-muted d-block">
//                                         Size: <strong>${item.size || 'M'}</strong> • 
//                                         Qty: <strong>${item.quantity}</strong>
//                                     </small>
//                                     <p class="mb-0 text-primary fw-bold">
//                                         Rp ${subtotal.toLocaleString('id-ID')}
//                                     </p>
//                                 </div>
//                                 <button class="btn btn-sm btn-outline-danger remove-from-cart-modal" 
//                                         data-item-id="${item.id}"
//                                         data-item-name="${item.name}"
//                                         title="Hapus dari keranjang">
//                                     <i class="bi bi-trash"></i>
//                                 </button>
//                             </div>
//                         </div>
//                     `;
//                 });

//                 container.innerHTML = html;
                
//                 // Update summary
//                 if (totalItemsEl) totalItemsEl.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
//                 if (totalPriceEl) totalPriceEl.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
//                 if (checkoutBtn) checkoutBtn.disabled = false;

//                 // Attach event listeners untuk tombol hapus
//                 this.attachCartModalEventListeners();
                
//                 console.log('✅ Cart loaded successfully! Items:', totalItems);
//             })
//             .catch((err) => {
//                 console.error('❌ Error loading cart:', err);
//                 container.innerHTML = `
//                     <div class="alert alert-danger text-center">
//                         <i class="bi bi-exclamation-triangle"></i>
//                         <p class="mb-0">Gagal memuat keranjang</p>
//                         <small class="text-muted">Silakan refresh halaman</small>
//                         <br>
//                         <small class="text-muted">Error: ${err.message}</small>
//                     </div>`;
//             });

            
//     }


//     // ATTACH EVENT LISTENERS UNTUK TOMBOL DI MODAL
//     attachCartModalEventListeners() {
//         const container = document.getElementById('cart-content');
//         if (!container) {
//             console.error('❌ Container tidak ditemukan untuk attach events');
//             return;
//         }

//         // Gunakan event delegation untuk handle tombol hapus
//         container.addEventListener('click', (e) => {
//             if (e.target.closest('.remove-from-cart-modal')) {
//                 e.preventDefault();
//                 e.stopPropagation();
                
//                 const button = e.target.closest('.remove-from-cart-modal');
//                 const itemId = button.getAttribute('data-item-id');
//                 const itemName = button.getAttribute('data-item-name') || 'Item';
//                 const itemCard = button.closest('.cart-item-card');
                
//                 console.log('🗑️ Tombol hapus diklik! Item:', itemName, 'ID:', itemId);
                
//                 this.removeFromCartModal(itemId, itemName, itemCard);
//             }
//         });

//         console.log('✅ Event listeners attached untuk tombol hapus');
//     }

//     // HAPUS ITEM DARI CART (MODAL VERSION)
//     removeFromCartModal(itemId, itemName, itemElement) {
//         if (!this.requireLogin("menghapus dari keranjang")) return;

//         // Konfirmasi hapus
//         const confirmMessage = `Hapus "${itemName}" dari keranjang?`;
        
//         if (confirm(confirmMessage)) {
//             this.processRemoveFromCart(itemId, itemElement);
//         }
//     }

//     // PROSES HAPUS DARI CART
//     processRemoveFromCart(itemId, itemElement) {
//         const apiUrl = this.urls.apiCartRemove || '/api/cart/remove/';
//         console.log(`🗑️ Removing item ${itemId} dari ${apiUrl}`);
        
//         fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': this.csrfToken
//             },
//             body: JSON.stringify({ item_id: parseInt(itemId) })
//         })
//         .then(r => {
//             if (!r.ok) throw new Error('Network error');
//             return r.json();
//         })
//         .then(data => {
//             console.log('✅ Remove response:', data);
            
//             if (data.success) {
//                 this.showToast('success', 'Berhasil!', 'Item dihapus dari keranjang');
                
//                 // Update cart count
//                 this.updateCartCount(data.cart_count);
                
//                 // Hapus elemen dari modal dengan animasi
//                 if (itemElement) {
//                     itemElement.style.transition = 'all 0.3s ease';
//                     itemElement.style.opacity = '0';
//                     itemElement.style.transform = 'translateX(-100%)';
                    
//                     setTimeout(() => {
//                         itemElement.remove();
                        
//                         // Reload modal jika tidak ada item lagi
//                         const remainingItems = document.querySelectorAll('.cart-item-card');
//                         if (remainingItems.length === 0) {
//                             this.loadCartIntoModal();
//                         }
//                     }, 300);
//                 } else {
//                     // Fallback: reload modal
//                     this.loadCartIntoModal();
//                 }
//             } else {
//                 this.showToast('error', 'Gagal!', data.message || 'Gagal menghapus item');
//             }
//         })
//         .catch((err) => {
//             console.error('❌ Error removing item:', err);
//             this.showToast('error', 'Error!', 'Gagal terhubung ke server');
//         });
//     }

//     requireLogin(action = "melakukan aksi ini") {
//         if (this.isLoggedIn) return true;

//         if (window.Swal) {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Login Diperlukan',
//                 text: `Silakan login terlebih dahulu untuk ${action}`,
//                 confirmButtonText: 'Login Sekarang',
//                 confirmButtonColor: '#f85a87',
//                 allowOutsideClick: false
//             }).then(() => {
//                 const next = encodeURIComponent(window.location.pathname + window.location.search);
//                 window.location.href = `${this.urls.login}?next=${next}`;
//             });
//         } else {
//             const next = encodeURIComponent(window.location.pathname + window.location.search);
//             window.location.href = `${this.urls.login}?next=${next}`;
//         }
//         return false;
//     }

//     // TAMBAH KE CART - PERBAIKI INI!
//     addToCart(productId, size = 'M') {
//         if (!this.requireLogin("menambahkan ke keranjang")) return;

//         console.log(`🛒 Adding to cart - Product: ${productId}, Size: ${size}`);
        
//         const apiUrl = this.urls.apiCartAdd || '/api/cart/add/';
        
//         fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': this.csrfToken
//             },
//             body: JSON.stringify({ 
//                 product_id: parseInt(productId), 
//                 quantity: 1,
//                 size: size 
//             })
//         })
//         .then(r => {
//             console.log(`📡 Add to cart response status: ${r.status}`);
//             if (!r.ok) throw new Error('Network error');
//             return r.json();
//         })
//         .then(data => {
//             console.log('✅ Add to cart response:', data);
            
//             if (data.success) {
//                 this.showToast('success', 'Berhasil!', data.message || 'Ditambahkan ke keranjang');
//                 this.updateCartCount(data.cart_count);
                
//                 // Jika modal cart terbuka, refresh isinya
//                 const cartModal = document.getElementById('cartModal');
//                 if (cartModal && cartModal.classList.contains('show')) {
//                     console.log('🔄 Modal terbuka, reloading cart...');
//                     this.loadCartIntoModal();
//                 }
//             } else {
//                 this.showToast('error', 'Gagal!', data.message || 'Gagal menambahkan ke keranjang');
//             }
//         })
//         .catch((err) => {
//             console.error('❌ Error adding to cart:', err);
//             this.showToast('error', 'Error!', 'Terjadi kesalahan');
//         });
//     }

//     addToWishlist(productId) {
//         if (!this.requireLogin("menyimpan ke wishlist")) return;

//         fetch(this.urls.apiWishlistAdd || '/api/wishlist/add/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': this.csrfToken
//             },
//             body: JSON.stringify({ product_id: productId })
//         })
//         .then(r => r.json())
//         .then(data => {
//             if (data.success) {
//                 this.showToast('success', 'Berhasil!', data.message);
//                 this.updateWishlistCount(data.wishlist_count);
//             } else {
//                 this.showToast('info', 'Info', data.message || 'Sudah ada di wishlist');
//             }
//         })
//         .catch(() => this.showToast('error', 'Gagal', 'Terjadi kesalahan'));
//     }

//     // UPDATE COUNTS
//     updateCartCount(count = null) {
//         const el = document.getElementById('cartCount');
//         if (!el) {
//             console.error('❌ cartCount element tidak ditemukan!');
//             return;
//         }

//         if (count !== null) {
//             console.log(`🔄 Update cart count: ${count}`);
//             el.textContent = count;
//             el.style.display = count > 0 ? 'inline' : 'none';
//         } else if (this.isLoggedIn) {
//             // Fetch count dari server
//             fetch(this.urls.apiCartItems || '/api/cart/items/')
//                 .then(r => r.json())
//                 .then(data => {
//                     const total = data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
//                     el.textContent = total;
//                     el.style.display = total > 0 ? 'inline' : 'none';
//                     console.log(`🔄 Cart count updated from server: ${total}`);
//                 })
//                 .catch((err) => {
//                     console.error('❌ Error fetching cart count:', err);
//                     el.style.display = 'none';
//                 });
//         } else {
//             const value = this.getLocalCartCount();
//             el.textContent = value;
//             el.style.display = value > 0 ? 'inline' : 'none';
//         }
//     }

//     updateWishlistCount(count = null) {
//         const el = document.getElementById('wishlistCount');
//         if (!el) return;
//         const value = count !== null ? count : this.getLocalWishlistCount();
//         el.textContent = value;
//         el.style.display = value > 0 ? 'inline' : 'none';
//     }

//     getLocalCartCount() {
//         if (this.isLoggedIn) return 0;
//         const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//         return cart.reduce((sum, item) => sum + item.quantity, 0);
//     }

//     getLocalWishlistCount() {
//         if (this.isLoggedIn) return 0;
//         const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
//         return wishlist.length;
//     }

//     showToast(icon, title, text) {
//         if (typeof Swal !== 'undefined') {
//             Swal.fire({ 
//                 icon, 
//                 title, 
//                 text, 
//                 timer: 1500, 
//                 showConfirmButton: false,
//                 toast: true,
//                 position: 'top-end'
//             });
//         } else {
//             alert(`${title}: ${text}`);
//         }
//     }

//     // TAMBAHKAN FUNGSI INI DALAM CLASS
//     async getCartItems() {
//         if (!this.isLoggedIn) {
//             console.warn('⚠️ User belum login, tidak bisa mengambil cart items');
//             return [];
//         }

//         try {
//             const response = await fetch(this.urls.apiCartItems || '/api/cart/items/');
//             if (!response.ok) throw new Error('Failed to fetch cart');
            
//             const data = await response.json();
//             console.log('🛒 Cart items dari API:', data);
            
//             if (data.success && data.items) {
//                 // Format data sesuai kebutuhan halaman sewa
//                 return data.items.map(item => ({
//                     id: item.product_id,
//                     name: item.name,
//                     price: item.price,
//                     image: item.image,
//                     size: item.size || 'M',
//                     quantity: item.quantity || 1,
//                     category: item.category || 'Fashion'
//                 }));
//             }
//             return [];
//         } catch (error) {
//             console.error('❌ Error fetching cart items:', error);
//             return [];
//         }
//     }

//     // Juga tambahkan fungsi untuk redirect ke halaman sewa dengan cart items
//     async function checkoutFromCart() {
//         if (!window.app?.requireLogin("checkout")) return;
        
//         // Ambil cart items
//         const cartItems = await window.app.getCartItems();
        
//         if (cartItems.length === 0) {
//             window.app.showToast('warning', 'Keranjang Kosong', 'Tambahkan produk ke keranjang terlebih dahulu');
//             return;
//         }
        
//         // Simpan ke localStorage untuk halaman sewa
//         localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
//         // Redirect ke halaman sewa
//         window.location.href = '/sewa/';
//     }
// };

// // INISIALISASI
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('🚀 Initializing IA Rent App...');
//     window.app = new IARentApp();
// });

// // FUNGSI GLOBAL UNTUK HTML
// function goToDetail(id) { 
//     window.location.href = `/product/${id}/`;
// }

// function addToCart(id, size = 'M') { 
//     console.log(`📞 addToCart called with id: ${id}, size: ${size}`);
//     window.app?.addToCart(id, size); 
// }

// function addToWishlist(id) { 
//     window.app?.addToWishlist(id); 
// }

// function checkout() { 
//     window.location.href = '/sewa/'; 
// }

// function continueShopping() {
//     const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
//     if (modal) modal.hide();
// }

// // ⚠️ HAPUS SEMUA FUNGSI DUPLIKAT DI BAWAH INI!
// // JANGAN ADA FUNGSI loadCartToModal, dll di luar class!


// static/js/app.js → SATU FILE UNTUK SEMUA HALAMAN!

class IARentApp {
    constructor() {
        this.init();
    }

    init() {
        this.isLoggedIn = window.djangoData?.isLoggedIn || false;
        this.urls = window.djangoData?.urls || {};
        this.csrfToken = window.djangoData?.csrfToken || this.getCookie('csrftoken');

        console.log('🛒 IA Rent Fashion App siap!', { 
            loggedIn: this.isLoggedIn,
            urls: this.urls 
        });

        this.updateCartCount();
        this.updateWishlistCount();
        this.setupEventListeners();
        this.setupCartModal();
    }

    getCookie(name) {
        let value = null;
        if (document.cookie && document.cookie !== '') {
            document.cookie.split(';').forEach(cookie => {
                const c = cookie.trim();
                if (c.startsWith(name + '=')) {
                    value = decodeURIComponent(c.substring(name.length + 1));
                }
            });
        }
        return value;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (card && !e.target.closest('button, a, .btn, .bi')) {
                const link = card.querySelector('a[href*="/product/"]') || card.closest('a');
                if (link) {
                    e.preventDefault();
                    window.location.href = link.href;
                }
            }
        });
    }

    // SETUP MODAL KERANJANG
    setupCartModal() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.addEventListener('show.bs.modal', () => {
                console.log('🔓 Modal cart dibuka - memuat data...');
                this.loadCartIntoModal();
            });
        } else {
            console.error('❌ Modal cart tidak ditemukan!');
        }
    }

    // LOAD CART KE MODAL
    loadCartIntoModal() {
        const container = document.getElementById('cart-content');
        const totalItemsEl = document.getElementById('cart-total-items');
        const totalPriceEl = document.getElementById('cart-total-price');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (!container) {
            console.error('❌ Container cart-content tidak ditemukan!');
            return;
        }

        console.log('🛒 Memulai load cart ke modal...');

        // Tampilkan loading
        container.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Memuat keranjang...</p>
            </div>`;

        if (!this.isLoggedIn) {
            setTimeout(() => {
                container.innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-lock-fill display-1 text-muted"></i>
                        <p class="mt-3">Login untuk melihat keranjang</p>
                        <a href="${this.urls.login}" class="btn btn-primary">Login Sekarang</a>
                    </div>`;
                if (totalItemsEl) totalItemsEl.textContent = '0 items';
                if (totalPriceEl) totalPriceEl.textContent = 'Rp 0';
                if (checkoutBtn) checkoutBtn.disabled = true;
            }, 500);
            return;
        }

        // Fetch data cart dari server
        const apiUrl = this.urls.apiCartItems || '/api/cart/items/';
        console.log(`📡 Fetching cart dari: ${apiUrl}`);
        
        fetch(apiUrl)
            .then(r => {
                console.log(`📡 Response status: ${r.status}`);
                if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
                return r.json();
            })
            .then(data => {
                console.log('✅ Data cart diterima:', data);
                
                if (!data.success) {
                    console.error('❌ API response tidak success:', data);
                    container.innerHTML = `
                        <div class="alert alert-danger text-center">
                            <i class="bi bi-exclamation-triangle"></i>
                            <p class="mb-0">Gagal memuat keranjang</p>
                            <small class="text-muted">${data.error || 'Unknown error'}</small>
                        </div>`;
                    return;
                }

                if (!data.items || data.items.length === 0) {
                    // Cart kosong
                    container.innerHTML = `
                        <div class="text-center py-5 text-muted">
                            <i class="bi bi-cart-x display-1"></i>
                            <p class="mt-3">Keranjang kosong</p>
                            <p class="text-muted small">Silakan tambahkan produk ke keranjang Anda</p>
                        </div>`;
                    
                    if (totalItemsEl) totalItemsEl.textContent = '0 items';
                    if (totalPriceEl) totalPriceEl.textContent = 'Rp 0';
                    if (checkoutBtn) checkoutBtn.disabled = true;
                    return;
                }

                // Tampilkan items di cart
                let html = '';
                let totalItems = 0;
                let totalPrice = 0;

                data.items.forEach(item => {
                    const subtotal = item.price * item.quantity;
                    totalItems += item.quantity;
                    totalPrice += subtotal;

                    html += `
                        <div class="cart-item-card border rounded bg-white shadow-sm mb-3" data-item-id="${item.id}">
                            <div class="p-3 d-flex align-items-center gap-3">
                                <img src="${item.image}" 
                                    class="rounded" 
                                    style="width: 70px; height: 70px; object-fit: cover;" 
                                    alt="${item.name}"
                                    onerror="this.src='/static/img/no-image.jpg'">
                                <div class="flex-grow-1">
                                    <h6 class="mb-1 fw-bold text-dark">${item.name}</h6>
                                    <small class="text-muted d-block">
                                        Size: <strong>${item.size || 'M'}</strong> • 
                                        Qty: <strong>${item.quantity}</strong>
                                    </small>
                                    <p class="mb-0 text-primary fw-bold">
                                        Rp ${subtotal.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <button class="btn btn-sm btn-outline-danger remove-from-cart-modal" 
                                        data-item-id="${item.id}"
                                        data-item-name="${item.name}"
                                        title="Hapus dari keranjang">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });

                container.innerHTML = html;
                
                // Update summary
                if (totalItemsEl) totalItemsEl.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
                if (totalPriceEl) totalPriceEl.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
                if (checkoutBtn) checkoutBtn.disabled = false;

                // Attach event listeners untuk tombol hapus
                this.attachCartModalEventListeners();
                
                console.log('✅ Cart loaded successfully! Items:', totalItems);
            })
            .catch((err) => {
                console.error('❌ Error loading cart:', err);
                container.innerHTML = `
                    <div class="alert alert-danger text-center">
                        <i class="bi bi-exclamation-triangle"></i>
                        <p class="mb-0">Gagal memuat keranjang</p>
                        <small class="text-muted">Silakan refresh halaman</small>
                        <br>
                        <small class="text-muted">Error: ${err.message}</small>
                    </div>`;
            });
    }

    // ATTACH EVENT LISTENERS UNTUK TOMBOL DI MODAL
    attachCartModalEventListeners() {
        const container = document.getElementById('cart-content');
        if (!container) {
            console.error('❌ Container tidak ditemukan untuk attach events');
            return;
        }

        // Gunakan event delegation untuk handle tombol hapus
        container.addEventListener('click', (e) => {
            if (e.target.closest('.remove-from-cart-modal')) {
                e.preventDefault();
                e.stopPropagation();
                
                const button = e.target.closest('.remove-from-cart-modal');
                const itemId = button.getAttribute('data-item-id');
                const itemName = button.getAttribute('data-item-name') || 'Item';
                const itemCard = button.closest('.cart-item-card');
                
                console.log('🗑️ Tombol hapus diklik! Item:', itemName, 'ID:', itemId);
                
                this.removeFromCartModal(itemId, itemName, itemCard);
            }
        });

        console.log('✅ Event listeners attached untuk tombol hapus');
    }

    // HAPUS ITEM DARI CART (MODAL VERSION)
    removeFromCartModal(itemId, itemName, itemElement) {
        if (!this.requireLogin("menghapus dari keranjang")) return;

        // Konfirmasi hapus
        const confirmMessage = `Hapus "${itemName}" dari keranjang?`;
        
        if (confirm(confirmMessage)) {
            this.processRemoveFromCart(itemId, itemElement);
        }
    }

    // PROSES HAPUS DARI CART
    processRemoveFromCart(itemId, itemElement) {
        const apiUrl = this.urls.apiCartRemove || '/api/cart/remove/';
        console.log(`🗑️ Removing item ${itemId} dari ${apiUrl}`);
        
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.csrfToken
            },
            body: JSON.stringify({ item_id: parseInt(itemId) })
        })
        .then(r => {
            if (!r.ok) throw new Error('Network error');
            return r.json();
        })
        .then(data => {
            console.log('✅ Remove response:', data);
            
            if (data.success) {
                this.showToast('success', 'Berhasil!', 'Item dihapus dari keranjang');
                
                // Update cart count
                this.updateCartCount(data.cart_count);
                
                // Hapus elemen dari modal dengan animasi
                if (itemElement) {
                    itemElement.style.transition = 'all 0.3s ease';
                    itemElement.style.opacity = '0';
                    itemElement.style.transform = 'translateX(-100%)';
                    
                    setTimeout(() => {
                        itemElement.remove();
                        
                        // Reload modal jika tidak ada item lagi
                        const remainingItems = document.querySelectorAll('.cart-item-card');
                        if (remainingItems.length === 0) {
                            this.loadCartIntoModal();
                        }
                    }, 300);
                } else {
                    // Fallback: reload modal
                    this.loadCartIntoModal();
                }
            } else {
                this.showToast('error', 'Gagal!', data.message || 'Gagal menghapus item');
            }
        })
        .catch((err) => {
            console.error('❌ Error removing item:', err);
            this.showToast('error', 'Error!', 'Gagal terhubung ke server');
        });
    }

    // ============================
    // FUNGSI BARU: AMBIL CART ITEMS
    // ============================
    async getCartItems() {
        if (!this.isLoggedIn) {
            console.warn('⚠️ User belum login, tidak bisa mengambil cart items');
            this.showToast('warning', 'Login Diperlukan', 'Silakan login terlebih dahulu');
            return [];
        }

        try {
            const response = await fetch(this.urls.apiCartItems || '/api/cart/items/');
            if (!response.ok) throw new Error('Failed to fetch cart');
            
            const data = await response.json();
            console.log('🛒 Cart items dari API:', data);
            
            if (data.success && data.items) {
                // Format data sesuai kebutuhan halaman sewa
                return data.items.map(item => ({
                    id: item.product_id,
                    name: item.name,
                    price: item.price,
                    image: item.image || '/static/img/no-image.jpg',
                    size: item.size || 'M',
                    quantity: item.quantity || 1,
                    category: item.category || 'Fashion'
                }));
            }
            return [];
        } catch (error) {
            console.error('❌ Error fetching cart items:', error);
            this.showToast('error', 'Gagal', 'Gagal mengambil data keranjang');
            return [];
        }
    }

    // ============================
    // FUNGSI BARU: CHECKOUT DARI KERANJANG
    // ============================
    async checkoutFromCart() {
        if (!this.requireLogin("melakukan checkout")) return;

        console.log('🛒 Memulai checkout dari keranjang...');
        
        // Tampilkan loading
        this.showToast('info', 'Loading...', 'Mengambil data keranjang');

        try {
            const cartItems = await this.getCartItems();
            
            if (cartItems.length === 0) {
                this.showToast('warning', 'Keranjang Kosong', 'Tambahkan produk ke keranjang terlebih dahulu');
                return;
            }

            console.log(`✅ ${cartItems.length} produk siap checkout:`, cartItems);
            
            // Simpan ke localStorage untuk halaman sewa
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            localStorage.setItem('checkoutProducts', JSON.stringify(cartItems));
            
            // Redirect ke halaman sewa
            window.location.href = '/sewa/';
            
        } catch (error) {
            console.error('❌ Error checkout:', error);
            this.showToast('error', 'Gagal', 'Terjadi kesalahan saat checkout');
        }
    }

    requireLogin(action = "melakukan aksi ini") {
        if (this.isLoggedIn) return true;

        if (window.Swal) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Diperlukan',
                text: `Silakan login terlebih dahulu untuk ${action}`,
                confirmButtonText: 'Login Sekarang',
                confirmButtonColor: '#f85a87',
                allowOutsideClick: false
            }).then(() => {
                const next = encodeURIComponent(window.location.pathname + window.location.search);
                window.location.href = `${this.urls.login}?next=${next}`;
            });
        } else {
            const next = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `${this.urls.login}?next=${next}`;
        }
        return false;
    }

    // TAMBAH KE CART
    addToCart(productId, size = 'M') {
        if (!this.requireLogin("menambahkan ke keranjang")) return;

        console.log(`🛒 Adding to cart - Product: ${productId}, Size: ${size}`);
        
        const apiUrl = this.urls.apiCartAdd || '/api/cart/add/';
        
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.csrfToken
            },
            body: JSON.stringify({ 
                product_id: parseInt(productId), 
                quantity: 1,
                size: size 
            })
        })
        .then(r => {
            console.log(`📡 Add to cart response status: ${r.status}`);
            if (!r.ok) throw new Error('Network error');
            return r.json();
        })
        .then(data => {
            console.log('✅ Add to cart response:', data);
            
            if (data.success) {
                this.showToast('success', 'Berhasil!', data.message || 'Ditambahkan ke keranjang');
                this.updateCartCount(data.cart_count);
                
                // Jika modal cart terbuka, refresh isinya
                const cartModal = document.getElementById('cartModal');
                if (cartModal && cartModal.classList.contains('show')) {
                    console.log('🔄 Modal terbuka, reloading cart...');
                    this.loadCartIntoModal();
                }
            } else {
                this.showToast('error', 'Gagal!', data.message || 'Gagal menambahkan ke keranjang');
            }
        })
        .catch((err) => {
            console.error('❌ Error adding to cart:', err);
            this.showToast('error', 'Error!', 'Terjadi kesalahan');
        });
    }

    addToWishlist(productId) {
        if (!this.requireLogin("menyimpan ke wishlist")) return;

        fetch(this.urls.apiWishlistAdd || '/api/wishlist/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.csrfToken
            },
            body: JSON.stringify({ product_id: productId })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                this.showToast('success', 'Berhasil!', data.message);
                this.updateWishlistCount(data.wishlist_count);
            } else {
                this.showToast('info', 'Info', data.message || 'Sudah ada di wishlist');
            }
        })
        .catch(() => this.showToast('error', 'Gagal', 'Terjadi kesalahan'));
    }

    // UPDATE COUNTS
    updateCartCount(count = null) {
        const el = document.getElementById('cartCount');
        if (!el) {
            console.error('❌ cartCount element tidak ditemukan!');
            return;
        }

        if (count !== null) {
            console.log(`🔄 Update cart count: ${count}`);
            el.textContent = count;
            el.style.display = count > 0 ? 'inline' : 'none';
        } else if (this.isLoggedIn) {
            // Fetch count dari server
            fetch(this.urls.apiCartItems || '/api/cart/items/')
                .then(r => r.json())
                .then(data => {
                    const total = data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                    el.textContent = total;
                    el.style.display = total > 0 ? 'inline' : 'none';
                    console.log(`🔄 Cart count updated from server: ${total}`);
                })
                .catch((err) => {
                    console.error('❌ Error fetching cart count:', err);
                    el.style.display = 'none';
                });
        } else {
            const value = this.getLocalCartCount();
            el.textContent = value;
            el.style.display = value > 0 ? 'inline' : 'none';
        }
    }

    updateWishlistCount(count = null) {
        const el = document.getElementById('wishlistCount');
        if (!el) return;
        const value = count !== null ? count : this.getLocalWishlistCount();
        el.textContent = value;
        el.style.display = value > 0 ? 'inline' : 'none';
    }

    getLocalCartCount() {
        if (this.isLoggedIn) return 0;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    getLocalWishlistCount() {
        if (this.isLoggedIn) return 0;
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        return wishlist.length;
    }

    showToast(icon, title, text) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({ 
                icon, 
                title, 
                text, 
                timer: 1500, 
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        } else {
            alert(`${title}: ${text}`);
        }
    }
}

// INISIALISASI
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing IA Rent App...');
    window.app = new IARentApp();
});

// ===========================================
// FUNGSI GLOBAL UNTUK HTML
// ===========================================
function goToDetail(id) { 
    window.location.href = `/product/${id}/`;
}

function addToCart(id, size = 'M') { 
    console.log(`📞 addToCart called with id: ${id}, size: ${size}`);
    window.app?.addToCart(id, size); 
}

function addToWishlist(id) { 
    window.app?.addToWishlist(id); 
}

// ===========================================
// FUNGSI CHECKOUT YANG DIPERBAIKI - TIDAK PAKAI localStorage
// ===========================================

async function checkout() {
    console.log('🛒 Tombol checkout diklik');
    
    if (!window.app?.isLoggedIn) {
        window.app?.requireLogin("melakukan checkout");
        return;
    }
    
    // ⭐ SOLUSI: Langsung redirect ke /sewa/ tanpa localStorage
    // Django akan otomatis load data cart dari database
    
    // Tampilkan loading dengan SweetAlert
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Menyiapkan pesanan...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }
    
    // Delay 500ms untuk memastikan data tersinkron
    setTimeout(() => {
        console.log('✅ Redirect ke halaman sewa...');
        
        // Close SweetAlert
        if (typeof Swal !== 'undefined') {
            Swal.close();
        }
        
        // ⭐ LANGSUNG REDIRECT - Data akan diambil dari database oleh Django
        window.location.href = '/sewa/';
    }, 500);
}

// FUNGSI ALTERNATIF: Jika mau tetap pakai localStorage sebagai backup
async function checkoutWithBackup() {
    console.log('🛒 Checkout dengan backup localStorage');
    
    if (!window.app?.isLoggedIn) {
        window.app?.requireLogin("melakukan checkout");
        return;
    }
    
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Menyiapkan pesanan...',
            text: 'Mengambil data dari keranjang',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }
    
    try {
        // Ambil data cart dari API
        const cartItems = await window.app.getCartItems();
        
        console.log(`✅ Data cart berhasil diambil: ${cartItems.length} items`, cartItems);
        
        if (cartItems.length === 0) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Keranjang Kosong',
                    text: 'Tambahkan produk ke keranjang terlebih dahulu'
                });
            } else {
                alert('Keranjang kosong! Tambahkan produk terlebih dahulu.');
            }
            return;
        }
        
        // Simpan ke localStorage sebagai backup (opsional)
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('checkoutProducts', JSON.stringify(cartItems));
        
        console.log('💾 Data disimpan ke localStorage sebagai backup');
        
        // Close loading dan redirect
        if (typeof Swal !== 'undefined') {
            Swal.close();
        }
        
        // Redirect ke halaman sewa
        window.location.href = '/sewa/';
        
    } catch (error) {
        console.error('❌ Error dalam fungsi checkout:', error);
        
        if (typeof Swal !== 'undefined') {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan saat memproses checkout'
            });
        } else {
            alert('Terjadi kesalahan saat checkout');
        }
    }
}

// FUNGSI HELPER: Continue Shopping
function continueShopping() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modal) {
        modal.hide();
    }
}

// ⭐ EXPORT UNTUK DIGUNAKAN DI HTML
window.checkout = checkout;
window.checkoutWithBackup = checkoutWithBackup;
window.continueShopping = continueShopping;

function continueShopping() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modal) modal.hide();
}

// ===========================================
// TIDAK ADA FUNGSI DUPLIKAT DI BAWAH INI!
// ===========================================

