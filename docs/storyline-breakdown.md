# Storyline Breakdown Detail - Branching Tree per Hari × Domain × Attack

> Fungsi doc ini:
> 1. **Spec lengkap** buat generate/finetune AI adversary (intent → response → state).
> 2. **Fallback plan** kalau AMD gak ngasih akses GPU: semua tree di bawah bisa jalan
>    TANPA LLM (rule-based intent classifier + scripted replies) - mode `MOCK_LLM`.
> 3. Sumber truth buat QA branching (tiap cabang harus bisa ditempuh & konsisten).

## Notasi

- Intent pemain (klasifikasi reply, regex/keyword juga cukup untuk fallback):
  - `COMPLY` - ngasih data / ikut arahan / klik link / bayar / bacain kode
  - `SUSPECT` - nanya balik skeptis ("kok gini?", "aku gak pernah daftar")
  - `REFUSE` - nolak tegas / keluar chat
  - `REPORT` - tekan tombol lapor / bilang mau lapor
  - `DELAY` - basa-basi gak jelas / minta waktu
- State adversary: `HOOK → PRESSURE → ESCALATE → (WIN_attacker | GIVE_UP)`
- Terminal outcome per attack:
  - `EXPOSED` - kecolongan (data/klik/bayar/kode keluar)
  - `SURVIVED` - nolak & keluar
  - `REPORTED` - nolak + lapor (skor terbaik)
  - `IGNORED` - gak pernah engage (aman tapi indikator report gak keisi)
- Indikator (4): `verify_source`, `under_pressure`, `protect_data`, `report_threat`

---

# HARI 1 - D2 Phishing & Pesan (pagi) + D1 Kata Sandi & Akun (siang)

**App urutan:** notif → ChatLoop (attack A) → SafeBrowse (attack B, dari link A) → MessageBox (SMS kode) → Journal
**Misi eksplorasi:** 📬 baca SMS · 💬 baca chat · 📓 buka Journal

## Attack A - "Panitia Lomba Palsu" (D2, ChatLoop)

**PREVIEW (sebelum chat):** cek pengirim → nomor asing, verified ✗, saved ✗, no history.
- **Verify dulu** → indikator `verify_source` ✓, tetep bisa pilih engage/abaikan
- **Abaikan** → `IGNORED` → notif hilang, hari lanjut. Konsekuensi: gak tau ini scam, di Hari 3 gak ada konteks "aku pernah hampir kena".
- **Balas** → masuk chat:

```
S1 HOOK: "Selamat! Kamu FINALIS 10 BESAR Kompetisi Nasional!
         Isi formulir di kompetisi-nasional[.]id/daftar sebelum jam 12 - slot hangus 3 jam!"
├─ A COMPLY "oke, mau isi"      → attacker kirim link resmi-looking + minta data lengkap
│    S2a PRESSURE: "Isi nama lengkap, NISN, nama ibu kandung untuk verifikasi ya!"
│    ├─ A2 COMPLY kirim data    → EXPOSED (protect_data ✗) → data dipakai D6 Hari 3 (takeover)
│    ├─ B2 SUSPECT "kok minta nama ibu?" → S3a: "standar verifikasi panitia" (authority)
│    │    ├─ A3 COMPLY         → EXPOSED (sama atas)
│    │    └─ B3 REFUSE/REPORT  → SURVIVED/REPORTED (recovered - belajar di debrief)
│    └─ C2 REFUSE "gak dulu"   → S3b: "slot kamu pindah ke peserta lain dalam 30 menit!"
│         ├─ A3 COMPLY (takut) → EXPOSED + under_pressure ✗
│         └─ B3 tahan/REPORT   → SURVIVED/REPORTED + under_pressure ✓
├─ B SUSPECT "aku gak pernah ikut lomba" → S2b REASSURE: "portal otomatis kirim undangan
│    ke siswa berprestasi, kamu terpilih dari nilai rapor!" (flattery)
│    ├─ A2 COMPLY klik link    → lanjut ke Attack B (portal login) - rantai cerita
│    ├─ B2 SUSPECT lagi        → S3c: naikin urgensi + ancam slot
│    │    └─ (cabang sama seperti S3b atas)
│    └─ C2 REFUSE/EXIT         → SURVIVED
├─ C REPORT "aku lapor lo"      → GIVE_UP: attacker diam / akun "tidak ditemukan"
│    → REPORTED (report_threat ✓)
└─ D DELAY "nanti aku cek"      → S2d: "JANGAN ditunda, kuota finalis terbatas!"
     ├─ A2 COMPLY              → masuk S2a (jalan data)
     └─ B2 REFUSE              → SURVIVED (delay + tahan = tahan tekanan ✓)
```

