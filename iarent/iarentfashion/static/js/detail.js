// ============================================
// DETAIL.JS - HALAMAN DETAIL PRODUK (COMPLETE FIXED VERSION)
// ============================================
// ============================================
// EMERGENCY DATA FALLBACK
// ============================================
function getEmergencyProductData() {
    console.log('🆘 Using emergency product data fallback');
    
    // Coba ambil data dari elemen HTML
    const productName = document.querySelector('h1.fw-bold')?.textContent || 'Unknown Product';
    const priceText = document.querySelector('.text-danger')?.textContent;
    const stockInfo = document.querySelector('.text-success small, .text-danger small')?.textContent;
    
    // Extract price dari text
    let price = 150000; // default fallback
    if (priceText) {
        const priceMatch = priceText.match(/Rp\s*([\d.,]+)/);
        if (priceMatch) {
            price = parseInt(priceMatch[1].replace(/[^\d]/g, ''));
        }
    }
    
    // Extract stock dari text
    let stock = 10; // default fallback
    if (stockInfo) {
        const stockMatch = stockInfo.match(/(\d+)\s*item/);
        if (stockMatch) {
            stock = parseInt(stockMatch[1]);
        } else if (stockInfo.includes('Habis')) {
            stock = 0;
        }
    }
    
    // Extract category
    const categoryText = document.querySelector('h6.text-muted')?.textContent || 'Jas';
    
    return {
        id: window.location.pathname.split('/').filter(Boolean).pop() || 'temp_' + Date.now(),
        name: productName,
        price: price,
        stock: stock,
        category: categoryText,
        description: document.querySelector('.lead')?.textContent || ''
    };
}

// ============================================
// DETAIL.JS - HALAMAN DETAIL PRODUK (COMPLETE FIXED VERSION)
// ============================================

console.log('🚀 Loading detail.js...');

// Ambil data produk dari HTML dengan error handling
let productData = null;
let usingFallbackData = false;

try {
    const productDataEl = document.getElementById('product-data');
    if (productDataEl && productDataEl.textContent.trim()) {
        const jsonText = productDataEl.textContent.trim();
        console.log('📦 Raw JSON:', jsonText);
        
        // Validasi JSON sebelum parse
        if (jsonText.startsWith('{') && jsonText.endsWith('}')) {
            productData = JSON.parse(jsonText);
            console.log('✅ Product data loaded from JSON:', productData);
            
            // Validasi field penting
            if (!productData.price || productData.price <= 0) {
                throw new Error('Invalid price in JSON data');
            }
        } else {
            throw new Error('Invalid JSON format');
        }
    } else {
        throw new Error('Product data element not found or empty');
    }
} catch (error) {
    console.error('❌ Error loading product data:', error);
    console.log('🔄 Attempting to use emergency fallback data...');
    
    // Gunakan emergency fallback
    productData = getEmergencyProductData();
    usingFallbackData = true;
    
    console.log('🆘 Using emergency product data:', productData);
}

// State global
let selectedSize = null;
let currentQuantity = 1;

// ============================================
// VALIDASI DATA PRODUK - LEBIH FLEKSIBEL
// ============================================
function validateProductData() {
    if (!productData) {
        console.error('❌ productData is null');
        return false;
    }
    
    // Jika menggunakan fallback, selalu return true
    if (usingFallbackData) {
        console.log('🆘 Using fallback data - validation bypassed');
        return true;
    }
    
    // ID bisa digenerate jika tidak ada
    if (!productData.id) {
        console.warn('⚠️ Product ID missing, generating temporary ID');
        productData.id = 'temp_' + Date.now();
    }
    
    // Price harus ada
    if (!productData.price || productData.price <= 0) {
        console.error('❌ Product price invalid:', productData.price);
        return false;
    }
    
    // Stock default jika tidak ada
    if (typeof productData.stock === 'undefined' || productData.stock < 0) {
        console.warn('⚠️ Product stock invalid, using default');
        productData.stock = 10;
    }
    
    // Category optional
    if (!productData.category) {
        console.warn('⚠️ Product category missing');
        productData.category = 'Umum';
    }
    
    return true;
}

