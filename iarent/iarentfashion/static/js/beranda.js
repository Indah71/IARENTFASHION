// ===== MANUAL SWIPER FIX =====
document.addEventListener("DOMContentLoaded", function () {
  // Initialize swiper TANPA navigation config
  const mainSwiper = new Swiper(".main-swiper", {
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    // HAPUS navigation: {} dari sini
  });

  // Manual event listeners untuk tombol
  const nextButton = document.querySelector('.main-slider-button-next');
  const prevButton = document.querySelector('.main-slider-button-prev');

  if (nextButton) {
    nextButton.style.cursor = 'pointer';
    nextButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Next button clicked');
      mainSwiper.slideNext();
    });
  }

  if (prevButton) {
    prevButton.style.cursor = 'pointer';
    prevButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Prev button clicked');
      mainSwiper.slidePrev();
    });
  }

  console.log('✅ Manual navigation setup complete');
});

// ===== COUNTDOWN TIMER =====
function initializeCountdown() {
  const countdownDate = new Date();
  countdownDate.setDate(countdownDate.getDate() + 7); // 7 hari dari sekarang

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update elements
    const daysElement = document.querySelector(".days");
    const hoursElement = document.querySelector(".hours");
    const minutesElement = document.querySelector(".minutes");
    const secondsElement = document.querySelector(".seconds");

    if (daysElement) daysElement.textContent = days.toString().padStart(2, "0");
    if (hoursElement)
      hoursElement.textContent = hours.toString().padStart(2, "0");
    if (minutesElement)
      minutesElement.textContent = minutes.toString().padStart(2, "0");
    if (secondsElement)
      secondsElement.textContent = seconds.toString().padStart(2, "0");

    if (distance < 0) {
      clearInterval(countdownTimer);
      const countdownClock = document.getElementById("countdown-clock");
      if (countdownClock) {
        countdownClock.innerHTML =
          '<h4 class="text-danger">Promo telah berakhir!</h4>';
      }
    }
  }

  // Update setiap detik
  const countdownTimer = setInterval(updateCountdown, 1000);
  updateCountdown(); // Initial call
}

// ===== AUTHENTICATION FUNCTIONS =====
function redirectToLogin(reason) {
  // Simpan alasan login di sessionStorage
  sessionStorage.setItem("loginReason", reason);

  // Redirect ke login
  window.location.href = "/login/";
}

function handleSewaClick() {
  if (!isAuthenticated) {
    redirectToLogin("sewa");
  } else {
    window.location.href = "/sewa/";
  }
}

// ===== WISHLIST FUNCTIONS =====
function addToWishlist(
  productId,
  productName,
  productPrice,
  productImage,
  productCategory
) {
  if (!isAuthenticated) {
    redirectToLogin("wishlist");
    return;
  }

  // AJAX call untuk menambah wishlist
  fetch("/api/wishlist/add/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      product_id: productId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        loadWishlist();
        showNotification(
          "success",
          data.message || "Produk berhasil ditambahkan ke wishlist!"
        );
      } else {
        showNotification(
          "error",
          data.message || "Gagal menambahkan ke wishlist."
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(
        "error",
        "Terjadi kesalahan saat menambahkan ke wishlist."
      );
    });
}

