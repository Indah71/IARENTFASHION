// Fungsi untuk format Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Fungsi untuk filter pesanan - FIXED VERSION
function initializeFilter() {
    const filterButtons = document.querySelectorAll('.btn-outline-primary[data-filter]');
    const orderCards = document.querySelectorAll('.order-card');
    
    console.log('🔍 Filter buttons found:', filterButtons.length);
    console.log('🔍 Order cards found:', orderCards.length);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('🔄 Filter clicked:', this.getAttribute('data-filter'));
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline-primary');
            });
            
            // Add active class to clicked button
            this.classList.remove('btn-outline-primary');
            this.classList.add('btn-primary', 'active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter orders
            let visibleCount = 0;
            orderCards.forEach(card => {
                const cardStatus = card.getAttribute('data-status');
                
                if (filter === 'all' || cardStatus === filter) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            console.log(`✅ Filter "${filter}" applied. Visible: ${visibleCount} orders`);
            
            // Show message if no orders match filter
            const emptyState = document.querySelector('.empty-state');
            if (emptyState) {
                emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    });
    
    // Set initial active state
    const activeButton = document.querySelector('.btn-outline-primary.active[data-filter]');
    if (activeButton) {
        activeButton.classList.remove('btn-outline-primary');
        activeButton.classList.add('btn-primary');
    }
}

// Fungsi untuk format Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Fungsi untuk menambah review
function addReview(orderId) {
    // Redirect ke halaman review atau buka modal
    window.location.href = `/review/?order=${orderId}`;
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Pesanan page initialized');
    initializeFilter();
    
    // Debug: Log semua order status
    const orderCards = document.querySelectorAll('.order-card');
    orderCards.forEach((card, index) => {
        const status = card.getAttribute('data-status');
        const orderNumber = card.querySelector('h5')?.textContent || 'Unknown';
        console.log(`📦 Order ${index + 1}: ${orderNumber}, Status: ${status}`);
    });
});

// Fungsi untuk menampilkan detail pesanan
function showOrderDetail(orderNumber) {
    // Implementasi detail pesanan (bisa modal atau redirect ke detail page)
    alert(`Detail pesanan: ${orderNumber}\n\nFitur detail pesanan akan segera tersedia!`);
}

// Fungsi untuk membatalkan pesanan - FIXED VERSION
function cancelOrder(orderId) {
    console.log(`🔄 Memproses cancel order ID: ${orderId}`);
    
    if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
        // Tampilkan loading
        const cancelBtn = event.target;
        const originalText = cancelBtn.innerHTML;
        cancelBtn.innerHTML = '<i class="bi bi-arrow-repeat spinner"></i> Memproses...';
        cancelBtn.disabled = true;
        
        // PERBAIKAN: Gunakan FormData untuk mengirim CSRF token dengan benar
        const formData = new FormData();
        formData.append('csrfmiddlewaretoken', getCsrfToken());
        
        fetch(`/pesanan/${orderId}/cancel/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            
            if (data.success) {
                alert('Pesanan berhasil dibatalkan!');
                location.reload(); // Refresh halaman
            } else {
                alert('Gagal membatalkan pesanan: ' + data.message);
                // Reset button
                cancelBtn.innerHTML = originalText;
                cancelBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat membatalkan pesanan.');
            // Reset button
            cancelBtn.innerHTML = originalText;
            cancelBtn.disabled = false;
        });
    }
}

// Fungsi untuk mendapatkan CSRF token - IMPROVED
function getCsrfToken() {
    // Coba dari meta tag pertama
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfTokenMeta) {
        return csrfTokenMeta.getAttribute('content');
    }
    
    // Coba dari input hidden
    const csrfTokenInput = document.querySelector('[name=csrfmiddlewaretoken]');
    if (csrfTokenInput) {
        return csrfTokenInput.value;
    }
    
    // Coba dari cookie sebagai fallback
    const cookieValue = getCookie('csrftoken');
    if (cookieValue) {
        return cookieValue;
    }
    
    console.error('❌ CSRF token tidak ditemukan!');
    return '';
}

// Helper function untuk get cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Fungsi untuk menampilkan detail pesanan - PERBAIKAN
function showOrderDetail(orderId) {
    // Redirect ke halaman detail pesanan
    window.location.href = `/pesanan/${orderId}/detail/`;
}

// Fungsi untuk mendapatkan CSRF token - PERBAIKAN
function getCsrfToken() {
    // Cari CSRF token di meta tag atau input hidden
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfTokenMeta) {
        return csrfTokenMeta.getAttribute('content');
    }
    
    const csrfTokenInput = document.querySelector('[name=csrfmiddlewaretoken]');
    if (csrfTokenInput) {
        return csrfTokenInput.value;
    }
    
    // Fallback: cari di cookie
    return getCookie('csrftoken');
}

// Helper function untuk get cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}