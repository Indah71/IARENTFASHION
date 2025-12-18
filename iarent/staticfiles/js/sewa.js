// Global variables
const { jsPDF } = window.jspdf;
let products = [];
let paymentTimer;
let timeLeft = 300;
let currentStep = 1;


// ============================================
// FUNGSI UNTUK INISIALISASI PRODUK DARI TEMPLATE - PERBAIKAN
// ============================================

function initProductsFromTemplate() {
    console.log('🔄 Inisialisasi produk dari template Django...');
    
    // Ambil data produk dari elemen HTML yang sudah ada
    const orderItems = document.querySelectorAll('.order-item');
    
    if (orderItems.length === 0) {
        console.log('⚠️ Tidak ada produk di template');
        products = [];
        return;
    }
    
    // Reset array products
    products = [];
    
    orderItems.forEach((item, index) => {
        const productId = item.getAttribute('data-product-id');
        const name = item.querySelector('h6')?.textContent?.trim() || '';
        const priceText = item.querySelector('.text-primary')?.textContent?.trim() || '0';
        const price = parseFloat(priceText.replace('Rp', '').replace('/hari', '').replace(/\./g, '').replace(',', '').trim()) || 0;
        
        // Ambil size dan quantity dari teks
        const metaText = item.querySelector('small')?.textContent || '';
        const sizeMatch = metaText.match(/Ukuran:\s*([A-Z0-9]+)/i);
        const qtyMatch = metaText.match(/Qty:\s*(\d+)/i);
        
        // ⭐ PERBAIKAN: Ambil gambar dengan benar
        const imgElement = item.querySelector('img');
        let image = '/static/img/no-image.jpg'; // Default
        
        if (imgElement) {
            // Ambil src dari img tag
            const imgSrc = imgElement.getAttribute('src') || imgElement.src;
            
            // Validasi URL gambar
            if (imgSrc && !imgSrc.includes('undefined') && !imgSrc.includes('null')) {
                image = imgSrc;
            }
        }
        
        const productData = {
            id: parseInt(productId) || 0,
            name: name,
            price: price,
            priceRaw: price,
            image: image,
            size: sizeMatch ? sizeMatch[1] : 'M',
            quantity: qtyMatch ? parseInt(qtyMatch[1]) : 1,
            category: 'Fashion'
        };
        
        console.log(`📦 Produk ${index + 1}:`, productData);
        products.push(productData);
    });
    
    console.log(`✅ Total ${products.length} produk berhasil dimuat dari template`);
    
    // Update global totals
    updateTotalFromTemplate();
}

// Fungsi untuk update total dari data template
function updateTotalFromTemplate() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    
    if (!startDate || !endDate || products.length === 0) {
        console.log('⚠️ Tidak bisa update total: tanggal atau produk kosong');
        return;
    }
    
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1;
    
    let totalSewa = 0;
    
    products.forEach(product => {
        totalSewa += product.price * days * product.quantity;
    });
    
    // Deposit 10%
    const deposit = Math.round(totalSewa * 0.10);
    const totalBayar = totalSewa + deposit;
    
    console.log('💰 Total dari template:', { totalSewa, deposit, totalBayar, days });
    
    // Update elemen UI
    const sewaSummary = document.getElementById('sewaSummary');
    const depositSummary = document.getElementById('depositSummary');
    const totalBayarElement = document.getElementById('totalBayar');
    
    if (sewaSummary) sewaSummary.textContent = `Rp ${totalSewa.toLocaleString('id-ID')}`;
    if (depositSummary) depositSummary.textContent = `Rp ${deposit.toLocaleString('id-ID')}`;
    if (totalBayarElement) totalBayarElement.textContent = `Rp ${totalBayar.toLocaleString('id-ID')}`;
}

// Fungsi untuk update total dari data template
function updateTotalFromTemplate() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    
    if (!startDate || !endDate || products.length === 0) {
        console.log('⚠️ Tidak bisa update total: tanggal atau produk kosong');
        return;
    }
    
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1;
    
    let totalSewa = 0;
    
    products.forEach(product => {
        totalSewa += product.price * days * product.quantity;
    });
    
    // Deposit 10%
    const deposit = Math.round(totalSewa * 0.10);
    const totalBayar = totalSewa + deposit;
    
    console.log('💰 Total dari template:', { totalSewa, deposit, totalBayar, days });
    
    // Update elemen UI
    const sewaSummary = document.getElementById('sewaSummary');
    const depositSummary = document.getElementById('depositSummary');
    const totalBayarElement = document.getElementById('totalBayar');
    
    if (sewaSummary) sewaSummary.textContent = `Rp ${totalSewa.toLocaleString('id-ID')}`;
    if (depositSummary) depositSummary.textContent = `Rp ${deposit.toLocaleString('id-ID')}`;
    if (totalBayarElement) totalBayarElement.textContent = `Rp ${totalBayar.toLocaleString('id-ID')}`;
}

// Fungsi untuk update total dari data template
function updateTotalFromTemplate() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    
    if (!startDate || !endDate || products.length === 0) {
        console.log('⚠️ Tidak bisa update total: tanggal atau produk kosong');
        return;
    }
    
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1;
    
    let totalSewa = 0;
    
    products.forEach(product => {
        totalSewa += product.price * days * product.quantity;
    });
    
    // Deposit 10%
    const deposit = Math.round(totalSewa * 0.10);
    const totalBayar = totalSewa + deposit;
    
    console.log('💰 Total dari template:', { totalSewa, deposit, totalBayar, days });
    
    // Update elemen UI jika diperlukan
    // (Data sudah ada di template, tapi kita update juga untuk konsistensi)
    const sewaSummary = document.getElementById('sewaSummary');
    const depositSummary = document.getElementById('depositSummary');
    const totalBayarElement = document.getElementById('totalBayar');
    
    if (sewaSummary) sewaSummary.textContent = `Rp ${totalSewa.toLocaleString('id-ID')}`;
    if (depositSummary) depositSummary.textContent = `Rp ${deposit.toLocaleString('id-ID')}`;
    if (totalBayarElement) totalBayarElement.textContent = `Rp ${totalBayar.toLocaleString('id-ID')}`;
}

// Utility functions
function formatRupiah(n) { 
    return `Rp ${n.toLocaleString('id-ID')}`; 
}

// Fungsi untuk mengambil data produk dari database
async function fetchProductData(productId) {
    try {
        const response = await fetch(`/api/products/${productId}/`);
        if (!response.ok) {
            throw new Error('Product not found');
        }
        const product = await response.json();
        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// Fungsi untuk mengambil data dari URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        product: params.get('product'),
        size: params.get('size'),
        qty: params.get('qty') || 1
    };
}

// Product management
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentQuantity = parseInt(quantityInput.value);
    quantityInput.value = currentQuantity + 1;
    updateProductQuantity(currentQuantity + 1);
    updateTotal();
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentQuantity = parseInt(quantityInput.value);
    if (currentQuantity > 1) {
        quantityInput.value = currentQuantity - 1;
        updateProductQuantity(currentQuantity - 1);
        updateTotal();
    }
}

function updateProductQuantity(newQuantity) {
    if (products.length > 0) {
        products[0].quantity = newQuantity;
        if (products.length === 1) {
            displaySingleProduct(products[0]);
        }
    }
    updateTotal();
}

