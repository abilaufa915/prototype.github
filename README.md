<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DeadlineGuard — Sistem Informasi & Prioritas Tugas Kuliah</title>

  <!-- Memuat Google Font 'Inter' untuk tipografi yang bersih dan modern -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

  <!-- Memuat Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Konfigurasi kustom Tailwind untuk font dan animasi halus -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
          },
        },
      },
    };
  </script>

  <style>
    /* Gaya dasar untuk memastikan kelancaran gulir dan mencegah overflow horizontal */
    html, body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      overflow-x: hidden;
    }

    /* Animasi transisi halus untuk kartu tugas dan notifikasi */
    @keyframes fadeSlideIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-card {
      animation: fadeSlideIn 0.25s ease-out forwards;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col">

  <!-- ==================== 1. HEADER & IDENTITAS APLIKASI ==================== -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        <!-- Kiri: Logo, Judul, Subjudul, dan Jam Real-Time -->
        <div class="flex items-start sm:items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
            <!-- Ikon Perisai / Checklist SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Deadline<span class="text-indigo-600">Guard</span>
              </h1>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                Mahasiswa Edition
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              Sistem Informasi &amp; Prioritas Tugas Kuliah Mahasiswa
            </p>
          </div>
        </div>

        <!-- Kanan: Penunjuk Waktu Real-Time & Tombol Utilitas -->
        <div class="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <!-- Tampilan Tanggal & Jam Real-Time -->
          <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span id="live-clock" class="tabular-nums">Memuat waktu...</span>
          </div>

          <!-- Tombol Utilitas: Tambah Data Contoh (4 tugas demo) -->
          <button
            type="button"
            id="btn-add-samples"
            class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:scale-[0.99] transition border border-indigo-200"
            title="Isi 4 contoh tugas realistis untuk keperluan simulasi dan presentasi"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Tambah Data Contoh</span>
          </button>

          <!-- Tombol Utilitas: Hapus Semua Data -->
          <button
            type="button"
            id="btn-clear-all"
            class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-rose-600 hover:bg-rose-50 active:scale-[0.99] transition border border-slate-200 hover:border-rose-200"
            title="Hapus seluruh daftar tugas dari penyimpanan lokal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Hapus Semua Data</span>
          </button>
        </div>

      </div>
    </div>
  </header>

  <!-- ==================== KONTEN UTAMA ==================== -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

    <!-- ==================== 2. PANEL RINGKASAN STATISTIK TUGAS ==================== -->
    <section aria-label="Ringkasan Statistik Tugas" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      
      <!-- Kartu Statistik 1: Total Tugas Aktif -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs sm:text-sm font-medium text-slate-500">Total Tugas Aktif</p>
          <p id="stat-active" class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">0</p>
          <p class="text-xs text-slate-400 mt-1">Status Belum Mulai &amp; Dikerjakan</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>

      <!-- Kartu Statistik 2: Tugas Mendesak (< 24 Jam / Lewat Tenggat) -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs sm:text-sm font-medium text-slate-500">Tugas Mendesak</p>
          <p id="stat-urgent" class="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1 tabular-nums">0</p>
          <p class="text-xs text-rose-500/90 mt-1">Tenggat &lt; 24 jam atau lewat batas</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      <!-- Kartu Statistik 3: Tugas Selesai -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs sm:text-sm font-medium text-slate-500">Tugas Selesai</p>
          <p id="stat-completed" class="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 tabular-nums">0</p>
          <p class="text-xs text-emerald-600/80 mt-1">Telah tuntas dikerjakan</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

    </section>

    <!-- ==================== TATA LETAK 2 KOLOM: FORMULIR (KIRI) & DAFTAR TUGAS (KANAN) ==================== -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- ==================== 3. FORMULIR PENCATATAN TUGAS ==================== -->
      <section aria-label="Formulir Pencatatan Tugas" class="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 lg:sticky lg:top-24">
        <div class="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900">Catat Tugas Baru</h2>
            <p class="text-xs text-slate-500">Prioritas dihitung otomatis oleh sistem</p>
          </div>
        </div>

        <!-- Pesan Validasi Form (Menggantikan alert()) -->
        <div id="form-error" class="hidden mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"></div>

        <form id="task-form" class="mt-4 space-y-4" novalidate>
          <!-- Input Nama Tugas -->
          <div>
            <label for="task-title" class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Nama Tugas <span class="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="task-title"
              name="title"
              required
              placeholder="Contoh: Laporan Praktikum Basis Data"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
            />
          </div>

          <!-- Input Nama Mata Kuliah -->
          <div>
            <label for="task-course" class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Nama Mata Kuliah <span class="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="task-course"
              name="course"
              list="course-suggestions"
              required
              placeholder="Contoh: Sistem Basis Data"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
            />
            <!-- Saran Mata Kuliah Umum Mahasiswa -->
            <datalist id="course-suggestions">
              <option value="Pemrograman Web"></option>
              <option value="Sistem Basis Data"></option>
              <option value="Kecerdasan Buatan"></option>
              <option value="Jaringan Komputer"></option>
              <option value="Metodologi Penelitian"></option>
              <option value="Rekayasa Perangkat Lunak"></option>
            </datalist>
          </div>

          <!-- Input Tanggal & Jam Tenggat Waktu -->
          <div>
            <label for="task-deadline" class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Tanggal &amp; Jam Tenggat Waktu <span class="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="task-deadline"
              name="deadline"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
            />
          </div>

          <!-- Pilihan Tingkat Kesulitan (Bobot 1, 2, 3) -->
          <div>
            <span class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Tingkat Kesulitan <span class="text-rose-500">*</span>
            </span>
            <div class="grid grid-cols-3 gap-2">
              <!-- Mudah (Bobot 1) -->
              <label class="cursor-pointer">
                <input type="radio" name="difficulty" value="1" class="peer sr-only" />
                <div class="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-center peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-800 hover:bg-slate-100 transition">
                  <p class="text-xs sm:text-sm font-bold">Mudah</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">Bobot 1</p>
                </div>
              </label>

              <!-- Sedang (Bobot 2 - Default) -->
              <label class="cursor-pointer">
                <input type="radio" name="difficulty" value="2" class="peer sr-only" checked />
                <div class="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-center peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-800 hover:bg-slate-100 transition">
                  <p class="text-xs sm:text-sm font-bold">Sedang</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">Bobot 2</p>
                </div>
              </label>

              <!-- Sulit (Bobot 3) -->
              <label class="cursor-pointer">
                <input type="radio" name="difficulty" value="3" class="peer sr-only" />
                <div class="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-center peer-checked:bg-rose-50 peer-checked:border-rose-500 peer-checked:text-rose-800 hover:bg-slate-100 transition">
                  <p class="text-xs sm:text-sm font-bold">Sulit</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">Bobot 3</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Input Catatan Singkat (Opsional) -->
          <div>
            <label for="task-notes" class="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Catatan Singkat <span class="text-xs font-normal text-slate-400">(Opsional)</span>
            </label>
            <textarea
              id="task-notes"
              name="notes"
              rows="2"
              placeholder="Contoh: Format PDF, kumpulkan di e-Learning sebelum pukul 23.59"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition resize-none"
            ></textarea>
          </div>

          <!-- Tombol Simpan Tugas -->
          <button
            type="submit"
            class="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Simpan Tugas</span>
          </button>
        </form>

        <!-- Legenda Peringatan Visual Dinamis -->
        <div class="mt-5 pt-4 border-t border-slate-100">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Panduan Indikator Warna
          </p>
          <div class="space-y-1.5 text-xs text-slate-600">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
              <span><strong>Merah:</strong> Sisa waktu &lt; 24 jam / lewat tenggat</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <span><strong>Kuning:</strong> Sisa waktu 1 – 3 hari (24–72 jam)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span><strong>Hijau:</strong> Sisa waktu &gt; 3 hari atau Selesai</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== 4, 5, 6. DAFTAR PRIORITAS TUGAS, FILTER & PENCARIAN ==================== -->
      <section aria-label="Daftar Prioritas Tugas" class="lg:col-span-8 space-y-4">
        
        <!-- Bar Filter & Pencarian -->
        <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 class="text-base sm:text-lg font-bold text-slate-900">Daftar Prioritas Tugas</h2>
              <p class="text-xs text-slate-500">Diurutkan otomatis berdasarkan skor urgensi tertinggi</p>
            </div>
            <span id="visible-count" class="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              Menampilkan 0 tugas
            </span>
          </div>

          <!-- Filter Tab Status -->
          <div id="status-filter-group" class="flex flex-wrap gap-2" role="tablist" aria-label="Filter berdasarkan status tugas">
            <button type="button" data-status="Semua" class="status-tab px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-indigo-600 text-white shadow-sm">
              Semua
            </button>
            <button type="button" data-status="Belum Mulai" class="status-tab px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-slate-100 text-slate-600 hover:bg-slate-200/70">
              Belum Mulai
            </button>
            <button type="button" data-status="Dikerjakan" class="status-tab px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-slate-100 text-slate-600 hover:bg-slate-200/70">
              Dikerjakan
            </button>
            <button type="button" data-status="Selesai" class="status-tab px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-slate-100 text-slate-600 hover:bg-slate-200/70">
              Selesai
            </button>
          </div>

          <!-- Filter Mata Kuliah & Kolom Pencarian -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Pencarian Nama Tugas -->
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                id="search-input"
                placeholder="Cari nama tugas atau catatan..."
                class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
              />
            </div>

            <!-- Dropdown Dinamis Mata Kuliah -->
            <div>
              <select
                id="course-filter"
                aria-label="Filter berdasarkan mata kuliah"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
              >
                <option value="Semua">Semua Mata Kuliah</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Kontainer Kartu Daftar Tugas -->
        <div id="task-list" class="space-y-3.5">
          <!-- Kartu tugas dirender secara dinamis oleh JavaScript -->
        </div>

        <!-- Tampilan Kosong (Empty State) -->
        <div id="empty-state" class="hidden bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center">
          <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-slate-800">Tidak ada tugas ditemukan</h3>
          <p id="empty-state-desc" class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            Belum ada tugas yang tercatat atau tidak ada tugas yang sesuai dengan filter pencarian saat ini.
          </p>
          <button
            type="button"
            id="btn-empty-sample"
            class="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <span>Muat 4 Contoh Tugas Mahasiswa</span>
          </button>
        </div>

      </section>
    </div>
  </main>

  <!-- ==================== FOOTER SEDERHANA ==================== -->
  <footer class="bg-white border-t border-slate-200 mt-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
      <p><strong>DeadlineGuard</strong> — Proyek Akhir Berbantuan AI (Sistem Informasi &amp; Pencatatan Tugas Kuliah)</p>
      <p>Penyimpanan Lokal Aktif (<code class="text-indigo-600 font-medium">Web LocalStorage</code>)</p>
    </div>
  </footer>

  <!-- ==================== MODAL KONFIRMASI KUSTOM (PENGGANTI confirm()) ==================== -->
  <div id="confirm-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-card">
      <div class="flex items-start gap-3.5">
        <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 id="modal-title" class="text-base font-bold text-slate-900">Konfirmasi Penghapusan</h3>
          <p id="modal-message" class="text-xs sm:text-sm text-slate-600 mt-1">
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
      </div>
      <div class="mt-6 flex items-center justify-end gap-2.5">
        <button
          type="button"
          id="modal-cancel"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
        >
          Batal
        </button>
        <button
          type="button"
          id="modal-confirm"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm"
        >
          Ya, Hapus
        </button>
      </div>
    </div>
  </div>

  <!-- ==================== NOTIFIKASI TOAST (PENGGANTI alert()) ==================== -->
  <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-[calc(100%-2.5rem)] pointer-events-none"></div>

  <!-- ==================== LOGIKA JAVASCRIPT APLIKASI DEADLINEGUARD ==================== -->
  <script>
    /**
     * Kunci penyimpanan LocalStorage untuk menyimpan daftar tugas dan status inisialisasi awal.
     */
    const STORAGE_KEY = 'deadlineguard_tasks_v1';
    const INIT_FLAG_KEY = 'deadlineguard_initialized_v1';

    /**
     * State utama aplikasi yang menyimpan daftar tugas serta kriteria filter aktif.
     */
    let tasks = [];
    let filterState = {
      status: 'Semua',
      course: 'Semua',
      search: ''
    };
    let pendingConfirmAction = null;

    // ==================== UTILITAS TANGGAL & WAKTU ====================

    /**
     * Menghasilkan string waktu lokal format 'YYYY-MM-DDTHH:mm' relatif terhadap jam saat ini.
     * Digunakan untuk menghasilkan contoh tugas yang selalu relevan saat aplikasi dibuka.
     * @param {number} offsetHours - Selisih jam dari waktu sekarang (bisa positif atau negatif)
     * @returns {string} String format datetime-local
     */
    function getRelativeDeadlineISO(offsetHours) {
      const targetDate = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
      const pad = (n) => String(n).padStart(2, '0');
      const year = targetDate.getFullYear();
      const month = pad(targetDate.getMonth() + 1);
      const day = pad(targetDate.getDate());
      const hours = pad(targetDate.getHours());
      const minutes = pad(targetDate.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    /**
     * Memformat timestamp ISO menjadi tampilan tanggal & jam Indonesia yang mudah dibaca.
     * @param {string} isoString - String tanggal ISO
     * @returns {string} Tanggal terformat (contoh: 'Rab, 18 Nov 2026 • 23:59')
     */
    function formatReadableDeadline(isoString) {
      try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return 'Tanggal tidak valid';
        const datePart = date.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        const timePart = date.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        });
        return `${datePart} • ${timePart}`;
      } catch (error) {
        return isoString;
      }
    }

    /**
     * Memperbarui jam dan tanggal real-time di header setiap detik.
     */
    function updateLiveClock() {
      const clockEl = document.getElementById('live-clock');
      if (!clockEl) return;
      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      clockEl.textContent = `${dateStr} • ${timeStr}`;
    }

    // ==================== MANAJEMEN PENYIMPANAN LOKAL (LOCALSTORAGE) ====================

    /**
     * Menyimpan array tugas ke Web LocalStorage dengan penanganan error.
     */
    function saveTasksToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        showToast('Gagal menyimpan data ke penyimpanan lokal peramban.', 'error');
      }
    }

    /**
     * Memuat tugas dari LocalStorage. Jika aplikasi dibuka pertama kali dan belum
     * pernah diinisialisasi, otomatis mengisi 3 contoh tugas awal agar tampilan langsung hidup.
     */
    function loadTasksFromStorage() {
      try {
        const isInitialized = localStorage.getItem(INIT_FLAG_KEY);
        const rawData = localStorage.getItem(STORAGE_KEY);

        if (!isInitialized) {
          // 3 data contoh awal saat pertama kali aplikasi dibuka
          tasks = [
            {
              id: 'init-' + Date.now() + '-1',
              title: 'Laporan Praktikum Algoritma & Struktur Data',
              course: 'Struktur Data',
              deadline: getRelativeDeadlineISO(7.5), // < 24 jam (Merah)
              difficulty: 3, // Sulit
              notes: 'Sertakan analisis kompleksitas waktu Big-O dan screenshot hasil kompilasi.',
              status: 'Dikerjakan',
              createdAt: Date.now()
            },
            {
              id: 'init-' + Date.now() + '-2',
              title: 'Makalah Analisis Dampak AI dalam Pendidikan',
              course: 'Etika Profesi TI',
              deadline: getRelativeDeadlineISO(50), // ~2 hari (Kuning)
              difficulty: 2, // Sedang
              notes: 'Minimal 8 halaman, format sitasi IEEE.',
              status: 'Belum Mulai',
              createdAt: Date.now()
            },
            {
              id: 'init-' + Date.now() + '-3',
              title: 'Rangkuman Materi Normalisasi Database (1NF–3NF)',
              course: 'Sistem Basis Data',
              deadline: getRelativeDeadlineISO(124), // > 5 hari (Hijau)
              difficulty: 1, // Mudah
              notes: 'Tulis tangan atau ketik rapi lalu unggah ke portal akademik.',
              status: 'Belum Mulai',
              createdAt: Date.now()
            }
          ];
          localStorage.setItem(INIT_FLAG_KEY, 'true');
          saveTasksToStorage();
        } else if (rawData) {
          const parsed = JSON.parse(rawData);
          tasks = Array.isArray(parsed) ? parsed : [];
        } else {
          tasks = [];
        }
      } catch (error) {
        tasks = [];
        showToast('Terjadi kendala saat membaca data tersimpan.', 'error');
      }
    }

    /**
     * Menambahkan 4 contoh tugas realistis mahasiswa (Laporan Praktikum, Makalah, Kuis, Proyek Kelompok)
     * dengan variasi tenggat <24 jam, 2 hari, 5 hari, dan selesai untuk keperluan demonstrasi.
     */
    function addDemoSampleTasks() {
      const now = Date.now();
      const demoTasks = [
        {
          id: `demo-${now}-1`,
          title: 'Laporan Praktikum Jaringan Komputer (Routing Dinamis)',
          course: 'Jaringan Komputer',
          deadline: getRelativeDeadlineISO(5.5), // < 24 jam (Merah)
          difficulty: 3, // Sulit
          notes: 'Lampirkan file topologi Packet Tracer (.pkt) dan tabel routing.',
          status: 'Dikerjakan',
          createdAt: now
        },
        {
          id: `demo-${now}-2`,
          title: 'Makalah Studi Kasus Keamanan Sistem Informasi',
          course: 'Keamanan Siber',
          deadline: getRelativeDeadlineISO(48), // 2 hari (Kuning)
          difficulty: 2, // Sedang
          notes: 'Diskusi kelompok 3 orang, kumpulkan melalui Google Classroom.',
          status: 'Belum Mulai',
          createdAt: now + 1
        },
        {
          id: `demo-${now}-3`,
          title: 'Kuis Online Pemrograman Web Dasar (HTML, CSS, JS)',
          course: 'Pemrograman Web',
          deadline: getRelativeDeadlineISO(120), // 5 hari (Hijau)
          difficulty: 1, // Mudah
          notes: 'Durasi pengerjaan 45 menit di LMS kampus.',
          status: 'Belum Mulai',
          createdAt: now + 2
        },
        {
          id: `demo-${now}-4`,
          title: 'Proyek Kelompok Perancangan UI/UX Aplikasi Kampus',
          course: 'Interaksi Manusia & Komputer',
          deadline: getRelativeDeadlineISO(18), // Sudah Selesai (Hijau)
          difficulty: 3, // Sulit
          notes: 'Prototipe Figma dan presentasi slide telah diunggah.',
          status: 'Selesai',
          createdAt: now + 3
        }
      ];

      tasks = [...demoTasks, ...tasks];
      saveTasksToStorage();
      renderApp();
      showToast('4 contoh tugas mahasiswa berhasil ditambahkan!', 'success');
    }

    // ==================== ALGORITMA AUTO-PRIORITY & COUNTDOWN ====================

    /**
     * Menghitung metrik prioritas, skor urgensi, label warna peringatan visual,
     * serta teks hitung mundur (countdown) secara real-time untuk sebuah tugas.
     * @param {Object} task - Objek tugas
     * @param {number} nowMs - Timestamp saat ini dalam milidetik
     * @returns {Object} Hasil kalkulasi urgensi, visual alert, dan countdown
     */
    function evaluateTaskUrgency(task, nowMs) {
      const deadlineMs = new Date(task.deadline).getTime();
      const diffMs = deadlineMs - nowMs;
      const hoursRemaining = diffMs / (1000 * 60 * 60);
      const weight = Number(task.difficulty) || 1;
      const isCompleted = task.status === 'Selesai';

      // 1. Hitung teks hitung mundur (Countdown Real-Time)
      let countdownText = '';
      if (diffMs <= 0) {
        countdownText = 'Melewati Tenggat!';
      } else {
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const totalHours = Math.floor(totalMinutes / 60);
        const days = Math.floor(totalHours / 24);
        const remHours = totalHours % 24;
        const remMinutes = totalMinutes % 60;
        const remSeconds = Math.floor((diffMs / 1000) % 60);

        if (days >= 1) {
          countdownText = remHours > 0
            ? `Sisa ${days} hari ${remHours} jam`
            : `Sisa ${days} hari ${remMinutes} menit`;
        } else if (totalHours >= 1) {
          countdownText = `Sisa ${totalHours} jam ${remMinutes} menit`;
        } else {
          countdownText = `Sisa ${remMinutes} menit ${remSeconds} detik`;
        }
      }

      // 2. Hitung Skor Urgensi Otomatis (Auto-Priority)
      // Tugas selesai diberi skor -Infinity agar selalu berada di bagian bawah daftar.
      let urgencyScore = 0;
      if (isCompleted) {
        urgencyScore = -Infinity;
      } else if (hoursRemaining <= 0) {
        // Tugas yang sudah melewati tenggat mendapat skor tertinggi
        urgencyScore = 2500 + Math.abs(hoursRemaining) * 5 + weight * 50;
      } else {
        // Kombinasi kedekatan tenggat (1000 / sisa jam) dan bobot tingkat kesulitan
        const timeFactor = 1000 / Math.max(hoursRemaining, 0.5);
        const difficultyMultiplier = 1 + (weight - 1) * 0.35;
        urgencyScore = timeFactor * difficultyMultiplier;
      }

      // 3. Tentukan Label Prioritas & Peringatan Visual Dinamis (Merah, Kuning, Hijau)
      let priorityLabel = 'Prioritas Rendah';
      let alertTheme = 'green'; // 'red' | 'amber' | 'green'

      if (isCompleted) {
        priorityLabel = 'Tugas Selesai';
        alertTheme = 'green';
      } else if (hoursRemaining < 24) {
        // Merah: sisa waktu < 24 jam atau lewat tenggat
        priorityLabel = 'Prioritas Tinggi';
        alertTheme = 'red';
      } else if (hoursRemaining <= 72) {
        // Kuning/Amber: sisa waktu antara 1 hingga 3 hari (24 - 72 jam)
        priorityLabel = urgencyScore >= 60 ? 'Prioritas Tinggi' : 'Prioritas Sedang';
        alertTheme = 'amber';
      } else {
        // Hijau/Emerald: sisa waktu > 3 hari
        priorityLabel = 'Prioritas Rendah';
        alertTheme = 'green';
      }

      return {
        diffMs,
        hoursRemaining,
        urgencyScore,
        priorityLabel,
        alertTheme,
        countdownText,
        isOverdue: !isCompleted && diffMs <= 0,
        isUrgent: !isCompleted && hoursRemaining < 24
      };
    }

    // ==================== RENDERING ANTARMUKA (UI) ====================

    /**
     * Memperbarui 3 kartu statistik di bagian atas (Aktif, Mendesak, Selesai).
     */
    function updateStatistics(evaluatedTasks) {
      let activeCount = 0;
      let urgentCount = 0;
      let completedCount = 0;

      evaluatedTasks.forEach(({ task, meta }) => {
        if (task.status === 'Selesai') {
          completedCount++;
        } else {
          activeCount++;
          if (meta.isUrgent) {
            urgentCount++;
          }
        }
      });

      document.getElementById('stat-active').textContent = activeCount;
      document.getElementById('stat-urgent').textContent = urgentCount;
      document.getElementById('stat-completed').textContent = completedCount;
    }

    /**
     * Memperbarui opsi dropdown filter Mata Kuliah secara dinamis berdasarkan data tugas yang ada.
     */
    function updateCourseFilterOptions() {
      const courseSelect = document.getElementById('course-filter');
      if (!courseSelect) return;

      const uniqueCourses = Array.from(
        new Set(tasks.map((t) => t.course.trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b, 'id'));

      // Reset filter ke 'Semua' jika mata kuliah yang dipilih sebelumnya sudah tidak ada
      if (filterState.course !== 'Semua' && !uniqueCourses.includes(filterState.course)) {
        filterState.course = 'Semua';
      }

      courseSelect.innerHTML = '<option value="Semua">Semua Mata Kuliah</option>';
      uniqueCourses.forEach((courseName) => {
        const opt = document.createElement('option');
        opt.value = courseName;
        opt.textContent = courseName;
        if (courseName === filterState.course) {
          opt.selected = true;
        }
        courseSelect.appendChild(opt);
      });
    }

    /**
     * Mengembalikan label dan kelas styling badge untuk tingkat kesulitan tugas.
     */
    function getDifficultyBadge(difficulty) {
      const level = Number(difficulty);
      if (level === 3) {
        return { label: 'Sulit (Bobot 3)', classes: 'bg-rose-50 text-rose-700 border-rose-200' };
      }
      if (level === 2) {
        return { label: 'Sedang (Bobot 2)', classes: 'bg-amber-50 text-amber-700 border-amber-200' };
      }
      return { label: 'Mudah (Bobot 1)', classes: 'bg-slate-100 text-slate-700 border-slate-200' };
    }

    /**
     * Merender seluruh komponen UI: statistik, filter mata kuliah, dan daftar kartu tugas.
     */
    function renderApp() {
      const nowMs = Date.now();

      // Evaluasi urgensi setiap tugas dan urutkan dari skor tertinggi ke terendah
      const evaluated = tasks.map((task) => ({
        task,
        meta: evaluateTaskUrgency(task, nowMs)
      }));

      evaluated.sort((a, b) => {
        // Jika keduanya selesai, urutkan berdasarkan tenggat terbaru
        if (a.task.status === 'Selesai' && b.task.status === 'Selesai') {
          return new Date(b.task.deadline).getTime() - new Date(a.task.deadline).getTime();
        }
        // Urutkan berdasarkan skor urgensi tertinggi
        if (b.meta.urgencyScore !== a.meta.urgencyScore) {
          return b.meta.urgencyScore - a.meta.urgencyScore;
        }
        // Tie-breaker: tenggat waktu paling dekat
        return new Date(a.task.deadline).getTime() - new Date(b.task.deadline).getTime();
      });

      // Perbarui statistik & opsi mata kuliah
      updateStatistics(evaluated);
      updateCourseFilterOptions();

      // Terapkan filter Status, Mata Kuliah, dan Pencarian Teks
      const query = filterState.search.trim().toLowerCase();
      const filtered = evaluated.filter(({ task }) => {
        const matchStatus = filterState.status === 'Semua' || task.status === filterState.status;
        const matchCourse = filterState.course === 'Semua' || task.course === filterState.course;
        const matchSearch =
          !query ||
          task.title.toLowerCase().includes(query) ||
          task.course.toLowerCase().includes(query) ||
          (task.notes && task.notes.toLowerCase().includes(query));
        return matchStatus && matchCourse && matchSearch;
      });

      // Perbarui label penghitung tugas yang tampil
      const visibleCountEl = document.getElementById('visible-count');
      if (visibleCountEl) {
        visibleCountEl.textContent = `Menampilkan ${filtered.length} dari ${tasks.length} tugas`;
      }

      const taskListEl = document.getElementById('task-list');
      const emptyStateEl = document.getElementById('empty-state');

      if (filtered.length === 0) {
        taskListEl.innerHTML = '';
        emptyStateEl.classList.remove('hidden');
        return;
      }

      emptyStateEl.classList.add('hidden');

      // Bangun HTML setiap kartu tugas
      taskListEl.innerHTML = filtered.map(({ task, meta }) => {
        const isCompleted = task.status === 'Selesai';
        const diffBadge = getDifficultyBadge(task.difficulty);

        // Pemetaan gaya peringatan visual dinamis (Merah, Kuning/Amber, Hijau/Emerald)
        const themeStyles = {
          red: {
            borderLeft: 'border-l-rose-500',
            cardBg: 'bg-white',
            priorityBadge: 'bg-rose-50 text-rose-700 border-rose-200',
            countdownBadge: 'bg-rose-600 text-white shadow-xs',
            dotColor: 'bg-rose-500'
          },
          amber: {
            borderLeft: 'border-l-amber-500',
            cardBg: 'bg-white',
            priorityBadge: 'bg-amber-50 text-amber-800 border-amber-200',
            countdownBadge: 'bg-amber-100 text-amber-900 border border-amber-300',
            dotColor: 'bg-amber-500'
          },
          green: {
            borderLeft: 'border-l-emerald-500',
            cardBg: isCompleted ? 'bg-slate-50/90 opacity-90' : 'bg-white',
            priorityBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            countdownBadge: isCompleted
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            dotColor: 'bg-emerald-500'
          }
        }[meta.alertTheme];

        // Tombol pemilih status langsung ('Belum Mulai', 'Dikerjakan', 'Selesai')
        const statuses = ['Belum Mulai', 'Dikerjakan', 'Selesai'];
        const statusButtonsHtml = statuses.map((st) => {
          const isActive = task.status === st;
          let activeClass = 'bg-slate-800 text-white border-slate-800';
          if (isActive && st === 'Selesai') activeClass = 'bg-emerald-600 text-white border-emerald-600';
          if (isActive && st === 'Dikerjakan') activeClass = 'bg-indigo-600 text-white border-indigo-600';

          const inactiveClass = 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100';
          return `
            <button
              type="button"
              onclick="changeTaskStatus('${task.id}', '${st}')"
              class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${isActive ? activeClass : inactiveClass}"
            >
              ${st}
            </button>
          `;
        }).join('');

        return `
          <article class="${themeStyles.cardBg} rounded-2xl border border-slate-200/90 border-l-[6px] ${themeStyles.borderLeft} shadow-sm p-4 sm:p-5 transition hover:shadow-md animate-card">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              
              <!-- Informasi Utama Tugas -->
              <div class="space-y-1.5 flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <!-- Badge Prioritas Otomatis -->
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${themeStyles.priorityBadge}">
                    <span class="w-1.5 h-1.5 rounded-full ${themeStyles.dotColor}"></span>
                    ${meta.priorityLabel}
                  </span>

                  <!-- Badge Mata Kuliah -->
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    ${escapeHtml(task.course)}
                  </span>

                  <!-- Badge Tingkat Kesulitan -->
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${diffBadge.classes}">
                    ${diffBadge.label}
                  </span>
                </div>

                <!-- Judul Tugas -->
                <h3 class="text-base sm:text-lg font-bold text-slate-900 break-words ${isCompleted ? 'line-through text-slate-500' : ''}">
                  ${escapeHtml(task.title)}
                </h3>

                <!-- Catatan Singkat (jika ada) -->
                ${task.notes ? `<p class="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">${escapeHtml(task.notes)}</p>` : ''}
              </div>

              <!-- Badge Countdown Real-Time & Jadwal Tenggat -->
              <div class="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-1.5 shrink-0 pt-1 sm:pt-0">
                <span
                  data-countdown-id="${task.id}"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold tabular-nums ${themeStyles.countdownBadge}"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>${isCompleted ? 'Selesai Tepat Waktu' : meta.countdownText}</span>
                </span>
                <span class="text-[11px] sm:text-xs font-medium text-slate-500">
                  Tenggat: ${formatReadableDeadline(task.deadline)}
                </span>
              </div>

            </div>

            <!-- Bar Aksi Bawah: Pengubah Status Langsung & Tombol Hapus -->
            <div class="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="text-xs font-medium text-slate-400 mr-1">Status:</span>
                ${statusButtonsHtml}
              </div>

              <button
                type="button"
                onclick="requestDeleteTask('${task.id}')"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                title="Hapus tugas ini"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Hapus</span>
              </button>
            </div>
          </article>
        `;
      }).join('');
    }

    /**
     * Memperbarui teks countdown setiap detik tanpa merender ulang seluruh DOM
     * sehingga interaksi tombol dan input pengguna tetap mulus.
     */
    function refreshCountdownsTick() {
      updateLiveClock();
      const nowMs = Date.now();
      let requiresFullRerender = false;

      tasks.forEach((task) => {
        const meta = evaluateTaskUrgency(task, nowMs);
        const badgeEl = document.querySelector(`[data-countdown-id="${task.id}"] span`);
        if (badgeEl) {
          const newText = task.status === 'Selesai' ? 'Selesai Tepat Waktu' : meta.countdownText;
          if (badgeEl.textContent !== newText) {
            badgeEl.textContent = newText;
          }
        }
        // Jika baru saja melewati batas 24 jam atau lewat tenggat, perbarui seluruh kartu agar warna berubah
        if (!task._wasOverdue && meta.isOverdue) {
          task._wasOverdue = true;
          requiresFullRerender = true;
        }
      });

      if (requiresFullRerender) {
        renderApp();
      }
    }

    // ==================== AKSI PENGGUNA (CRUD, FILTER, MODAL, TOAST) ====================

    /**
     * Mengubah status pengerjaan tugas ('Belum Mulai', 'Dikerjakan', 'Selesai').
     */
    window.changeTaskStatus = function (taskId, newStatus) {
      const target = tasks.find((t) => t.id === taskId);
      if (!target || target.status === newStatus) return;

      target.status = newStatus;
      saveTasksToStorage();
      renderApp();
      showToast(`Status tugas diubah menjadi "${newStatus}".`, 'info');
    };

    /**
     * Membuka dialog konfirmasi kustom sebelum menghapus satu tugas.
     */
    window.requestDeleteTask = function (taskId) {
      const target = tasks.find((t) => t.id === taskId);
      if (!target) return;

      openConfirmModal(
        'Hapus Tugas Ini?',
        `Tugas "${target.title}" (${target.course}) akan dihapus permanen dari daftar Anda.`,
        () => {
          tasks = tasks.filter((t) => t.id !== taskId);
          saveTasksToStorage();
          renderApp();
          showToast('Tugas berhasil dihapus.', 'info');
        }
      );
    };

    /**
     * Membuka modal konfirmasi kustom (pengganti window.confirm).
     */
    function openConfirmModal(title, message, onConfirm) {
      const modal = document.getElementById('confirm-modal');
      document.getElementById('modal-title').textContent = title;
      document.getElementById('modal-message').textContent = message;
      pendingConfirmAction = onConfirm;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    /**
     * Menutup modal konfirmasi kustom.
     */
    function closeConfirmModal() {
      const modal = document.getElementById('confirm-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      pendingConfirmAction = null;
    }

    /**
     * Menampilkan notifikasi toast sementara di sudut kanan bawah (pengganti window.alert).
     */
    function showToast(message, type = 'success') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const styles = {
        success: 'bg-slate-900 text-white border-emerald-500',
        error: 'bg-rose-600 text-white border-rose-800',
        info: 'bg-indigo-600 text-white border-indigo-800'
      }[type] || 'bg-slate-900 text-white border-slate-700';

      const toast = document.createElement('div');
      toast.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-lg border-l-4 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 animate-card ${styles}`;
      toast.innerHTML = `<span>${escapeHtml(message)}</span>`;

      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.25s ease';
        setTimeout(() => toast.remove(), 260);
      }, 3000);
    }

    /**
     * Mencegah injeksi HTML (XSS) pada input teks pengguna.
     */
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // ==================== INISIALISASI EVENT LISTENER SAAT HALAMAN DIMUAT ====================

    document.addEventListener('DOMContentLoaded', () => {
      // 1. Muat data awal dan mulai jam real-time
      loadTasksFromStorage();
      updateLiveClock();
      renderApp();

      // Set nilai default input tenggat waktu menjadi besok pukul 23:59 agar praktis
      const deadlineInput = document.getElementById('task-deadline');
      if (deadlineInput) {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const pad = (n) => String(n).padStart(2, '0');
        deadlineInput.value = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T23:59`;
      }

      // Interval pembaruan detik untuk jam dan countdown
      setInterval(refreshCountdownsTick, 1000);

      // 2. Penanganan Submit Formulir Pencatatan Tugas
      const taskForm = document.getElementById('task-form');
      const formErrorEl = document.getElementById('form-error');

      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formErrorEl.classList.add('hidden');

        const title = document.getElementById('task-title').value.trim();
        const course = document.getElementById('task-course').value.trim();
        const deadline = document.getElementById('task-deadline').value;
        const notes = document.getElementById('task-notes').value.trim();
        const difficultyEl = document.querySelector('input[name="difficulty"]:checked');
        const difficulty = difficultyEl ? Number(difficultyEl.value) : 2;

        // Validasi input wajib
        if (!title || !course || !deadline) {
          formErrorEl.textContent = 'Mohon lengkapi Nama Tugas, Nama Mata Kuliah, dan Tanggal/Jam Tenggat Waktu.';
          formErrorEl.classList.remove('hidden');
          return;
        }

        const newTask = {
          id: 'task-' + Date.now(),
          title,
          course,
          deadline,
          difficulty,
          notes,
          status: 'Belum Mulai',
          createdAt: Date.now()
        };

        tasks.unshift(newTask);
        saveTasksToStorage();
        renderApp();

        // Reset kolom teks form namun pertahankan default tenggat yang nyaman
        document.getElementById('task-title').value = '';
        document.getElementById('task-course').value = '';
        document.getElementById('task-notes').value = '';
        showToast('Tugas baru berhasil disimpan dan diprioritaskan!', 'success');
      });

      // 3. Tombol Tambah Data Contoh (Header & Empty State)
      document.getElementById('btn-add-samples').addEventListener('click', addDemoSampleTasks);
      document.getElementById('btn-empty-sample').addEventListener('click', addDemoSampleTasks);

      // 4. Tombol Hapus Semua Data
      document.getElementById('btn-clear-all').addEventListener('click', () => {
        if (tasks.length === 0) {
          showToast('Daftar tugas sudah kosong.', 'info');
          return;
        }
        openConfirmModal(
          'Hapus Semua Data Tugas?',
          `Seluruh ${tasks.length} tugas yang tersimpan di peramban akan dihapus secara permanen.`,
          () => {
            tasks = [];
            saveTasksToStorage();
            renderApp();
            showToast('Seluruh data tugas berhasil dibersihkan.', 'info');
          }
        );
      });

      // 5. Event Listener Modal Konfirmasi
      document.getElementById('modal-cancel').addEventListener('click', closeConfirmModal);
      document.getElementById('modal-confirm').addEventListener('click', () => {
        if (typeof pendingConfirmAction === 'function') {
          pendingConfirmAction();
        }
        closeConfirmModal();
      });
      document.getElementById('confirm-modal').addEventListener('click', (e) => {
        if (e.target.id === 'confirm-modal') closeConfirmModal();
      });

      // 6. Event Listener Filter Tab Status
      const statusTabs = document.querySelectorAll('.status-tab');
      statusTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          filterState.status = tab.dataset.status;
          statusTabs.forEach((btn) => {
            const isSelected = btn.dataset.status === filterState.status;
            btn.className = isSelected
              ? 'status-tab px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-indigo-600 text-white shadow-sm'
              : 'status-tab px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-slate-100 text-slate-600 hover:bg-slate-200/70';
          });
          renderApp();
        });
      });

      // 7. Event Listener Filter Mata Kuliah & Kolom Pencarian
      document.getElementById('course-filter').addEventListener('change', (e) => {
        filterState.course = e.target.value;
        renderApp();
      });

      document.getElementById('search-input').addEventListener('input', (e) => {
        filterState.search = e.target.value;
        renderApp();
      });
    });
  </script>
</body>
</html>