// ============================================
// VALIDASI DATA PRODUK - DIREVISI
// ============================================
function validateProductData() {
    if (!productData) {
        console.error('❌ productData is null');
        return false;
    }
    
    // ID bisa digenerate jika tidak ada
    if (!productData.id) {
        console.warn('⚠️ Product ID missing, generating temporary ID');
        productData.id = 'temp_' + Date.now();
    }
    
    // Price harus ada
    if (!productData.price || productData.price <= 0) {
        console.error('❌ Product price invalid:', productData.price);
        return false;
    }
    
    // Stock default jika tidak ada
    if (!productData.stock || productData.stock < 0) {
        console.warn('⚠️ Product stock invalid, using default:', productData.stock);
        productData.stock = 10;
    }
    
    // Category optional
    if (!productData.category) {
        console.warn('⚠️ Product category missing');
        productData.category = 'Umum';
    }
    
    return true;
}

function showDataError() {
    Swal.fire({
        icon: 'error',
        title: 'Data Produk Tidak Lengkap',
        text: 'Silakan hubungi administrator untuk melengkapi data produk',
        confirmButtonColor: '#ea6262'
    });
}

function disableActionButtons() {
    const buttons = document.querySelectorAll('.btn-action, .btn-dark[onclick*="addToCart"]');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Data Produk Error';
        btn.classList.add('btn-secondary');
        btn.classList.remove('btn-dark', 'btn-action');
    });
}

// ============================================
// INISIALISASI SAAT PAGE LOAD - DIREVISI
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    
    // Setup event listeners untuk tombol
    setupEventListeners();
    
    // Validasi data dengan approach yang lebih toleran
    if (validateProductData()) {
        initializeProductPage();
    } else {
        console.error('❌ Cannot initialize - invalid product data');
        disableActionButtons();
    }
});

function initializeProductPage() {
    // Auto-select ukuran pertama untuk non-aksesoris
    const category = productData.category ? productData.category.toLowerCase() : '';
    
    if (category.includes('aksesoris')) {
        // Untuk aksesoris, set otomatis T/A
        selectedSize = 'T/A';
        console.log('✅ Auto-selected T/A for accessories');
        
        // Update hidden input untuk aksesoris
        const hiddenInput = document.getElementById('selectedSizeInput');
        if (hiddenInput) {
            hiddenInput.value = 'T/A';
        }
        
        // Sembunyikan section ukuran untuk aksesoris
        const sizeSection = document.querySelector('.size-section');
        if (sizeSection) {
            sizeSection.style.display = 'none';
        }
    } else {
        // Untuk non-aksesoris, auto-select ukuran pertama
        const firstSizeBtn = document.querySelector('.size-btn');
        if (firstSizeBtn) {
            const firstSize = firstSizeBtn.dataset.size;
            selectSize(firstSize);
            console.log('✅ Auto-selected first size:', firstSize);
        }
        
        // Initialize stock data untuk size buttons
        initializeSizeStockData();
    }
    
    // Setup event listener untuk input quantity
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.addEventListener('input', updateQuantityFromInput);
        quantityInput.addEventListener('change', updateQuantityFromInput);
        
        // Set max attribute berdasarkan stock
        const maxStock = getAvailableStock();
        quantityInput.setAttribute('max', maxStock);
        quantityInput.setAttribute('min', '1');
    }
    
    updateTotalPrice();
    updateCartCount();
    updateStockDisplay();
    console.log('✅ Detail page initialized successfully');
}

// ============================================
// MANAJEMEN STOK UKURAN - FUNGSI BARU
// ============================================
function initializeSizeStockData() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        const size = btn.getAttribute('data-size');
        // Jika button sudah punya data-stock, gunakan itu
        // Jika tidak, gunakan stock overall product
        if (!btn.hasAttribute('data-stock')) {
            btn.setAttribute('data-stock', productData.stock);
        }
        
        // Tambahkan indicator stok di button
        const stock = parseInt(btn.getAttribute('data-stock'));
        updateSizeButtonDisplay(btn, stock);
    });
}

