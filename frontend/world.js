/* ============================================================
   HumanPatch — World Director (client)
   Builds the fictional phone world per profile. Deterministic
   templates + (later) AI Director enrichment via backend.
   ============================================================ */

/* ---------- app catalog ---------- */
const APP_CATALOG = {
  chatloop:   { id: "chatloop",   name: "ChatLoop",   icon: "💬", bg: "#0F766E", category: "chat" },
  messagebox: { id: "messagebox", name: "MessageBox", icon: "✉️", bg: "#2563EB", category: "sms" },
  mailbox:    { id: "mailbox",    name: "Mailbox",    icon: "📧", bg: "#DC2626", category: "email" },
  safebrowse: { id: "safebrowse", name: "SafeBrowse", icon: "🌐", bg: "#334155", category: "browser" },
  pocketpay:  { id: "pocketpay",  name: "PocketPay",  icon: "👛", bg: "#7C3AED", category: "ewallet" },
  dailymart:  { id: "dailymart",  name: "DailyMart",  icon: "🛒", bg: "#EA580C", category: "shopping" },
  socialsquare:{id: "socialsquare",name: "SocialSquare",icon: "📸", bg: "#DB2777", category: "social" },
  campushub:  { id: "campushub",  name: "CampusHub",  icon: "🎓", bg: "#0891B2", category: "campus" },
  workdesk:   { id: "workdesk",   name: "WorkDesk",   icon: "💼", bg: "#475569", category: "work" },
  settings:   { id: "settings",   name: "Settings",   icon: "⚙️", bg: "#64748B", category: "system" },
  security:   { id: "security",   name: "Security",   icon: "🛡️", bg: "#111827", category: "system" },
  journal:    { id: "journal",    name: "Journal",    icon: "📓", bg: "#F59E0B", category: "system" },
};

