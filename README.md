# DeadlineGuard v2 — GitHub Pages

## Isi rilis
- `index.html`: aplikasi utama.
- `manifest.json`, `sw.js`, `icons/`: aset PWA dan Service Worker.
- `.nojekyll`: mencegah pemrosesan Jekyll untuk file statis.
- `backend-reference/`: contoh backend opsional. Folder ini **tidak dijalankan** oleh GitHub Pages.

## Deploy ke GitHub Pages
1. Ekstrak ZIP ini.
2. Unggah **isi folder** ini ke root repository `abilaufa915/prototype.github` pada branch `main` (jangan unggah folder pembungkusnya).
3. Pastikan `index.html`, `manifest.json`, `sw.js`, `.nojekyll`, dan `icons/` berada sejajar di root.
4. Di Settings → Pages pilih `Deploy from a branch`, branch `main`, folder `/(root)`.
5. Tunggu deployment selesai, lalu buka `https://abilaufa915.github.io/prototype.github/` dan refresh.

## Perubahan v2
- Desain dipoles dengan hierarki visual lebih rapi dan perbaikan ergonomi layar kecil.
- Menambahkan ekspor JSON dan pemulihan backup dengan validasi data serta konfirmasi sebelum mengganti data.
- Pengingat lokal bertahap H-72, H-24, H-3, H-1, dan lewat tenggat; setiap tahap hanya dicatat sekali per tugas.
- Sinkronisasi antar-tab untuk perubahan LocalStorage.
- Menambahkan metadata rilis dan cache Service Worker baru.

## Batasan penting
- Data masih tersimpan di LocalStorage browser/perangkat. Backup JSON dianjurkan secara berkala; data tidak otomatis tersinkron antarperangkat.
- Pengingat lokal hanya diperiksa ketika halaman aktif/terbuka. Timer JavaScript tidak dapat menjamin notifikasi saat browser ditutup.
- Push saat aplikasi ditutup memerlukan backend Web Push yang berjalan di hosting server, database/penyimpanan langganan, HTTPS, dan konfigurasi VAPID. GitHub Pages hanya meng-host file statis dan tidak menjalankan Node.js.
- `backend-reference/` adalah referensi awal, bukan backend produksi. Jangan mengunggah `.env` atau private VAPID key ke repository publik.
- Tailwind masih dimuat dari CDN; saat offline penuh, tampilan bisa kehilangan styling. Offline-first CSS mandiri menjadi pekerjaan tahap berikutnya.

## Roadmap bertahap
### Tahap 1 — Stabilitas inti (rilis ini)
Validasi penyimpanan, backup/restore, pengingat bertingkat saat aplikasi aktif, Service Worker/PWA, dan tampilan responsif.

### Tahap 2 — Push yang benar-benar andal
Pisahkan API backend dari GitHub Pages; simpan subscription secara aman; buat scheduler server-side; autentikasi endpoint, validasi payload, rate limit, logging, dan uji perangkat Android/iOS.

### Tahap 3 — Data dan sinkronisasi
Migrasi ke database, akun pengguna, sinkronisasi multi-perangkat, konflik perubahan, dan pemulihan akun.

### Tahap 4 — Fitur akademik
Kalender akademik, estimasi durasi, bobot tugas, dan dashboard produktivitas. Fitur baru masuk setelah stabilitas tahap sebelumnya teruji.

## Uji minimum sebelum dipakai harian
- Tambah, edit status, hapus satu, hapus semua (konfirmasi).
- Reload browser dan pastikan tugas tetap ada.
- Export lalu import backup pada browser uji.
- Uji tenggat contoh pada tiap tahap reminder.
- Uji izin notifikasi ditolak, diberikan, dan tidak didukung.
- Install PWA dari HTTPS; uji update Service Worker.
- Uji layar 360px, 390px, tablet, dan laptop.


## Dark theme update
- Default appearance changed to a deep navy dark theme.
- Updated browser/PWA theme metadata and Service Worker cache version.
- No task data schema changes are intended in this visual update.

