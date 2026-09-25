// Data State Management
let products = [];
let cart = [];
let history = [];
let todayOmzet = 0;

// Format Currency
const formatRp = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
};

// Initialize App
function initApp() {
    loadData();
    setupNavigation();
    setupEventListeners();
    updateClock();
    setInterval(updateClock, 1000);
    renderProducts();
    updateDashboard();
    renderHistory();
}

// Load Data from LocalStorage
function loadData() {
    const savedProducts = localStorage.getItem('litepos_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Seed default data
        products = [
            { id: 1, nama: 'Nasi Goreng Spesial', kategori: 'makanan', harga: 25000, stok: 50, gambar: '' },
            { id: 2, nama: 'Mie Goreng Seafood', kategori: 'makanan', harga: 28000, stok: 40, gambar: '' },
            { id: 3, nama: 'Es Teh Manis', kategori: 'minuman', harga: 5000, stok: 100, gambar: '' },
            { id: 4, nama: 'Kopi Susu Gula Aren', kategori: 'minuman', harga: 18000, stok: 60, gambar: '' },
            { id: 5, nama: 'Kentang Goreng', kategori: 'snack', harga: 15000, stok: 80, gambar: '' },
        ];
        saveProducts();
    }

    const savedHistory = localStorage.getItem('litepos_history');
    if (savedHistory) history = JSON.parse(savedHistory);

    const savedOmzet = localStorage.getItem('litepos_omzet');
    if (savedOmzet) todayOmzet = parseInt(savedOmzet);
}

function saveProducts() { localStorage.setItem('litepos_products', JSON.stringify(products)); }
function saveHistory() { localStorage.setItem('litepos_history', JSON.stringify(history)); }
function saveOmzet() { localStorage.setItem('litepos_omzet', todayOmzet.toString()); }

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links li');
    const views = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = link.getAttribute('data-view');
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            views.forEach(v => v.classList.remove('active'));
            document.getElementById(`view-${targetView}`).classList.add('active');
            
            if(targetView === 'products') renderProductTable();
            if(targetView === 'dashboard') updateDashboard();
            if(targetView === 'history') renderHistory();
        });
    });
}

// Clock
function updateClock() {
    const now = new Date();
    document.getElementById('current-datetime').textContent = now.toLocaleString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

// POS VIEW
function renderProducts(categoryFilter = 'all', searchQuery = '') {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    let filtered = products;
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(p => p.kategori === categoryFilter);
    }
    if (searchQuery) {
        filtered = filtered.filter(p => p.nama.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => addToCart(p);
        
        let imgHtml = p.gambar ? `<img src="${p.gambar}" alt="${p.nama}">` : `<i class="fa-solid fa-utensils"></i>`;
        
        card.innerHTML = `
            <div class="product-stock">${p.stok} Tersedia</div>
            <div class="product-img-wrapper">${imgHtml}</div>
            <div class="product-info">
                <h4>${p.nama}</h4>
                <div class="product-price">${formatRp(p.harga)}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Cart Management
function addToCart(product) {
    if (product.stok <= 0) {
        alert('Stok habis!');
        return;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        if (existing.qty >= product.stok) {
            alert('Stok tidak mencukupi!');
            return;
        }
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    renderCart();
}

function updateCartQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        const product = products.find(p => p.id === id);
        if (delta > 0 && item.qty >= product.stok) {
            alert('Stok maksimal!');
            return;
        }
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        renderCart();
    }
}

window.removeFromCart = function(id) {
    if(confirm('Hapus menu ini dari keranjang?')) {
        cart = cart.filter(i => i.id !== id);
        renderCart();
    }
}

let currentDiscountPercent = 0;

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Keranjang kosong</p>
            </div>
        `;
        document.getElementById('btn-checkout').disabled = true;
    } else {
        document.getElementById('btn-checkout').disabled = false;
        cartContainer.innerHTML = '';
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-title">${item.nama}</span>
                </div>
                <div class="cart-item-controls">
                    <span class="cart-item-price">${formatRp(item.harga)}</span>
                    <div class="qty-control">
                        <button type="button" class="qty-btn" onclick="updateCartQty(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                        <input type="text" class="qty-input" value="${item.qty}" readonly>
                        <button type="button" class="qty-btn" onclick="updateCartQty(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <span class="cart-item-total">${formatRp(item.harga * item.qty)}</span>
                    <button type="button" class="btn-icon" style="color:var(--danger-color); margin-left:8px;" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;
            cartContainer.appendChild(div);
        });
    }
    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const discount = subtotal * (currentDiscountPercent / 100);
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * 0.11; // 11% PPN
    const total = afterDiscount + tax;

    document.getElementById('cart-subtotal').textContent = formatRp(subtotal);
    document.getElementById('cart-discount').textContent = `-${formatRp(discount)}`;
    document.getElementById('cart-tax').textContent = formatRp(tax);
    document.getElementById('cart-total').textContent = formatRp(total);
    
    if(currentDiscountPercent > 0) {
        const badge = document.getElementById('discount-badge');
        badge.style.display = 'inline-block';
        badge.textContent = `${currentDiscountPercent}%`;
    } else {
        document.getElementById('discount-badge').style.display = 'none';
    }

    // Save for checkout
    window.currentCartTotal = total;
    window.currentCartSubtotal = subtotal;
    window.currentCartTax = tax;
    window.currentCartDiscount = discount;
}

