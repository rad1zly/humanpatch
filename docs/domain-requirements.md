# Domain Requirements — Kontrak Wajib per Hari × Domain
(STORY-VARIABLE, DOMAIN-INVARIANT)

> Doc ini BUKAN cerita. Ini **daftar syarat** yang WAJIB terpenuhi apapun alur
> yang di-generate AI. Storyline bebas variabel — coverage domain TIDAK boleh bolong.
> Dipakai sebagai: (1) prompt constraint buat generator, (2) checklist QA,
> (3) ground-truth buat training data.

## ATURAN GLOBAL (berlaku semua hari)

1. Tiap hari = **2 domain** (pasangan tetap, urutan D1→D10).
2. Tiap domain = **minimal 1 insiden/kejadian aktif** yang bisa diengage ATAU diabaikan.
3. Attack MASUK via notif → app sesuai kanal → preview cek pengirim → keputusan player.
4. Tiap kejadian WAJIB punya minimal **3 pilihan keputusan** dari daftar verb:
   `verify | ignore | engage | comply | refuse | delay | report | pay | share | block | ask | install`
5. Semua 5 kategori outcome HARUS reachable di tiap insiden:
   `EXPOSED | SURVIVED | REPORTED | IGNORED | RECOVERED`
6. Debrief tiap insiden WAJIB berisi: red flags (min 3) + safe response + 1 prinsip.
7. Tiap hari WAJIB menyentuh 4 indikator perilaku:
   `verify_source, under_pressure, protect_data, report_threat`
8. Nama/tempat/SSID dari AI cast — gak boleh hardcoded.
9. Kesulitan naik per hari: H1-2 attack kentara → H4-5 halus/emosional/personal.
10. Tiap hari ada min 1 misi eksplorasi (bukan attack) di app utilitas.

---

# HARI 1 — D1 KATA SANDI & AKUN + D2 PHISHING & PESAN

## D1 · Kata Sandi & Akun
**Konsep wajib diajarkan:** password unik per akun · 2FA · email pemulihan · tanda akun dibajak · mana password yang gak boleh dipakai ulang.

**Elemen wajib hadir:**
- 1 halaman/layar login (asli vs tiruan — harus BISA dibedakan)
- 1 momen minta kredensial (password/kode) dari pihak tidak resmi
- 1 SMS/notif kode verifikasi ASLI (biar player belajar: kode = buat aku, bukan buat dibacain)

**Jenis keputusan wajib tersedia:** `comply` (isi login) · `verify` (cek URL/domain) · `refuse/exit` · aksi pemulihan (`ganti password`, `aktifkan 2FA`, `logout perangkat`)

**Outcome wajib reachable:** EXPOSED (kredensial keluar) · RECOVERED (kecolongan lalu ganti password) · SURVIVED (cek URL dulu → keluar)

**Red flag wajib muncul (min 3):** URL beda dikit · sesi tiba2 "kedaluwarsa" · error password terus · minta kode via chat/telepon

**Debrief wajib:** kenapa password unik penting · apa itu 2FA · langkah ganti password + cek perangkat aktif

**Indikator:** protect_data, verify_source

## D2 · Phishing & Pesan
**Konsep:** pesan janggal · cek pengirim sebelum percaya · tautan palsu · impersonasi institusi · umpan (hadiah/urgensi/deadline).

**Elemen wajib:**
- 1 pesan masuk dari pengirim asing (nomor/akun tidak verified, tidak tersimpan)
- 1 umpan yang masuk akal buat konteks persona (hadiah/lomba/beasiswa/pesanan)
- 1 link yang bisa diklik (nyambung ke insiden D1 hari yang sama)

**Jenis keputusan:** `verify` (cek profil pengirim) · `ignore` · `engage` (balas) · `comply` (klik/kasih data) · `refuse` · `report`

**Outcome reachable:** IGNORED (gak pernah buka) · SURVIVED · REPORTED · EXPOSED (data pribadi keluar → state `credentials_leaked`)

**Red flag min 3:** tidak ada di kontak · deadline panik · domain janggal · konteks "lomba yang gak pernah diikuti" · minta data sensitif (NISN/nama ibu)

**Debrief wajib:** kebiasaan cek pengirim dulu · cara cek klaim ke kanal resmi · apa boleh & gak boleh dibalas

**Indikator:** verify_source, under_pressure

**Misi eksplorasi hari ini:** 📬 baca SMS · 💬 baca chat · 📓 buka Journal