function updateSizeButtonDisplay(button, stock) {
    // Hapus existing badge
    const existingBadge = button.querySelector('.stock-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    // Tambahkan badge stok jika stok terbatas
    if (stock < 10 && stock > 0) {
        const badge = document.createElement('span');
        badge.className = 'stock-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
        badge.style.fontSize = '0.6rem';
        badge.textContent = stock;
        button.style.position = 'relative';
        button.appendChild(badge);
    }
    
    // Disable button jika stok habis
    if (stock === 0) {
        button.disabled = true;
        button.classList.add('btn-outline-secondary');
        button.classList.remove('btn-outline-dark');
        button.innerHTML = `${button.getAttribute('data-size')} <small class="d-block">Habis</small>`;
    }
}

function getAvailableStock() {
    // Jika ada ukuran yang dipilih, gunakan stok untuk ukuran tersebut
    if (selectedSize) {
        const sizeBtn = document.querySelector(`.size-btn[data-size="${selectedSize}"]`);
        if (sizeBtn && sizeBtn.hasAttribute('data-stock')) {
            return parseInt(sizeBtn.getAttribute('data-stock'));
        }
    }
    
    // Fallback ke overall product stock
    return productData.stock;
}

function updateStockDisplay() {
    const stockDisplay = document.getElementById('stock-display');
    if (!stockDisplay) return;
    
    const availableStock = getAvailableStock();
    
    if (availableStock === 0) {
        stockDisplay.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle"></i> Stok Habis</span>';
    } else if (availableStock < 5) {
        stockDisplay.innerHTML = `<span class="text-warning"><i class="bi bi-exclamation-triangle"></i> Stok Terbatas (${availableStock})</span>`;
    } else {
        stockDisplay.innerHTML = `<span class="text-success"><i class="bi bi-check-circle"></i> Stok Tersedia (${availableStock})</span>`;
    }
}

// ============================================
// SETUP EVENT LISTENERS - DITAMBAH FITUR
// ============================================
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Direct event listeners untuk tombol utama
    const addToCartBtn = document.querySelector('.btn-dark[onclick*="addToCart"], .btn-dark');
    const sewaSekarangBtn = document.querySelector('.btn-action[onclick*="sewaSekarang"], .btn-action');
    
    console.log('🔍 Add to Cart button:', addToCartBtn);
    console.log('🔍 Sewa Sekarang button:', sewaSekarangBtn);
    
    // Remove existing onclick dan ganti dengan event listener
    if (addToCartBtn) {
        addToCartBtn.removeAttribute('onclick');
        addToCartBtn.addEventListener('click', function(e) {
            console.log('🛒 DIRECT EVENT: Add to Cart clicked');
            e.preventDefault();
            e.stopPropagation();
            addToCart();
        });
    }
    
    if (sewaSekarangBtn) {
        sewaSekarangBtn.removeAttribute('onclick');
        sewaSekarangBtn.addEventListener('click', function(e) {
            console.log('🎯 DIRECT EVENT: Sewa Sekarang clicked');
            e.preventDefault();
            e.stopPropagation();
            sewaSekarang();
        });
    }
    
    // Event listeners untuk quantity buttons
    const minusBtns = document.querySelectorAll('.btn-outline-dark[onclick*="decreaseQuantity"]');
    const plusBtns = document.querySelectorAll('.btn-outline-dark[onclick*="increaseQuantity"]');
    
    minusBtns.forEach(btn => {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            decreaseQuantity();
        });
    });
    
    plusBtns.forEach(btn => {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            increaseQuantity();
        });
    });
    
    // Event listeners untuk size buttons
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const size = this.getAttribute('data-size');
            selectSize(size);
        });
    });
    
    // Event listener untuk wishlist
    const wishlistBtn = document.querySelector('.btn-outline-danger[onclick*="addToWishlist"]');
    if (wishlistBtn) {
        wishlistBtn.removeAttribute('onclick');
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addToWishlist();
        });
    }
    
    console.log('✅ Event listeners setup completed');
}