/* ---------- world templates per archetype ---------- */
const WORLD_TEMPLATES = {
  student: {
    archetype: "student",
    wallpaper: "linear-gradient(160deg, #0F172A, #134E4A)",
    apps: ["chatloop", "messagebox", "mailbox", "safebrowse", "socialsquare", "campushub", "pocketpay", "settings", "security", "journal"],
    contacts: [
      { id: "ibu",   name: "Ibu",   avatar: "👩", color: "#FDA4AF", rel: "Ibu kandung" },
      { id: "bimo",  name: "Bimo",  avatar: "🧑‍🎤", color: "#93C5FD", rel: "Sahabat SMA" },
      { id: "dosen", name: "Pak Hendra", avatar: "👨‍🏫", color: "#FCD34D", rel: "Dosen PA" },
      { id: "kelas", name: "Kelas 4KA-07", avatar: "👥", color: "#86EFAC", rel: "Grup kelas" },
      { id: "kos",   name: "Bu Ratmi (Kosan)", avatar: "🏠", color: "#C4B5FD", rel: "Ibu kos" },
    ],
    normalNotifs: [
      { app: "chatloop", from: "Kelas 4KA-07", text: "Bimo: udah pada isi absen kewarganegaraan belum?" },
      { app: "campushub", from: "CampusHub", text: "Jadwal UAS semester ini sudah rilis. Cek akademik." },
      { app: "chatloop", from: "Bu Ratmi (Kosan)", text: "Dek, besok ada acara kerja bakti ya, jam 7 pagi." },
      { app: "socialsquare", from: "SocialSquare", text: "bimo_stylo dan 3 lainnya menandai kamu dalam foto." },
      { app: "pocketpay", from: "PocketPay", text: "Cashback Rp8.000 dari transaksi kopi kemarin sudah masuk." },
    ],
    personaBrief: "Mahasiswa tingkat akhir, kosan dekat kampus, aktif sosmed & e-wallet.",
  },
  merchant: {
    archetype: "merchant",
    wallpaper: "linear-gradient(160deg, #1F2937, #7C2D12)",
    apps: ["chatloop", "messagebox", "mailbox", "safebrowse", "dailymart", "pocketpay", "workdesk", "settings", "security", "journal"],
    contacts: [
      { id: "supplier", name: "Pak Jaya Supplier", avatar: "🧔", color: "#FDBA74", rel: "Supplier dagang" },
      { id: "pelanggan", name: "Mbak Sari (Pelanggan)", avatar: "👩", color: "#F9A8D4", rel: "Pelanggan langganan" },
      { id: "kurir", name: "Kurir Andi", avatar: "🛵", color: "#7DD3FC", rel: "Kurir langganan" },
      { id: "grupdagang", name: "Grup Kulakan Rakyat", avatar: "👥", color: "#BEF264", rel: "Grup bisnis" },
      { id: "suami", name: "Bang Don", avatar: "👨", color: "#A5B4FC", rel: "Suami" },
    ],
    normalNotifs: [
      { app: "dailymart", from: "DailyMart", text: "Pesanan #DM-2214 sudah diambil kurir. Estimasi sampai besok." },
      { app: "chatloop", from: "Mbak Sari (Pelanggan)", text: "Mbak, stok yang kemarin ada lagi gak? Mau repeat order." },
      { app: "pocketpay", from: "PocketPay", text: "Pembayaran QR Rp75.000 diterima dari pembeli Shopee." },
      { app: "chatloop", from: "Grup Kulakan Rakyat", text: "Pak Jaya: stok baru datang besok subuh, siap-siap." },
      { app: "mailbox", from: "Mailbox", text: "DailyMart: Tips meningkatkan rating toko Anda bulan ini." },
    ],
    personaBrief: "Pedagang online UMKM, jualan di marketplace & sosmed, pakai e-wallet harian.",
  },
  worker: {
    archetype: "worker",
    wallpaper: "linear-gradient(160deg, #0F172A, #1E3A8A)",
    apps: ["chatloop", "messagebox", "mailbox", "safebrowse", "workdesk", "pocketpay", "socialsquare", "settings", "security", "journal"],
    contacts: [
      { id: "boss", name: "Bu Ratna (Manager)", avatar: "👩‍💼", color: "#FDA4AF", rel: "Atasan" },
      { id: "hrd", name: "HRD Perusahaan", avatar: "🏢", color: "#93C5FD", rel: "HRD" },
      { id: "temankantor", name: "Dimas (Kantor)", avatar: "🧑", color: "#FCD34D", rel: "Teman kerja" },
      { id: "grupkantor", name: "Tim Project Q4", avatar: "👥", color: "#86EFAC", rel: "Grup kerja" },
      { id: "bendahara", name: "Pak Eko (Finance)", avatar: "🧑‍💼", color: "#C4B5FD", rel: "Finance" },
    ],
    normalNotifs: [
      { app: "workdesk", from: "WorkDesk", text: "Reminder: evaluasi kinerja Q4 mengisi form sebelum Jumat." },
      { app: "chatloop", from: "Tim Project Q4", text: "Dimas: deck buat klien udah aku revise, cek ya." },
      { app: "mailbox", from: "Mailbox", text: "Slip gaji bulan ini sudah tersedia di portal HR." },
      { app: "workdesk", from: "WorkDesk", text: "Meeting 10.00: sinkronasi timeline rilis produk baru." },
    ],
    personaBrief: "Karyawan swasta kantor, sibuk deadline, slip gaji & reimbursement lewat portal HR.",
  },
  parent: {
    archetype: "parent",
    wallpaper: "linear-gradient(160deg, #1F2937, #86198F)",
    apps: ["chatloop", "messagebox", "safebrowse", "pocketpay", "dailymart", "settings", "security", "journal", "mailbox", "socialsquare"],
    contacts: [
      { id: "anak", name: "Nadia (Anak)", avatar: "👧", color: "#F9A8D4", rel: "Anak SMA" },
      { id: "walikelas", name: "Bu Guru Wali Kelas", avatar: "👩‍🏫", color: "#FCD34D", rel: "Wali kelas Nadia" },
      { id: "gruportu", name: "Grup Ortu 12 IPA 2", avatar: "👥", color: "#86EFAC", rel: "Grup orang tua" },
      { id: "arisan", name: "Arisan RT", avatar: "💃", color: "#C4B5FD", rel: "Arisan" },
      { id: "suami", name: "Pak Budi", avatar: "👨", color: "#A5B4FC", rel: "Suami" },
    ],
    normalNotifs: [
      { app: "chatloop", from: "Grup Ortu 12 IPA 2", text: "Bu Guru: info pembayaran study tour cek announcement." },
      { app: "dailymart", from: "DailyMart", text: "Belanja mingguan sampai besok sore. Kurir: Andi." },
      { app: "chatloop", from: "Arisan RT", text: "Mbak Yuli: arisan undian bulan ini di rumah Bu Nani." },
      { app: "pocketpay", from: "PocketPay", text: "Tagihan listrik Rp340.000 jatuh tempo 3 hari lagi." },
      { app: "chatloop", from: "Nadia (Anak)", text: "Mi, nanti diambil jam 4 ya ada ekskul." },
    ],
    personaBrief: "Ibu rumah tangga, pegang keuangan keluarga, anak sekolah, aktif grup WA.",
  },
  general: {
    archetype: "general",
    wallpaper: "linear-gradient(160deg, #0F172A, #3F3F46)",
    apps: ["chatloop", "messagebox", "safebrowse", "pocketpay", "dailymart", "socialsquare", "settings", "security", "journal"],
    contacts: [
      { contacts_placeholder: true },
      { id: "temen", name: "Reza", avatar: "🧑", color: "#93C5FD", rel: "Teman" },
      { id: "bank", name: "Bank Nusantara", avatar: "🏦", color: "#86EFAC", rel: "Bank" },
      { id: "gruprt", name: "Grup RT 05", avatar: "👥", color: "#BEF264", rel: "Grup tetangga" },
      { id: "keluarga", name: "Keluarga Besar", avatar: "👨‍👩‍👧", color: "#FDA4AF", rel: "Grup keluarga" },
    ],
    normalNotifs: [
      { app: "chatloop", from: "Reza", text: "Bro, nonton bareng Sabtu?" },
      { app: "pocketpay", from: "PocketPay", text: "Kamu berhasil top-up Rp100.000. Saldo saat ini Rp384.210." },
      { app: "chatloop", from: "Grup RT 05", text: "Pak RT: kerja bakti Minggu pagi ya, tiap rumah minimal 1 orang." },
      { contacts_placeholder: true },
      { app: "dailymart", from: "DailyMart", text: "Flash sale jam 8 malam nanti, voucher di app." },
    ],
    normalNotifsPlaceholder: true,
    personaBrief: "Pengguna digital umum.",
  },
};

