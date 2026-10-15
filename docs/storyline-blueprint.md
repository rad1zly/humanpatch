# Storyline Blueprint — 10 DOMAIN UTAMA (isi + hari + app per hari)

> Fokus: apa yang HARUS ada di tiap domain, muncul hari ke berapa, dan aplikasi apa yang dibuka.
> 10 domain ÷ 5 hari = **2 domain per hari**. Urutan domain = urutan D1→D10.

## Peta Besar

| Hari | Domain yang dibawakan | App utama dibuka |
|---|---|---|
| 1 | **D1 Kata Sandi & Akun** + **D2 Phishing & Pesan** | notif → ChatLoop → SafeBrowse → MessageBox → Journal |
| 2 | **D3 Browsing Aman** + **D4 Privasi Sosmed** | notif → Settings (WLAN) → ChatLoop (grup) → Journal |
| 3 | **D5 Keamanan HP** + **D6 Lapor & Pulihkan** | notif → ChatLoop → Security → MessageBox → Journal |
| 4 | **D7 Telepon & CS Palsu** + **D8 Pembayaran Digital** | notif → Phone → ChatLoop (+popup QR) |
| 5 | **D9 Psikologi Penipuan** + **D10 Keluarga & Komunitas** | notif → MessageBox → ChatLoop → Phone → Journal |

---

## D1 · KATA SANDI & AKUN
**Substansi:** password unik per akun, 2FA, email pemulihan, manager password, tanda akun dibajak.
**Hari 1** (attack ke-2, siang) — **bisa balik di Hari 3 sebagai kejadian**

**Attack: Portal login tiruan**
- App dibuka: **SafeBrowse** (dari link di ChatLoop attack D2 — nyambung 1 cerita)
- Bentuk: halaman login MIRIP portal asli, URL beda dikit (`l0mba-nasional.id`, huruf dobel)
- Ladder: minta login → error password palsu → minta kode verifikasi "pemulihan"
- Red flags: URL beda, sesi tiba-tiba "kedaluwarsa", error terus padahal yakin benar, minta kode via chat
- Safe: tutup tab → buka dari bookmark → ganti password → aktifkan 2FA
- Konten edukasi debrief: kenapa password unik penting, apa itu 2FA, cek perangkat aktif

**App pendukung:** MessageBox (SMS kode verifikasi asli masuk — pemain belajar bedain kode resmi vs diminta orang), Settings (cek akun terhubung)

---

## D2 · PHISHING & PESAN
**Substansi:** kenali pesan janggal, cek pengirim, tautan palsu, impersonasi institusi, umpan hadiah/urgensi.

**Hari 1** (attack pertama, pagi — pintu masuk cerita)

**Attack: Panitia lomba palsu**
- App dibuka: **ChatLoop** (chat masuk dari nomor asing)
- Bentuk: "kamu finalis!" + link konfirmasi + deadline 3 jam
- Ladder: klaim finalis → minta isi formulir data → minta nama ibu kandung "verifikasi" → ancam slot hangus
- Red flags: tidak ada di kontak, deadline panik, domain janggal, lomba yang gak pernah diikuti
- Safe: abaikan + lapor; cek situs resmi langsung
- **Link attack ini yang buka attack D1 di SafeBrowse** (satu rantai cerita)

**App pendukung:** sheet cek pengirim (nomor, verified ✗, saved ✗), Journal

---

## D3 · BROWSING AMAN
**Substansi:** HTTPS, domain palsu, WiFi umum/evil twin, auto-connect, captive portal.

**Hari 2** (attack pertama, pagi — di lokasi baru: kafe)

**Attack: Evil-twin WiFi**
- App dibuka: **Settings** (bagian WLAN) — JANGAN chat
- Notif: "Jaringan Wi-Fi gratis terdeteksi — sinyal kuat, tanpa password"
- SSID **wajib generate AI** dari `cast.cafe_name` / `cast.wifi_ssid`
- Bentuk: dua SSID mirip muncul bersamaan (asli vs kembaran palsu)
- Ladder: konek gratis → captive portal minta email+password → error minta ulang → suruh instal "profil jaringan"
- Red flags: dua SSID mirip, WiFi minta password email, login gagal terus, diminta instal profil
- Safe: konfirmasi SSID ke staf, jangan pernah isi password email di portal WiFi, matikan auto-connect

**App pendukung:** SafeBrowse (buka halaman setelah konek — HTTP tanpa gembok), notif bar

---

## D4 · PRIVASI SOSMED
**Substansi:** apa yang aman dibagikan, metadata foto, lokasi, akun private vs publik, oversharing rutinitas.

