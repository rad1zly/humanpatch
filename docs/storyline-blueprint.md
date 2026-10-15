# Storyline Blueprint — 5 Hari × 10 Domain × App Choreography

> Referensi wajib sebelum generate storyline baru (archetype mana pun).
> Satu hari = 2 attack (utama + kedua) + 2-3 app utilitas. Total 10 slot = 10 domain.

## Arc 5 Hari (progression biar nyambung)

| Hari | Tema | Skill | Prinsip |
|---|---|---|---|
| 1 | Sesuatu Masuk | **RECOGNIZE** | Kenali attack yang paling umum (chat + link) |
| 2 | Konek & Share | **VERIFY** | Cek lingkungan: jaringan & apa yang kamu bagikan |
| 3 | Device & Akun | **DEFEND** | Proteksi aset: HP & akun (APK, izin, OTP) |
| 4 | Suara & Uang | **RESIST** | Tahan tekanan real-time (telepon + pembayaran) |
| 5 | Giliran Orang Lain | **PROTECT** | Jadi garis pertahanan keluarga + pulih diri |

Rules of thumb:
- Kesulitan naik: day 1-2 attack kentara banget → day 4-5 attack halus/emosional.
- Tiap attack SELALU masuk lewat **notif bar dulu**, baru dibuka di app-nya (check-first).
- Attack kedua tiap hari biasanya **punya benang merah** dengan attack pertama di hari sebelumnya (contoh: data bocor day 2 dipakai blackmail day 5).

---

## Matriks Domain × Hari × App

| # | Domain | Hari | Attack | App Attack | App Pendukung |
|---|---|---|---|---|---|
| 1 | `phishing_social` | 1 | Panitia lomba palsu | ChatLoop | SafeBrowse, Journal |
| 2 | `credentials` | 1 | Portal login tiruan | SafeBrowse | MessageBox |
| 3 | `browsing` | 2 | Evil-twin WiFi | **Settings** (WLAN) | notif bar |
| 4 | `privacy` | 2 | Upload foto berisi kartu pelajar | ChatLoop (grup) | — |
| 5 | `mobile` | 3 | APK premium gratis | ChatLoop → Settings/Security | Security |
| 6 | `incident_response`* | 3 | OTP account takeover | MessageBox | Settings (aktif perangkat) |
| 7 | `scam_calls` | 4 | Vishing minta dibacakan OTP | **Phone** (incoming call) | — |
| 8 | `digital_payments` | 4 | Biaya admin via QRIS | ChatLoop (+popup QR) | — |
| 9 | `family_community` | 5 | Ibu hampir kena, adik dapat "hadiah skin" | MessageBox | Phone |
| 10 | `scam_psychology` | 5 | Blackmail pakai data bocor (day 2!) | ChatLoop | Journal |

*) `incident_response` nempel di domain credentials day 3 — kalau mau jadi domain sendiri, pisahkan jadi "langkah pemulihan" di debrief.

---

## Breakdown Per Hari

### HARI 1 — RECOGNIZE (phishing_social + credentials)
**Apps dibuka (urutan):** notif panel → ChatLoop (attack 1) → SafeBrowse (attack 2) → MessageBox (tutorial SMS) → Journal (intro misi)

**Attack 1 — ChatLoop · phishing_social**
- Pengirim: panitia/school-admin/aplikasi resmi PALSU
- Opener: hadiah/finalis/undangan + deadline pendek
- Ladder: klaim → link konfirmasi → minta data pribadi → ancam slot hangus
- Red flags: pengirim asing, deadline panik, domain janggal, hadiah dari lomba yang gak pernah diikuti
- Safe: abaikan + lapor; cek situs resmi langsung, bukan dari link

**Attack 2 — SafeBrowse · credentials**
- Bentuk: halaman login MIRIP portal asli (URL beda dikit: huruf dobel, tanda hubung)
- Ladder: minta login → error password palsu → minta kode verifikasi
- Red flags: URL beda, minta login ulang padahal barusan dipakai, error terus
- Safe: tutup tab, buka dari bookmark, ganti password kalau kelanjut, aktifkan 2FA
- Koneksi ke hari berikutnya: email+password yang bocor di sini dipakai attack day 3

**Panel misi:** 📬 baca SMS · 💬 baca chat · 📓 buka Journal · 🔔 notif · 🔍 cek pengirim · ⚔️ selesaikan insiden

---

### HARI 2 — VERIFY (browsing + privacy)
**Apps dibuka:** notif panel → **Settings/WLAN** (attack 1) → ChatLoop grup (attack 2) → Journal

