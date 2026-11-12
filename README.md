# KantinKu AI — ISCOMFEST 2026 (Programming)

Platform pre-order kantin untuk SMK, dengan rekomendasi menu dari budget dan preferensi rasa.

Tim: Dwi (Agung Dwi Saputra), Narayana, Olvans — SMK Telkom Sidoarjo.
Kompetisi: Lomba Programming, ISCOMFEST 2026, HMPSSI Universitas Mercu Buana Yogyakarta.
Pengumpulan karya: 12–16 November 2026, 23.59 WIB.

## Masalah

Siswa antre lama di kantin, bingung memilih menu sesuai uang saku, dan sering kehabisan menu yang diinginkan. Petugas kantin kewalahan mencatat pesanan secara manual.

## Solusi

Siswa pre-order dari HP sebelum istirahat, lalu mengambil pesanan dengan kode pesanan saat status Siap Diambil. Petugas melihat semua pesanan masuk di satu dashboard dan mengubah statusnya dengan satu klik.

## Fitur

### Siswa

- Katalog 15 menu dengan foto, harga, kategori (makanan berat, snack, minuman), dan stok live. Menu habis tidak bisa dipesan.
- Pencarian, filter kategori, dan sort harga.
- Rekomendasi AI: input budget, preferensi rasa (manis, pedas, gurih, segar), dan pantangan. Output 3 rekomendasi teratas beserta skor transparan, alasan, dan paket hemat. Mesin rekomendasi bersifat rule-based scoring, berjalan offline, tanpa API key di repo.
- Keranjang dengan cek budget otomatis.
- Pre-order: isi nama dan kelas, pilih jam ambil (istirahat 1 / istirahat 2 / pulang), bayar tunai saat ambil. Pesanan mendapat kode, contoh `KNT-001`.
- Lacak pesanan: Diterima, Disiapkan, Siap Diambil, Selesai.
- Riwayat pesanan, pesan ulang, dan rating menu yang memengaruhi rekomendasi.

### Petugas kantin

- Dashboard: pesanan masuk hari ini, pesanan siap diambil, menu terlaris, total pemasukan hari ini.
- Kelola pesanan: filter status, cari kode/nama, ubah status satu klik. Perubahan status langsung terlihat di sisi siswa.
- Kelola menu: tambah, edit, hapus menu, ubah harga, stok, dan ketersediaan. Stok berkurang otomatis saat pesanan masuk.
- Rekap harian.

## Cara menjalankan

Tidak ada backend dan tidak ada build step.

1. Buka `index.html` langsung di browser, atau
2. Deploy sebagai situs statis (misalnya GitHub Pages, Netlify, atau Vercel), atau
3. Jalankan server statis lokal, contoh: `python3 -m http.server 8000`, lalu buka `http://localhost:8000`.

Data pesanan dan menu tersimpan di localStorage browser perangkat yang sama, jadi demo tetap jalan offline. Gunakan tombol Reset Data Demo di aplikasi untuk mengembalikan data awal.

Akun demo: ganti peran Siswa / Petugas dari dalam aplikasi, tanpa login.

## Teknologi

- HTML, CSS, JavaScript (aplikasi statis, tanpa build step)
- Google Fonts: Playfair Display SC / Karla
- localStorage untuk penyimpanan data demo
- Tidak ada API key, tidak ada backend, tidak ada database server

## Design system

Dibuat dengan skill UI/UX Pro Max (https://github.com/nextlevelbuilder/ui-ux-pro-max-skill, MIT).

- Style: Vibrant & Block-based, pattern Funnel 3 langkah
- Warna: primer merah `#DC2626`, aksen emas `#A16207`, background `#FEF2F2`
- Tipografi: Playfair Display SC / Karla
- Ikon SVG, tanpa emoji sebagai ikon. Responsif 375 / 768 / 1024 / 1440px.

## Struktur repo

```text
index.html            Markup aplikasi, memuat css/ dan js/ di bawah
css/
  style.css           Seluruh styling (design system merah #DC2626 / emas #A16207)
js/
  data.js             Data awal: 15 menu, 5 pesanan contoh, pilihan foto, label status
  app.js              State + localStorage, katalog, keranjang, rekomendasi AI, pesanan siswa
  staff.js            Dashboard petugas, kelola pesanan/menu, checkout, wiring tombol
assets/
  img/                15 foto menu (JPEG, satu file per menu)
README.md             Dokumen ini
```

Versi awal repo ini adalah satu file `index.html` 2,7 MB dengan gambar inline base64 yang diduplikasi. Sejak commit pemisahan, gambar disimpan sekali sebagai file di `assets/img/` dan kode dipisah per berkas di atas. Isi dan perilaku aplikasi tidak berubah.

## Penggunaan AI

AI dipakai sebagai alat bantu coding dan sebagai fitur produk (mesin rekomendasi rule-based di atas). Tidak ada API key di repo. Integrasi chatbot WhatsApp realtime masih rencana pengembangan, bukan fitur yang sudah jadi, dan tidak diklaim sebagai fitur di karya ini.

## Rencana pengembangan

- Chatbot WhatsApp realtime dan notifikasi status pesanan via WhatsApp
- Pembayaran QRIS otomatis
- Multi-kantin

## Lisensi dan keaslian

Karya orisinal tim untuk ISCOMFEST 2026, belum pernah memenangkan kompetisi atau dipublikasikan sebagai karya lomba sebelumnya.