// Fungsi utama untuk load produk ke halaman sewa
async function loadProduct() {
    console.log('🔄 Memuat produk untuk sewa...');
    
    // Cek apakah sudah ada produk di template Django
    const hasTemplateProducts = document.querySelectorAll('.order-item').length > 0;
    
    if (hasTemplateProducts) {
        console.log('✅ Produk sudah ada di template Django');
        initProductsFromTemplate();
        return;
    }
    
    // Jika tidak ada produk di template, coba load dari localStorage atau API
    const urlParams = getUrlParams();
    let productsToDisplay = [];
    
    // Priority 1: URL parameters (dari halaman detail)
    if (urlParams.product) {
        console.log('📦 Loading dari URL parameters:', urlParams);
        const productData = await fetchProductData(urlParams.product);
        if (productData) {
            productsToDisplay = [{
                id: productData.id,
                name: productData.name,
                price: parseFloat(productData.price),
                image: productData.image || '/static/img/no-image.jpg',
                category: productData.category_name || 'Fashion',
                size: urlParams.size || 'M',
                quantity: parseInt(urlParams.qty) || 1
            }];
        }
    }
    // Priority 2: localStorage (fallback)
    else {
        console.log('💾 Mengambil dari localStorage...');
        const storedProducts = JSON.parse(localStorage.getItem('checkoutProducts') || 
                                          localStorage.getItem('cartItems') || '[]');
        
        if (Array.isArray(storedProducts) && storedProducts.length > 0) {
            productsToDisplay = storedProducts;
        }
    }
    
    // Jika berhasil mendapatkan produk, tampilkan
    if (productsToDisplay.length > 0) {
        products = productsToDisplay;
        displayProducts(productsToDisplay);
    }
}

// Fungsi untuk menampilkan produk
function displayProducts(productsArray) {
    const orderList = document.getElementById('order-list-items');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!orderList) return;
    
    // Reset global products variable
    products = productsArray;
    
    if (!productsArray || productsArray.length === 0) {
        orderList.innerHTML = '';
        if (emptyCart) emptyCart.classList.remove('hidden');
        updateTotal(); // Update total menjadi 0
        return;
    }
    
    let html = '';
    
    // Single product
    if (productsArray.length === 1) {
        const product = productsArray[0];
        html = `
            <div class="order-item" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='/static/img/no-image.jpg'">
                <div class="flex-grow-1">
                    <p class="item-name">${product.name}</p>
                    <p class="item-meta">
                        ${product.category || 'Fashion'} • 
                        Ukuran: <strong>${product.size || 'M'}</strong> • 
                        Qty: 
                        <span class="quantity-controls">
                            <button class="btn-qty-minus" onclick="decreaseQuantity()">-</button>
                            <span id="currentQuantity">${product.quantity || 1}</span>
                            <button class="btn-qty-plus" onclick="increaseQuantity()">+</button>
                        </span>
                    </p>
                    <p class="item-price mt-1">${formatRupiah(product.price)}/hari</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeProduct(${product.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Update quantity input
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.value = product.quantity || 1;
        }
    }
    // Multiple products
    else {
        productsArray.forEach(product => {
            const price = parseFloat(product.price) || 0;
            const quantity = product.quantity || 1;
            
            html += `
                <div class="order-item mb-3" data-product-id="${product.id}">
                    <div class="d-flex align-items-center">
                        <img src="${product.image}" alt="${product.name}" 
                             class="rounded me-3" 
                             style="width: 70px; height: 70px; object-fit: cover;"
                             onerror="this.src='/static/img/no-image.jpg'">
                        <div class="flex-grow-1">
                            <h6 class="mb-1 fw-bold">${product.name}</h6>
                            <p class="text-muted small mb-1">
                                ${product.category || 'Fashion'} • 
                                Ukuran: <strong>${product.size || 'M'}</strong> • 
                                Qty: <strong>${quantity}</strong>
                            </p>
                            <p class="mb-0 text-primary fw-bold">
                                ${formatRupiah(price)}/hari
                            </p>
                        </div>
                        <div class="ms-3">
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="removeProduct(${product.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    orderList.innerHTML = html;
    if (emptyCart) emptyCart.classList.add('hidden');
    
    // Update total
    updateTotal();
}

// Fungsi untuk menghapus produk dari list
function removeProduct(productId) {
    if (confirm('Hapus produk dari daftar sewa?')) {
        // Hapus dari array products
        const index = products.findIndex(p => p.id == productId);
        if (index !== -1) {
            products.splice(index, 1);
            
            // Update display
            displayProducts(products);
            
            // Update localStorage
            localStorage.setItem('cartItems', JSON.stringify(products));
            
            // Show notification
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'Dihapus!',
                    text: 'Produk dihapus dari daftar sewa',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        }
    }
}

// Update fungsi quantity untuk single product
function increaseQuantity() {
    if (products.length === 1) {
        products[0].quantity = (products[0].quantity || 1) + 1;
        displayProducts(products);
        updateTotal();
    }
}

function decreaseQuantity() {
    if (products.length === 1 && products[0].quantity > 1) {
        products[0].quantity -= 1;
        displayProducts(products);
        updateTotal();
    }
}

function displayMultipleProducts(products) {
    let html = '';
    products.forEach(product => {
        const price = parseInt(product.price || product.priceRaw || 0);
        const image = product.image || 'https://via.placeholder.com/60';
        const category = product.category || 'Produk';
        const size = product.size || '-';
        const quantity = product.quantity || 1;
        
        html += `
            <div class="order-item">
                <img src="${image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/60'">
                <div>
                    <p class="item-name">${product.name}</p>
                    <p class="item-meta">${category} • Ukuran: ${size} • Qty: ${quantity}</p>
                </div>
                <div class="item-price">${formatRupiah(price)}/hari</div>
            </div>
        `;
    });
    document.getElementById('order-list-items').innerHTML = html;
    document.getElementById('empty-cart').classList.add('hidden');
}

function displaySingleProduct(product) {
    const price = parseInt(product.price || product.priceRaw || 0);
    const image = product.image || 'https://via.placeholder.com/60';
    const category = product.category || 'Produk';
    const size = product.size || '-';
    const quantity = product.quantity || 1;

    document.getElementById('order-list-items').innerHTML = `
        <div class="order-item">
            <img src="${image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/60'">
            <div>
                <p class="item-name">${product.name}</p>
                <p class="item-meta">${category} • Ukuran: ${size} • Qty: ${quantity}</p>
            </div>
            <div class="item-price">${formatRupiah(price)}/hari</div>
        </div>
    `;
    document.getElementById('empty-cart').classList.add('hidden');
    
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.value = quantity;
    }
}

function updateTotal() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    
    if (!start || !end || products.length === 0) return;

    const days = Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1;
    
    let totalSewa = 0;
    
    products.forEach(product => {
        const price = parseInt(product.price || product.priceRaw || 0);
        const quantity = product.quantity || 1;
        totalSewa += price * days * quantity;
    });
    
    // UBAH DEPOSIT MENJADI 10% (Deposit (10%)
    const deposit = Math.round(totalSewa * 0.10);
    const totalBayar = totalSewa + deposit;

    document.getElementById('totalSewa').textContent = formatRupiah(totalSewa);
    document.getElementById('depositAmount').textContent = formatRupiah(deposit);
    document.getElementById('totalBayarTempat').textContent = formatRupiah(totalBayar);
    document.getElementById('sewaSummary').textContent = formatRupiah(totalSewa);
    document.getElementById('depositSummary').textContent = formatRupiah(deposit);
    document.getElementById('totalBayar').textContent = formatRupiah(totalBayar);
    
    // Update text untuk QRIS
    document.getElementById('depositBayarQris').textContent = formatRupiah(deposit);
    document.getElementById('depositAmountText').textContent = formatRupiah(deposit);
}

// PERBAIKAN: Fungsi generatePDF dengan pop-up blocker handling
// function generatePDF() {
//     console.log('🎯 Memulai generate PDF...');
    
//     // Cek apakah element invoicePreview ada
//     let preview = document.getElementById('invoicePreview');
    
