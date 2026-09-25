# LitePOS - Sistem Kasir Modern

LitePOS adalah aplikasi Point of Sale (POS) modern dan responsif yang dirancang khusus untuk UMKM. Aplikasi ini dibangun dengan antarmuka yang bersih (clean UI) dan sangat mudah digunakan tanpa memerlukan setup server.

## ✨ Fitur Utama

- **Sistem Kasir (POS)**: Proses pemesanan dan pembayaran yang cepat, mendukung filter kategori dan pencarian produk.
- **Dashboard Analitik**: Memantau omzet harian, jumlah transaksi, dan barang terjual dengan visual yang menarik.
- **Manajemen Produk**: Tambah, edit, hapus, dan kelola stok produk Anda dengan mudah. Anda juga bisa mengunggah gambar produk.
- **Riwayat Transaksi**: Lihat kembali semua transaksi yang sudah terjadi lengkap dengan detail pembelanjaan.
- **Struk Digital**: Cetak struk pembelian untuk diberikan kepada pelanggan.
- **Perhitungan Otomatis**: Mendukung penambahan diskon dan pajak (PPN) secara otomatis pada keranjang belanja.
- **Data Tersimpan Aman**: Data tersimpan secara lokal di perangkat menggunakan teknologi LocalStorage browser.

## 🛠 Teknologi yang Digunakan

- **HTML5**
- **CSS3** (Vanilla, Flexbox, CSS Grid)
- **JavaScript** (Vanilla ES6, LocalStorage API)
- **FontAwesome** (Icons)
- **Google Fonts** (Outfit)

## 🚀 Cara Instalasi / Penggunaan

Aplikasi ini tidak memerlukan instalasi backend maupun database. Anda hanya membutuhkan web browser.

1. Clone repositori ini ke komputer Anda:
   ```bash
   git clone https://github.com/mynameanonim43-ship-it/litepos.git
   ```
2. Buka folder `litepos` hasil download/clone tadi.
3. Buka file `index.html` dengan cara klik dua kali, atau drag-and-drop ke web browser Anda (Chrome, Edge, Firefox, Safari).
   *(Saran: Anda juga bisa menggunakan ekstensi seperti **Live Server** di VS Code untuk menjalankannya).*
4. Pada saat pertama kali dibuka, aplikasi akan meminta Anda membuat **password baru**. Masukkan password tersebut untuk mengamankan data POS Anda.
5. Selesai! Aplikasi LitePOS siap digunakan.

## 📂 Struktur Folder

```text
/
├── css/
│   └── style.css      # File styling (CSS) utama
├── js/
│   └── app.js         # Logika dan fungsi utama (JavaScript)
├── index.html         # Halaman utama aplikasi
├── LICENSE            # Lisensi proyek
├── README.md          # Dokumentasi proyek
└── .gitignore         # File abaikan git standar
```

## 📝 Catatan Penting

Karena aplikasi ini sepenuhnya berjalan di sisi client (*Client-Side*) dan menggunakan **LocalStorage**, data Anda (produk, transaksi, password) akan hilang jika Anda menghapus riwayat browser (Clear Data/Cache) untuk website ini. Pastikan Anda melakukan backup atau tidak menghapus data site secara tidak sengaja.