**Attack 1 — Settings · browsing (evil twin)**
- Bentuk: SSID kembaran WiFi tempat umum (kafe/sekolah/kantor), sinyal kuat tanpa password
- Ladder: konek → captive portal minta email+password → error → minta instal "profil jaringan"
- Red flags: dua SSID mirip, WiFi minta password email, login gagal terus
- Safe: konfirmasi SSID ke staf, jangan pernah isi password email di portal WiFi, matikan auto-connect
- **SSID wajib di-generate AI** dari `cast.cafe_name`/`wifi_ssid`

**Attack 2 — ChatLoop grup · privacy**
- Bentuk: BUKAN scammer — teman/kolaga ceroboh ajak upload foto berisi data (kartu pelajar/KTP/jadwal/struk)
- Ladder: ajakan unggah → tekanan "semua juga upload" → upload duluan tanpa izin
- Red flags: identitas terlihat jelas, jadwal bocorkan rutinitas, akun publik
- Safe: blur data sebelum upload, jadwal gak perlu publik, private account
- Benang merah: data yang bocor di sini jadi amunisi blackmail di **day 5**

**Panel misi:** 📶 cek daftar WiFi di Settings · 🔔 notif · 🔍 cek pengirim · ⚔️ selesaikan insiden

---

### HARI 3 — DEFEND (mobile + incident_response)
**Apps dibuka:** notif → ChatLoop (attack 1: link APK) → **Security** (audit izin — mission wajib) → MessageBox (attack 2) → Settings

**Attack 1 — ChatLoop · mobile**
- Bentuk: teman grup bagikan APK "premium gratis" (editor/game/tools) via link drive
- Ladder: tawaran → "versi Play Store udah lama" → izin aneh (SMS, kontak, aksesibilitas) → data terkirim diam-diam
- Red flags: di luar toko resmi, premium gratis gak masuk akal, izin gak nyambung dengan fungsi app
- Safe: tolak, unduh hanya dari Play Store/App Store, cek izin & developer

**Attack 2 — MessageBox · incident_response / credentials**
- Bentuk: "Tim Dukungan Akun" — ada percobaan login ASLI dari perangkat lain (karena password bocor day 1)
- Ladder: peringatan login + kode OTP → minta dibacakan "untuk pembatalan" → deadline 5 menit → ganti email pemulihan
- Red flags: minta OTP (resmi TIDAK PERNAH), deadline panik, kanal gak resmi
- Safe: jangan bagikan kode, cek perangkat aktif dari app langsung, ubah password, 2FA, logout semua device
- Ini momen **pemulihan insiden**: kalau day 1 kecolongan, di sini ditutup

**Panel misi:** 📱 audit izin di Security · 🔔 notif · 🔍 cek pengirim · ⚔️ selesaikan insiden

---

### HARI 4 — RESIST (scam_calls + digital_payments)
**Apps dibuka:** notif → **Phone/incoming call** (attack 1) → ChatLoop (attack 2 + popup QR)

**Attack 1 — Phone · scam_calls (vishing)**
- Bentuk: telepon masuk, suara tenang & profesional, klaim error pembayaran/verifikasi
- Ladder: klaim error → OTP dikirim ke HP korban → minta dibacakan → ancam batal/denda
- Red flags: OTP masuk ke HP-mu tapi diminta orang lain bacakan, klaim yang gak bisa diverifikasi, tekanan waktu
- Safe: tutup telepon, jangan bacakan kode apa pun, hubungi panitia/bank via kanal resmi, blokir

**Attack 2 — ChatLoop · digital_payments**
- Bentuk: tagihan fiktif untuk klaim hadiah/pengiriman/pajak — "bayar biaya admin via QRIS hari ini"
- Ladder: klaim wajib bayar → QR buru-buru → bonus fiktif setelah bayar → rekening atas nama pribadi
- Red flags: bayar untuk MENERIMA uang = scam, QR ke nama pribadi bukan lembaga, deadline tanpa dokumen
- Safe: jangan bayar, cek pengumuman resmi, lapor ke panitia asli & platform

**Panel misi:** 📞 cek riwayat panggilan · 🔔 notif · 🔍 cek pengirim · ⚔️ selesaikan insiden

---

### HARI 5 — PROTECT (family_community + scam_psychology)
**Apps dibuka:** notif → MessageBox (attack 1: keluarga) → ChatLoop (attack 2: blackmail) → Phone (hubungi keluarga) → Journal (closing)

**Attack 1 — MessageBox · family_community**
- Bentuk: BUKAN korban = kamu. Keluarga yang kena: ibu ditelpon "petugas bank" minta no kartu, adik dapat "hadiah skin game" minta password
- Ladder: ibu ragu-ragu cerita → adik panik mau kasih password → kamu harus jelasin & putusin
- Red flags: bank gak pernah telepon minta data, hadiah game minta password
- Safe: blokir kartu via app bank resmi, ganti password adik, ajarkan satu aturan: OTP/kartu/password gak pernah dibagikan
- Ini penilaian TRANSFER OF LEARNING: player jadi guru