**Hari 2** (attack ke-2, siang — BUKAN scammer, ini human error)

**Attack: Tekanan upload foto berisi data**
- App dibuka: **ChatLoop** (grup tim/komunitas)
- Bentuk: teman ajak upload foto persiapan — kartu pelajar/KTP/struk terlihat jelas + jadwal rutinitas
- Ladder: ajakan unggah → "semua tim juga upload" → upload duluan tanpa izin → minta ikut
- Red flags: identitas terlihat jelas di foto, jadwal bocorin rutinitas, akun publik, tekanan sosial
- Safe: blur/tutup data sebelum upload, jadwal gak perlu publik, private account
- **Data yang bocor di sini jadi amunisi D9 (Hari 5)** — benang merah cerita

**App pendukung:** Journal (refleksi), preview galeri (opsional)

---

## D5 · KEAMANAN HP
**Substansi:** izin aplikasi berlebihan, APK di luar toko resmi, spyware, update sistem, app pengunci.

**Hari 3** (attack pertama, pagi)

**Attack: APK premium gratis**
- App dibuka: **ChatLoop** (link APK) → **Security** (audit izin — jadi misi hari itu)
- Bentuk: teman grup bagi link APK editor/kasir/game "premium gratis"
- Ladder: tawaran → "versi Play Store udah lama" → izin aneh (SMS, kontak, aksesibilitas) → data terkirim diam-diam
- Red flags: luar toko resmi, premium gratis, izin gak nyambung fungsi, developer gak jelas
- Safe: jangan instal, toko resmi doang, cek izin & review, kalau keinstal: uninstall + ganti password + scan

**App pendukung:** Security (daftar izin app — misi explorasi wajib hari itu)

---

## D6 · LAPOR & PULIHKAN
**Substansi:** ke mana melapor (platform, kanal resmi, aduankonten.id), langkah pemulihan akun, ganti password, logout perangkat, cek aktivitas.

**Hari 3** (attack ke-2, sore — klimaks pertama cerita)

**Attack: OTP account takeover**
- App dibuka: **MessageBox** (peringatan "percobaan login") → Settings (perangkat aktif)
- Konteks: ada login ASLI dari perangkat lain — **karena korban kecolongan password di Hari 1** (runtutan cerita)
- Bentuk: "Tim Dukungan Akun" kirim kode, minta dibacakan "untuk pembatalan"
- Ladder: peringatan login + OTP → minta dibaca "batalin" → "akun dikunci 5 menit lagi" → ganti email pemulihan
- Red flags: minta OTP (resmi TIDAK PERNAH), deadline mepet, kanal gak resmi
- Safe: jangan kasih kode → cek perangkat aktif dari app langsung → ganti password → 2FA → logout semua → **LAPOR**
- Ini domain tempat **aksi melapor** diperkenalkan & dinilai (tombol lapor pertama kali meaningful)

**App pendukung:** Phone (hubungi CS resmi — verifikasi balik), Journal

---

## D7 · TELEPON & CS PALSU
**Substansi:** vishing, verifikasi balik (callback), suara meyakinkan ≠ resmi, nomor resmi vs nomor pribadi.

**Hari 4** (attack pertama, pagi)

**Attack: Telepon petugas dukungan**
- App dibuka: **Phone** (incoming call UI — layar telepon masuk, bukan chat)
- Bentuk: penelpon tenang-profesional, klaim error pembayaran pendaftaran
- Ladder: klaim error → OTP dikirim ke HP korban → minta dibacakan → ancam batal/denda
- Red flags: OTP masuk ke HP-mu tapi diminta orang lain bacakan, klaim gak bisa diverifikasi, tekanan waktu
- Safe: tutup telepon, jangan bacakan kode, hubungi institusi via kanal resmi (verifikasi balik), blokir

**App pendukung:** contact list (nomor resmi tersimpan vs nomor asing), Phone log (misi explorasi)

---

## D8 · PEMBAYARAN DIGITAL
**Substansi:** OTP pembayaran, QRIS dinamis vs statis, e-wallet, biaya fiktif, cek nama penerima.

**Hari 4** (attack ke-2, siang)

**Attack: Biaya administrasi fiktif via QRIS**
- App dibuka: **ChatLoop** (+ **popup QR scanner tiruan**)
- Bentuk: "finalis wajib bayar biaya admin Rp 250rb — hadiah Rp 5 juta langsung cair"
- Ladder: klaim wajib bayar → QR buru-buru "hari ini" → bonus fiktif setelah bayar → QR atas nama pribadi
- Red flags: bayar untuk MENERIMA uang = scam, QR nama pribadi bukan lembaga, deadline tanpa dokumen
- Safe: jangan bayar, cek pengumuman resmi, lapor ke panitia asli & platform