**Debrief fields** (dari blueprint): red_flags, safe_response, lesson D2.

## Attack B - "Portal Login Tiruan" (D1, SafeBrowse)

**Trigger:** klik link dari Attack A (atau langsung buka SafeBrowse → situs udah kebuka).
Preview: URL `kompetisi-nas1onal[.]id` (huruf dobel/angka) - halaman MIRIP portal asli.

```
S1 halaman login: "Sesi kedaluwarsa - masuk email + password sekolah"
├─ A COMPLY login (email+password) → S2a "Password salah" (error palsu, 2x)
│    ├─ A2 COMPLY coba lagi/coba password lain → S3a "Kami kirim kode verifikasi
│    │    ke email untuk pemulihan - bacakan kodenya" (OTP minta)
│    │    ├─ A3 kasih kode    → EXPOSED TOTAL (kredensial + email) → D6 Hari 3 pasti kena
│    │    └─ B3 ragu/EXIT     → EXPOSED PARSIAL (password udah keluar) → debrief:
│    │                           "ganti password SEKARANG" → ada tombol [Ganti Password]
│    │                           → kalau diganti: recovery ✓, D6 Hari 3 jadi cuma "percobaan gagal"
│    └─ B2 SUSPECT cek URL    → S2b hint: keliatan beda (asli: .go.id / .sch.id)
│         ├─ A3 EXIT + ganti password → SURVIVED + verify ✓ + recovery ✓
│         └─ B3 COMPLY tetap login → (cabang S2a)
├─ B SUSPECT cek URL dulu     → S2b langsung (URL beda ketahuan)
│    └─ EXIT                  → SURVIVED (verify_source ✓)
└─ C EXIT langsung            → SURVIVED (netral)
```

**SMS MessageBox (edukasi):** kode verifikasi ASLI masuk ke SMS - pemain belajar: kode dari sistem buat AKU, bukan buat dibacain ke orang.

**State yang dibawa ke hari berikutnya:**
- `credentials_leaked = true|partial|false` → menentukan intensitas D6 Hari 3
- `knows_scam_pattern` (pernah SUSPECT/REPORT di A) → dialog Hari 3 bisa nyambung ("kekayak yang kemarin…")

---

# HARI 2 - D3 Browsing Aman (pagi) + D4 Privasi Sosmed (siang)

**App urutan:** notif → Settings/WLAN (attack A) → ChatLoop grup (attack B) → Journal
**Misi eksplorasi:** 📶 cek daftar WiFi di Settings

## Attack A - "Evil-Twin WiFi" (D3, Settings)

**Notif:** "Jaringan Wi-Fi gratis terdeteksi - sinyal kuat, tanpa password" (SSID dari AI cast).
**Settings → WLAN list:** 2 SSID mirip: `KafeX_Free_WiFi` (asli 🔒) vs `KafeX_Free_WiFi` (palsu, open).