/* contact placeholder cleanup (defensive) */
for (const [k, tpl] of Object.entries(WORLD_TEMPLATES)) {
  tpl.contacts = (tpl.contacts || []).filter(c => !c.contacts_placeholder);
  tpl.normalNotifs = (tpl.normalNotifs || []).filter(n => !n.contacts_placeholder && n.app);
}

/* ---------- day-by-day storyline (Chapter 1) ---------- */
const STORY_DAYS = [
  {
    day: 1, title: "Hari Biasa", engTitle: "The Ordinary Day",
    objective: "Kenali HP-mu: aplikasi, kontak, dan cara cek detail pengirim.",
    events: "intro",
  },
  {
    day: 2, title: "Ada yang Perasaan", engTitle: "Something Feels Wrong",
    objective: "Ada pesan janggal. Periksa sebelum percaya.",
    events: "phishing",
  },
  {
    day: 3, title: "Lindungi Akun", engTitle: "Protect Your Accounts",
    objective: "Izin aplikasi, pemulihan akun, dan keputusan autentikasi.",
    events: "account",
  },
  {
    day: 4, title: "Konsekuensi", engTitle: "The Consequences",
    objective: "Keputusanmu sebelumnya mengubah arah cerita hari ini.",
    events: "consequences",
  },
  {
    day: 5, title: "Pulihkan & Laporkan", engTitle: "Recover & Respond",
    objective: "Tanggapi insiden: pulihkan akun, laporkan ke kanal yang benar.",
    events: "recovery",
  },
];

/* ---------- build a world from profile ---------- */
function buildWorld(profile, day = 1) {
  const tpl = WORLD_TEMPLATES[profile.archetype] || WORLD_TEMPLATES.general;
  const seed = strSeed(profile.id + "|" + profile.name);
  const contacts = tpl.contacts.map(c => ({ ...c }));
  const apps = tpl.apps.map(id => ({ ...APP_CATALOG[id] }));

  /* day-specific attack payload injected into the world */
  const attack = buildAttack(profile, day, seed);
  if (attack) {
    /* attack surfaces as an incoming message inside the relevant app */
    const app = apps.find(a => a.id === attack.app);
    if (app) app.pending = attack;
    apps.find(a => a.id === "journal").badge = day;
  }
  apps.find(a => a.id === "journal").badge = day;

  /* notifications: mix of normal + (day>=2) attack-flavored */
  const notifs = tpl.normalNotifs.map(n => ({ ...n, id: nid(), read: false }));
  if (attack && day >= 2) {
    notifs.unshift({ id: nid(), app: attack.app, from: attack.from, text: attack.notifText, attack: true, read: false });
  }

  return {
    profile, day,
    apps, contacts, notifs,
    attack: attack || null,
    personaBrief: tpl.personaBrief,
    wallpaper: tpl.wallpaper,
    phoneTime: "08:47",
    battery: 78,
  };
}