---

# HARI 2 — D3 BROWSING AMAN + D4 PRIVASI SOSMED

## D3 · Browsing Aman
**Konsep:** HTTPS/lock · domain palsu · WiFi umum/evil twin · auto-connect · captive portal.

**Elemen wajib:**
- 1 SSID dari AI cast (kafe/lokasi persona) — muncul di Settings/WLAN, BUKAN chat
- Situasi 2 jaringan mirip (asli vs palsu) ATAU portal login aneh setelah konek
- 1 momen minta password email di portal WiFi

**Jenis keputusan:** `comply` (konek/isi portal) · `verify` (bandingkan SSID / tanya staf) · `refuse` (pakai data seluler) · `exit` (stop sebelum isi kredensial)

**Outcome reachable:** EXPOSED (kredensial WiFi keluar) · SURVIVED (verify/refuse) · IGNORED (gak sentuh WiFi)

**Red flag min 3:** jaringan open tanpa password · 2 SSID mirip · WiFi minta login email · halaman HTTP tanpa gembok setelah konek

**Debrief wajib:** password email ≠ password WiFi · matikan auto-connect · cara konfirmasi SSID resmi

**Indikator:** verify_source, protect_data

## D4 · Privasi Sosmed
**Konsep:** apa yang aman dibagikan · metadata/identitas terlihat di foto · lokasi & rutinitas · akun publik vs privat.

**Elemen wajib:**
- 1 konteks sosial (grup/teman — BUKAN scammer) yang mendorong sharing
- 1 konten berisi data pribadi (kartu identitas/jadwal/struk/lokasi)
- Tekanan sosial ("semua juga upload")

**Jenis keputusan:** `comply` (upload apa adanya) · `negosiasi` (blur/edit dulu) · `refuse` · `delay` · `ask` (minta dihapus kalau udah keupload) · `report` (ke admin grup/platform)

**Outcome reachable:** EXPOSED (data publik → state `personal_data_public`) · SURVIVED (negosiasi/refuse) · RECOVERED (minta hapus sukses)

**Red flag min 3:** identitas terbaca jelas · jadwal membocorkan rutinitas · akun publik · tekanan sosial

**Debrief wajib:** checklist sebelum upload · apa itu metadata · private account

**Indikator:** protect_data, under_pressure (tekanan sosial)

**Misi eksplorasi:** 📶 cek daftar WiFi di Settings

---

# HARI 3 — D5 KEAMANAN HP + D6 LAPOR & PULIHKAN

## D5 · Keamanan HP
**Konsep:** izin aplikasi berlebihan · APK di luar toko resmi · spyware · update sistem.

**Elemen wajib:**
- 1 tawaran install app dari luar toko resmi (vektornya chat/link)
- Layar daftar izin yang mencurigakan (SMS/kontak/aksesibilitas) — gak nyambung dengan fungsi app
- App Security = tempat audit (misi eksplorasi hari ini WAJIB kesini)

**Jenis keputusan:** `comply` (install + izinkan semua) · `verify` (cek izin/developer/review) · `refuse` · `uninstall` (recovery) · `install` dari sumber resmi (alternatif aman)

**Outcome reachable:** EXPOSED (spyware terinstall) · RECOVERED (uninstall + ganti password setelah kena) · SURVIVED (tolak/verify)

**Red flag min 3:** luar toko resmi · "premium gratis" · izin gak nyambung fungsi · developer gak jelas/0 review

**Debrief wajib:** sumber instalasi resmi · cara baca izin · langkah kalau keinstal (uninstall → ganti password → scan)

**Indikator:** protect_data, verify_source

## D6 · Lapor & Pulihkan
**Konsep:** ke mana melapor (platform/kanal resmi/aduankonten.id) · urutan pemulihan akun · logout perangkat · cek aktivitas akun.

**Elemen wajib:**
- 1 insiden akun (percobaan login/perubahan pemulihan) — intensitasnya boleh nyambung state `credentials_leaked` dari H1
- Momen minta OTP dari pihak "dukungan" (penipuan OTP)
- Tombol/aksi [LAPOR] pertama kali meaningful + dinilai
- Layar perangkat aktif (Settings) untuk cek & logout remote

**Jenis keputusan:** `comply` (kasih kode) · `verify` (cek perangkat aktif) · `refuse` · `report` · aksi pemulihan berurutan (logout semua → ganti password → pulihkan email)