```
S1 list WiFi (klik SSID open):
├─ A COMPLY konek → S2a captive portal: "Masuk email + password untuk akses internet"
│    ├─ A2 COMPLY isi password email → error → minta ulang →
│    │    ├─ A3 isi lagi/kasih kode → EXPOSED (kredensial email) → D6 Hari 3 alternatif vector
│    │    └─ B3 STOP + EXIT → EXPOSED PARSIAL → debrief: password email ≠ password WiFi
│    ├─ B2 SUSPECT "kok WiFi minta password email?" → S2b: "verifikasi keamanan penyedia"
│    │    ├─ A3 COMPLY  → EXPOSED
│    │    └─ B3 EXIT    → SURVIVED + verify ✓
│    └─ C2 EXIT         → SURVIVED (partial - udah konek tapi gak kasih apa2; cookie risk)
├─ B VERIFY bandingkan 2 SSID / tanya staf (tombol "Tanya staf kafe") →
│    → SURVIVED + verify ✓ → staf: "yang asli ada gemboknya, tanya dulu selalu"
└─ C IGNORE (pakai data seluler aja) → SURVIVED (silent win)
```

## Attack B - "Upload Foto Berisi Data" (D4, ChatLoop grup)

**Bukan scammer - teman tim.** Foto persiapan lomba: kartu pelajar + jadwal latihan terlihat.

```
S1 HOOK: "Foto tim kita keren! Kartu pelajar kelihatan jelas - ayo upload ke IG!"
├─ A COMPLY upload apa adanya → S2a teman puji → 1 jam kemudian DM aneh masuk
│    (orang asing: "kamu Nadia kan, siswa SMA X? aku panitia…") →
│    → EXPOSED (data publik dipakai social engineering) → jadi amunisi D9 Hari 5
│    → DEBRIEF: tunjukin di mana data kebocor (kartu pelajar + jadwal)
├─ B SUSPECT "kartu pelajarku keliatan, jangan dulu" → S2b: "all team juga upload,
│    gak apa-apa kok" (tekanan sosial)
│    ├─ A2 COMPLY         → EXPOSED (versi cepat)
│    ├─ B2 NEGOSIASI "blur dulu aja NISN-nya" → S3: teman setuju →
│    │    → SURVIVED + protect_data ✓ → foto aman di-upload (win sosial!)
│    └─ C2 REFUSE tegas   → SURVIVED (temen agak kecewa - konsekuensi sosial ringan, realistis)
├─ C DELAY "nanti aku edit dulu" → S2c: teman upload duluan TANPA izin (foto kamu ikut)
│    ├─ A2 minta dihapus (tombol "Minta hapus") → RECOVERED + report ✓ (platform action)
│    └─ B2 diam            → EXPOSED (bocor via tangan orang lain - pelajaran: minta izin juga norma)
└─ D REPORT ke admin grup  → SURVIVED + report ✓ (admin grup private-in akun)
```

**State ke Hari 5:** `personal_data_public = true|false` → kalau true, D9 blackmail pakai data ASLI; kalau false, D9 attacker cuma punya data FABRIKASI (gampang dibongkar → lesson: cek klaimnya).

---

# HARI 3 - D5 Keamanan HP (pagi) + D6 Lapor & Pulihkan (sore)

**App urutan:** notif → ChatLoop (attack A) → Security (audit izin, misi wajib) → MessageBox (attack B) → Settings (perangkat aktif)
**Misi eksplorasi:** 📱 audit izin aplikasi di Security

## Attack A - "APK Premium Gratis" (D5, ChatLoop → Settings/Security)

```
S1 HOOK (teman grup): "APK editor video PREMIUM gratis! instal dari link drive,
   gak perlu Play Store!"
├─ A COMPLY download → S2a instal → minta izin: SMS, kontak, aksesibilitas
│    ├─ A2 COMPLY izinkan semua → EXPOSED (spyware) → Security scan (misi hari ini)
│    │    DETECT app jahat: "EditorVideoProPro - 12 izin berlebihan, 0 review"
│    │    ├─ A3 UNINSTALL + ganti password → RECOVERED (incident_response ✓✓)
│    │    └─ B3 diam            → EXPOSED FINAL → data kontak keluar (DM aneh ke teman2 di Hari 4)
│    ├─ B2 SUSPECT tolak izin aneh → app gak jalan → teman: "izinin aja semua"
│    │    ├─ A3 COMPLY          → EXPOSED (jalan atas)
│    │    └─ B3 UNINSTALL       → SURVIVED + verify ✓
│    └─ C2 EXIT sebelum instal  → SURVIVED
├─ B SUSPECT "kenapa gak dari Play Store?" → S2b: "versi Play Store lama, ini lebih baru"
│    ├─ A2 COMPLY   → S2a
│    └─ B2 REFUSE + saran Play Store → SURVIVED + bantu teman (win komunitas)
└─ C IGNORE → SURVIVED (silent)
```