//     // Jika tidak ada, buat elementnya
//     if (!preview) {
//         console.log('📝 Membuat element invoicePreview...');
//         preview = document.createElement('div');
//         preview.id = 'invoicePreview';
//         preview.style.cssText = `
//             position: absolute;
//             left: -9999px;
//             top: -9999px;
//             width: 500px;
//             background: white;
//             padding: 20px;
//             font-family: Arial, sans-serif;
//         `;
//         document.body.appendChild(preview);
//     }
    
//     // Generate HTML invoice
//     preview.innerHTML = generateInvoiceHTML();
    
//     console.log('✅ Invoice HTML berhasil dibuat');

//     // Update status
//     updateDownloadStatus('loading', 'Membuat struk PDF...');

//     // Gunakan html2canvas + jsPDF dengan error handling yang lebih baik
//     html2canvas(preview, { 
//         scale: 2,
//         useCORS: true,
//         backgroundColor: '#ffffff',
//         logging: true,
//         allowTaint: true
//     }).then(canvas => {
//         console.log('✅ HTML2Canvas berhasil');
        
//         const imgData = canvas.toDataURL('image/png');
//         const pdf = new jsPDF('p', 'mm', 'a5');
//         const imgWidth = 148;
//         const pageHeight = 210;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;
//         let heightLeft = imgHeight;
//         let position = 0;

//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;

//         while (heightLeft >= 0) {
//             position = heightLeft - imgHeight;
//             pdf.addPage();
//             pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;
//         }

//         const name = document.getElementById('fullName')?.value?.replace(/ /g, '-') || 'customer';
//         const fileName = `struk-IA-${name}-${Date.now()}.pdf`;
        
//         // PERBAIKAN: Handle pop-up blocker dengan multiple methods
//         try {
//             // Method 1: Coba save langsung
//             pdf.save(fileName);
//             console.log('✅ PDF berhasil diunduh:', fileName);
//             updateDownloadStatus('success', 'Struk berhasil diunduh!');
//             showPDFSuccessNotification();
//         } catch (saveError) {
//             console.error('❌ Error save PDF (mungkin pop-up blocker):', saveError);
            
//             // Method 2: Coba dengan blob download
//             try {
//                 const pdfBlob = pdf.output('blob');
//                 const url = URL.createObjectURL(pdfBlob);
//                 const a = document.createElement('a');
//                 a.href = url;
//                 a.download = fileName;
//                 a.style.display = 'none';
//                 document.body.appendChild(a);
//                 a.click();
//                 document.body.removeChild(a);
//                 URL.revokeObjectURL(url);
                
//                 console.log('✅ PDF berhasil diunduh via blob:', fileName);
//                 updateDownloadStatus('success', 'Struk berhasil diunduh!');
//                 showPDFSuccessNotification();
//             } catch (blobError) {
//                 console.error('❌ Error blob download:', blobError);
                
//                 // Method 3: Tampilkan manual download instruction
//                 updateDownloadStatus('error', 'Download diblokir browser. Klik tombol manual.');
//                 showManualDownloadInstruction();
//             }
//         }
        
//     }).catch(error => {
//         console.error('❌ Error generate PDF:', error);
//         updateDownloadStatus('error', 'Gagal membuat PDF: ' + error.message);
        
//         // Fallback: coba lagi setelah 3 detik
//         setTimeout(() => {
//             console.log('🔄 Mencoba generate PDF lagi...');
//             generatePDF();
//         }, 3000);
//     });
// }

// PDF GENERATOR TERBARU 2025 — 100% AUTO DOWNLOAD DI SEMUA HP (Chrome, Safari, Samsung, dll)
// PAKAI jsPDF MURNI + BLOB + KLIK OTOMATIS → TIDAK BISA DIBLOKIR LAGI!
function generatePDF() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        updateDownloadStatus('error', 'jsPDF tidak terload. Refresh halaman!');
        return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');

    // Ambil data
    const name     = document.getElementById('fullName')?.value?.trim() || 'Pelanggan';
    const phone    = document.getElementById('phone')?.value?.trim() || '-';
    const email    = document.getElementById('email')?.value?.trim() || '-';
    const start    = document.getElementById('startDate')?.value || '-';
    const end      = document.getElementById('endDate')?.value || '-';
    const sewa     = document.getElementById('sewaSummary')?.textContent || 'Rp 0';
    const deposit  = document.getElementById('depositSummary')?.textContent || 'Rp 0';
    const total    = document.getElementById('totalBayar')?.textContent || 'Rp 0';
    const days     = Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1 || 1;
    const invoiceNo = `IA${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}${new Date().getDate().toString().padStart(2,'0')}${String(Math.floor(Math.random()*899+100))}`;

    // Header
    doc.setFontSize(26);
    doc.setTextColor(220, 53, 69);
    doc.text('IA RENT FASHION', 105, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Jl. Brigjend H. Hasan Basri, Pangeran, Banjarmasin', 105, 33, { align: 'center' });
    doc.text('Telp: 0811-2223-3344 • iarentfashion@gmail.com', 105, 39, { align: 'center' });

    doc.setDrawColor(220, 53, 69);
    doc.setLineWidth(1.5);
    doc.line(15, 45, 195, 45);

    // Judul & Invoice
    doc.setFontSize(20);
    doc.setTextColor(0);
    doc.text('STRUK PENYEWAAN', 105, 58, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`No. Invoice: #${invoiceNo}`, 105, 66, { align: 'center' });

    // Info Pelanggan
    let y = 80;
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text('Nama       :', 20, y); doc.setTextColor(0); doc.setFont('helvetica','bold'); doc.text(name, 55, y); doc.setFont('helvetica','normal');
    y += 8; doc.setTextColor(80);
    doc.text('Telepon    :', 20, y); doc.setTextColor(0); doc.text(phone, 55, y);
    y += 8; doc.setTextColor(80);
    doc.text('Email      :', 20, y); doc.setTextColor(0); doc.text(email, 55, y);
    y += 8; doc.setTextColor(80);
    doc.text('Periode    :', 20, y); doc.setTextColor(0); doc.text(`${start} s/d ${end} (${days} hari)`, 55, y);

    // Tabel Produk
    // TABEL PRODUK — DIPERBAIKI SUPAYA TIDAK NUMPUK LAGI
    // TABEL PRODUK — POSISI TELAH DIPERBAIKI
    y += 20;

    // HEADER TABEL
    doc.setFillColor(248, 249, 250);
    doc.rect(15, y, 180, 13, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);

    // PERBAIKAN POSISI: 
    doc.text('Produk', 18, y + 8);                    // x: 18
    doc.text('Ukuran', 75, y + 8);                    // x: 75 (dari 78)
    doc.text('Harga/hari', 115, y + 8);               // x: 115 (dari 108) 
    doc.text('Subtotal', 165, y + 8, { align: 'right' }); // x: 165 (dari 192)

    y += 15;
    doc.setDrawColor(180);
    doc.line(15, y - 4, 195, y - 4);

    // KONTEN PRODUK
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    products.forEach(p => {
        const price = parseInt(p.price || p.priceRaw || 0);
        const qty = p.quantity || 1;
        const subtotal = price * days * qty;

        const namaProduk = p.name.length > 25 ? p.name.substring(0, 25) + '...' : p.name;

        // PERBAIKAN POSISI (SESUAI HEADER):
        doc.text(namaProduk, 18, y);                              // x: 18
        doc.text(p.size || '-', 75, y);                           // x: 75  
        doc.text(formatRupiah(price) + '/hari', 115, y);          // x: 115
        doc.text(formatRupiah(subtotal), 165, y, { align: 'right' }); // x: 165
        
        y += 12;
    });

    doc.line(15, y, 195, y);

    // Total
    y += 15;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Biaya Sewa:', 130, y);
    doc.text(sewa, 192, y, { align: 'right' });

    y += 9;
    doc.text('Deposit (10%):', 130, y);
    doc.text(deposit, 192, y, { align: 'right' });

    y += 20;
    doc.setFontSize(20);
    doc.setTextColor(220, 53, 69);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL BAYAR SAAT AMBIL:', 105, y, { align: 'center' });
    y += 12;
    doc.setFontSize(28);
    doc.text(total, 105, y, { align: 'center' });

    // Footer
    y += 35;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('• Wajib bawa KTP asli saat pengambilan', 20, y); y += 6;
    doc.text('• Deposit dikembalikan maksimal 1×24 jam setelah pengecekan', 20, y); y += 6;
    doc.text('• Denda 2× harga sewa jika terlambat lebih dari 1 hari', 20, y);

    y += 12;
    doc.setFontSize(14);
    doc.setTextColor(220, 53, 69);
    doc.text('Terima kasih atas kepercayaan Anda!', 105, y, { align: 'center' });

    y += 8;
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, 105, y, { align: 'center' });

    // INI YANG BIKIN 100% BERHASIL DOWNLOAD OTOMATIS
    try {
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const fileName = `Struk-IA-Rent-${name.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.pdf`;

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        updateDownloadStatus('success', 'Struk berhasil diunduh otomatis!');
        showPDFSuccessNotification();

    } catch (err) {
        console.error('Download gagal:', err);
        updateDownloadStatus('error', 'Gagal unduh otomatis. Klik tombol manual.');
    }
}