// Modals Setup
function openModal(id) {
    document.getElementById(id).classList.add('active');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function setupEventListeners() {
    // Modal closes
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal-overlay').classList.remove('active');
        });
    });

    // Categories filter
    document.querySelectorAll('.categories-list li').forEach(li => {
        li.addEventListener('click', (e) => {
            document.querySelectorAll('.categories-list li').forEach(l => l.classList.remove('active'));
            li.classList.add('active');
            renderProducts(li.getAttribute('data-category'), document.getElementById('search-product').value);
        });
    });

    // Search
    document.getElementById('search-product').addEventListener('input', (e) => {
        const cat = document.querySelector('.categories-list li.active').getAttribute('data-category');
        renderProducts(cat, e.target.value);
    });

    // Cart actions
    document.getElementById('clear-cart').addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm('Kosongkan keranjang?')) {
            cart = [];
            currentDiscountPercent = 0;
            renderCart();
        }
    });

    document.getElementById('btn-add-discount').addEventListener('click', () => {
        const pct = prompt('Masukkan persentase diskon (0-100):', '0');
        if (pct !== null && !isNaN(pct) && pct >= 0 && pct <= 100) {
            currentDiscountPercent = parseInt(pct);
            updateCartTotals();
        }
    });

    // Checkout Flow
    document.getElementById('btn-checkout').addEventListener('click', () => {
        document.getElementById('checkout-total-value').textContent = formatRp(window.currentCartTotal);
        document.getElementById('input-uang-bayar').value = '';
        document.getElementById('checkout-change-value').textContent = 'Rp 0';
        document.getElementById('btn-confirm-payment').disabled = true;
        openModal('checkout-modal');
    });

    document.getElementById('input-uang-bayar').addEventListener('input', handlePaymentInput);
    
    document.querySelectorAll('.btn-quick-cash').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const amount = e.target.getAttribute('data-amount');
            const input = document.getElementById('input-uang-bayar');
            if (amount === 'exact') {
                input.value = Math.ceil(window.currentCartTotal);
            } else {
                input.value = amount;
            }
            handlePaymentInput();
        });
    });

    document.getElementById('btn-confirm-payment').addEventListener('click', processPayment);

    // Product Management
    document.getElementById('btn-add-product').addEventListener('click', () => {
        document.getElementById('product-modal-title').textContent = 'Tambah Produk Baru';
        document.getElementById('prod-id').value = '';
        document.getElementById('prod-nama').value = '';
        document.getElementById('prod-harga').value = '';
        document.getElementById('prod-stok').value = '';
        document.getElementById('prod-gambar').value = '';
        document.getElementById('prod-gambar-url').value = '';
        document.getElementById('prod-gambar-file').value = '';
        document.getElementById('file-name-display').textContent = '';
        openModal('product-modal');
    });

    document.getElementById('prod-gambar-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500 * 1024) { // 500KB limit
                alert("Ukuran gambar terlalu besar! Maksimal 500KB.");
                e.target.value = '';
                document.getElementById('file-name-display').textContent = '';
                return;
            }
            document.getElementById('file-name-display').textContent = 'File dipilih: ' + file.name;
            const reader = new FileReader();
            reader.onload = function(evt) {
                document.getElementById('prod-gambar').value = evt.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            document.getElementById('file-name-display').textContent = '';
        }
    });

    document.getElementById('prod-gambar-url').addEventListener('input', (e) => {
        if (e.target.value) {
            document.getElementById('prod-gambar').value = e.target.value;
            document.getElementById('prod-gambar-file').value = '';
            document.getElementById('file-name-display').textContent = '';
        }
    });

    document.getElementById('btn-save-product').addEventListener('click', saveProductForm);

    document.getElementById('btn-print-receipt').addEventListener('click', () => {
        window.print(); // In real app, might use specialized print library
    });
    
    document.getElementById('btn-tutup-buku').addEventListener('click', () => {
        if(confirm("Tutup buku hari ini? Omzet akan dikunci dan direset untuk besok.")) {
            alert(`Buku ditutup! Total omzet hari ini: ${formatRp(todayOmzet)}`);
            todayOmzet = 0;
            saveOmzet();
            updateDashboard();
        }
    });
}