// ============================================
// PILIH UKURAN - DITAMBAH UPDATE STOK
// ============================================
function selectSize(size) {
    console.log('👆 Size selected:', size);
    selectedSize = size;
    
    // Update hidden input untuk form submission
    const hiddenInput = document.getElementById('selectedSizeInput');
    if (hiddenInput) {
        hiddenInput.value = size;
        console.log('✅ Hidden input updated:', size);
    }
    
    // Update tampilan button - Hapus active dari semua
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('btn-dark', 'text-white');
        btn.classList.add('btn-outline-dark');
    });
    
    // Tambah active ke button yang dipilih
    const selectedButtons = document.querySelectorAll(`.size-btn[data-size="${size}"]`);
    selectedButtons.forEach(btn => {
        btn.classList.remove('btn-outline-dark');
        btn.classList.add('btn-dark', 'text-white');
    });
    
    // Update quantity input max value berdasarkan stok ukuran terpilih
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        const availableStock = getAvailableStock();
        quantityInput.setAttribute('max', availableStock);
        
        // Adjust current quantity jika melebihi stok tersedia
        if (currentQuantity > availableStock) {
            currentQuantity = availableStock;
            quantityInput.value = currentQuantity;
            Swal.fire({
                icon: 'warning',
                title: 'Quantity Disesuaikan',
                text: `Jumlah disesuaikan menjadi ${availableStock} karena stok terbatas`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    }
    
    updateStockDisplay();
    updateTotalPrice();
    console.log('✅ Button highlighted for size:', size);
}

// ============================================
// QUANTITY CONTROLS - DITAMBAH VALIDASI STOK
// ============================================
function increaseQuantity() {
    console.log('➕ Increase quantity clicked');
    
    if (!validateProductData()) {
        showDataError();
        return;
    }
    
    const max = getAvailableStock();
    
    if (currentQuantity < max) {
        currentQuantity++;
        const input = document.getElementById('quantityInput');
        if (input) input.value = currentQuantity;
        updateTotalPrice();
        console.log('➕ Quantity increased:', currentQuantity);
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Stok Terbatas',
            text: `Hanya tersedia ${max} item`,
            confirmButtonColor: '#ea6262',
            timer: 2000
        });
    }
}

function decreaseQuantity() {
    console.log('➖ Decrease quantity clicked');
    
    if (!validateProductData()) {
        showDataError();
        return;
    }
    
    if (currentQuantity > 1) {
        currentQuantity--;
        const input = document.getElementById('quantityInput');
        if (input) input.value = currentQuantity;
        updateTotalPrice();
        console.log('➖ Quantity decreased:', currentQuantity);
    }
}

function updateQuantityFromInput() {
    console.log('🔢 Quantity input changed');
    
    if (!validateProductData()) {
        showDataError();
        return;
    }
    
    const input = document.getElementById('quantityInput');
    if (!input) return;
    
    let value = parseInt(input.value);
    const max = getAvailableStock();
    
    if (isNaN(value) || value < 1) {
        value = 1;
    } else if (value > max) {
        value = max;
        Swal.fire({
            icon: 'warning',
            title: 'Stok Terbatas',
            text: `Maksimal ${max} item`,
            confirmButtonColor: '#ea6262',
            timer: 2000
        });
    }
    
    currentQuantity = value;
    input.value = value;
    updateTotalPrice();
    console.log('🔄 Quantity updated from input:', currentQuantity);
}

// ============================================
// UPDATE TOTAL HARGA
// ============================================
function updateTotalPrice() {
    const totalPriceEl = document.getElementById('total-price');
    if (!totalPriceEl) {
        console.error('❌ Element #total-price tidak ditemukan');
        return;
    }
    
    if (!validateProductData()) {
        totalPriceEl.textContent = 'Rp 0';
        return;
    }
    
    const total = productData.price * currentQuantity;
    totalPriceEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    console.log('💰 Total price updated:', total);
}

