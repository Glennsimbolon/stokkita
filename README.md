# 📦 StokKita — Modern Inventory Management

StokKita adalah aplikasi manajemen inventori (stok) berbasis web yang dirancang untuk membantu UMKM, toko retail, dan distributor mengelola gudang mereka secara modern, cepat, dan akurat.

Aplikasi ini dibangun menggunakan **React (Vite)** untuk frontend dan **Supabase (PostgreSQL)** untuk backend & database secara *real-time*.

## 🔗 Live Demo
Kamu bisa mencoba aplikasi secara langsung di:
**[https://stokkita-pi.vercel.app](https://stokkita-pi.vercel.app)**

---

## ✨ Fitur Utama

Aplikasi ini memiliki 12 modul lengkap yang siap digunakan:

1. **Sistem Autentikasi (Auth)** — Login & Register aman menggunakan Supabase Auth. Halaman dilindungi (Protected Routes).
2. **Dasbor Interaktif** — Ringkasan nilai aset, SKU aktif, stok menipis, dan Purchase Order (PO) yang sedang berjalan.
3. **Stok Produk** — Tabel inventori lengkap dengan filter gudang, filter status (Menipis/ED), dan fitur penerimaan barang.
4. **Pembelian (PO)** — Buat PO baru dengan detail multi-barang. Stok otomatis **bertambah** saat status PO berubah menjadi "Selesai".
5. **Penjualan (SO)** — Buat pesanan pelanggan dengan validasi stok. Stok otomatis **berkurang** saat pesanan selesai.
6. **Transfer Gudang** — Pindahkan stok antar gudang. Stok gudang asal berkurang, gudang tujuan bertambah.
7. **Stock Opname** — Koreksi stok sistem dengan hasil hitung fisik. Riwayat opname tersimpan permanen.
8. **Prediksi & Reorder** — Analisis AI sederhana untuk memprediksi kapan barang akan habis.
9. **Laporan (Reports)** — Laporan nilai persediaan yang bisa di-export ke **CSV** dan **PDF** (siap cetak).
10. **Gudang & Lokasi** — Pantau kapasitas dan distribusi nilai per gudang.
11. **Pemasok (Suppliers)** — CRUD lengkap pemasok beserta status Aktif/Nonaktif.
12. **Pengguna & Akses** — Manajemen pengguna sistem dengan role (Admin, Staff, Viewer).

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** React 18, Vite, Vanilla CSS (Zero CSS Framework untuk performa maksimal)
- **Backend & Database:** Supabase (PostgreSQL), Row Level Security (RLS)
- **Library Tambahan:** `clsx` (classnames), `jspdf` & `jspdf-autotable` (Export PDF)
- **Deployment:** Vercel

---

## 🚀 Cara Menjalankan di Lokal

Jika kamu ingin menjalankan project ini di komputer sendiri, ikuti langkah berikut:

### 1. Clone Repository
```bash
git clone https://github.com/Glennsimbolon/stokkita.git
cd stokkita