function handlePaymentInput() {
    const paid = parseFloat(document.getElementById('input-uang-bayar').value || 0);
    const total = window.currentCartTotal;
    const changeDisplay = document.getElementById('checkout-change-value');
    const btnConfirm = document.getElementById('btn-confirm-payment');

    if (paid >= total) {
        changeDisplay.textContent = formatRp(paid - total);
        changeDisplay.style.color = 'var(--success-color)';
        btnConfirm.disabled = false;
    } else {
        changeDisplay.textContent = 'Uang Kurang!';
        changeDisplay.style.color = 'var(--danger-color)';
        btnConfirm.disabled = true;
    }
}

function processPayment() {
    const paid = parseFloat(document.getElementById('input-uang-bayar').value);
    const change = paid - window.currentCartTotal;
    
    // Create transaction record
    const trx = {
        id: 'TRX-' + Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        subtotal: window.currentCartSubtotal,
        discount: window.currentCartDiscount,
        tax: window.currentCartTax,
        total: window.currentCartTotal,
        paid: paid,
        change: change
    };

    history.unshift(trx);
    saveHistory();

    // Update Omzet
    todayOmzet += trx.total;
    saveOmzet();

    // Reduce Stock
    cart.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (prod) prod.stok -= item.qty;
    });
    saveProducts();

    closeModal('checkout-modal');
    generateReceipt(trx);
    
    // Reset Cart
    cart = [];
    currentDiscountPercent = 0;
    renderCart();
    renderProducts(); // Refresh stock display
    
    openModal('receipt-modal');
}

function generateReceipt(trx) {
    const paper = document.getElementById('receipt-paper');
    const dateStr = new Date(trx.date).toLocaleString('id-ID');
    
    let itemsHtml = '';
    trx.items.forEach(item => {
        itemsHtml += `
            <div class="receipt-item">
                <span>${item.nama} x${item.qty}</span>
                <span>${formatRp(item.harga * item.qty)}</span>
            </div>
        `;
    });

    paper.innerHTML = `
        <div class="receipt-center">
            <h3>LITEPOS STORE</h3>
            <p>Jl. Teknologi No. 99, Jakarta</p>
            <p>${dateStr}</p>
        </div>
        <div class="receipt-line"></div>
        <p>No: ${trx.id}</p>
        <p>Kasir: Admin Toko</p>
        <div class="receipt-line"></div>
        ${itemsHtml}
        <div class="receipt-line"></div>
        <div class="receipt-item"><span>Subtotal:</span> <span>${formatRp(trx.subtotal)}</span></div>
        <div class="receipt-item"><span>Diskon:</span> <span>-${formatRp(trx.discount)}</span></div>
        <div class="receipt-item"><span>PPN (11%):</span> <span>${formatRp(trx.tax)}</span></div>
        <div class="receipt-total"><span>TOTAL:</span> <span>${formatRp(trx.total)}</span></div>
        <div class="receipt-item"><span>Tunai:</span> <span>${formatRp(trx.paid)}</span></div>
        <div class="receipt-item"><span>Kembali:</span> <span>${formatRp(trx.change)}</span></div>
        <div class="receipt-line"></div>
        <div class="receipt-center">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>Barang yang sudah dibeli tidak dapat ditukar.</p>
        </div>
    `;
}