**App pendukung:** MessageBox (SMS bank — pemain belajar bedain notif bank asli vs chat), Journal

---

## D9 · PSIKOLOGI PENIPUAN
**Substansi:** tekanan waktu, umpan greed, ketakutan/ancaman, authority bias, FOMO, kenali emosi sendiri saat dimanipulasi.

**Hari 5** (attack ke-2, siang — klimaks psikologis)

**Attack: Blackmail data bocor**
- App dibuka: **ChatLoop** (chat anonim)
- Konteks: penjahat pakai data ASLI korban (nama, sekolah, alamat — **bocoran dari D4 Hari 2**)
- Ladder: data asli sebagai pembuka → ancam sebar 15 menit → "orang tuamu akan tahu" → hilang setelah dilaporkan
- Red flags: data akurat bikin nyata, deadline 15 menit, ancaman sosial, transfer cepat ke pribadi
- Safe: JANGAN bayar, jangan balas, screenshot bukti, blokir, lapor (platform + sekolah/orang tua + aduankonten.id)
- Debrief wajib: "ini bukan salahmu" — destigmatization biar berani lapor
- Review semua taktik hari 1-4 di debrief (tekanan waktu, umpan, authority, fear) — domain ini = meta-lesson

**App pendukung:** Journal (refleksi emosi — "apa yang kamu rasakan saat baca ancaman itu?")

---

## D10 · KELUARGA & KOMUNITAS
**Substansi:** transfer of learning — pemain jadi guru untuk orang tersayang, orang tua/adik lebih rentan, cara menjelaskan aturan sederhana.

**Hari 5** (attack pertama, pagi — penutup emosional)

**Attack: Keluarga hampir kena**
- App dibuka: **MessageBox** (chat ibu) → **Phone** (telepon keluarga)
- Bentuk: BUKAN korban = kamu. Ibu ditelpon "petugas bank" (D7), adik dapat "hadiah skin game" minta password (D2)
- Ladder: ibu ragu cerita (sudah kasih no kartu, belum kode) → adik panik mau kasih password → kamu jelaskan & putusin
- Red flags: bank gak pernah telepon minta data, hadiah game minta password
- Safe: blokir kartu via app bank resmi, ganti password adik, lapor nomor penipu
- Inti: aturan sederhana yang diajarkan ulang ke keluarga — "OTP, kartu, password gak pernah dibagikan"
- Ini assessment sejati: pemain harus PAKAI pengetahuan D1-D9 buat nyelametin orang lain

**App pendukung:** Phone (callback keluarga), Journal (closing ceremony)

---

## Rangkuman App Choreography per Hari

| Hari | Urutan app dibuka | Attack | Eksplorasi (misi) |
|---|---|---|---|
| 1 | notif → ChatLoop → SafeBrowse → MessageBox → Journal | D2 chat phishing → D1 portal login | 📬 SMS · 💬 chat · 📓 Journal |
| 2 | notif → Settings(WLAN) → ChatLoop grup → Journal | D3 evil twin → D4 upload privacy | 📶 WiFi list |
| 3 | notif → ChatLoop → Security → MessageBox → Settings | D5 APK → D6 OTP takeover | 📱 audit izin |
| 4 | notif → Phone → ChatLoop + popup QR | D7 vishing → D8 QRIS fiktif | 📞 call log |
| 5 | notif → MessageBox → ChatLoop → Phone → Journal | D10 keluarga → D9 blackmail | 👨‍👩‍👧 pesan keluarga |

**Aturan keras:**
1. Attack SELALU masuk via notif dulu → app → list normal → item attack → preview cek pengirim → 3 pilihan.
2. Kanal = app: WiFi→Settings, telepon→Phone, login→SafeBrowse, chat→ChatLoop/MessageBox, bayar→ChatLoop+QR.
3. Max 2 attack per hari. App utilitas = misi eksplorasi.
4. Semua nama (kafe, SSID, sekolah, NPC) dari AI cast.

**Benang merah cerita (wajib dijaga):**
- D2 (H1) link → buka D1 (H1) portal → password bocor → dipakai D6 (H3) takeover
- D4 (H2) data bocor → dipakai D9 (H5) blackmail
- D7 (H4) vishing → berulang ke ibu di D10 (H5)
- Makin hari, attack makin halus & personal (level 1→5)