**Attack 2 — ChatLoop · scam_psychology (blackmail)**
- Bentuk: penguntit anonim yang tahu data ASLI kamu (nama, sekolah, alamat — dari bocoran day 2)
- Ladder: data asli sebagai pembuka → ancam sebar 15 menit → naikkan "orang tuamu akan tahu" → hilang setelah dilaporkan
- Red flags: data akurat bikin terasa nyata, deadline 15 menit, ancaman sosial
- Safe: JANGAAN bayar, jangan balas, screenshot bukti, blokir, lapor (platform + sekolah/orang tua + aduankonten.id)
- Closing: "ini bukan salahmu" — de-stigmatization biar berani lapor

**Panel misi:** 👨‍👩‍👧 baca pesan keluarga · 🔔 notif · 🔍 cek pengirim · ⚔️ selesaikan insiden

---

## Aturan App Choreography (wajib patuh)

1. **Attack gak pernah langsung kebuka.** Alur: notif bar → buka app → lihat list/daftar normal → item attack (unread) → preview (cek pengirim) → 3 pilihan (Cek profil / Abaikan / Balas).
2. **App attack harus match kanal attack-nya:**
   - Chat/messaging scam → ChatLoop (kontak) atau MessageBox (SMS)
   - Login page / web phishing → SafeBrowse
   - WiFi/network → **Settings (WLAN)** + notif — JANGAN ChatLoop
   - APK/izin → ChatLoop (vector) + Security (audit)
   - Telepon → **Phone**
   - Pembayaran → ChatLoop + popup QR/e-wallet
3. **Tiap hari max 2 attack.** App utilitas (Journal, Security) jadi misi explorasi, bukan attack.
4. **Semua nama (kafe, SSID, sekolah, NPC) dari AI cast** — gak ada nama hardcoded kecuali fallback.

---

## Formula Reskin per Archetype (arc & domain TETAP, konteks ganti)

| Hari | Pelajar (jadi) | Pedagang | Pekerja | Orang Tua | Umum |
|---|---|---|---|---|---|
| 1 phishing | panitia lomba | "supplier murah" via WA | "HRD" email gaji | "BPJS/kemenkes" SMS | hadiah undian |
| 1 credentials | portal lomba | dashboard toko online | portal HRIS | login e-banking palsu | login media sosial |
| 2 WiFi | kafe dekat sekolah | WiFi pasar/mall | WiFi coworking | WiFi posyandu/komunitas | WiFi terminal |
| 2 privacy | kartu pelajar | foto etalaga + harga | badge & layar kerja | foto KTP di grup RT | lokasi real-time |
| 3 APK | editor video | app kasir "gratis" | "tools produktivitas" | app "kesehatan gratis" | app penghasil uang |
| 3 takeover | akun email | akun toko marketplace | akun kantor | akun media sosial | akun game |
| 4 vishing | petugas lomba | "pembeli besar" telepon | "CEO/bos" telepon urgent | "petugas bank/dinkes" | "kurir/paket" |
| 4 pembayaran | biaya admin hadiah | "bayar bea masuk barang" | "loan gaji" fee | "pajak/iniatan" | ongkir paket mahal |
| 5 keluarga | ibu + adik | anak yang bantu toko | pasangan | SESAMA teman sepuh | tetangga |
| 5 psychology | ancam sebar ke sekolah | ancam sebar ke pelanggan | ancam sebar ke kantor | ancam fitnah | ancam sebar kontak |

---

## Checklist Generate Scenario (field wajib per attack)

```
id: story_<arc>_d<hari>_<nama>       # story_day: 1-5, story: <storyline-id>
domain, channel (ChatLoop/MessageBox/SafeBrowse/Settings/Phone), sender
language: "id", level: <1-5>          # naik per hari: 1,2,3,4,5
attacker_character: 1 kalimat siapa & gaya dia
attacker_goal: 1 kalimat tujuan dia
opener: pesan pembuka (maks 2-3 kalimat, gaya chat asli)
escalation_ladder: [4 langkah]        # tiap langkah 1 baris
red_flags: [4-5 tanda]                # ini yang muncul di debrief 🚩
safe_response: 1-2 kalimat            # muncul di debrief 🛡️
lesson: 1-2 kalimat                   # muncul di debrief 🎓 (prinsip, bukan langkah)
translations.en: { semua field atas, EN }  # WAJIB — EN session pakai ini
```

**Uji logika attack (sebelum submit):** bisakah orang awam jelaskan kenapa korban MUNGKIN percaya? Kalau gak (contoh: link butuh login padahal konten publik), buang.