**Outcome reachable:** EXPOSED (akun dibajak) · RECOVERED (jalankan urutan pemulihan sukses — nilai tinggi) · REPORTED (best path) · SURVIVED

**Red flag min 3:** minta OTP (resmi TIDAK PERNAH) · deadline "akun dikunci 5 menit" · kanal tidak resmi · email pemulihan diganti

**Debrief wajib:** urutan pemulihan (jangan panik → cek perangkat → logout → ganti → lapor) · daftar kanal lapor · bedakan notif asli vs penipuan

**Indikator:** report_threat, under_pressure

**Misi eksplorasi:** 📱 audit izin aplikasi di Security

---

# HARI 4 — D7 TELEPON & CS PALSU + D8 PEMBAYARAN DIGITAL

## D7 · Telepon & CS Palsu
**Konsep:** vishing · verifikasi balik (callback) · suara yakin ≠ resmi · nomor resmi vs pribadi · OTP gak pernah dibacakan.

**Elemen wajib:**
- 1 telepon MASUK (UI panggilan, bukan chat) dengan identitas "petugas/CS/institusi"
- OTP asli masuk ke SMS saat nelpon (realistis — kode ada di tangan korban)
- 1 nomor resmi tersimpan di contacts sebagai alat verifikasi balik

**Jenis keputusan:** `reject` (tolak panggilan) · `comply` (bacakan kode) · `verify` (callback ke nomor resmi) · `refuse` (tutup) · `report` (blokir + lapor nomor)

**Outcome reachable:** SURVIVED (tolak/callback) · EXPOSED (kode/kartu keluar → state `wallet_damaged`) · REPORTED

**Red flag min 3:** minta bacakan OTP · klaim gak bisa diverifikasi · tekanan waktu ("hari ini batal") · nomor pribadi bukan official

**Debrief wajib:** aturan OTP gak pernah dibagikan · cara verifikasi balik · "tutup telepon = aman, nggak ada rugi"

**Indikator:** under_pressure, verify_source

## D8 · Pembayaran Digital
**Konsep:** OTP pembayaran · QRIS dinamis vs statis · biaya fiktif untuk klaim hadiah · cek nama penerima · sunk-cost trap.

**Elemen wajib:**
- 1 permintaan bayar (biaya admin/pajak/bea) buat MENERIMA sesuatu (hadiah/paket/refund)
- Tampilan QR/pembayaran yang menunjukkan NAMA PENERIMA (pribadi vs lembaga)
- Momen "bayar lagi" (biaya kedua) buat ngukur sunk-cost

**Jenis keputusan:** `pay` (scan/bayar) · `verify` (cek nama penerima/kanal resmi) · `refuse` · `report` · `stop` (berhenti di biaya kedua)

**Outcome reachable:** EXPOSED (bayar sekali) · EXPOSED TOTAL (bayar lagi — sunk cost) · SURVIVED (cek nama/kanal resmi) · REPORTED

**Red flag min 3:** bayar untuk MENERIMA uang · QR atas nama pribadi · deadline tanpa dokumen resmi · biaya kedua muncul

**Debrief wajib:** hadiah asli gak minta biara · cara cek nama penerima QR · berhenti bayar = berhenti rugi · lapor bank cepat

**Indikator:** protect_data (uang), under_pressure

**Misi eksplorasi:** 📞 cek riwayat panggilan

---

# HARI 5 — D9 PSIKOLOGI PENIPUAN + D10 KELUARGA & KOMUNITAS

## D9 · Psikologi Penipuan
**Konsep:** tekanan waktu · umpan greed · fear/ancaman · authority bias · FOMO · kesadaran emosi sendiri · klaim data sering bluff.

**Elemen wajib:**
- 1 insiden klimaks yang pakai KOMBINASI taktik (min 3 dari: urgency, greed, fear, authority, social proof)
- Konten attack bersifat PERSONAL (nyebut data/identitas — asli kalau `personal_data_public=true`, fabrikasi kalau false → bisa dibongkar)
- Momen "bayar supaya berhenti" yang TIDAK berhenti (extortion berlanjut)
- 1 titik refleksi emosi ("apa yang kamu rasakan?")

**Jenis keputusan:** `comply` (bayar) · `verify` (uji klaim data) · `refuse` · `report` (platform+sekolah+ortu+aduankonten.id) · `block` · `delay`

**Outcome reachable:** EXPOSED TOTAL (bayar berulang) · RECOVERED (stop + report setelah bayar) · SURVIVED (panggil bluff) · REPORTED (best path — ancaman kosong terbukti)