// ============================================
// TAMBAH KE KERANJANG - DENGAN VALIDASI STOK PER UKURAN
// ============================================
function addToCart() {
    console.log('🛒 === ADD TO CART CLICKED ===');
    
    // Validasi data produk
    if (!validateProductData()) {
        showDataError();
        return;
    }
    
    // Check login status
    const isLoggedIn = document.body.getAttribute('data-user-logged-in') === 'true';
    console.log('🔐 User logged in:', isLoggedIn);
    
    if (!isLoggedIn) {
        showLoginRequired('menambahkan ke keranjang');
        return;
    }

    // Check overall stock availability
    if (productData.stock === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Stok Habis',
            text: 'Maaf, produk ini sedang tidak tersedia',
            confirmButtonColor: '#ea6262'
        });
        return;
    }

    // Validate size selection dan stok per ukuran
    if (!validateSizeSelection()) {
        return;
    }

    const category = productData.category ? productData.category.toLowerCase() : '';
    const finalSize = category.includes('aksesoris') ? 'T/A' : selectedSize;
    
    console.log('🎯 Final data:', {
        productId: productData.id,
        size: finalSize,
        quantity: currentQuantity,
        price: productData.price,
        availableStock: getAvailableStockForSize(selectedSize)
    });

    // Try to add to cart via Django API first
    addToCartDjangoAPI(finalSize);
}

// ============================================
// WISHLIST FUNCTION - FUNGSI BARU
// ============================================
function addToWishlist() {
    console.log('❤️ Add to Wishlist clicked');
    
    const isLoggedIn = document.body.getAttribute('data-user-logged-in') === 'true';
    
    if (!isLoggedIn) {
        showLoginRequired('menambahkan ke wishlist');
        return;
    }

    // Simpan ke localStorage sebagai fallback
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    const productItem = {
        id: productData.id,
        name: document.querySelector('h1.fw-bold')?.textContent || 'Unknown Product',
        price: productData.price,
        image: document.querySelector('.img-fluid.rounded.shadow')?.src || '',
        category: productData.category,
        added_at: new Date().toISOString()
    };

    // Cek apakah sudah ada di wishlist
    const existingIndex = wishlist.findIndex(item => item.id === productData.id);
    
    if (existingIndex > -1) {
        // Hapus dari wishlist jika sudah ada
        wishlist.splice(existingIndex, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        Swal.fire({
            icon: 'success',
            title: 'Dihapus dari Wishlist!',
            text: 'Produk dihapus dari wishlist Anda',
            timer: 1500,
            showConfirmButton: false
        });
        
        // Update button appearance
        const wishlistBtn = document.querySelector('.btn-outline-danger[onclick*="addToWishlist"]');
        if (wishlistBtn) {
            wishlistBtn.innerHTML = '<i class="bi bi-heart"></i> Wishlist';
        }
    } else {
        // Tambah ke wishlist
        wishlist.push(productItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        Swal.fire({
            icon: 'success',
            title: 'Ditambahkan ke Wishlist!',
            text: 'Produk berhasil ditambahkan ke wishlist',
            timer: 1500,
            showConfirmButton: false
        });
        
        // Update button appearance
        const wishlistBtn = document.querySelector('.btn-outline-danger[onclick*="addToWishlist"]');
        if (wishlistBtn) {
            wishlistBtn.innerHTML = '<i class="bi bi-heart-fill text-danger"></i> In Wishlist';
        }
    }
    
    console.log('✅ Wishlist updated');
}

// ============================================
// TAMBAH KE KERANJANG DJANGO API
// ============================================
function addToCartDjangoAPI(finalSize) {
    const formData = new FormData();
    formData.append('product_id', productData.id);
    formData.append('quantity', currentQuantity);
    formData.append('size', finalSize);
    formData.append('csrfmiddlewaretoken', getCSRFToken());

    console.log('📤 Sending to Django API:', {
        product_id: productData.id,
        quantity: currentQuantity,
        size: finalSize
    });

    fetch('/cart/add/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Update cart count dari response server
            updateCartCountFromServer(data.cart_count);
            
            // Tampilkan notifikasi sukses
            const productName = document.querySelector('h1.fw-bold')?.textContent || 'Produk';
            showSuccessMessage(`${productName} (${finalSize}) berhasil ditambahkan ke keranjang!`);

            console.log('✅ Item added to cart via Django API');
        } else {
            throw new Error(data.message || 'Gagal menambahkan ke keranjang');
        }
    })
    .catch(error => {
        console.error('❌ Error adding to cart via API:', error);
        
        // Fallback ke localStorage jika server error
        console.log('🔄 Falling back to localStorage...');
        addToCartLocalStorage(finalSize);
    });
}

