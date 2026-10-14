/* ============================================================
   HUMANPATCH STORYLINES — per-world template collections
   Each world gets N storyline templates. On profile creation,
   one is picked at random (seeded by profile id) so every user
   gets a different arc. Templates are persona-adaptive: the
   engine substitutes {name}, {school}, {city}, {age} from the
   active persona.
   ============================================================ */

const STORYLINES = {

  student: [
    {
      id: "student-01",
      title: { id: "Kompetisi Digital", en: "The Digital Competition" },
      premise: {
        id: "Sekolah mengadakan kompetisi proyek digital berhadiah beasiswa. Selama persiapan, pesan-pesan mencurigakan mulai bermunculan: panitia palsu, tawaran hadiah, permintaan kode OTP, hingga akun teman yang mengirim tautan aneh.",
        en: "Your school launches a digital project competition with a scholarship prize. As you prepare, suspicious messages appear: fake organizers, prize offers, OTP requests, and a friend's account sending strange links.",
      },
      days: [
        { title: { id: "Awal Baru", en: "A New Beginning" },
          domains: ["credentials", "phishing"],
          events: [
            { domain: "credentials", scene: "account_signup",
              text: { id: "Portal kompetisi meminta kamu membuat akun. Kamu tergoda memakai sandi yang sama dengan akun lainnya biar gampang diingat.", en: "The competition portal asks you to create an account. You're tempted to reuse the same password as your other accounts." },
              choices: [
                { t: { id: "Pakai sandi yang sama seperti akun lain", en: "Reuse the same password" }, risk: 2, tag: "risky" },
                { t: { id: "Sandi baru yang mirip sedikit", en: "A slightly different password" }, risk: 1, tag: "partial" },
                { t: { id: "Sandi unik kuat + simpan di password manager", en: "Strong unique password + manager" }, risk: 0, tag: "safe" },
              ] },
            { domain: "phishing", scene: "wa_prize",
              text: { id: "Pesan WhatsApp: 'Selamat! Kamu terpilih finalis kompetisi nasional. Konfirmasi identitas dalam 10 menit agar slot beasiswamu tidak dibatalkan.'", en: "WhatsApp: 'Congrats! You're a national finalist. Confirm your identity within 10 minutes or lose your scholarship slot.'" },
              choices: [
                { t: { id: "Buka tautan dan isi data", en: "Open the link and submit data" }, risk: 2, tag: "risky" },
                { t: { id: "Balas, tanya identitas pengirim", en: "Reply, ask who they are" }, risk: 1, tag: "probe", ai: true },
                { t: { id: "Cek pengumuman di situs resmi + kontak panitia terverifikasi", en: "Check the official site + verified contact" }, risk: 0, tag: "safe" },
              ],
              twist: { id: "Pengirim menghubungi lagi dengan nada lebih meyakinkan setelah kamu diamkan.", en: "The sender follows up more convincingly after you ignore them.", ai: true } },
          ] },
        { title: { id: "Semua Orang Melihat", en: "Everyone Is Watching" },
          domains: ["browsing", "privacy"],
          events: [
            { domain: "browsing", scene: "cafe_wifi",
              text: { id: "Di kafe, ada Wi-Fi gratis bernama mirip nama resmi kafe. Kamu butuh mengunduh dokumen kompetisi.", en: "At the café, free Wi-Fi with a name similar to the official one. You need to download competition docs." },
              choices: [
                { t: { id: "Pakai jaringan dengan sinyal terkuat", en: "Use the strongest signal" }, risk: 2, tag: "risky" },
                { t: { id: "Konek lalu langsung buka portal", en: "Connect and open the portal" }, risk: 1, tag: "risky" },
                { t: { id: "Konfirmasi nama ke petugas, hindari aktivitas sensitif", en: "Verify with staff, avoid sensitive activity" }, risk: 0, tag: "safe" },
              ] },
            { domain: "privacy", scene: "socmed_upload",
              text: { id: "Foto persiapan tim memperlihatkan kartu pelajar, jadwal, lokasi, dan sebagian layar akun.", en: "Your team photo shows student IDs, schedules, location, and part of an account screen." },
              choices: [
                { t: { id: "Langsung unggah, akunku cuma diikuti teman", en: "Upload now, only friends follow me" }, risk: 2, tag: "risky" },
                { t: { id: "Hapus foto sepenuhnya", en: "Delete the photo entirely" }, risk: 0, tag: "over" },
                { t: { id: "Periksa, samarkan info sensitif, hapus lokasi, tinjau audiens", en: "Blur sensitive info, strip location, review audience" }, risk: 0, tag: "safe" },
              ],
              twist: { id: "Seorang teman mengunggah foto lain yang memperlihatkan jadwal pulangmu.", en: "A friend posts another photo revealing your schedule.", ai: false } },
          ] },
        { title: { id: "Ada yang Tidak Beres", en: "Something Is Wrong" },
          domains: ["mobile", "reporting"],
          events: [
            { domain: "mobile", scene: "sideload_app",
              text: { id: "Aplikasi edit video dibagikan lewat grup sekolah — tidak ada di toko aplikasi resmi.", en: "A video editor app shared in the school group — not on the official store." },
              choices: [
                { t: { id: "Install saja, kata teman-teman bagus", en: "Install it, friends say it's good" }, risk: 2, tag: "risky" },
                { t: { id: "Install tapi tolak beberapa izin", en: "Install but deny some permissions" }, risk: 1, tag: "partial" },
                { t: { id: "Cek sumber, reputasi pengembang, dan izin yang diminta", en: "Check source, developer reputation, permissions" }, risk: 0, tag: "safe" },
              ] },
            { domain: "reporting", scene: "account_takeover",
              text: { id: "Notifikasi: percobaan login dari perangkat asing. Beberapa menit kemudian kamu tidak bisa masuk ke akun medsos.", en: "Notification: login attempt from an unknown device. Minutes later you're locked out of your social account." },
              choices: [
                { t: { id: "Minta bantuan 'dukungan akun' yang DM kamu", en: "Ask the 'account support' that DM'd you" }, risk: 2, tag: "risky", ai: true },
                { t: { id: "Coba login berulang, abaikan notifikasi", en: "Retry logins, ignore alerts" }, risk: 2, tag: "risky" },
                { t: { id: "Kanal pemulihan resmi: amankan email, ganti sandi, cek sesi, laporkan", en: "Official recovery: secure email, rotate creds, check sessions, report" }, risk: 0, tag: "safe" },
              ],
              twist: { id: "Akunmu mulai mengirim tautan mencurigakan ke teman-teman. Sekarang bukan cuma kamu yang terdampak.", en: "Your account starts sending suspicious links to friends. It's not just you anymore.", ai: false } },
          ] },
        { title: { id: "Kepercayaan Itu Rumit", en: "Trust Is Complicated" },
          domains: ["scam_calls", "payments"],
          events: [
            { domain: "scam_calls", scene: "fake_support_call",
              text: { id: "Telepon: 'Petugas dukungan kompetisi. Akunmu bermasalah — bacakan kode OTP yang baru masuk untuk verifikasi.'", en: "Phone: 'Competition support staff. Your account has an issue — read out the OTP you just received to verify.'" },
              choices: [
                { t: { id: "Kasih kodenya — dia tahu namaku dan sekolahku", en: "Give the code — they know my name and school" }, risk: 2, tag: "risky" },
                { t: { id: "Tutup telepon tanpa tindakan lanjutan", en: "Hang up, do nothing else" }, risk: 1, tag: "partial" },
                { t: { id: "Tolak kode, akhiri panggilan, hubungi layanan resmi lewat kanal yang kamu cari sendiri", en: "Refuse, end call, contact official support yourself" }, risk: 0, tag: "safe" },
              ],
              twist: { id: "Penelepon menyebut info pribadimu yang pernah kamu unggah publik. Info benar bukan bukti orang itu terpercaya.", en: "They cite personal info you once posted publicly. Correct info isn't proof of trust.", ai: true } },
            { domain: "payments", scene: "qris_fee",
              text: { id: "Pesan berlogo kompetisi: finalis wajib bayar 'biaya administrasi' via QRIS hari ini juga.", en: "Branded message: finalists must pay an 'admin fee' via QRIS today." },
              choices: [
                { t: { id: "Bayar segera, takut kehilangan kesempatan", en: "Pay now, afraid of losing the slot" }, risk: 2, tag: "risky" },
                { t: { id: "Minta bukti dulu ke pengirim", en: "Ask the sender for proof" }, risk: 1, tag: "probe", ai: true },
                { t: { id: "Cek ketentuan resmi + konfirmasi ke panitia terverifikasi", en: "Check official terms + verify with organizers" }, risk: 0, tag: "safe" },
              ],
              twist: { id: "Seorang teman mengaku sudah membayar dan mendesakmu ikut.", en: "A friend claims they already paid and pressures you.", ai: false } },
          ] },
        { title: { id: "Tantangan Terakhir", en: "The Final Challenge" },
          domains: ["psychology", "family"],
          events: [
            { domain: "psychology", scene: "sextortion_threat",
              text: { id: "Pesan ancaman: 'Kami punya informasi pribadimu. 15 menit, atau kami sebar.' Sebagian info mereka benar.", en: "Threat message: 'We have your personal info. 15 minutes or we leak it.' Some of it is accurate." },
              choices: [
                { t: { id: "Ikuti instruksi agar cepat selesai", en: "Follow instructions to end it fast" }, risk: 2, tag: "risky" },
                { t: { id: "Balas marah dan ancam balik", en: "Reply angrily, threaten back" }, risk: 2, tag: "risky", ai: true },
                { t: { id: "Tidak impulsif: simpan bukti, jangan interaksi, minta bantuan orang tepercaya", en: "Don't act impulsively: save evidence, don't engage, seek trusted help" }, risk: 0, tag: "safe" },
              ] },
            { domain: "family", scene: "family_under_attack",
              text: { id: "Adikmu dapat pesan 'hadiah game'. Orang tuamu ditelpon 'petugas bank' yang minta informasi rahasia.", en: "Your sibling got a 'game prize' message. Your parents got a 'bank officer' call asking for secrets." },
              choices: [
                { t: { id: "Abaikan — bukan akunku yang kena", en: "Ignore — not my account" }, risk: 2, tag: "risky" },
                { t: { id: "Larang keluarga pakai layanan digital", en: "Ban family from digital services" }, risk: 1, tag: "over" },
                { t: { id: "Bantu mereka verifikasi, lindungi kode rahasia, laporkan penipuan", en: "Help them verify, protect secrets, report the scam" }, risk: 0, tag: "safe" },
              ],
              twist: { id: "Seorang teman malu cerita pernah tertipu. Respons tanpa menyalahkan korban.", en: "A friend is ashamed of being scammed. Respond without blaming the victim.", ai: false } },
          ] },
      ],
    },
    // ── slots for student-02, student-03 (placeholder until user provides)
    { id: "student-02", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
    { id: "student-03", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
  ],

  merchant: [
    { id: "merchant-01", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
    { id: "merchant-02", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
    { id: "merchant-03", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
  ],
  worker: [
    { id: "worker-01", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
    { id: "worker-02", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
    { id: "worker-03", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
  ],
  parent: [
    { id: "parent-01", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
    { id: "parent-02", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
    { id: "parent-03", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
  ],
  general: [
    { id: "general-01", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
    { id: "general-02", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
    { id: "general-03", title: { id: "…", en: "…" }, premise: { id: "", en: "" }, days: [] },
  ],
};


/* Persona facts for AI adaptation — AI rewrites template text to match these. */
const PERSONA_FACTS = {
  nadia:   { name: "Nadia",   age: 16, city: "Jakarta",  level: "SMA",    lang_hint: "id", context: "siswi SMA di Jakarta, suka cari beasiswa" },
  xiaoyu:  { name: "Xiaoyu",  age: 13, city: "Chengdu",  level: "SMP",    lang_hint: "id", context: "siswi SMP di Chengdu" },
  rizky:   { name: "Rizky",   age: 17, city: "Surabaya", level: "SMA",    lang_hint: "id", context: "siswa SMA di Surabaya, hobi gaming" },
  chinedu: { name: "Chinedu", age: 17, city: "Lagos",    level: "SMA",    lang_hint: "en", context: "high schooler in Lagos" },
  ananya:  { name: "Ananya",  age: 14, city: "Bengaluru",level: "SMP",    lang_hint: "en", context: "middle schooler in Bengaluru" },
  elsa:    { name: "Elsa",    age: 15, city: "Stockholm",level: "SMP",    lang_hint: "en", context: "middle schooler in Stockholm" },
  maddie:  { name: "Maddie",  age: 18, city: "Austin",   level: "College",lang_hint: "en", context: "college freshman in Austin" },
  emir:    { name: "Emir",    age: 20, city: "Istanbul", level: "Universitas", lang_hint: "en", context: "university student in Istanbul" },
  diego:   { name: "Diego",   age: 12, city: "CDMX",     level: "SD",     lang_hint: "es", context: "estudiante de primaria en CDMX" },
  oliver:  { name: "Oliver",  age: 22, city: "London",   level: "Universitas", lang_hint: "en", context: "final-year university student in London" },
};
window.PERSONA_FACTS = PERSONA_FACTS;

/* Pick a random storyline for a profile — only among FULLY AUTHORED ones. */
function pickStoryline(world) {
  const pool = (STORYLINES[world] || []).filter(s => s.days && s.days.length > 0);
  if (!pool.length) return null;
  // seeded by time + random for variety per new profile
  const i = Math.floor(Math.random() * pool.length);
  return pool[i];
}

window.STORYLINES = STORYLINES;
window.pickStoryline = pickStoryline;
