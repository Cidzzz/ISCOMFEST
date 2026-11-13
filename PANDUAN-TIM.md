# Panduan Tim — KantinKu AI (ISCOMFEST 2026)

Buat Narayana dan Olvans. Baca ini dulu sebelum pegang proposal, video, atau demo.

## 1. Apa itu KantinKu AI

Platform pre-order kantin untuk SMK. Siswa pesan dari HP sebelum istirahat,
lalu ambil pesanan dengan kode saat status Siap Diambil. Petugas melihat semua
pesanan di satu dashboard dan mengubah statusnya satu klik.

- **Live:** https://kantinku-ai.vercel.app/
- **Repo:** https://github.com/Cidzzz/ISCOMFEST (publik, branch `main`)
- **Tim:** Dwi, Narayana, Olvans — SMK Telkom Sidoarjo
- **Deadline kumpul:** Senin 16 Nov 2026, 23.59 WIB
- **Penjurian:** 17–18 Nov, pengumuman finalis 18 Nov, Grand Final offline 25 Nov
  di Auditorium UMBY (presentasi + simulasi maks 10 menit, Q&A maks 10 menit,
  bawa laptop sendiri, demo harus jalan offline)

## 2. Masalah yang diselesaikan

1. Siswa antre lama di kantin.
2. Siswa bingung pilih menu sesuai uang saku.
3. Menu sering kehabisan tanpa info.
4. Petugas kewalahan mencatat pesanan manual.

## 3. Fitur — peran Siswa

- **Katalog 15 menu** berfoto, harga, kategori (makanan berat, snack, minuman),
  stok live. Menu habis tidak bisa dipesan.
- **Cari, filter kategori, urutkan** (paling laris / rating / harga).
- **Rekomendasi AI:** input budget, rasa favorit (pedas, gurih, manis, segar),
  dan pantangan. Keluar 3 rekomendasi teratas + skor transparan, alasan, dan
  paket hemat. Mesinnya rule-based scoring, jalan offline, tanpa API key.
- **Keranjang** dengan cek budget otomatis (peringatan kalau total melebihi budget).
- **Pre-order:** isi nama + kelas, pilih jam ambil (Istirahat 1 · 09.30 /
  Istirahat 2 · 12.00 / Pulang · 15.30), bayar tunai saat ambil. Pesanan
  mendapat kode, contoh `KNT-001`.
- **Lacak pesanan:** Diterima → Disiapkan → Siap Diambil → Selesai.
- **Riwayat pesanan, pesan ulang, rating menu** (rating memengaruhi rekomendasi).

## 4. Fitur — peran Petugas Kantin

Ganti peran lewat tombol Siswa / Petugas Kantin di atas halaman. Tanpa login.

- **Dashboard:** pesanan masuk hari ini, pesanan siap diambil, menu terlaris,
  total pemasukan hari ini.
- **Kelola pesanan:** filter status, cari kode/nama, ubah status satu klik.
  Perubahan status langsung terlihat di sisi siswa.
- **Kelola menu:** tambah, edit, hapus menu, ubah harga, stok, ketersediaan.
  Stok berkurang otomatis saat pesanan masuk.
- **Rekap harian** penjualan.

## 5. Alur demo (5 menit, yang dipakai di video dan final)

1. Siswa isi budget **Rp10.000**, rasa **pedas** → klik Cari Rekomendasi.
2. Tunjukkan top-3 + skor dan alasannya.
3. Tambah 1 menu ke keranjang → buka keranjang → isi nama + kelas →
   jam ambil Istirahat 1 → Buat Pre-Order → catat kode (mis. `KNT-006`).
4. Pindah ke peran Petugas → cari kode itu → ubah status ke Siap Diambil.
5. Kembali ke peran Siswa → status pesanan berubah jadi Siap Diambil.
6. Sebutkan penutup: bayar tunai di loket saat ambil.

## 6. Isi repo (struktur file)

```text
index.html            Markup aplikasi
css/
  style.css           Semua styling (minimal: satu aksen merah #B91C1C, netral stone)
js/
  data.js             Data awal: 15 menu, 5 pesanan contoh, pilihan foto, label status
  app.js              State + localStorage, katalog, keranjang, rekomendasi, pesanan siswa
  staff.js            Dashboard petugas, kelola pesanan/menu, checkout
assets/
  img/                15 foto menu (JPEG, satu file per menu)
README.md             Penjelasan lengkap (fitur, cara jalan, AI disclosure)
PANDUAN-TIM.md        Dokumen ini
```

## 7. Cara menjalankan

Tidak ada backend, tidak ada build step.

- **Paling mudah:** buka https://kantinku-ai.vercel.app/
- **Lokal:** clone repo, lalu `python3 -m http.server 8000` di folder repo,
  buka `http://localhost:8000`. Atau buka `index.html` langsung.
- **Data demo:** pesanan dan menu tersimpan di localStorage browser perangkat
  yang sama, jadi demo jalan offline. Ada 5 pesanan contoh (`KNT-001`–`KNT-005`).
  Tombol **Reset Data Demo** di aplikasi mengembalikan data awal.

## 8. Desain

Minimal, satu aksen merah tua `#B91C1C` di atas netral stone
(background `#FAFAF9`, teks `#1C1917`, border `#E7E5E4`), satu font Karla,
border 1px, ikon SVG (tanpa emoji). Responsif HP sampai desktop.
Dark mode mengikuti setting sistem.

## 9. Yang BELUM jadi — jangan diklaim sudah jadi

Ini rencana pengembangan (Tahap 2), ditulis begitu di proposal:

- Pesan lewat chatbot WhatsApp yang terintegrasi ke pesanan yang sama.
- Pembayaran QRIS otomatis (bukan tunai).
- Multi-kantin.

Kalau juri tanya, jawab sebagai rencana ke depan, bukan fitur yang didemokan.

## 10. Penggunaan AI (jujur, sesuai ketentuan)

AI dipakai sebagai alat bantu coding dan sebagai fitur produk (mesin
rekomendasi rule-based di atas). Tidak ada API key di repo. Karya ini orisinal
tim, belum pernah memenangkan kompetisi atau dipublikasikan sebagai karya
lomba sebelumnya.

## 11. Sisa tugas sebelum 16 Nov 23.59 WIB

- [ ] Proposal PDF (A4, maks 10 halaman) — isi: masalah, solusi, fitur,
      teknologi, diagram alur, screenshot, penutup + rencana pengembangan.
- [ ] Video demo maks 5 menit — pakai alur di bagian 5.
- [ ] Surat orisinalitas (Lampiran 3) + materai Rp10.000.
- [ ] Kumpul: folder Drive `PROGRAMMING_[Nama Tim]_[Nama Instansi]` berisi
      proposal + link web/repo + video + surat, lalu kirim via Google Form.
- [ ] Latihan demo offline 10 menit untuk final (kalau lolos).