// ============================================
// FALLBACK: TAMBAH KE KERANJANG LOCALSTORAGE
// ============================================
function addToCartLocalStorage(finalSize) {
    console.log('🔄 Using localStorage fallback...');
    
    const productName = document.querySelector('h1.fw-bold')?.textContent || 'Unknown Product';
    const productImage = document.querySelector('.img-fluid.rounded.shadow')?.src || '';
    
    // Ambil cart dari localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Cek apakah item sudah ada di cart
    const existingIndex = cart.findIndex(item => 
        item.id === productData.id && item.size === finalSize
    );

    if (existingIndex > -1) {
        // Update quantity jika sudah ada
        const newQty = cart[existingIndex].quantity + currentQuantity;
        const availableStock = getAvailableStock();
        
        if (newQty <= availableStock) {
            cart[existingIndex].quantity = newQty;
            console.log('✅ Updated existing item quantity:', newQty);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Stok Tidak Cukup',
                text: `Maksimal ${availableStock} item!`,
                confirmButtonColor: '#ea6262'
            });
            return;
        }
    } else {
        // Tambah item baru
        const newItem = {
            id: productData.id,
            name: productName,
            price: productData.price,
            size: finalSize,
            quantity: currentQuantity,
            image: productImage,
            category: productData.category,
            added_at: new Date().toISOString()
        };
        cart.push(newItem);
        console.log('✅ Added new item to cart:', newItem);
    }

    // Simpan ke localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Tampilkan notifikasi
    showSuccessMessage(`${productName} (${finalSize}) berhasil ditambahkan ke keranjang!`);
}

