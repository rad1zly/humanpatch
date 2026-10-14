# STUDENT STORYLINE #1 — "Kompetisi Digital" (template: NADIA)

> Source: ChatGPT share link (user-provided), 2026-10-14.
> This is template storyline #1 for the STUDENT world. Adapt names/context per persona.

## Premis
Nadia, siswi SMA 16 th, aktif pakai HP untuk belajar, tugas, teman, medsos, cari beasiswa.
Sekolah mengadakan kompetisi proyek digital (hadiah beasiswa + program nasional).
Selama persiapan, muncul situasi mencurigakan: pesan palsu panitia, tawaran hadiah,
permintaan OTP, akun teman kirim tautan aneh.

## Struktur 5 hari × 2 domain

### DAY 1 — A New Beginning (semua dimulai dari sebuah akun)
- **Domain 1 — Passwords & Accounts**: bikin akun portal kompetisi.
  - A: pakai sandi sama seperti akun lain → bocor 1 = kena semua
  - B: sandi mirip → tetap berisiko
  - C: sandi unik kuat + password manager → risiko turun signifikan
  - Follow-up: aktifkan MFA di email + jaga recovery
- **Domain 2 — Phishing & Messages**: WA "Selamat! Finalis kompetisi nasional, konfirmasi 10 menit!"
  - A: buka link + isi data → simulasi risiko kredensial bocor
  - B: balas tanya identitas → AI lawan manipulatif meyakinkan
  - C: cek situs resmi + kontak panitia terverifikasi → hoax terbongkar
  - TWIST: pengirim nyoba lagi lebih meyakinkan setelah diabaikan

### DAY 2 — Everyone Is Watching (tidak semua yang terlihat aman dibagikan)
- **Domain 3 — Safe Browsing**: Wi-Fi gratis kafe (nama mirip resmi)
  - A: pakai sinyal terkuat
  - B: konek + langsung buka portal
  - C: konfirmasi nama ke petugas, hindari aktivitas sensitif, pakai koneksi aman
  - Situs mirip portal sekolah dengan alamat beda → cek domain, batas HTTPS
- **Domain 4 — Social Privacy**: unggah foto persiapan (kartu ID, jadwal, lokasi, layar laptop)
  - A: langsung unggah (akun cuma teman)
  - B: hapus total
  - C: cek foto, blur sensitif, hapus lokasi, review audience → privasi ≠ berhenti medsos
  - TWIST: teman unggah foto lain berisi jadwal pulang Nadia → minta hapus/edit?

### DAY 3 — Something Is Wrong (masalah mulai nyata)
- **Domain 5 — Phone Security**: app edit video dari link grup (bukan toko resmi)
  - A: install (katanya bagus)
  - B: install + tolak sebagian izin
  - C: cek sumber, reputasi dev, izin → sumber tak terverifikasi
- **Domain 6 — Report & Recover**: percobaan login asing + akun medsos kena
  - A: minta bantuan "dukungan" DM (scam!)
  - B: coba login berulang, abaikan notifikasi
  - C: kanal resmi, amankan email utama, ganti kredensial, cek sesi, laporkan
  - TWIST: akun Nadia kirim link berbahaya ke teman-teman → peringatkan mereka

### DAY 4 — Trust Is Complicated (ancaman tak selalu dari orang asing)
- **Domain 7 — Scam Calls & Fake Support**: telpon "petugas dukungan" minta OTP
  - A: kasih kode (dia tahu nama + sekolah)
  - B: tutup telpon tanpa verifikasi
  - C: tolak, akhiri, hubungi layanan resmi via kanal mandiri
  - TWIST: penelepon tahu info pribadi dari unggahan publik → info benar ≠ orang terpercaya
- **Domain 8 — Digital Payments**: "biaya administrasi QRIS untuk finalis"
  - A: bayar takut kehilangan slot
  - B: minta bukti dulu
  - C: cek ketentuan resmi + konfirmasi panitia terverifikasi
  - TWIST: teman mengaku sudah bayar, mendesak ikut → tekanan sosial

### DAY 5 — The Final Challenge (gabungkan semua)
- **Domain 9 — Scam Psychology**: ancaman sebar data dalam 15 menit (info benar campur)
  - A: ikuti instruksi
  - B: balas marah + ancam balik
  - C: jangan impulsif, simpan bukti, hindari interaksi, minta bantuan kanal tepercaya
- **Domain 10 — Family & Community**: adik dapat link hadiah game; ortu ditelpon "petugas bank"
  - A: abaikan (bukan akunku)
  - B: larang keluarga pakai digital
  - C: bantu verifikasi, jangan bagi kode, laporkan
  - Teman malu pernah tertipu → respons tanpa menyalahkan korban

## Sistem Adaptif (AI + state machine)
- AI/LLM: dialog, karakter (teman/panitia/penipu), tone sesuai usia, variasi situasi, penjelasan post-action
- State machine: status skenario, urutan logis, konsekuensi, validasi keputusan, skor
- Contoh state: NEW_ACCOUNT → CREDENTIALS_SECURED → PHISHING_DETECTED → ACCOUNT_COMPROMISED|PROTECTED → RECOVERY|CONTINUE

## Penilaian (4 komponen)
1. Threat Recognition — kenali ancaman & tanda
2. Decision Quality — ketepatan tindakan
3. Response & Recovery — mitigasi & pemulihan pasca-salah
4. Consistency — konsisten saat situasi berubah

## Filosofi Kegagalan
Salah ≠ game over. OTP bocor → akun berisiko → pemain HARUS: kenali, amankan via kanal resmi,
cek sesi, laporkan, refleksi. Fokus pada resilience, bukan kesempurnaan.
