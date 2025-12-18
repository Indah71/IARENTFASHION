// Product data - bisa diganti dengan data dari Django
const products = {
    1: { id: 1, name: "Jas Hitam Klasik", category: "Jas", price: 250000, image: "{% static 'assets_inspi/inspijas.jpg' %}" },
    2: { id: 2, name: "Jas Silver Elegan", category: "Jas", price: 275000, image: "{% static 'assets_inspi/inspijas2.jpg' %}" },
    // ... tambahkan produk lainnya
};

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Setup modal popup for product details
    const productItems = document.querySelectorAll('.item-produk');
    const modalNamaProduk = document.getElementById('modalNamaProduk');
    const modalDeskripsiProduk = document.getElementById('modalDeskripsiProduk');
    
    productItems.forEach(item => {
        item.addEventListener('click', function() {
            const nama = this.getAttribute('data-nama');
            const deskripsi = this.getAttribute('data-deskripsi');
            
            if (modalNamaProduk && modalDeskripsiProduk) {
                modalNamaProduk.textContent = nama;
                modalDeskripsiProduk.textContent = deskripsi;
            }
        });
    });
    
    // Load wishlist dan cart saat halaman dimuat
    loadWishlist();
    loadCart();
});

// ===== FUNGSI WISHLIST =====
function addToWishlist(productId) {
    const product = products[productId];
    if (!product) return;

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const existingItemIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingItemIndex === -1) {
        const productToAdd = {
            id: productId,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image
        };
        
        wishlist.push(productToAdd);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        loadWishlist();
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `${product.name} berhasil ditambahkan ke wishlist!`,
            timer: 1500,
            showConfirmButton: false
        });
    } else {
        Swal.fire({
            icon: 'info',
            title: 'Produk Sudah Ada',
            text: 'Produk ini sudah ada di wishlist Anda!',
            timer: 1500,
            showConfirmButton: false
        });
    }
}

function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCount = document.getElementById('wishlistCount');
    const wishlistItems = document.getElementById('wishlistItems');
    
    if (wishlistCount) wishlistCount.textContent = wishlist.length;
    
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
                            <span class="text-primary fw-bold small">Rp ${item.price.toLocaleString('id-ID')}</span>
                            <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromWishlist(${item.id})">
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

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();
    
    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Produk berhasil dihapus dari wishlist!',
        timer: 1500,
        showConfirmButton: false
    });
}

// ===== FUNGSI KERANJANG =====
function addToCart(productId) {
    const product = products[productId];
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex === -1) {
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
        loadCart();
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `${product.name} berhasil ditambahkan ke keranjang!`,
            timer: 1500,
            showConfirmButton: false
        });
    } else {
        cart[existingItemIndex].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Jumlah produk di keranjang telah diperbarui!',
            timer: 1500,
            showConfirmButton: false
        });
    }
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-muted text-center mb-0">Keranjang Anda kosong</p>';
        } else {
            let cartHTML = '';
            let totalPrice = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                cartHTML += `
                    <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.name}" class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
                            <div>
                                <h6 class="fw-semibold mb-0 small">${item.name}</h6>
                                <small class="text-muted">${item.category}</small>
                                <div class="d-flex align-items-center mt-1">
                                    <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                                    <span class="mx-2 small">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                                </div>
                            </div>
                        </div>
                        <div class="text-end">
                            <span class="text-primary fw-bold small">Rp ${itemTotal.toLocaleString('id-ID')}</span>
                            <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart(${item.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
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

function updateCartQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    
    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Produk berhasil dihapus dari keranjang!',
        timer: 1500,
        showConfirmButton: false
    });
}

// Function untuk redirect ke login
function redirectToLogin(reason) {
    localStorage.setItem('loginReason', reason);
    window.location.href = '/login';
}

function handleSewaClick() {
    redirectToLogin('sewa');
}