// PERBAIKAN: Update status download dengan state 'info'
function updateDownloadStatus(status, message) {
    const downloadStatus = document.getElementById('downloadStatus');
    const downloadBtn = document.getElementById('downloadPdfBtn');
    
    console.log(`📊 Download Status: ${status} - ${message}`);
    
    if (downloadStatus) {
        if (status === 'success') {
            downloadStatus.innerHTML = `<i class="bi bi-check-circle text-success"></i> ${message}`;
            downloadStatus.className = 'small mb-0 text-success';
        } else if (status === 'error') {
            downloadStatus.innerHTML = `<i class="bi bi-exclamation-triangle text-danger"></i> ${message}`;
            downloadStatus.className = 'small mb-0 text-danger';
        } else if (status === 'loading') {
            downloadStatus.innerHTML = `<i class="bi bi-hourglass-split text-warning"></i> ${message}`;
            downloadStatus.className = 'small mb-0 text-warning';
        } else if (status === 'info') {
            downloadStatus.innerHTML = `<i class="bi bi-info-circle text-info"></i> ${message}`;
            downloadStatus.className = 'small mb-0 text-info';
        }
    }
    
    if (downloadBtn) {
        if (status === 'success') {
            downloadBtn.innerHTML = '<i class="bi bi-check-circle"></i> Struk Terunduh!';
            downloadBtn.className = 'btn btn-success';
            
            // Reset setelah 5 detik
            setTimeout(() => {
                if (downloadBtn.innerHTML.includes('Struk Terunduh!')) {
                    downloadBtn.innerHTML = '<i class="bi bi-download"></i> Unduh Ulang Struk';
                    downloadBtn.className = 'btn btn-primary';
                }
            }, 5000);
        } else if (status === 'error') {
            downloadBtn.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Coba Lagi';
            downloadBtn.className = 'btn btn-danger';
        } else if (status === 'loading') {
            downloadBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Membuat PDF...';
            downloadBtn.className = 'btn btn-warning';
            downloadBtn.disabled = true;
        } else {
            downloadBtn.innerHTML = '<i class="bi bi-download"></i> Unduh Struk PDF';
            downloadBtn.className = 'btn btn-primary';
            downloadBtn.disabled = false;
        }
    }
}

// STEP MANAGEMENT
function updateUI(targetStep) {
    console.log(`🔄 Pindah ke step ${targetStep}`);
    
    // Update stepper UI
    document.querySelectorAll('.step').forEach(s => {
        const stepNumber = +s.dataset.step;
        s.classList.remove('active', 'done');
        if (stepNumber < targetStep) s.classList.add('done');
        if (stepNumber === targetStep) s.classList.add('active');
    });
    
    // Hide all sections
    const sections = {
        1: document.getElementById('step-1-content'),
        2: document.getElementById('step-2-content'),
        3: document.getElementById('step-3-content'),
        4: document.getElementById('step-4-content'),
        5: document.getElementById('step-5-content')
    };
    
    Object.values(sections).forEach(section => {
        if (section) {
            section.style.display = 'none';
            section.classList.add('hidden');
        }
    });
    
    // Show target section
    if (sections[targetStep]) {
        sections[targetStep].style.display = 'block';
        sections[targetStep].classList.remove('hidden');
    }
    
    currentStep = targetStep;
    
    // Execute step-specific actions
    switch(targetStep) {
        case 3:
            startPaymentTimer();
            break;
        case 4:
            showConfirm();
            break;
        case 5:
            showSuccessStep();
            break;
    }
}


// PERBAIKAN: Show Success Step dengan user interaction handling
// function showSuccessStep() {
//     console.log('🎉 Menampilkan halaman sukses');
    
//     // Update status download
//     updateDownloadStatus('loading', 'Mempersiapkan struk PDF...');
    
//     // Clear localStorage
//     localStorage.removeItem('cartItems');
//     localStorage.removeItem('checkoutProducts');
//     localStorage.removeItem('selectedProduct');
    
//     // Pastikan element invoicePreview ada
//     let preview = document.getElementById('invoicePreview');
//     if (!preview) {
//         preview = document.createElement('div');
//         preview.id = 'invoicePreview';
//         preview.style.cssText = `
//             position: absolute;
//             left: -9999px;
//             top: -9999px;
//             width: 500px;
//             background: white;
//             padding: 20px;
//         `;
//         document.body.appendChild(preview);
//     }
    
//     // PERBAIKAN: Tunggu lebih lama dan berikan waktu untuk user interaction
//     console.log('⏳ Menunggu 3 detik sebelum auto-download...');
    
//     setTimeout(() => {
//         console.log('🚀 Memulai auto-download PDF...');
        
//         // Coba auto download
//         generatePDF();
        
//         // Jika setelah 5 detik masih loading, tampilkan manual option
//         setTimeout(() => {
//             const status = document.getElementById('downloadStatus');
//             if (status && status.classList.contains('text-warning')) {
//                 console.log('⚠️ Auto-download timeout, showing manual option');
//                 showManualDownloadOption();
//             }
//         }, 5000);
        
//     }, 3000); // Tunggu 3 detik untuk pastikan DOM ready
// }

function showSuccessStep() {
    // Bersihin localStorage
    localStorage.removeItem('cartItems');
    localStorage.removeItem('checkoutProducts');
    localStorage.removeItem('selectedProduct');
    localStorage.removeItem('sewaProduct');

    // Tampilkan loading
    updateDownloadStatus('loading', 'Membuat struk PDF...');

    // Langsung generate PDF dalam 600ms → PASTI lolos user gesture (nggak kena blocker)
    setTimeout(() => {
        generatePDF();
    }, 600);
}

// FUNGSI BARU: Tampilkan notifikasi sukses PDF
function showPDFSuccessNotification() {
    // Buat notifikasi sukses
    const successHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-3">
            <i class="bi bi-check-circle"></i>
            <strong>Berhasil!</strong> Struk PDF telah berhasil diunduh.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const downloadSection = document.querySelector('.download-section');
    if (downloadSection) {
        const existingAlert = downloadSection.querySelector('.alert-success');
        if (!existingAlert) {
            downloadSection.insertAdjacentHTML('beforeend', successHTML);
        }
    }
}