function loadWishlist() {
  if (!isAuthenticated) return;

  fetch("/api/wishlist/")
    .then((response) => response.json())
    .then((data) => {
      const wishlistCount = document.getElementById("wishlistCount");
      const wishlistItems = document.getElementById("wishlistItems");

      if (wishlistCount) wishlistCount.textContent = data.count;

      if (wishlistItems) {
        if (data.items.length === 0) {
          wishlistItems.innerHTML =
            '<p class="text-muted text-center mb-0">Wishlist Anda kosong</p>';
        } else {
          let wishlistHTML = "";
          data.items.forEach((item) => {
            wishlistHTML += `
                        <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                            <div class="d-flex align-items-center">
                                <img src="${item.image}" alt="${
              item.name
            }" class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
                                <div>
                                    <h6 class="fw-semibold mb-0 small">${
                                      item.name
                                    }</h6>
                                    <small class="text-muted">${
                                      item.category
                                    }</small>
                                </div>
                            </div>
                            <div class="text-end">
                                <span class="text-primary fw-bold small">Rp ${item.price.toLocaleString(
                                  "id-ID"
                                )}</span>
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromWishlist(${
                                  item.id
                                })">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
          });
          wishlistItems.innerHTML = wishlistHTML;
        }
      }
    })
    .catch((error) => {
      console.error("Error loading wishlist:", error);
    });
}

function removeFromWishlist(productId) {
  fetch("/api/wishlist/remove/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      product_id: productId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        loadWishlist();
        showNotification(
          "success",
          data.message || "Produk berhasil dihapus dari wishlist!"
        );
      } else {
        showNotification(
          "error",
          data.message || "Gagal menghapus dari wishlist."
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(
        "error",
        "Terjadi kesalahan saat menghapus dari wishlist."
      );
    });
}

// ===== CART FUNCTIONS =====
function addToCart(productId, quantity = 1) {
  if (!isAuthenticated) {
    redirectToLogin("cart");
    return;
  }

  fetch("/api/cart/add/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        loadCart();
        showNotification(
          "success",
          data.message || "Produk berhasil ditambahkan ke keranjang!"
        );
      } else {
        showNotification(
          "error",
          data.message || "Gagal menambahkan ke keranjang."
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(
        "error",
        "Terjadi kesalahan saat menambahkan ke keranjang."
      );
    });
}

function loadCart() {
  if (!isAuthenticated) return;

  fetch("/api/cart/")
    .then((response) => response.json())
    .then((data) => {
      const cartCount = document.getElementById("cartCount");
      const cartItems = document.getElementById("cartItems");

      if (cartCount) cartCount.textContent = data.total_items;

      if (cartItems) {
        if (data.items.length === 0) {
          cartItems.innerHTML =
            '<p class="text-muted text-center mb-0">Keranjang Anda kosong</p>';
        } else {
          let cartHTML = "";
          data.items.forEach((item) => {
            const itemTotal = item.price * item.quantity;

            cartHTML += `
                        <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                            <div class="d-flex align-items-center">
                                <img src="${item.image}" alt="${
              item.name
            }" class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
                                <div>
                                    <h6 class="fw-semibold mb-0 small">${
                                      item.name
                                    }</h6>
                                    <small class="text-muted">${
                                      item.category
                                    }</small>
                                    <div class="d-flex align-items-center mt-1">
                                        <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="updateCartQuantity(${
                                          item.id
                                        }, -1)">-</button>
                                        <span class="mx-2 small">${
                                          item.quantity
                                        }</span>
                                        <button class="btn btn-sm btn-outline-secondary p-0" style="width: 20px; height: 20px;" onclick="updateCartQuantity(${
                                          item.id
                                        }, 1)">+</button>
                                    </div>
                                </div>
                            </div>
                            <div class="text-end">
                                <span class="text-primary fw-bold small">Rp ${itemTotal.toLocaleString(
                                  "id-ID"
                                )}</span>
                                <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart(${
                                  item.id
                                })">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
          });

          cartHTML += `
                    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                        <span class="fw-bold">Total:</span>
                        <span class="fw-bold text-primary">Rp ${data.total_price.toLocaleString(
                          "id-ID"
                        )}</span>
                    </div>
                `;

          cartItems.innerHTML = cartHTML;
        }
      }
    })
    .catch((error) => {
      console.error("Error loading cart:", error);
    });
}

function updateCartQuantity(productId, change) {
  fetch("/api/cart/update/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      product_id: productId,
      quantity_change: change,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        loadCart();
        showNotification(
          "success",
          data.message || "Keranjang berhasil diperbarui!"
        );
      } else {
        showNotification(
          "error",
          data.message || "Gagal memperbarui keranjang."
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(
        "error",
        "Terjadi kesalahan saat memperbarui keranjang."
      );
    });
}

function removeFromCart(productId) {
  fetch("/api/cart/remove/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      product_id: productId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        loadCart();
        showNotification(
          "success",
          data.message || "Produk berhasil dihapus dari keranjang!"
        );
      } else {
        showNotification(
          "error",
          data.message || "Gagal menghapus dari keranjang."
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(
        "error",
        "Terjadi kesalahan saat menghapus dari keranjang."
      );
    });
}

// ===== UTILITY FUNCTIONS =====
function showNotification(type, message) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: type,
    title: message,
  });
}

// Global variables (akan di-set oleh inline script di template)
let csrftoken = "";
let isAuthenticated = false;