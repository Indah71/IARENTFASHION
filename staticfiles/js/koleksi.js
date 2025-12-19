// Konfigurasi
const CONFIG = {
    API_BASE_URL: '/api',
    CART_ENDPOINT: '/cart/add',
    WISHLIST_ENDPOINT: '/wishlist/add',
    CSRF_TOKEN: getCSRFToken()
};

// Utility Functions
function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
    return cookieValue || '';
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

// API Functions
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': CONFIG.CSRF_TOKEN
        },
        credentials: 'same-origin'
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        if (response.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
            return null;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Cart Functions
async function addToCart(productId, productName = null) {
    // Check authentication
    if (!isUserAuthenticated()) {
        showNotification('Silakan login terlebih dahulu untuk menambahkan ke keranjang', 'warning');
        redirectToLogin();
        return;
    }

    try {
        // Show loading state
        const button = event?.target.closest('.btn-cart');
        const originalText = button?.innerHTML;
        if (button) {
            button.innerHTML = '<span class="loading"></span>';
            button.disabled = true;
        }

        const data = await apiRequest(`${CONFIG.API_BASE_URL}${CONFIG.CART_ENDPOINT}`, {
            method: 'POST',
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        });

        if (data && data.success) {
            showNotification(`✅ ${productName || 'Produk'} berhasil ditambahkan ke keranjang`);
            updateCartCount(data.cart_count);
            
            // Visual feedback
            if (button) {
                button.innerHTML = '<i class="bi bi-check-circle"></i> Berhasil';
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-success');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('btn-success');
                    button.classList.add('btn-outline-primary');
                    button.disabled = false;
                }, 2000);
            }
        } else if (data) {
            showNotification(`❌ ${data.message}`, 'danger');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('❌ Terjadi kesalahan saat menambahkan ke keranjang', 'danger');
        
        // Reset button state
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }
}

async function updateCartCount(count = null) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    if (count !== null) {
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline' : 'none';
        });
        return;
    }

    try {
        const data = await apiRequest(`${CONFIG.API_BASE_URL}/cart/count`);
        if (data && data.count !== undefined) {
            cartCountElements.forEach(element => {
                element.textContent = data.count;
                element.style.display = data.count > 0 ? 'inline' : 'none';
            });
        }
    } catch (error) {
        console.error('Error fetching cart count:', error);
    }
}

// Wishlist Functions
async function addToWishlist(productId, productName = null) {
    if (!isUserAuthenticated()) {
        showNotification('Silakan login terlebih dahulu untuk menambahkan ke wishlist', 'warning');
        redirectToLogin();
        return;
    }

    try {
        const button = event?.target.closest('.btn-wishlist');
        const originalHTML = button?.innerHTML;

        if (button) {
            button.innerHTML = '<span class="loading"></span>';
            button.disabled = true;
        }

        const data = await apiRequest(`${CONFIG.API_BASE_URL}${CONFIG.WISHLIST_ENDPOINT}`, {
            method: 'POST',
            body: JSON.stringify({
                product_id: productId
            })
        });

        if (data && data.success) {
            showNotification(`✅ ${productName || 'Produk'} berhasil ditambahkan ke wishlist`);
            
            if (button) {
                button.classList.add('active');
                button.innerHTML = '<i class="bi bi-heart-fill"></i>';
                
                setTimeout(() => {
                    button.disabled = false;
                }, 1000);
            }
        } else if (data) {
            showNotification(`❌ ${data.message}`, 'danger');
            if (button) {
                button.innerHTML = originalHTML;
                button.disabled = false;
            }
        }
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        showNotification('❌ Terjadi kesalahan', 'danger');
        
        if (button) {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }
    }
}

// Authentication Functions
function isUserAuthenticated() {
    // Check if user is authenticated (you might need to adjust this based on your auth system)
    return document.body.getAttribute('data-user-authenticated') === 'true' || 
           window.isAuthenticated === true;
}

function redirectToLogin() {
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
}

// Product Interaction Functions
function goToProductDetail(productId) {
    window.location.href = `/product/${productId}/`;
}

function quickView(productId) {
    // Implement quick view modal
    console.log('Quick view for product:', productId);
    // You can implement a modal here to show product details quickly
}

// Filter and Search Functions
function applyCategoryFilter(category) {
    const url = new URL(window.location.href);
    if (category) {
        url.searchParams.set('category', category);
    } else {
        url.searchParams.delete('category');
    }
    window.location.href = url.toString();
}

function searchProducts(query) {
    const url = new URL(window.location.href);
    if (query) {
        url.searchParams.set('search', query);
    } else {
        url.searchParams.delete('search');
    }
    window.location.href = url.toString();
}

// Sort Functions
function sortProducts(sortBy) {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', sortBy);
    window.location.href = url.toString();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    if (isUserAuthenticated()) {
        updateCartCount();
    }

    // Add event listeners for product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const productId = this.dataset.productId;
                if (productId) {
                    goToProductDetail(productId);
                }
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProducts(e.target.value);
            }, 500);
        });
    }

    // Sort functionality
    const sortSelect = document.querySelector('#sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
            sortProducts(e.target.value);
        });
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Export functions for global access
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.goToProductDetail = goToProductDetail;
window.applyCategoryFilter = applyCategoryFilter;
window.searchProducts = searchProducts;
window.sortProducts = sortProducts;