// FUNGSI BARU: Tampilkan instruksi download manual
function showManualDownloadInstruction() {
    const manualHTML = `
        <div class="alert alert-warning mt-3">
            <h6><i class="bi bi-exclamation-triangle"></i> Download Terblokir</h6>
            <p class="mb-2">Browser memblokir download otomatis. Silakan:</p>
            <ol class="mb-2">
                <li>Klik tombol <strong>"Unduh Struk PDF"</strong> di bawah</li>
                <li>Izinkan pop-up/download jika diminta</li>
            </ol>
        </div>
    `;
    
    const downloadSection = document.querySelector('.download-section');
    if (downloadSection) {
        const existingManual = downloadSection.querySelector('.alert-warning');
        if (!existingManual) {
            downloadSection.insertAdjacentHTML('beforeend', manualHTML);
        }
    }
}

// FUNGSI BARU: Tampilkan opsi download manual setelah timeout
function showManualDownloadOption() {
    const manualOptionHTML = `
        <div class="alert alert-info mt-3">
            <h6><i class="bi bi-info-circle"></i> Download Manual</h6>
            <p class="mb-2">Jika PDF tidak terdownload otomatis, silakan klik tombol di bawah:</p>
        </div>
    `;
    
    const downloadSection = document.querySelector('.download-section');
    if (downloadSection) {
        const existingInfo = downloadSection.querySelector('.alert-info');
        if (!existingInfo) {
            downloadSection.insertAdjacentHTML('beforeend', manualOptionHTML);
        }
    }
    
    updateDownloadStatus('info', 'Klik tombol manual jika PDF tidak terdownload');
}