// ============================================
// SEWA SEKARANG - DENGAN VALIDASI STOK
// ============================================
function sewaSekarang() {
    console.log('🎯 === SEWA SEKARANG CLICKED ===');
    
    // Validasi data produk
    if (!validateProductData()) {
        showDataError();
        return;
    }
    
    // Check login status
    const isLoggedIn = document.body.getAttribute('data-user-logged-in') === 'true';
    console.log('🔐 User logged in:', isLoggedIn);
    
    if (!isLoggedIn) {
        showLoginRequired('menyewa produk');
        return;
    }

    // Check overall stock
    if (productData.stock === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Stok Habis',
            text: 'Maaf, produk ini sedang tidak tersedia',
            confirmButtonColor: '#ea6262'
        });
        return;
    }

    // Validate size selection
    if (!validateSizeSelection()) {
        return;
    }

    const category = productData.category ? productData.category.toLowerCase() : '';
    const finalSize = category.includes('aksesoris') ? 'T/A' : selectedSize;
    
    console.log('🚀 Redirecting to sewa page with:', {
        product: productData.id,
        size: finalSize,
        quantity: currentQuantity,
        availableStock: getAvailableStockForSize(selectedSize)
    });

    // Show confirmation before redirect
    Swal.fire({
        title: 'Lanjutkan Penyewaan?',
        html: `
            <div class="text-start">
                <p><strong>Produk:</strong> ${document.querySelector('h1.fw-bold')?.textContent || 'Unknown'}</p>
                <p><strong>Ukuran:</strong> ${finalSize}</p>
                <p><strong>Jumlah:</strong> ${currentQuantity}</p>
                <p><strong>Stok Tersedia:</strong> ${getAvailableStockForSize(selectedSize)} item</p>
                <p><strong>Total:</strong> Rp ${(productData.price * currentQuantity).toLocaleString('id-ID')}</p>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ea6262',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Lanjutkan',
        cancelButtonText: 'Batal',
        customClass: {
            popup: 'rounded-4'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect ke halaman sewa
            const sewaUrl = `/sewa/?product=${productData.id}&size=${encodeURIComponent(finalSize)}&qty=${currentQuantity}`;
            window.location.href = sewaUrl;
        }
    });
}

// ============================================
// UPDATE CART COUNT
// ============================================
function updateCartCountFromServer(count) {
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
        console.log('🔢 Cart count updated from server:', count);
    }
}

function updateCartCount() {
    // Ambil dari localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
        console.log('🔢 Cart count updated from localStorage:', totalItems);
    }
}


// ============================================
// UTILITY FUNCTIONS - DITAMBAH
// ============================================
function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
    return cookieValue;
}

function showLoginRequired(action) {
    Swal.fire({
        icon: 'warning',
        title: 'Login Diperlukan',
        text: `Silakan login terlebih dahulu untuk ${action}`,
        confirmButtonText: 'Login',
        confirmButtonColor: '#ea6262',
        cancelButtonText: 'Batal',
        showCancelButton: true,
        customClass: {
            popup: 'rounded-4'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/login/?next=' + encodeURIComponent(window.location.pathname);
        }
    });
}

function showSizeRequired() {
    Swal.fire({
        icon: 'warning',
        title: 'Pilih Ukuran Dulu!',
        text: 'Kamu harus memilih ukuran sebelum melanjutkan',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ea6262',
        customClass: {
            popup: 'rounded-4'
        }
    });
}

function showSuccessMessage(message) {
    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: message,
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: '#ea6262',
        customClass: {
            popup: 'rounded-4'
        }
    });
}

// ============================================
// SHARE PRODUCT FUNCTION - FUNGSI BARU
// ============================================
function shareProduct() {
    const productName = document.querySelector('h1.fw-bold')?.textContent || 'Produk Menarik';
    const productUrl = window.location.href;
    
    if (navigator.share) {
        // Web Share API
        navigator.share({
            title: productName,
            text: `Lihat ${productName} di toko kami!`,
            url: productUrl,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(productUrl).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Link Disalin!',
                text: 'Link produk berhasil disalin ke clipboard',
                timer: 1500,
                showConfirmButton: false
            });
        });
    }
}

// ============================================
// MODAL CART FUNCTIONS
// ============================================
function continueShopping() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modal) modal.hide();
}

function sewa() {
    console.log('🛍️ Checkout from cart');
    
    const isLoggedIn = document.body.getAttribute('data-user-logged-in') === 'true';
    
    if (!isLoggedIn) {
        showLoginRequired('melakukan penyewaan');
        return;
    }

    window.location.href = '/sewa/';
}

// ============================================
// LOAD CART MODAL CONTENT
// ============================================
const cartModalEl = document.getElementById('cartModal');
if (cartModalEl) {
    cartModalEl.addEventListener('show.bs.modal', function() {
        console.log('🛒 Opening cart modal');
        loadCartModalContent();
    });
}

function loadCartModalContent() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const container = document.getElementById('cart-content');
    const totalItemsEl = document.getElementById('cart-total-items');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x display-1 text-muted"></i>
                <p class="mt-3 text-muted">Keranjang Anda kosong</p>
                <small class="text-muted">Silakan tambahkan produk ke keranjang</small>
            </div>
        `;
        if (totalItemsEl) totalItemsEl.textContent = '0 items';
        return;
    }

    let html = '';
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalItems += item.quantity;
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        html += `
            <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                <img src="${item.image}" alt="${item.name}" class="rounded" style="width: 80px; height: 80px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-1 fw-bold">${item.name}</h6>
                    <small class="text-muted d-block">Ukuran: ${item.size}</small>
                    <small class="text-muted d-block">Qty: ${item.quantity} × Rp ${item.price.toLocaleString('id-ID')}</small>
                    <p class="mb-0 fw-bold text-danger mt-1">Rp ${itemTotal.toLocaleString('id-ID')}</p>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    });

    // Tambah total harga
    html += `
        <div class="border-top pt-3 mt-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <strong>Total Items:</strong>
                <strong>${totalItems} items</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <strong class="fs-5">Total Harga:</strong>
                <strong class="fs-5 text-danger">Rp ${totalPrice.toLocaleString('id-ID')}</strong>
            </div>
        </div>
    `;

    container.innerHTML = html;
    if (totalItemsEl) totalItemsEl.textContent = `${totalItems} items`;
    console.log('✅ Cart modal loaded with', totalItems, 'items');
}

// ============================================
// REMOVE FROM CART
// ============================================
function removeFromCart(index) {
    console.log('🗑️ Removing item at index:', index);
    
    Swal.fire({
        title: 'Hapus dari Keranjang?',
        text: 'Item akan dihapus dari keranjang belanja',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ea6262',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        customClass: {
            popup: 'rounded-4'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            updateCartCount();
            loadCartModalContent();
            
            Swal.fire({
                icon: 'success',
                title: 'Dihapus!',
                text: 'Item berhasil dihapus dari keranjang',
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    popup: 'rounded-4'
                }
            });
            
            console.log('✅ Item removed from cart');
        }
    });
}

// ============================================
// GET AVAILABLE STOCK FOR SIZE (PRODUCT SIZE SYSTEM)
// ============================================
function getAvailableStockForSize(size) {
    if (productData.available_sizes && productData.available_sizes.length > 0) {
        const sizeData = productData.available_sizes.find(s => s.size === size);
        return sizeData ? sizeData.stock : 0;
    }
    
    // Fallback jika tidak ada data available_sizes
    return productData.stock;
}

function getAvailableStock() {
    // Jika ada ukuran yang dipilih, gunakan stok untuk ukuran tersebut
    if (selectedSize) {
        const sizeStock = getAvailableStockForSize(selectedSize);
        console.log(`📦 Stock for ${selectedSize}:`, sizeStock);
        return sizeStock;
    }
    
    // Fallback ke overall product stock
    console.log('📦 Using total stock:', productData.stock);
    return productData.stock;
}

// ============================================
// VALIDATE SIZE SELECTION (PRODUCT SIZE SYSTEM)
// ============================================
function validateSizeSelection() {
    const category = productData.category ? productData.category.toLowerCase() : '';
    
    // Untuk aksesoris, tidak perlu validasi ukuran
    if (category.includes('aksesoris')) {
        return true;
    }
    
    // Untuk produk lain, harus pilih ukuran
    if (!selectedSize) {
        showSizeRequired();
        return false;
    }
    
    // Validasi stok untuk ukuran tertentu
    const availableStock = getAvailableStockForSize(selectedSize);
    if (availableStock < currentQuantity) {
        Swal.fire({
            icon: 'error',
            title: 'Stok Tidak Cukup',
            text: `Hanya tersedia ${availableStock} item untuk ukuran ${selectedSize}`,
            confirmButtonColor: '#ea6262'
        });
        return false;
    }
    
    return true;
}

// ============================================
// EXPORT FUNCTIONS TO GLOBAL SCOPE - DITAMBAH
// ============================================
window.selectSize = selectSize;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.updateQuantityFromInput = updateQuantityFromInput;
window.addToCart = addToCart;
window.sewaSekarang = sewaSekarang;
window.continueShopping = continueShopping;
window.sewa = sewa;
window.removeFromCart = removeFromCart;
window.updateCartCount = updateCartCount;
window.loadCartModalContent = loadCartModalContent;
window.addToWishlist = addToWishlist;
window.shareProduct = shareProduct;

// Export juga sebagai object untuk kompatibilitas
window.detailProduct = {
    selectSize,
    increaseQuantity,
    decreaseQuantity,
    updateQuantityFromInput,
    addToCart,
    sewaSekarang,
    continueShopping,
    sewa,
    removeFromCart,
    updateCartCount,
    loadCartModalContent,
    addToWishlist,
    shareProduct
};

console.log('✅ detail.js loaded successfully - ALL FEATURES READY');
console.log('🎯 Available functions: addToCart(), sewaSekarang(), selectSize(), addToWishlist(), etc.');