let _nid = 0;
function nid() { return "n" + (++_nid); }
function strSeed(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* ---------- day-based attack builder (mock adversary content) ----------
   Deterministic, profile-flavored. The backend AI adversary replaces
   message text live during encounters; this seeds the world surface. */
function buildAttack(profile, day, seed) {
  const A = {
    student: {
      phishing: {
        app: "chatloop", from: "Panitia Beasiswa Cendekia",
        notifText: "Selamat! Kamu lolos tahap akhir beasiswa Cendekia...",
        scenario: "wa_scholarship",
      },
      account: { app: "mailbox", from: "Tim Keamanan CampusHub", notifText: "Aktivitas login mencurigakan terdeteksi...", scenario: "mail_hr_slip" },
      consequences: { app: "socialsquare", from: "Tim Verifikasi SocialSquare", notifText: "Akun kamu dilaporkan impersonation...", scenario: "social_overshare" },
      recovery: { app: "chatloop", from: "Tim Bantuan Pengaduan", notifText: "Kami bantu blokir dana yang hilang...", scenario: "report_fake_support" },
    },
    merchant: {
      phishing: { app: "chatloop", from: "Pembeli Shopee", notifText: "Kak, refund QRIS pesanan kemarin gagal...", scenario: "wa_qris_refund" },
      account: { app: "dailymart", from: "DailyMart Security", notifText: "Toko kamu terindikasi penipuan, verifikasi...", scenario: "mail_hr_slip" },
      consequences: { app: "pocketpay", from: "PocketPay Support", notifText: "Saldo kamu dibekukan karena pelanggaran...", scenario: "wa_cs_otp" },
      recovery: { app: "chatloop", from: "Tim Bantuan Pengaduan", notifText: "Dana penipuan bisa kami tahan, jangan lapor dulu...", scenario: "report_fake_support" },
    },
    worker: {
      phishing: { app: "mailbox", from: "HRD Perusahaan", noticText: "", notifText: "Slip gaji bulan ini: konfirmasi data...", scenario: "mail_hr_slip" },
      account: { app: "workdesk", from: "IT Support", notifText: "Password kadaluarsa, reset segera...", scenario: "cred_password_reuse" },
      consequences: { app: "mailbox", from: "Tim Keamanan Perusahaan", notifText: "Akun email kamu dikirim spam massal...", scenario: "cred_password_reuse" },
      recovery: { app: "chatloop", from: "Tim Bantuan Pengaduan", notifText: "Kami dari tim bantuan korban penipuan...", scenario: "report_fake_support" },
    },
    parent: {
      phishing: { app: "chatloop", from: "Admin Sekolah", notifText: "Tagihan SPP semester baru, transfer ke rekening baru...", scenario: "wa_spp_sekolah" },
      account: { app: "messagebox", from: "Bank Nusantara", notifText: "Kartu kamu diblokir, verifikasi via link...", scenario: "wa_cs_otp" },
      consequences: { app: "pocketpay", from: "PocketPay Support", notifText: "Transaksi tak dikenal Rp2.300.000...", scenario: "wa_cs_otp" },
      recovery: { app: "chatloop", from: "Tim Bantuan Pengaduan", notifText: "Dana SPP yang salah transfer bisa kami tarik...", scenario: "report_fake_support" },
    },
    general: {
      phishing: { app: "messagebox", from: "Kurir Paket", notifText: "Paketmu tertahan, bayar bea Rp15.000 di link...", scenario: "sms_kuota_hadiah" },
      account: { app: "socialsquare", from: "SocialSquare Security", notifText: "Login dari perangkat tak dikenal...", scenario: "cred_password_reuse" },
      consequences: { app: "pocketpay", from: "PocketPay", notifText: "Saldo berkurang untuk transaksi tak dikenal...", scenario: "wa_prize_link" },
      recovery: { ph_app_placeholder: true, app: "chatloop", from: "Tim Bantuan Pengaduan", notifText: "Korban penipuan? Kami bantu cairkan...", scenario: "report_fake_support" },
    },
  };
  const t = (A[profile.archetype] || A.general);
  let ev = null;
  if (day === 1) ev = null;
  else if (day === 2) ev = t.phishing;
  else if (day === 3) ev = t.account;
  else if (day === 4) ev = t.consequences;
  else if (day === 5) ev = t.recovery;
  if (!ev) return null;
  return { ...ev, id: "atk" + day, seed };
}

if (typeof module !== "undefined") module.exports = { APP_CATALOG, WORLD_TEMPLATES, STORY_DAYS, buildWorld };
