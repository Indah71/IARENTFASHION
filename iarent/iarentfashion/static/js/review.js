// static/js/review.js

class ReviewApp {
    constructor() {
        this.currentFilter = new URLSearchParams(window.location.search).get('rating') || '0';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupInteractiveStars();
        this.highlightCurrentFilter();
        console.log('Review App initialized');
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.rating-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFilterClick(e.target);
            });
        });

        // Interactive stars change
        const ratingSelect = document.getElementById('reviewRating');
        if (ratingSelect) {
            ratingSelect.addEventListener('change', (e) => {
                this.updateInteractiveStars(parseInt(e.target.value));
            });
        }

        // Form submission handling
        const reviewForm = document.querySelector('form[action*="submit_review"]');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
    }

    highlightCurrentFilter() {
        document.querySelectorAll('.rating-filter').forEach(btn => {
            const rating = btn.getAttribute('data-rating');
            if (rating === this.currentFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    setupInteractiveStars() {
        const starsContainer = document.getElementById('interactiveStars');
        if (!starsContainer) return;
        
        starsContainer.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = 'bi bi-star-fill star';
            star.style.color = '#ddd';
            star.style.cursor = 'pointer';
            star.style.fontSize = '1.5rem';
            star.style.transition = 'all 0.2s ease';
            
            star.addEventListener('click', () => {
                this.setRating(i);
            });
            
            star.addEventListener('mouseenter', () => {
                this.highlightStars(i);
            });
            
            starsContainer.appendChild(star);
        }
        
        // Set initial rating from select
        const initialRating = document.getElementById('reviewRating')?.value || 5;
        this.updateInteractiveStars(parseInt(initialRating));
    }

    setRating(rating) {
        const ratingSelect = document.getElementById('reviewRating');
        if (ratingSelect) {
            ratingSelect.value = rating;
            this.updateInteractiveStars(rating);
        }
    }

    highlightStars(rating) {
        const stars = document.querySelectorAll('#interactiveStars .star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#ffc107';
                star.style.transform = 'scale(1.1)';
            } else {
                star.style.color = '#ddd';
                star.style.transform = 'scale(1)';
            }
        });
    }

    updateInteractiveStars(rating) {
        const stars = document.querySelectorAll('#interactiveStars .star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.className = 'bi bi-star-fill star';
                star.style.color = '#ffc107';
            } else {
                star.className = 'bi bi-star star';
                star.style.color = '#ddd';
            }
        });
    }

    handleFilterClick(button) {
        const rating = button.getAttribute('data-rating');
        this.currentFilter = rating;
        
        // Update URL without page reload for better UX
        const url = new URL(window.location);
        
        if (rating === '0') {
            url.searchParams.delete('rating');
        } else {
            url.searchParams.set('rating', rating);
        }
        
        // Remove page parameter when changing filters
        url.searchParams.delete('page');
        
        // Navigate to new URL
        window.location.href = url.toString();
    }

    handleFormSubmit(e) {
        const form = e.target;
        const rating = form.querySelector('[name="rating"]').value;
        const comment = form.querySelector('[name="comment"]').value;
        const product = form.querySelector('[name="product"]').value;

        // Client-side validation
        if (!product) {
            e.preventDefault();
            this.showNotification('Pilih produk terlebih dahulu!', 'error');
            return;
        }

        if (!rating) {
            e.preventDefault();
            this.showNotification('Pilih rating!', 'error');
            return;
        }

        if (!comment || comment.length < 10) {
            e.preventDefault();
            this.showNotification('Komentar minimal 10 karakter!', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('#submitReview');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Mengirim...';
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `custom-notification alert alert-${type === 'error' ? 'danger' : 'success'} position-fixed`;
        notification.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            border: none;
            border-radius: 10px;
        `;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'} me-2"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.reviewApp = new ReviewApp();
    
    // Add fade-in animation when scrolling
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

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Show Django messages as notifications
    const messages = document.querySelectorAll('.alert-dismissible');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 5000);
    });
});