## Attack B - "OTP Account Takeover" (D6, MessageBox) - KLIMAKS

**Konteks:** kalau `credentials_leaked=true` (Hari 1) → login ASLI dari perangkat lain benar2 terjadi.
Kalau `false` → tetap sama (attack sim), tapi debrief nunjukin: "kali ini latihan".

```
S1 MessageBox: "⚠️ Percobaan masuk dari perangkat tidak dikenal (Windows · Kota Lain).
   Kami kirim kode untuk mengamankan akun - BALAS dengan kodenya."
├─ A COMPLY kirim kode → EXPOSED TOTAL → 10 menit kemudian: email pemulihan diganti
│    → RECOVERY SEQUENCE (ini inti domain D6):
│       "Akunmu dibajak. Ikuti langkah: 1) jangan panik 2) buka Settings → perangkat aktif
│        3) logout semua 4) ganti password 5) pulihkan email 6) LAPOR"
│    ├─ selesaikan semua langkah → RECOVERED + incident_response ✓ (nilai tinggi: recovery dari kekalahan)
│    └─ skip/sebagian → masih EXPOSED → Hari 4 dibuka dengan akun "masih bermasalah" (notif ganggu)
├─ B SUSPECT "resmi gak minta kode" → S2b attacker panik: "akun DIKUNCI 5 menit lagi!"
│    ├─ A3 COMPLY (takut) → EXPOSED → recovery sequence atas
│    ├─ B3 tahan + cek Settings → perangkat aktif KELIATAN → logout remote → SURVIVED + verify ✓✓
│    └─ C3 REPORT → REPORTED + report_threat ✓ (best path)
├─ C REPORT langsung → REPORTED
└─ D IGNORE → netral (login attempt "gagal sendiri" di log - tapi kalau credentials_leaked,
     Hari 4 notif kejadian aneh bermunculan: akun tetap rawan)
```

**Edukasi inti D6:** urutan pemulihan + ke mana lapor (platform, kanal resmi, aduankonten.id).
Tombol [Lapor] pertama kali jadi aksi dinilai di sini.

---

# HARI 4 - D7 Telepon & CS Palsu (pagi) + D8 Pembayaran Digital (siang)

**App urutan:** notif → Phone (attack A) → ChatLoop + popup QR (attack B)
**Misi eksplorasi:** 📞 cek riwayat panggilan

## Attack A - "Vishing Petugas Dukungan" (D7, Phone)

**UI khusus: layar telepon masuk (bukan chat).** Tombol: [Angkat] [Tolak].

```
S0 incoming call: "+62 812-xxxx (Petugas Dukungan)"
├─ Tolak langsung → SURVIVED (silent) → masuk call log (misi eksplorasi ke-check)
└─ Angkat → S1: "Halo, akun kamu error pembayaran. aku kirim kode ke HP-mu sekarang,
     tolong bacakan biar aku perbaiki." → OTP ASLI masuk ke SMS (realistis!)
     ├─ A COMPLY bacakan kode → EXPOSED → "verifikasi pembayaran" lanjut →
     │    malah minta OTP kedua →
     │    ├─ A2 kasih lagi  → EXPOSED TOTAL (transaksi terjadi - saldo e-wallet anjlok
     │    │                   → masuk D8 dengan saldo berkurang: konsekuensi nyambung!)
     │    └─ B2 sadar & tutup → EXPOSED PARSIAL → blokir kartu via app (recovery mini)
     ├─ B SUSPECT "aku hubungi CS resmi aja" → S2b: "antrean CS 3 hari, akun kamu
     │    batal HARI INI" (urgency + authority)
     │    ├─ A3 COMPLY   → EXPOSED
     │    └─ B3 tutup + callback ke nomor resmi (contact list) → SURVIVED + verify ✓✓
     │         → CS resmi: "kami gak pernah minta kode" (konfirmasi edukatif)
     ├─ C REPORT (blokir + lapor nomor) → REPORTED
     └─ D diam/mikir → attacker naikin tekanan (jalan B3)
```

