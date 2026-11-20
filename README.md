# DeadlineGuard PWA

DeadlineGuard adalah aplikasi pencatat dan pemrioritas tugas kuliah. Versi ini memperbaiki formulir, responsivitas, penyimpanan, PWA, dan notifikasi perangkat.

## Fitur yang diperbaiki

- Formulir tugas memiliki kolom catatan yang sebelumnya dirujuk JavaScript tetapi belum tersedia di HTML.
- Tampilan responsif untuk layar laptop dan handphone.
- Data tugas disimpan di `localStorage` pada perangkat.
- PWA menggunakan `manifest.json`, ikon PNG, dan Service Worker dari file same-origin.
- Notifikasi mobile menggunakan `ServiceWorkerRegistration.showNotification()`.
- Pengingat saat aplikasi terbuka diperiksa berkala dan saat halaman kembali aktif.
- Server Web Push opsional mengirim pengingat saat tab/aplikasi tidak dibuka, selama server berjalan dan perangkat terdaftar.
- Aksi status dan hapus tugas memakai event delegation, bukan inline JavaScript.

## Menjalankan aplikasi

Perlu Node.js 18 atau lebih baru.

1. Buka folder proyek ini di terminal.
2. Jalankan `npm install`.
3. Salin `.env.example` menjadi `.env`.
4. Buat pasangan kunci VAPID dengan `npm run generate-vapid`.
5. Salin nilai **Public Key** dan **Private Key** dari hasil perintah ke `VAPID_PUBLIC_KEY` dan `VAPID_PRIVATE_KEY` di `.env`. Isi `VAPID_SUBJECT` dengan alamat email yang dapat dihubungi.
6. Jalankan `npm start`.
7. Buka `http://localhost:3000` untuk pengujian di komputer.

Tanpa kunci VAPID, aplikasi dan pengingat lokal tetap dapat digunakan, tetapi push saat aplikasi ditutup belum aktif.

## Mengaktifkan notifikasi di handphone

Untuk penggunaan nyata di HP, aplikasi harus dihosting lewat **HTTPS**. `localhost` hanya untuk pengujian di perangkat yang menjalankan server itu sendiri; alamat IP LAN biasa tidak otomatis dianggap secure context.

1. Deploy seluruh proyek Node.js ini pada hosting yang menyediakan HTTPS. Jalankan `npm install` dan `npm start` pada server tersebut, lalu isi variabel VAPID di pengaturan environment hosting.
2. Buka URL HTTPS aplikasi dari handphone.
3. Pasang aplikasi ke layar utama (Add to Home Screen / Install App).
4. Buka aplikasi yang telah dipasang.
5. Tekan **Aktifkan Notifikasi HP** dan pilih **Allow/Izinkan**.
6. Tekan **Tes Notifikasi** untuk menguji notifikasi sistem. Pastikan suara notifikasi aplikasi/situs tidak dimatikan di pengaturan HP.

### Catatan kompatibilitas dan suara

- Android: gunakan browser modern yang mendukung PWA, Notifications, Service Worker, dan Push API.
- iPhone/iPad: Web Push tersedia untuk web app yang sudah ditambahkan ke Home Screen pada iOS/iPadOS 16.4 atau lebih baru. Buka dari ikon Home Screen sebelum meminta izin.
- Suara notifikasi sistem **tidak dapat dipilih atau dipaksa oleh halaman web**. Browser/HP menggunakan suara dan getaran sesuai pengaturan notifikasi perangkat, mode senyap, Focus/Do Not Disturb, dan kebijakan browser.
- Bunyi kecil dari Web Audio hanya dapat diputar saat halaman aplikasi terbuka dan browser mengizinkan audio. Pengingat saat aplikasi ditutup berasal dari push notification sistem, bukan audio yang dimainkan halaman web.
- Push saat aplikasi ditutup memerlukan server tetap berjalan, kunci VAPID, koneksi internet, izin notifikasi, dan langganan Push yang valid. Jika server tidak dikonfigurasi, label status akan tetap menunjukkan izin lokal, bukan push aktif.

## Penyimpanan dan privasi

Daftar tugas utama tetap disimpan di browser perangkat. Saat Push diaktifkan, data tugas yang diperlukan untuk menjadwalkan pengingat (judul, mata kuliah, tenggat, status) juga dikirim ke server pada origin aplikasi. Server menyimpan langganan push dan jadwal tugas di `data/deadlineguard.json`. Lindungi server dan file data tersebut, gunakan HTTPS, dan jangan bagikan file `.env`.

## Struktur proyek

```text
DeadlineGuard-PWA/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── icon-maskable-512.png
├── server.js
├── package.json
├── .env.example
└── README.md
```