// Show Confirm Details
function showConfirm() {
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    const sewa = document.getElementById('sewaSummary').textContent;
    const deposit = document.getElementById('depositSummary').textContent;
    const total = document.getElementById('totalBayar').textContent;
    
    // Format tanggal untuk tampilan yang lebih baik
    const startDate = new Date(start).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const endDate = new Date(end).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Hitung total hari
    const totalDays = Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1;
    
    let productsHTML = '';
    if (products && products.length > 0) {
        products.forEach(product => {
            const price = parseInt(product.price || product.priceRaw || 0);
            const quantity = product.quantity || 1;
            const subtotal = price * totalDays * quantity;
            
            productsHTML += `
                <div class="product-confirm-item mb-3 p-3 border rounded">
                    <div class="row align-items-center">
                        <div class="col-8">
                            <h6 class="mb-1">${product.name}</h6>
                            <p class="mb-1 small text-muted">
                                <strong>Ukuran:</strong> ${product.size || '-'} | 
                                <strong>Qty:</strong> ${quantity} | 
                                <strong>Harga:</strong> ${formatRupiah(price)}/hari
                            </p>
                            <p class="mb-0 small text-muted">
                                <strong>Subtotal:</strong> ${formatRupiah(subtotal)} (${totalDays} hari)
                            </p>
                        </div>
                        <div class="col-4 text-end">
                            <img src="${product.image || 'https://via.placeholder.com/60'}" 
                                 alt="${product.name}" 
                                 class="img-fluid rounded" 
                                 style="max-height: 60px;"
                                 onerror="this.src='https://via.placeholder.com/60'">
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        productsHTML = '<div class="alert alert-warning">Tidak ada produk dalam pesanan</div>';
    }

    const confirmDetails = document.getElementById('confirmDetails');
    if (confirmDetails) {
        confirmDetails.innerHTML = `
            <div class="confirmation-details">
                <!-- Informasi Pelanggan -->
                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h6 class="mb-0"><i class="bi bi-person-circle"></i> Informasi Pelanggan</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p class="mb-2"><strong>Nama Lengkap:</strong><br>${name}</p>
                                <p class="mb-2"><strong>Email:</strong><br>${email}</p>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-2"><strong>Telepon:</strong><br>${phone}</p>
                                <p class="mb-0"><strong>Alamat Pengambilan:</strong><br>Jl. Brigjend H. Hasan Basri, Pangeran, Banjarmasin</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Periode Sewa -->
                <div class="card mb-4">
                    <div class="card-header bg-info text-white">
                        <h6 class="mb-0"><i class="bi bi-calendar-event"></i> Periode Sewa</h6>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-md-6">
                                <p class="mb-1"><strong>Mulai Sewa</strong></p>
                                <p class="mb-0 text-primary fw-bold">${startDate}</p>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-1"><strong>Selesai Sewa</strong></p>
                                <p class="mb-0 text-primary fw-bold">${endDate}</p>
                            </div>
                        </div>
                        <hr>
                        <p class="text-center mb-0">
                            <strong>Durasi Sewa:</strong> ${totalDays} hari
                        </p>
                    </div>
                </div>

                <!-- Produk yang Disewa -->
                <div class="card mb-4">
                    <div class="card-header bg-warning text-dark">
                        <h6 class="mb-0"><i class="bi bi-bag-check"></i> Produk yang Disewa (${products ? products.length : 0} item)</h6>
                    </div>
                    <div class="card-body">
                        ${productsHTML}
                    </div>
                </div>

                <!-- Ringkasan Pembayaran -->
                <div class="card mb-4">
                    <div class="card-header bg-success text-white">
                        <h6 class="mb-0"><i class="bi bi-cash-coin"></i> Ringkasan Pembayaran</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-8">
                                <p class="mb-2">Biaya Sewa (${totalDays} hari)</p>
                                <p class="mb-2">Deposit Jaminan (10%)</p>
                                <hr>
                                <p class="mb-0 fw-bold">Total Bayar Saat Ambil</p>
                            </div>
                            <div class="col-4 text-end">
                                <p class="mb-2">${sewa}</p>
                                <p class="mb-2">${deposit}</p>
                                <hr>
                                <p class="mb-0 fw-bold fs-5">${total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Informasi Pembayaran Deposit -->
                <div class="alert alert-info">
                    <h6><i class="bi bi-info-circle"></i> Informasi Pembayaran</h6>
                    <p class="mb-1">✅ <strong>Deposit (10%)</strong> telah dibayar via QRIS: <strong>${deposit}</strong></p>
                    <p class="mb-0">💰 <strong>Bayar saat ambil:</strong> <strong>${sewa}</strong> (biaya sewa)</p>
                </div>
            </div>
        `;
    }
}

// Invoice and PDF generation
function generateInvoiceHTML() {
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    const sewa = document.getElementById('sewaSummary').textContent;
    const deposit = document.getElementById('depositSummary').textContent;
    const total = document.getElementById('totalBayar').textContent;
    const invoiceNo = `IA${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2,'0')}${String(new Date().getDate()).padStart(2,'0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    let productsHTML = '';
    let totalDays = Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1;
    
    if (Array.isArray(products)) {
        products.forEach(product => {
            const price = parseInt(product.price || product.priceRaw || 0);
            const quantity = product.quantity || 1;
            const subtotal = price * totalDays * quantity;
            productsHTML += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.size || '-'}</td>
                    <td>${quantity}</td>
                    <td>${formatRupiah(price)}/hari</td>
                    <td>${formatRupiah(subtotal)}</td>
                </tr>
            `;
        });
    } else if (products[0]) {
        const product = products[0];
        const price = parseInt(product.price || product.priceRaw || 0);
        const quantity = product.quantity || 1;
        const subtotal = price * totalDays * quantity;
        productsHTML = `
            <tr>
                <td>${product.name}</td>
                <td>${product.size || '-'}</td>
                <td>${quantity}</td>
                <td>${formatRupiah(price)}/hari</td>
                <td>${formatRupiah(subtotal)}</td>
            </tr>
        `;
    }

    return `
        <div class="invoice-header">
            <img src="/static/images/main-logo.png" alt="Logo" style="height:60px; border-radius:8px;">
            <h3>IA RENT FASHION</h3>
            <p>Jl. Brigjend H. Hasan Basri, Pangeran, Banjarmasin</p>
            <p>Telp: 0812-3456-7890 | Email: info@iarentfashion.com</p>
        </div>
        <hr style="border: 1px dashed #ccc;">
        <h5 style="color:var(--primary); text-align:center; margin:15px 0;">INVOICE PENYEWAAN</h5>
        <p style="text-align:center; font-size:0.9em;">No. Invoice: <strong>#${invoiceNo}</strong></p>

        <table class="invoice-table">
            <tr><th>Pelanggan</th><td>${name}</td></tr>
            <tr><th>Email</th><td>${email}</td></tr>
            <tr><th>Telepon</th><td>${phone}</td></tr>
            <tr><th>Periode Sewa</th><td>${start} s/d ${end} (${totalDays} hari)</td></tr>
            <tr>
                <th colspan="2" style="text-align:center; background:#f8f9fa;">Detail Produk</th>
            </tr>
            <tr>
                <td colspan="2">
                    <table width="100%" style="border-collapse: collapse;">
                        <tr>
                            <th style="text-align:left; padding:8px; border-bottom:1px solid #eee;">Produk</th>
                            <th style="text-align:left; padding:8px; border-bottom:1px solid #eee;">Ukuran</th>
                            <th style="text-align:center; padding:8px; border-bottom:1px solid #eee;">Qty</th>
                            <th style="text-align:left; padding:8px; border-bottom:1px solid #eee;">Harga/hari</th>
                            <th style="text-align:left; padding:8px; border-bottom:1px solid #eee;">Subtotal</th>
                        </tr>
                        ${productsHTML}
                    </table>
                </td>
            </tr>
            <tr><th>Biaya Sewa</th><td>${sewa}</td></tr>
            <tr><th>Deposit (10%)</th><td>${deposit}</td></tr>
            <tr class="total-row"><td><strong>Total Bayar Saat Ambil</strong></td><td><strong>${total}</strong></td></tr>
        </table>

        <div class="invoice-footer">
            <div style="background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0;">
                <strong><i class="bi bi-exclamation-triangle"></i> Syarat & Ketentuan:</strong>
                <ul style="margin: 5px 0; font-size: 0.8em;">
                    <li>Deposit 10% dibayar via QRIS</li>
                    <li>Wajib bawa KTP asli saat pengambilan</li>
                    <li>Tanggung jawab penuh atas kerusakan/kehilangan</li>
                    <li>Pemeriksaan barang max 1×24 jam setelah pengembalian</li>
                    <li>Denda 2× lipat untuk keterlambatan > 1×24 jam</li>
                </ul>
            </div>
            <p><strong class="highlight">Deposit akan dikembalikan max 1x24 jam</strong> setelah barang dicek.</p>
            <p><strong>Alamat Pengambilan:</strong> Jl. Brigjend H. Hasan Basri, Pangeran, Banjarmasin</p>
            <p>Terima kasih telah mempercayakan penyewaan kepada kami.</p>
            <p style="font-size:0.8em; color:#999;">Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
        </div>
    `;
}

// Payment functions
function startPaymentTimer() {
    console.log('⏰ Memulai timer pembayaran...');
    clearInterval(paymentTimer);
    timeLeft = 300;
    
    const timerElement = document.getElementById('paymentTimer');
    const paymentStatus = document.getElementById('paymentStatus');
    const continueButton = document.getElementById('continueAfterPayment');
    
    if (timerElement) {
        const tick = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(paymentTimer);
                simulatePaymentFailed();
            }
            timeLeft--;
        };
        
        tick();
        paymentTimer = setInterval(tick, 1000);
    }
    
    if (paymentStatus) {
        paymentStatus.className = 'payment-status payment-pending';
        paymentStatus.innerHTML = `
            <div class="status-content">
                <i class="bi bi-clock"></i>
                <span class="status-text">Menunggu Pembayaran...</span>
            </div>
        `;
    }
    
    if (continueButton) {
        continueButton.style.display = 'none';
        continueButton.classList.add('hidden');
    }
    
    const qrisOverlay = document.getElementById('qrisOverlay');
    if (qrisOverlay) {
        qrisOverlay.style.display = 'none';
        qrisOverlay.classList.add('hidden');
    }
}

function simulatePaymentSuccess() {
    console.log('✅ Simulasi pembayaran berhasil');
    clearInterval(paymentTimer);
    
    const paymentStatus = document.getElementById('paymentStatus');
    const continueButton = document.getElementById('continueAfterPayment');
    const qrisOverlay = document.getElementById('qrisOverlay');
    const timerElement = document.getElementById('paymentTimer');
    const paymentTimerAlert = document.querySelector('.payment-timer');
    
    if (paymentStatus) {
        paymentStatus.className = 'payment-status payment-success';
        paymentStatus.innerHTML = `
            <div class="status-content">
                <i class="bi bi-check-circle"></i>
                <span class="status-text">Pembayaran Deposit Berhasil!</span>
            </div>
        `;
    }
    
    if (continueButton) {
        continueButton.style.display = 'block';
        continueButton.classList.remove('hidden');
    }
    
    if (qrisOverlay) {
        qrisOverlay.style.display = 'flex';
        qrisOverlay.classList.remove('hidden');
    }
    
    if (timerElement) {
        timerElement.textContent = '00:00';
    }
    
    if (paymentTimerAlert) {
        paymentTimerAlert.className = 'payment-timer alert alert-success';
    }
}

function simulatePaymentFailed() {
    console.log('❌ Simulasi pembayaran gagal');
    clearInterval(paymentTimer);
    
    const paymentStatus = document.getElementById('paymentStatus');
    const continueButton = document.getElementById('continueAfterPayment');
    const timerElement = document.getElementById('paymentTimer');
    const paymentTimerAlert = document.querySelector('.payment-timer');
    
    if (paymentStatus) {
        paymentStatus.className = 'payment-status payment-failed';
        paymentStatus.innerHTML = `
            <div class="status-content">
                <i class="bi bi-x-circle"></i>
                <span class="status-text">Pembayaran Gagal - Waktu habis atau pembayaran dibatalkan</span>
            </div>
        `;
    }
    
    if (continueButton) {
        continueButton.style.display = 'none';
        continueButton.classList.add('hidden');
    }
    
    if (timerElement) {
        timerElement.textContent = '00:00';
    }
    
    if (paymentTimerAlert) {
        paymentTimerAlert.className = 'payment-timer alert alert-danger';
    }
}

function resetPayment() {
    console.log('🔄 Reset pembayaran');
    startPaymentTimer();
}

// VALIDATION FUNCTIONS
function clearErrors() {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.style.display = 'none');
}

function showError(el, msg) {
    el.classList.add('is-invalid');
    const fb = el.closest('.form-group')?.querySelector('.invalid-feedback') || el.nextElementSibling;
    if (fb) { 
        fb.textContent = msg; 
        fb.style.display = 'block'; 
    }
}

function validateStep(step) {
    clearErrors();
    let isValid = true;
    
    switch(step) {
        case 1:
            const inputs = document.querySelectorAll('#step-1-content [required]');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    showError(input, 'Wajib diisi');
                    isValid = false;
                } else if (input.id === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
                    showError(input, 'Email tidak valid');
                    isValid = false;
                } else if ((input.id === 'startDate' || input.id === 'endDate') && input.value) {
                    const start = new Date(document.getElementById('startDate').value);
                    const end = new Date(document.getElementById('endDate').value);
                    if (end < start) {
                        showError(input, 'Tanggal selesai harus setelah tanggal mulai');
                        isValid = false;
                    }
                }
            });
            break;
            
        case 4:
            const agreeTerms = document.getElementById('agreeTerms');
            if (!agreeTerms.checked) {
                showError(agreeTerms, 'Anda harus menyetujui syarat dan ketentuan untuk menyelesaikan pesanan');
                isValid = false;
            }
            break;
    }
    
    return isValid;
}

// INITIALIZE FUNCTION
function initialize() {
    console.log('🚀 Initialize checkout flow');

    // Event delegation untuk semua tombol navigasi
    // Event delegation untuk semua tombol navigasi
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.matches('[data-next-step]')) {
            e.preventDefault();
            const nextStep = parseInt(target.getAttribute('data-next-step'));
            console.log(`➡️ Next step: ${nextStep}, Current: ${currentStep}`);
            
            if (validateStep(currentStep)) {
                updateUI(nextStep);
            }
        }
        
        if (target.matches('[data-prev-step]')) {
            e.preventDefault();
            const prevStep = parseInt(target.getAttribute('data-prev-step'));
            console.log(`⬅️ Previous step: ${prevStep}, Current: ${currentStep}`);
            updateUI(prevStep);
        }
        
        // PERBAIKAN: Panggil submitOrder() saat klik tombol submit
        if (target.matches('.continue-button[type="submit"]')) {
            e.preventDefault();
            console.log('✅ Submit konfirmasi pesanan');
            
            if (validateStep(currentStep)) {
                // JANGAN langsung updateUI(5), tapi panggil submitOrder dulu!
                submitOrder();
            }
        }
    });

    // MAIN INITIALIZATION - PERBAIKAN LENGKAP
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Halaman sewa dimuat');
        console.log('📦 Library status - html2canvas:', typeof html2canvas);
        console.log('📦 Library status - jsPDF:', typeof jsPDF);
        
        // Cek apakah library tersedia
        if (typeof html2canvas === 'undefined') {
            console.error('❌ html2canvas tidak tersedia!');
            showLibraryError('Library html2canvas tidak tersedia. Silakan refresh halaman.');
            return;
        }
        
        if (typeof jsPDF === 'undefined' || typeof window.jspdf === 'undefined') {
            console.error('❌ jsPDF tidak tersedia!');
            showLibraryError('Library jsPDF tidak tersedia. Silakan refresh halaman.');
            return;
        }
        
        console.log('✅ Semua library siap digunakan');
        
        // ⭐ PENTING: Inisialisasi produk dari template DULU
        setTimeout(() => {
            // Cek apakah template sudah render produk
            const hasProductsInTemplate = document.querySelectorAll('.order-item').length > 0;
            
            if (hasProductsInTemplate) {
                console.log('✅ Template sudah menampilkan produk, akan diambil dari HTML');
                initProductsFromTemplate();
            } else {
                console.log('⚠️ Template kosong, tidak ada produk di keranjang');
                products = [];
                
                // Tampilkan pesan keranjang kosong
                const orderList = document.getElementById('order-list-items');
                if (orderList) {
                    orderList.innerHTML = `
                        <div class="text-center py-5">
                            <i class="bi bi-cart-x display-5 text-muted"></i>
                            <p class="mt-3 text-muted">Keranjang kosong</p>
                            <a href="/" class="btn btn-primary mt-2">
                                <i class="bi bi-shop"></i> Belanja Sekarang
                            </a>
                        </div>
                    `;
                }
            }
            
            // Inisialisasi checkout flow
            initialize();
            
            // Set tanggal default
            const today = new Date().toISOString().split('T')[0];
            const startDateElem = document.getElementById('startDate');
            const endDateElem = document.getElementById('endDate');
            
            if (startDateElem) {
                startDateElem.min = today;
                startDateElem.value = today;
                startDateElem.addEventListener('change', function() {
                    updateTotalFromTemplate();
                    
                    // Update minimum endDate
                    if (this.value) {
                        const startDate = new Date(this.value);
                        const endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 3);
                        
                        if (endDateElem) {
                            endDateElem.min = this.value;
                            if (new Date(endDateElem.value) < startDate) {
                                endDateElem.value = endDate.toISOString().split('T')[0];
                            }
                        }
                    }
                });
            }
            
            if (endDateElem) {
                endDateElem.min = today;
                const defaultEndDate = new Date();
                defaultEndDate.setDate(defaultEndDate.getDate() + 3);
                endDateElem.value = defaultEndDate.toISOString().split('T')[0];
                endDateElem.addEventListener('change', updateTotalFromTemplate);
            }
            
            // Initial update total
            updateTotalFromTemplate();
            
        }, 300); // Tunggu 300ms untuk pastikan DOM sudah ready
        
        // Quantity input manual change
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.addEventListener('change', function() {
                const newQuantity = parseInt(this.value);
                if (newQuantity >= 1) {
                    updateProductQuantity(newQuantity);
                    updateTotalFromTemplate();
                } else {
                    this.value = 1;
                    updateProductQuantity(1);
                    updateTotalFromTemplate();
                }
            });
        }
    });

    // FUNGSI BARU: Tampilkan error library
    function showLibraryError(message) {
        const errorHTML = `
            <div class="alert alert-danger m-3">
                <i class="bi bi-exclamation-triangle"></i>
                <strong>Error!</strong> ${message}
                <button onclick="window.location.reload()" class="btn btn-sm btn-outline-danger ms-2">
                    <i class="bi bi-arrow-clockwise"></i> Refresh Halaman
                </button>
            </div>
        `;
        
        const mainContent = document.querySelector('.checkout-page');
        if (mainContent) {
            mainContent.insertAdjacentHTML('afterbegin', errorHTML);
        }
    }

    // Make functions available globally
    window.increaseQuantity = increaseQuantity;
    window.decreaseQuantity = decreaseQuantity;
    window.simulatePaymentSuccess = simulatePaymentSuccess;
    window.simulatePaymentFailed = simulatePaymentFailed;
    window.resetPayment = resetPayment;
    window.generatePDF = generatePDF;
    window.showLibraryError = showLibraryError;

    // Tambahkan function untuk testing
    window.testPDF = function() {
        console.log('🧪 Testing PDF Generation...');
        generatePDF();
    };

    window.debugProducts = function() {
        console.log('🐛 Current products array:', products);
        console.log('🐛 Products count:', products.length);
        products.forEach((p, i) => {
            console.log(`   ${i + 1}. ${p.name} - ${p.image}`);
        });
    };

    // File upload handler
    const drop = document.getElementById('fileUploadDropzone');
    const fileIn = document.getElementById('jaminanFile');
    if (drop && fileIn) {
        drop.addEventListener('click', () => fileIn.click());
        fileIn.addEventListener('change', () => {
            if (fileIn.files[0]) {
                const fileUploadText = document.getElementById('fileUploadText');
                if (fileUploadText) {
                    fileUploadText.textContent = fileIn.files[0].name;
                }
            }
        });
    }

    // Download PDF button handler
    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('⬇️ Manual download PDF dipicu');
            generatePDF();
        });
    }

    // Initialize first step
    updateUI(1);
}

// MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Halaman checkout dimuat');
    
    // Pastikan library tersedia dengan logging lebih detail
    console.log('📦 Library status - html2canvas:', typeof html2canvas);
    console.log('📦 Library status - jsPDF:', typeof jsPDF);
    console.log('📦 Library status - window.jspdf:', typeof window.jspdf);
    
    if (typeof html2canvas === 'undefined') {
        console.error('❌ html2canvas tidak tersedia!');
        showLibraryError('Library html2canvas tidak tersedia. Silakan refresh halaman.');
        return;
    }
    
    if (typeof jsPDF === 'undefined' || typeof window.jspdf === 'undefined') {
        console.error('❌ jsPDF tidak tersedia!');
        showLibraryError('Library jsPDF tidak tersedia. Silakan refresh halaman.');
        return;
    }
    
    console.log('✅ Semua library siap digunakan');
    
    loadProduct();
    initialize();
    
    // Date change listeners
    ['startDate', 'endDate'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updateTotal);
        }
    });
    
    // Set tanggal default
    const today = new Date().toISOString().split('T')[0];
    const startDateElem = document.getElementById('startDate');
    const endDateElem = document.getElementById('endDate');
    
    if (startDateElem) {
        startDateElem.min = today;
        startDateElem.value = today;
    }
    if (endDateElem) {
        endDateElem.min = today;
        const defaultEndDate = new Date();
        defaultEndDate.setDate(defaultEndDate.getDate() + 3);
        endDateElem.value = defaultEndDate.toISOString().split('T')[0];
    }
    
    if (startDateElem && endDateElem) {
        startDateElem.addEventListener('change', function() {
            if (this.value) {
                const startDate = new Date(this.value);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 3);
                endDateElem.min = this.value;
                endDateElem.value = endDate.toISOString().split('T')[0];
                updateTotal();
            }
        });
    }

    // Quantity input manual change
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const newQuantity = parseInt(this.value);
            if (newQuantity >= 1) {
                updateProductQuantity(newQuantity);
                updateTotal();
            } else {
                this.value = 1;
                updateProductQuantity(1);
                updateTotal();
            }
        });
    }
});

// FUNGSI BARU: Tampilkan error library
function showLibraryError(message) {
    const errorHTML = `
        <div class="alert alert-danger m-3">
            <i class="bi bi-exclamation-triangle"></i>
            <strong>Error!</strong> ${message}
            <button onclick="window.location.reload()" class="btn btn-sm btn-outline-danger ms-2">
                <i class="bi bi-arrow-clockwise"></i> Refresh Halaman
            </button>
        </div>
    `;
    
    const mainContent = document.querySelector('.container');
    if (mainContent) {
        mainContent.insertAdjacentHTML('afterbegin', errorHTML);
    }
}

// Make functions available globally
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.simulatePaymentSuccess = simulatePaymentSuccess;
window.simulatePaymentFailed = simulatePaymentFailed;
window.resetPayment = resetPayment;
window.generatePDF = generatePDF;

// Tambahkan function untuk testing
window.testPDF = function() {
    console.log('🧪 Testing PDF Generation...');
    generatePDF();
};

function submitOrder() {
    console.log('🚀 Memulai submit order...');
    
    // Validasi checkbox terms
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms?.checked) {
        Swal.fire('Perhatian!', 'Anda harus menyetujui syarat & ketentuan!', 'warning');
        return false;
    }

    // Ambil data dari form
    const formData = {
        full_name: document.getElementById('fullName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        start_date: document.getElementById('startDate')?.value || '',
        end_date: document.getElementById('endDate')?.value || '',
    };

    console.log('📝 Form Data:', formData);

    // VALIDASI: Pastikan products tidak kosong dan memiliki ID yang valid
    if (!products || products.length === 0) {
        Swal.fire('Keranjang Kosong', 'Tidak ada produk untuk dipesan', 'warning');
        return false;
    }

    // PERBAIKAN: Format cart_items dengan validasi yang lebih ketat
    const cart_items = products.map(p => {
        // Pastikan product_id ada dan valid
        const product_id = p.id || p.product_id || p.productId;
        if (!product_id) {
            console.error('❌ Produk tanpa ID:', p);
            return null;
        }
        
        return {
            product_id: parseInt(product_id),
            name: p.name || 'Produk',
            price: parseFloat(p.price) || 0,
            quantity: parseInt(p.quantity) || 1,
            size: p.size || 'M'
        };
    }).filter(item => item !== null); // Hapus item yang null

    console.log('🛒 Cart Items untuk API:', cart_items);

    // Validasi akhir: pastikan masih ada item yang valid
    if (cart_items.length === 0) {
        Swal.fire('Data Invalid', 'Tidak ada produk valid untuk dipesan', 'error');
        return false;
    }

    // Tampilkan loading
    Swal.fire({
        title: 'Menyimpan Pesanan...',
        html: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // KIRIM DATA KE SERVER
    fetch('/api/create-order/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            ...formData,
            cart_items: cart_items
        })
    })
    .then(response => {
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            return response.text().then(text => {
                console.error('❌ Response error text:', text);
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = JSON.parse(text);
                    errorMsg = errorData.error || errorMsg;
                } catch (e) {
                    if (text.includes('CSRF')) {
                        errorMsg = 'CSRF token missing or incorrect';
                    } else if (text.includes('JSON')) {
                        errorMsg = 'Format data tidak valid';
                    }
                }
                throw new Error(errorMsg);
            });
        }
        return response.json();
    })
    .then(result => {
        console.log('✅ Response dari server:', result);
        
        Swal.close();
        
        if (result.success) {
            // Hapus localStorage
            localStorage.removeItem('cartItems');
            localStorage.removeItem('sewaProduct');
            localStorage.removeItem('selectedProduct');
            localStorage.removeItem('checkoutProducts');
            
            // Update cart count
            const cartCount = document.getElementById('cartCount');
            if (cartCount) {
                cartCount.textContent = '0';
            }
            
            // Tampilkan success message dengan detail order
            Swal.fire({
                icon: 'success',
                title: 'Pesanan Berhasil!',
                html: `
                    <div class="text-start">
                        <p><strong>No. Order:</strong> ${result.order_number}</p>
                        <p><strong>Total Bayar:</strong> ${document.getElementById('totalBayar')?.textContent || 'Rp 0'}</p>
                        <p class="small text-success mt-2">
                            <i class="bi bi-check-circle"></i> Data sudah tersimpan di database
                        </p>
                        <p class="small text-muted">
                            Silakan unduh struk untuk bukti pemesanan
                        </p>
                    </div>
                `,
                confirmButtonText: 'Lanjutkan',
                timer: 5000
            }).then((result) => {
                // Pindah ke step 5 (sukses)
                updateUI(5);
            });
            
        } else {
            // Tampilkan error dari server
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: result.error || 'Terjadi kesalahan saat menyimpan pesanan',
                footer: '<small>Periksa data dan coba lagi</small>'
            });
        }
    })
    .catch(err => {
        console.error('❌ Error submitOrder:', err);
        Swal.close();
        
        let errorMessage = 'Gagal terhubung ke server';
        
        if (err.message.includes('CSRF')) {
            errorMessage = 'Masalah keamanan (CSRF). Silakan refresh halaman dan coba lagi.';
        } else if (err.message.includes('404')) {
            errorMessage = 'Endpoint API tidak ditemukan. Pastikan URL /api/create-order/ benar.';
        } else if (err.message.includes('500')) {
            errorMessage = 'Server mengalami masalah internal.';
        } else if (err.message.includes('JSON')) {
            errorMessage = 'Format response tidak valid dari server.';
        } else if (err.message.includes('NetworkError')) {
            errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
        } else {
            errorMessage = `Error: ${err.message}`;
        }
        
        Swal.fire({
            icon: 'error',
            title: 'Gagal Menyimpan Order',
            text: errorMessage,
            footer: '<small>Periksa konsol browser untuk detail error</small>'
        });
    });

    return false;
}

// Fungsi untuk mendapatkan CSRF token
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