## Attack B - "Biaya Admin QRIS Fiktif" (D8, ChatLoop + popup QR)

```
S1 HOOK: "FINALIS WAJIB BAYAR biaya administrasi Rp 250.000 via QRIS hari ini.
   Hadiah Rp 5 juta langsung diproses setelah pembayaran!"
├─ A COMPLY scan QR → popup QR scanner tiruan: nama penerima "BUDI S."
│    (BUKAN lembaga) + nominal →
│    ├─ A2 COMPLY bayar → EXPOSED (uang hilang) → lanjut "biaya kedua" (pajak)
│    │    ├─ A3 bayar LAGI   → EXPOSED TOTAL (sunk-cost trap!) → debrief: penipu
│    │    │                    gak berhenti sendiri; berhenti BAYAR = berhenti rugi
│    │    └─ B3 sadar & stop → EXPOSED (rugi sekali) → lapor + minta blokir transaksi
│    │                          (recovery parsial; edukasi: lapor bank CEPAT)
│    └─ B2 SUSPECT lihat nama penerima "ini orang pribadi, bukan panitia" → S2b
│         "nama bendahara panitia, wajar" (excuse lemah)
│         ├─ A3 COMPLY  → EXPOSED
│         └─ B3 EXIT + cek pengumuman resmi (tombol "Cek kanal resmi") →
│              → papan pengumuman: "KAMI TIDAK PERNAH MENGIUT MINTA PEMBAYARAN"
│              → SURVIVED + verify ✓✓ (di debrief: ini cara cek klaim uang)
├─ B SUSPECT "hadiah kok bayar dulu?" → S2b (jalan atas)
├─ C REPORT → REPORTED
└─ D IGNORE → SURVIVED (silent)
```