// Product Management View
function renderProductTable() {
    const tbody = document.getElementById('product-table-body');
    tbody.innerHTML = '';
    
    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.nama}</td>
            <td style="text-transform: capitalize">${p.kategori}</td>
            <td>${formatRp(p.harga)}</td>
            <td>
                <span class="badge ${p.stok < 10 ? 'badge-danger' : ''}">${p.stok}</span>
            </td>
            <td class="action-cell">
                <button class="btn-icon" onclick="editProduct(${p.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon" style="color:var(--danger-color)" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editProduct(id) {
    const p = products.find(x => x.id === id);
    if(p) {
        document.getElementById('product-modal-title').textContent = 'Edit Produk';
        document.getElementById('prod-id').value = p.id;
        document.getElementById('prod-nama').value = p.nama;
        document.getElementById('prod-kategori').value = p.kategori;
        document.getElementById('prod-harga').value = p.harga;
        document.getElementById('prod-stok').value = p.stok;
        document.getElementById('prod-gambar').value = p.gambar || '';
        document.getElementById('prod-gambar-url').value = p.gambar && p.gambar.startsWith('http') ? p.gambar : '';
        document.getElementById('file-name-display').textContent = p.gambar && p.gambar.startsWith('data:image') ? 'Gambar tersimpan di lokal' : '';
        document.getElementById('prod-gambar-file').value = '';
        openModal('product-modal');
    }
}

function saveProductForm() {
    const id = document.getElementById('prod-id').value;
    const p = {
        nama: document.getElementById('prod-nama').value,
        kategori: document.getElementById('prod-kategori').value,
        harga: parseInt(document.getElementById('prod-harga').value),
        stok: parseInt(document.getElementById('prod-stok').value),
        gambar: document.getElementById('prod-gambar').value
    };

    if(!p.nama || isNaN(p.harga) || isNaN(p.stok)) {
        alert("Mohon isi form dengan benar!");
        return;
    }

    if(id) {
        // Update
        const idx = products.findIndex(x => x.id == id);
        if(idx > -1) {
            products[idx] = { ...products[idx], ...p };
        }
    } else {
        // Add new
        p.id = Date.now();
        products.push(p);
    }

    saveProducts();
    renderProductTable();
    renderProducts();
    closeModal('product-modal');
}

function deleteProduct(id) {
    if(confirm('Yakin ingin menghapus produk ini secara permanen?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProductTable();
        renderProducts();
    }
}

// Dashboard View
function updateDashboard() {
    document.getElementById('dash-omzet').textContent = formatRp(todayOmzet);
    
    // Calculate today transactions
    const today = new Date().toDateString();
    let countTrx = 0;
    let itemsSold = 0;
    
    history.forEach(trx => {
        if(new Date(trx.date).toDateString() === today) {
            countTrx++;
            trx.items.forEach(item => itemsSold += item.qty);
        }
    });
    
    document.getElementById('dash-transaksi').textContent = countTrx;
    document.getElementById('dash-item-sold').textContent = itemsSold;

    // Recent 5 transactions
    const tbody = document.getElementById('dash-recent-table-body');
    tbody.innerHTML = '';
    history.slice(0, 5).forEach(trx => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(trx.date).toLocaleString('id-ID')}</td>
            <td>${formatRp(trx.total)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// History View
function renderHistory() {
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    
    history.forEach(trx => {
        const tr = document.createElement('tr');
        let totalItems = trx.items.reduce((sum, item) => sum + item.qty, 0);
        tr.innerHTML = `
            <td>${trx.id}</td>
            <td>${new Date(trx.date).toLocaleString('id-ID')}</td>
            <td>${totalItems} Item</td>
            <td style="font-weight:600; color:var(--accent-color)">${formatRp(trx.total)}</td>
            <td>
                <button class="btn btn-secondary" onclick="viewReceipt('${trx.id}')"><i class="fa-solid fa-eye"></i> Struk</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.viewReceipt = function(id) {
    const trx = history.find(t => t.id === id);
    if(trx) {
        generateReceipt(trx);
        openModal('receipt-modal');
    }
}

// Start
document.addEventListener('DOMContentLoaded', initApp);