**Red flag min 3:** deadline ekstrem (15 menit) · ancaman sebar ke kontak · data akurat dipakai buat intimidasi · minta "tanda kerja sama" tambahan · transfer ke pribadi

**Debrief wajib:** ancaman = umpan panik bukan fakta · BAYAR = dianggap target hidup · klaim data sering bluff — uji dulu · "ini bukan salahmu" (destigmatization) · review semua taktik H1-H4

**Indikator:** under_pressure, report_threat

## D10 · Keluarga & Komunitas
**Konsep:** transfer of learning — player jadi GURU · orang tua/adik lebih rentan · aturan sederhana yang bisa diajarkan · efek domino ke komunitas.

**Elemen wajib:**
- 1 anggota keluarga (dari cast: ortu/adik) yang JADI KORBAN HAMPIR (bukan player)
- Keluarga nanya/minta tolong KE PLAYER (player = penolong, bukan korban)
- Min 2 vektor berbeda nyerang keluarga (misal: telepon CS palsu ke ibu + hadiah game ke adik — reuse D7 & D2)
- Momen player HARUS menjelaskan aturan ("OTP/kartu/password gak pernah dibagikan")
- 1 aksi konkret nyelametin (blokir kartu / ganti password keluarga / lapor)

**Jenis keputusan:** `jelaskan benar` · `abaikan` · `setuju keliru` ("iya Bu beneran") · `report` ke ortu · `block` nomor penipu

**Outcome reachable:** FAMILY SAFE (jelaskan benar + aksi → best path) · EXPOSED-family (keluarga kena karena player diam/salah arah) · RECOVERED-family (kena → recovery bareng)

**Red flag min 3:** bank gak pernah telepon minta data · hadiah game minta password · keluarga dipakai pressure emosional

**Debrief wajib:** 1 aturan sederhana buat diajarkan ke keluarga · diam = ikut menjerumuskan · skill D1-D9 dipakai buat orang lain = tanda paham

**Indikator:** report_threat, protect_data

**Misi eksplorasi:** 👨‍👩‍👧 baca pesan keluarga

---

# MATRIKS RINGKAS (QA checklist cepat)

| Hari | Domain | Insiden aktif | App kanal | Misi eksplorasi | Outcome wajib reachable | State yang di-set |
|---|---|---|---|---|---|---|
| 1 | D1 + D2 | phishing chat + portal login | ChatLoop, SafeBrowse | 📬 SMS, 💬 chat, 📓 Journal | 5/5 semua | credentials_leaked |
| 2 | D3 + D4 | WiFi jahat + tekanan upload | Settings(WLAN), ChatLoop grup | 📶 WiFi list | 5/5 | personal_data_public, wifi_leaked |
| 3 | D5 + D6 | APK jahat + OTP takeover | ChatLoop, Security, MessageBox, Settings | 📱 audit izin | 5/5 | spyware_installed |
| 4 | D7 + D8 | vishing + QRIS fiktif | Phone, ChatLoop+QR | 📞 call log | 5/5 | wallet_damaged |
| 5 | D9 + D10 | blackmail + keluarga korban | ChatLoop, MessageBox, Phone | 👨‍👩‍👧 pesan keluarga | 5/5 | family_safe |

# DEFINISI VERB KEPUTUSAN (kosakata player, dipakai klasifikasi intent)

`verify` cek dulu (URL/pengirim/SSID/penerima) · `ignore` gak buka · `engage` buka/balas tanpa commit ·
`comply` ikut arahan/kasih data/klik · `refuse` tolak tegas · `delay` tunda/minta waktu ·
`report` lapor/blokir · `pay` bayar/scan · `share` upload/kirim konten · `ask` minta aksi orang lain ·
`install/uninstall` kelola app · `stop` berhenti di tengah (anti sunk-cost) · `jelaskan` edukasi orang lain (D10)

# STATE GLOBAL (satu-satunya hal yang narasi antar-hari boleh andalkan)

`credentials_leaked` (H1→H3) · `wifi_leaked` (H2→H3) · `personal_data_public` (H2→H5) ·
`spyware_installed` (H3→H4) · `wallet_damaged` (H4→H4/H5) · `family_safe` (H5→finale) ·
`knows_scam_pattern` per domain (tiap SUSPECT/REPORT → dialog hari berikut bisa nyebut riwayat)