**Kalau saldo berkurang dari D7:** teks attack ini nyambung ("saldomu kurang? itu
bukti pembayaran pertama berhasil, tinggal pelunasan…") - pressure naik.

---

# HARI 5 - D10 Keluarga & Komunitas (pagi) + D9 Psikologi Penipuan (siang)

**App urutan:** notif → MessageBox (attack A) → ChatLoop (attack B) → Phone (callback) → Journal (closing)
**Misi eksplorasi:** 👨‍👩‍👧 baca pesan keluarga

## Attack A - "Keluarga Hampir Kena" (D10, MessageBox)

**Pemain BUKAN korban - pemain = penolong.** Dua sub-kasus berurutan.

```
S1 Ibu (chat): "Nak, tadi ada telepon dari 'bank', minta nomor kartu & kode.
   Kartunya udah aku kasih, kode belum. Itu beneran bank ya?"
├─ A JELASIN BENAR: "Bu, itu penipuan! JANGAN kasih kode. Aku bantu blokir kartunya"
│    → S2: mini-flow blokir kartu via app bank (tombol "Blokir kartu Ibu") ✓
│    → lanjut S3 (kasus adik)
├─ B BIASA AJA: "kayaknya iya Bu, beneran" → ibu kasih KODE → EXPOSED (keluarga)
│    → kartu kosong → recovery: lapor bank + buat laporan polisi (D6 skill dipakai ulang)
└─ C ABAI "ntar aja" → ibu kasih kode → EXPOSED (versi pasif - debrief: diam = ikut
     menjerumuskan; transfer of learning gagal)

S3 Adik (chat): "Kak! dapat hadiah skin game gratis, cuma disuruh password akun.
   Aku kasih ya?"
├─ A STOP + JELASIN: "password gak boleh dibagi ke SIAPA PUN" → SURVIVED + protect_data ✓
│    + adik: "terus kalau dapat hadiah beneran gimana?" → pemain jawab (pilihan ganda):
│    ├─ jawab benar ("hadiah asli gak minta password") → FAMILY SAVE COMPLETE 🏆
│    └─ jawab ragu → coach compliment + koreksi (masih SURVIVED, edukasi menguatkan)
├─ B BIARKAN → EXPOSED (akun game adik dibajak → dipakai kirimin link scam ke
│    teman2 adik - efek domino komunitas)
└─ C REPORT ke ortu (tombol "Kabari Ibu") → SURVIVED + report ✓ (ibuu ikut aware)
```

**Skor D10 = assessment sejati**: pemain harus PAKAI skill D1-D9 buat nyelametin orang lain.

## Attack B - "Blackmail Data Bocor" (D9, ChatLoop) - KLIMAKS PSIKOLOGIS

**Konteks:**
- Kalau `personal_data_public=true` (D4 Hari 2): attacker pakai data ASLI (nama, sekolah, alamat) - creepy & meyakinkan
- Kalau `false`: data FABRIKASI (nama salah, sekolah salah) → player bisa bongkar klaimnya

```
S1 HOOK: "Kami punya infomu: [nama], [sekolah], [alamat] - SEMUA BENAR kan?
   Transfer 500rb dalam 15 MENIT atau kami sebar ke semua kontak sekolahmu."
├─ A COMPLY bayar → S2a: "terima kasih. tapi ada biaya penghapusan data…"
│    (extortion TIDAK berhenti) →
│    ├─ A2 bayar lagi → EXPOSED TOTAL (sunk-cost, sama kayak D8) → akhirnya
│    │    attacker minta "tanda kerja sama" (foto!) → makin dalam →
│    │    RESCUE: teman baik chat masuk ("kamu kenapa? share ke aku") →
│    │    admit & report → RECOVERED + lesson: BAYAR = dianggap target hidup
│    └─ B2 STOP + REPORT → RECOVERED (rugi sekali, pelajaran keras tapi pulih)
├─ B SUSPECT cek klaim: "sekolahku bukan itu" (kalau data fabrikasi) → attacker
│    kasih kambing: "aku punya filemu" (bluff) →
│    ├─ B2 panggil bluff / cek screenshot → GIVE_UP attacker → SURVIVED + verify ✓✓
│    │    (lesson: klaim data sering BLUFF - uji dulu)
│    └─ A2 takut & bayar → (jalan S2a)
├─ C REFUSE + REPORT: "gak akan bayar. aku screenshot & lapor" →
│    S2c attacker ancam lebih keras ("orangtuamu akan tahu besok pagi!") →
│    ├─ B3 TAHAN (gak balas, block, lapor ke platform + sekolah + ortu + aduankonten.id)
│    │    → REPORTED 🏆 + under_pressure ✓✓ → keesokan pagi: TIDAK ADA yang terjadi
│    │    (penipu pindah target) → debrief: ancaman = umpan panik, bukan fakta
│    └─ A3 balas emosi/marah → attacker naikin personal (pakai data D4 kalau ada)
│         → tetap harus block & report (jalan B3) untuk REPORTED
└─ D IGNORE + block diam2 → SURVIVED (oke, tapi report_threat gak ✓ - debrief
     ingetin: laporin nyelametin orang lain yang jadi target berikutnya)
```

**Closing (Journal):** refleksi 5 hari + prinsip (p1-p5) + "ini bukan salahmu" (destigmatization).

---

# Ringkasan State yang Dibawa Antar Hari (persistence)

| State | Di-set di | Dipakai di | Efek |
|---|---|---|---|
| `credentials_leaked` | H1 attack B | H3 attack B | true → takeover "asli" + H4 notif ganggu; partial→ recovery penuh bisa; false → simulasi |
| `wifi_credentials_leaked` | H2 attack A | H3 attack B | vector alternatif takeover |
| `personal_data_public` | H2 attack B | H5 attack B | true → blackmail data ASLI; false → data fabrikasi (bisa dibongkar) |
| `spyware_installed` | H3 attack A | H4 | DM aneh ke kontak; notif makin banyak |
| `wallet_damaged` | H4 attack A/B | H4 B / H5 | tekanan finansial nyambung |
| `family_safe` | H5 attack A | H5 closing | menentukan teks finale |
| `knows_scam_pattern` (per domain) | tiap SUSPECT/REPORT | hari berikut | dialog adversary bisa nyebut "kayak kemarin" |

# Skoring

- Outcome XP: REPORTED 150 · SURVIVED 100 · IGNORED 70 · RECOVERED 120 · EXPOSED 40 (tetap dapat - gagal = belajar)
- Indikator ✓ per cabang (lihat tree) → behavior_score backend
- `RECOVERED` (EXPOSED → recovery sukses) hampir setara SURVIVED - **failure-friendly by design**

---

# FALLBACK PLAN - Mode Tanpa LLM / Tanpa GPU AMD

## Prinsip
Semua tree di atas = **scripted decision tree lengkap**. AI (MiniMax via vLLM) cuma
buat VARIASI BAHASA dari node yang sama. Kalau GPU ilang → intent classifier +
template reply → game 100% playable, kualitas narasi turun dikit, logika TIDAK turun.

## Implementasi (sudah setengah jalan di repo)
1. **Intent classifier** (regex, urut preseden):
   ```python
   INTENTS = [
     (REPORT,  r"\b(lapor|report|penipu|scam|block|blokir)\b"),
     (REFUSE,  r"\b(gak|tidak|nggak|no|stop|bye|udah)\b(?!.*boleh)"),
     (COMPLY,  r"\b(oke|ok|iya|boleh|siap|ini|mau|kirim|bayar)\b|\d{4,}"),
     (SUSPECT, r"\?(?!.*oke)|kok|gimana|kapan|siapa|memangnya|beneran|janggal|aneh"),
     (DELAY,   r"\b(nanti|ntar|besok|pikir|wait|tunggu)\b"),
   ]
   ```
   Kode OTP / data di reply pemain (regex `\d{4,6}`, email) → auto-`COMPLY` (data keluar).
2. **Scripted replies**: setiap node `S1/S2a/S2b/S3...` di tree atas = string siap pakai
   (bahasa ID + EN via tabel translations). Adversary = state machine sederhana.
3. **Debrief**: template per outcome (tanpa LLM) - sudah ada fallback text di
   `/api/mission/{mid}/debrief`; tinggal tambah template per-outcome + red_flags statis.
4. **Cast generator** (nama kafe/SSID/NPC): fallback = wordlist per kita/persona
   (sudah ada `strSeed` deterministic fallback di frontend).
5. Flag: `LLM_PROVIDER=scripted` → semua endpoint balas dari tree, 0 token, 0 GPU.

## Format training data (kalau dapat GPU & mau finetune)
Dari tree atas, generate JSONL per node:
```json
{"state":"S2a","attack":"story_komp_d1_phishing","intent":"COMPLY",
 "player":"oke aku isi sekarang","reply":"Sempurna! Masukkan nama lengkap, NISN, dan nama ibu kandung...",
 "next":"S3a","outcome":null}
```
+ variasi parafrase 5-10x per intent (augment) = dataset adversary yang konsisten
dengan logika game. Eval: cabang tree coverage (semua jalur ter-reach).

## Prioritas GPU kalau dapat
1. Adversary paraphrase (make scripted natural) - dampak terbesar
2. Debrief coach personal
3. Cast generator (nama) - udah ada fallback bagus, prioritas rendah
