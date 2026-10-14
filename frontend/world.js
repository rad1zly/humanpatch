/* ============================================================
   HumanPatch — World Director (client)
   Multilingual fictional world content. L() resolves {id,en,es,hi,pt}
   with EN fallback. LANG set by i18n.js.
   ============================================================ */

function L(obj) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return obj[LANG] || obj.en || obj.id || "";
}

/* ---------- app catalog ---------- */
const APP_CATALOG = {
  chatloop:   { id: "chatloop",   name: "ChatLoop",   icon: "💬", bg: "#0F766E" },
  messagebox: { id: "messagebox", name: "MessageBox", icon: "✉️", bg: "#2563EB" },
  mailbox:    { id: "mailbox",    name: "Mailbox",    icon: "📧", bg: "#DC2626" },
  safebrowse: { id: "safebrowse", name: "SafeBrowse", icon: "🌐", bg: "#334155" },
  pocketpay:  { id: "pocketpay",  name: "PocketPay",  icon: "👛", bg: "#7C3AED" },
  dailymart:  { id: "dailymart",  name: "DailyMart",  icon: "🛒", bg: "#EA580C" },
  socialsquare:{id: "socialsquare",name: "SocialSquare",icon: "📸", bg: "#DB2777" },
  campushub:  { id: "campushub",  name: "CampusHub",  icon: "🎓", bg: "#0891B2" },
  workdesk:   { id: "workdesk",   name: "WorkDesk",   icon: "💼", bg: "#475569" },
  settings:   { id: "settings",   name: "Settings",   icon: "⚙️", bg: "#64748B" },
  security:   { id: "security",   name: "Security",   icon: "🛡️", bg: "#111827" },
  journal:    { id: "journal",    name: "Journal",    icon: "📓", bg: "#F59E0B" },
};

/* ---------- world templates per archetype (multilingual) ---------- */
const WORLD_TEMPLATES = {
  student: {
    archetype: "student",
    wallpaper: "linear-gradient(160deg, #0F172A, #134E4A)",
    apps: ["chatloop", "messagebox", "mailbox", "safebrowse", "socialsquare", "campushub", "pocketpay", "settings", "security", "journal"],
    contacts: [
      { id: "ibu",   avatar: "👩", color: "#FDA4AF", rel: {id:"Ibu kandung", en:"Mom", es:"Madre", pt:"Mãe", hi:"माँ"} , name: {id:"Ibu", en:"Mom", es:"Mamá", pt:"Mãe", hi:"माँ"} },
      { id: "bimo",  avatar: "🧑‍🎤", color: "#93C5FD", rel: {id:"Sahabat SMA", en:"High-school best friend", es:"Mejor amigo del colegio", pt:"Melhor amigo do colégio", hi:"स्कूल का दोस्त"}, name: {id:"Bimo", en:"Bimo", es:"Bimo", pt:"Bimo", hi:"बिमो"} },
      { id: "dosen", avatar: "👨‍🏫", color: "#FCD34D", rel: {id:"Dosen PA", en:"Academic advisor", es:"Tutor académico", pt:"Orientador acadêmico", hi:"प्रोफेसर"}, name: {id:"Pak Hendra", en:"Mr. Hendra", es:"Sr. Hendra", pt:"Sr. Hendra", hi:"हेंद्रा सर"} },
      { id: "kelas", avatar: "👥", color: "#86EFAC", rel: {id:"Grup kelas", en:"Class group", es:"Grupo de clase", pt:"Grupo da turma", hi:"कक्षा ग्रुप"}, name: {id:"Kelas 4KA-07", en:"Class 4KA-07", es:"Clase 4KA-07", pt:"Turma 4KA-07", hi:"कक्षा 4KA-07"} },
      { id: "kos",   avatar: "🏠", color: "#C4B5FD", rel: {id:"Ibu kos", en:"Landlady", es:"Casera", pt:"Senhoria", hi:"किराएदार मालकिन"}, name: {id:"Bu Ratmi (Kosan)", en:"Mrs. Ratmi (Dorm)", es:"Sra. Ratmi (Pensión)", pt:"Sra. Ratmi (República)", hi:"रत्मी आंटी (हॉस्टल)"} },
    ],
    normalNotifs: [
      { app: "chatloop", from: {id:"Kelas 4KA-07",en:"Class 4KA-07",es:"Clase 4KA-07",pt:"Turma 4KA-07",hi:"कक्षा 4KA-07"}, text: {id:"Bimo: udah pada isi absen kewarganegaraan belum?", en:"Bimo: has everyone filled the attendance form?", es:"Bimo: ¿todos llenaron la lista de asistencia?", pt:"Bimo: todo mundo preencheu a chamada?", hi:"बिमो: सबने उपस्थिति भरी?"} },
      { app: "campushub", from: {id:"CampusHub",en:"CampusHub",es:"CampusHub",pt:"CampusHub",hi:"CampusHub"}, text: {id:"Jadwal UAS semester ini sudah rilis. Cek akademik.", en:"This semester's final exam schedule is out. Check the portal.", es:"El horario de exámenes finales ya está publicado.", pt:"O cronograma de provas finais saiu. Veja no portal.", hi:"फाइनल परीक्षा की टाइम-टेबल आ गई है।"} },
      { app: "chatloop", from: {id:"Bu Ratmi (Kosan)",en:"Mrs. Ratmi (Dorm)",es:"Sra. Ratmi (Pensión)",pt:"Sra. Ratmi (República)",hi:"रत्मी आंटी"}, text: {id:"Dek, besok ada acara kerja bakti ya, jam 7 pagi.", en:"Dear, there's a community cleanup tomorrow at 7am.", es:"Querido, mañana hay limpieza comunitaria a las 7am.", pt:"Querido, amanhã tem mutirão de limpeza às 7h.", hi:"कल सुबह 7 बजे सफाई कार्यक्रम है।"} },
      { app: "socialsquare", from: {id:"SocialSquare",en:"SocialSquare",es:"SocialSquare",pt:"SocialSquare",hi:"SocialSquare"}, text: {id:"bimo_stylo dan 3 lainnya menandai kamu dalam foto.", en:"bimo_stylo and 3 others tagged you in a photo.", es:"bimo_stylo y 3 más te etiquetaron en una foto.", pt:"bimo_stylo e mais 3 marcaram você numa foto.", hi:"bimo_stylo और 3 और लोगों ने आपको फोटो में टैग किया।"} },
      { app: "pocketpay", from: {id:"PocketPay",en:"PocketPay",es:"PocketPay",pt:"PocketPay",hi:"PocketPay"}, text: {id:"Cashback Rp8.000 dari transaksi kopi kemarin sudah masuk.", en:"Rp8,000 cashback from yesterday's coffee has arrived.", es:"El cashback de Rp8.000 del café de ayer ya llegó.", pt:"O cashback de Rp8.000 do café de ontem chegou.", hi:"कल की कॉफी का कैशबैक आ गया है।"} },
    ],
  },
  merchant: {
    archetype: "merchant",
    wallpaper: "linear-gradient(160deg, #1F2937, #7C2D12)",
    apps: ["chatloop", "messagebox", "mailbox", "safebrowse", "dailymart", "pocketpay", "workdesk", "settings", "security", "journal"],
    contacts: [
      { id: "supplier", avatar: "🧔", color: "#FDBA74", rel: {id:"Supplier dagang", en:"Goods supplier", es:"Proveedor", pt:"Fornecedor", hi:"सप्लायर"}, name: {id:"Pak Jaya Supplier", en:"Mr. Jaya (Supplier)", es:"Sr. Jaya (Proveedor)", pt:"Sr. Jaya (Fornecedor)", hi:"जया (सप्लायर)"} },
      { id: "pelanggan", avatar: "👩", color: "#F9A8D4", rel: {id:"Pelanggan langganan", en:"Regular customer", es:"Clienta frecuente", pt:"Cliente fiel", hi:"नियमित ग्राहक"}, name: {id:"Mbak Sari (Pelanggan)", en:"Mrs. Sari (Customer)", es:"Sra. Sari (Cliente)", pt:"Sra. Sari (Cliente)", hi:"सारी (ग्राहक)"} },
      { id: "kurir", avatar: "🛵", color: "#7DD3FC", rel: {id:"Kurir langganan", en:"Regular courier", es:"Mensajero habitual", pt:"Entregador habitual", hi:"नियमित कूरियर"}, name: {id:"Kurir Andi", en:"Andi (Courier)", es:"Andi (Mensajero)", pt:"Andi (Entregador)", hi:"आंदी (कूरियर)"} },
      { id: "grupdagang", avatar: "👥", color: "#BEF264", rel: {id:"Grup bisnis", en:"Business group", es:"Grupo de negocio", pt:"Grupo de negócios", hi:"व्यापार ग्रुप"}, name: {id:"Grup Kulakan Rakyat", en:"Wholesale Buyers Group", es:"Grupo de Compras al Mayor", pt:"Grupo de Compra Atacado", hi:"थोक खरीद ग्रुप"} },
      { id: "suami", avatar: "👨", color: "#A5B4FC", rel: {id:"Suami", en:"Husband", es:"Esposo", pt:"Marido", hi:"पति"}, name: {id:"Bang Don", en:"Don", es:"Don", pt:"Don", hi:"डॉन"} },
    ],
    normalNotifs: [
      { app: "dailymart", from: {id:"DailyMart",en:"DailyMart"}, text: {id:"Pesanan #DM-2214 sudah diambil kurir. Estimasi sampai besok.", en:"Order #DM-2214 picked up by courier. Arriving tomorrow.", es:"El pedido #DM-2214 fue recogido. Llega mañana.", pt:"Pedido #DM-2214 coletado. Chega amanhã.", hi:"ऑर्डर #DM-2214 कूरियर ने ले लिया। कल पहुँचेगा।"} },
      { app: "chatloop", from: {id:"Mbak Sari (Pelanggan)",en:"Mrs. Sari (Customer)"}, text: {id:"Mbak, stok yang kemarin ada lagi gak? Mau repeat order.", en:"Is last week's item back in stock? I want to reorder.", es:"¿Volvió el producto de la semana pasada? Quiero repetir.", pt:"Voltou o produto da semana passada? Quero repetir.", hi:"पिछले हफ्ते का प्रोडक्ट वापस आया? दोबारा ऑर्डर करना है।"} },
      { app: "pocketpay", from: {id:"PocketPay",en:"PocketPay"}, text: {id:"Pembayaran QR Rp75.000 diterima dari pembeli.", en:"QR payment Rp75,000 received from buyer.", es:"Pago QR de Rp75.000 recibido.", pt:"Pagamento QR de Rp75.000 recebido.", hi:"QR पेमेंट Rp75,000 प्राप्त हुई।"} },
      { app: "chatloop", from: {id:"Grup Kulakan Rakyat",en:"Wholesale Buyers Group"}, text: {id:"Pak Jaya: stok baru datang besok subuh, siap-siap.", en:"Mr. Jaya: new stock arrives at dawn, get ready.", es:"Sr. Jaya: stock nuevo llega al amanecer.", pt:"Sr. Jaya: estoque novo chega de madrugada.", hi:"जया: नया स्टॉक सुबह आता है।"} },
      { app: "mailbox", from: {id:"DailyMart",en:"DailyMart"}, text: {id:"Tips meningkatkan rating tokomu bulan ini.", en:"Tips to boost your shop rating this month.", es:"Consejos para subir tu calificación este mes.", pt:"Dicas para subir sua nota este mês.", hi:"इस महीने दुकान रेटिंग बढ़ाने के टिप्स।"} },
    ],
  },
  worker: {
    archetype: "worker",
    wallpaper: "linear-gradient(160deg, #0F172A, #1E3A8A)",
    apps: ["chatloop", "messagebox", "mailbox", "safebrowse", "workdesk", "pocketpay", "socialsquare", "settings", "security", "journal"],
    contacts: [
      { id: "boss", avatar: "👩‍💼", color: "#FDA4AF", rel: {id:"Atasan", en:"Manager", es:"Jefa", pt:"Chefe", hi:"बॉस"}, name: {id:"Bu Ratna (Manager)", en:"Mrs. Ratna (Manager)", es:"Sra. Ratna (Gerente)", pt:"Sra. Ratna (Gerente)", hi:"रत्ना मैनेजर"} },
      { id: "hrd", avatar: "🏢", color: "#93C5FD", rel: {id:"HRD", en:"HR", es:"RRHH", pt:"RH", hi:"HR"}, name: {id:"HRD Perusahaan", en:"Company HR", es:"RRHH", pt:"RH da Empresa", hi:"कंपनी HR"} },
      { id: "temankantor", avatar: "🧑", color: "#FCD34D", rel: {id:"Teman kerja", en:"Coworker", es:"Compañero", pt:"Colega", hi:"सहकर्मी"}, name: {id:"Dimas (Kantor)", en:"Dimas (Work)", es:"Dimas (Trabajo)", pt:"Dimas (Trabalho)", hi:"दिमास (ऑफिस)"} },
      { id: "grupkantor", avatar: "👥", color: "#86EFAC", rel: {id:"Grup kerja", en:"Work group", es:"Grupo de trabajo", pt:"Grupo de trabalho", hi:"वर्क ग्रुप"}, name: {id:"Tim Project Q4", en:"Q4 Project Team", es:"Equipo Q4", pt:"Equipe Q4", hi:"Q4 टीम"} },
      { id: "bendahara", avatar: "🧑‍💼", color: "#C4B5FD", rel: {id:"Finance", en:"Finance", es:"Finanzas", pt:"Financeiro", hi:"फाइनेंस"}, name: {id:"Pak Eko (Finance)", en:"Mr. Eko (Finance)", es:"Sr. Eko (Finanzas)", pt:"Sr. Eko (Financeiro)", hi:"एको (फाइनेंस)"} },
    ],
    normalNotifs: [
      { app: "workdesk", from: {id:"WorkDesk",en:"WorkDesk"}, text: {id:"Reminder: evaluasi kinerja Q4 mengisi form sebelum Jumat.", en:"Reminder: complete the Q4 review form before Friday.", es:"Recordatorio: completa la evaluación Q4 antes del viernes.", pt:"Lembrete: complete a avaliação Q4 antes de sexta.", hi:"रिमाइंडर: शुक्रवार से पहले Q4 फॉर्म भरें।"} },
      { app: "chatloop", from: {id:"Tim Project Q4",en:"Q4 Project Team"}, text: {id:"Dimas: deck buat klien udah aku revise, cek ya.", en:"Dimas: I revised the client deck, take a look.", es:"Dimas: revisé la presentación, mira.", pt:"Dimas: revisei o deck do cliente, olha.", hi:"दिमास: क्लाइंट डेक रिवाइज कर दिया।"} },
      { app: "mailbox", from: {id:"Mailbox",en:"Mailbox"}, text: {id:"Slip gaji bulan ini sudah tersedia di portal HR.", en:"This month's payslip is available in the HR portal.", es:"La boleta de pago ya está en el portal de RRHH.", pt:"O contracheque já está no portal de RH.", hi:"इस महीने की सैलरी स्लिप पोर्टल पर है।"} },
      { app: "workdesk", from: {id:"WorkDesk",en:"WorkDesk"}, text: {id:"Meeting 10.00: sinkronasi timeline rilis produk baru.", en:"10:00 meeting: new product release timeline sync.", es:"Reunión 10:00: sincronización del lanzamiento.", pt:"Reunião 10h: sincronizar lançamento do produto.", hi:"10 बजे मीटिंग: प्रोडक्ट लॉन्च टाइमलाइन।"} },
    ],
  },
  parent: {
    archetype: "parent",
    wallpaper: "linear-gradient(160deg, #1F2937, #86198F)",
    apps: ["chatloop", "messagebox", "safebrowse", "pocketpay", "dailymart", "settings", "security", "journal", "mailbox", "socialsquare"],
    contacts: [
      { id: "anak", avatar: "👧", color: "#F9A8D4", rel: {id:"Anak SMA", en:"Teenage daughter", es:"Hija", pt:"Filha", hi:"बेटी"}, name: {id:"Nadia (Anak)", en:"Nadia (Daughter)", es:"Nadia (Hija)", pt:"Nadia (Filha)", hi:"नादिया (बेटी)"} },
      { id: "walikelas", avatar: "👩‍🏫", color: "#FCD34D", rel: {id:"Wali kelas Nadia", en:"Nadia's homeroom teacher", es:"Tutora de Nadia", pt:"Professora da Nadia", hi:"नादिया की क्लास टीचर"}, name: {id:"Bu Guru Wali Kelas", en:"Homeroom Teacher", es:"Tutora", pt:"Professora", hi:"क्लास टीचर"} },
      { id: "gruportu", avatar: "👥", color: "#86EFAC", rel: {id:"Grup orang tua", en:"Parents group", es:"Grupo de padres", pt:"Grupo de pais", hi:"पेरेंट्स ग्रुप"}, name: {id:"Grup Ortu 12 IPA 2", en:"Parents of 12 IPA 2", es:"Padres de 12 IPA 2", pt:"Pais da 12 IPA 2", hi:"12 IPA 2 पेरेंट्स"} },
      { id: "arisan", avatar: "💃", color: "#C4B5FD", rel: {id:"Arisan", en:"Community savings club", es:"Club de ahorro", pt:"Clube de economia", hi:"बचत ग्रुप"}, name: {id:"Arisan RT", en:"Neighborhood Club", es:"Club del barrio", pt:"Clube do bairro", hi:"पड़ोस क्लब"} },
      { id: "suami", avatar: "👨", color: "#A5B4FC", rel: {id:"Suami", en:"Husband", es:"Esposo", pt:"Marido", hi:"पति"}, name: {id:"Pak Budi", en:"Mr. Budi", es:"Sr. Budi", pt:"Sr. Budi", hi:"बुडी जी"} },
    ],
    normalNotifs: [
      { app: "chatloop", from: {id:"Grup Ortu 12 IPA 2",en:"Parents of 12 IPA 2"}, text: {id:"Bu Guru: info pembayaran study tour cek announcement.", en:"Teacher: check the announcement for study tour payment.", es:"Profesora: mira el anuncio del pago del viaje.", pt:"Professora: veja o anúncio do pagamento da excursão.", hi:"टीचर: स्टडी टूर पेमेंट की सूचना देखें।"} },
      { app: "dailymart", from: {id:"DailyMart",en:"DailyMart"}, text: {id:"Belanja mingguan sampai besok sore. Kurir: Andi.", en:"Weekly groceries arriving tomorrow afternoon. Courier: Andi.", es:"Las compras llegan mañana. Mensajero: Andi.", pt:"As compras chegam amanhã. Entregador: Andi.", hi:"साप्ताहिक किराना कल आएगी। कूरियर: आंदी।"} },
      { app: "chatloop", from: {id:"Arisan RT",en:"Neighborhood Club"}, text: {id:"Mbak Yuli: arisan undian bulan ini di rumah Bu Nani.", en:"Yuli: this month's club draw is at Mrs. Nani's.", es:"Yuli: el sorteo es en casa de la Sra. Nani.", pt:"Yuli: o sorteio é na casa da Sra. Nani.", hi:"यूली: इस महीने का ड्रा नानी आंटी के घर है।"} },
      { app: "pocketpay", from: {id:"PocketPay",en:"PocketPay"}, text: {id:"Tagihan listrik Rp340.000 jatuh tempo 3 hari lagi.", en:"Electricity bill Rp340,000 due in 3 days.", es:"Factura de luz Rp340.000 vence en 3 días.", pt:"Conta de luz Rp340.000 vence em 3 dias.", hi:"बिजली बिल Rp340,000 तीन दिन में ड्यू।"} },
      { app: "chatloop", from: {id:"Nadia (Anak)",en:"Nadia (Daughter)"}, text: {id:"Mi, nanti diambil jam 4 ya ada ekskul.", en:"Mom, pick me up at 4, I have extracurriculars.", es:"Mamá, recógeme a las 4, tengo extraescolares.", pt:"Mãe, me busca às 4, tenho atividade.", hi:"माँ, 4 बजे ले जाना, एक्टिविटी है।"} },
    ],
  },
  general: {
    archetype: "general",
    wallpaper: "linear-gradient(160deg, #0F172A, #3F3F46)",
    apps: ["chatloop", "messagebox", "safebrowse", "pocketpay", "dailymart", "socialsquare", "settings", "security", "journal"],
    contacts: [
      { id: "temen", avatar: "🧑", color: "#93C5FD", rel: {id:"Teman", en:"Friend", es:"Amigo", pt:"Amigo", hi:"दोस्त"}, name: {id:"Reza", en:"Reza", es:"Reza", pt:"Reza", hi:"रेज़ा"} },
      { id: "bank", avatar: "🏦", color: "#86EFAC", rel: {id:"Bank", en:"Bank", es:"Banco", pt:"Banco", hi:"बैंक"}, name: {id:"Bank Nusantara", en:"Nusantara Bank", es:"Banco Nusantara", pt:"Banco Nusantara", hi:"नुसंतारा बैंक"} },
      { id: "gruprt", avatar: "👥", color: "#BEF264", rel: {id:"Grup tetangga", en:"Neighborhood group", es:"Grupo del barrio", pt:"Grupo do bairro", hi:"पड़ोस ग्रुप"}, name: {id:"Grup RT 05", en:"Neighborhood 05", es:"Barrio 05", pt:"Vizinhança 05", hi:"मोहल्ला 05"} },
      { id: "keluarga", avatar: "👨‍👩‍👧", color: "#FDA4AF", rel: {id:"Grup keluarga", en:"Family group", es:"Grupo familiar", pt:"Grupo da família", hi:"परिवार ग्रुप"}, name: {id:"Keluarga Besar", en:"Big Family", es:"Familia Grande", pt:"Família Grande", hi:"बड़ा परिवार"} },
    ],
    normalNotifs: [
      { app: "chatloop", from: {id:"Reza",en:"Reza"}, text: {id:"Bro, nonton bareng Sabtu?", en:"Bro, movie night Saturday?", es:"Bro, ¿cine el sábado?", pt:"Bro, cinema sábado?", hi:"यार, शनिवार मूवी चलेगी?"} },
      { app: "pocketpay", from: {id:"PocketPay",en:"PocketPay"}, text: {id:"Top-up Rp100.000 berhasil. Saldo Rp384.210.", en:"Top-up Rp100,000 successful. Balance Rp384,210.", es:"Recarga de Rp100.000 exitosa.", pt:"Recarga de Rp100.000 concluída.", hi:"टॉप-अप Rp100,000 सफल।"} },
      { app: "chatloop", from: {id:"Grup RT 05",en:"Neighborhood 05"}, text: {id:"Pak RT: kerja bakti Minggu pagi ya, tiap rumah minimal 1 orang.", en:"Head of neighborhood: cleanup Sunday morning, at least 1 per house.", es:"Jefe del barrio: limpieza el domingo, 1 por casa.", pt:"Líder do bairro: mutirão domingo, 1 por casa.", hi:"मोहल्ला प्रमुख: रविवार सुबह सफाई, हर घर से 1 आदमी।"} },
      { app: "dailymart", from: {id:"DailyMart",en:"DailyMart"}, text: {id:"Flash sale jam 8 malam nanti, voucher di app.", en:"Flash sale tonight at 8, vouchers in the app.", es:"Oferta flash hoy a las 8, cupones en la app.", pt:"Oferta flash hoje às 8h da noite.", hi:"आज रात 8 बजे फ्लैश सेल।"} },
    ],
  },
};

/* ---------- day-by-day storyline (Chapter 1) ---------- */
const STORY_DAYS = [
  { day: 1, engTitle: "The Ordinary Day" },
  { day: 2, engTitle: "Something Feels Wrong" },
  { day: 3, engTitle: "Protect Your Accounts" },
  { day: 4, engTitle: "The Consequences" },
  { day: 5, engTitle: "Recover & Respond" },
];

/* ---------- conversation threads per contact (multilingual) ---------- */
const CONTACT_THREADS = {
  ibu: [
    { who: "them", text: {id:"Nak, sudah makan belum? Jam segini masih di kampus?", en:"Sweetie, have you eaten? Still on campus at this hour?", es:"Cariño, ¿ya comiste? ¿Todavía en el campus?", pt:"Querido, já comeu? Ainda no campus?", hi:"बेटा, खाना खा लिया? अभी भी कैंपस पर हो?"} },
    { who: "them", text: {id:"Ibu transfer uang saku tambahan ya tadi sore. Cek dulu sebelum dipakai.", en:"Mom sent extra allowance this afternoon. Check it before spending.", es:"Mamá envió dinero extra esta tarde. Verifícalo antes de gastar.", pt:"Mãe mandou mesada extra hoje. Confere antes de gastar.", hi:"माँ ने आज दोपहर अतिरिक्त पैसे भेजे। खर्च करने से पहले जाँच लो।"} },
  ],
  bimo: [
    { who: "them", text: {id:"Bro bsk konser kampus, gas gak? Tiket sisanya dikit", en:"Bro, campus concert tomorrow, you in? Few tickets left", es:"Bro, mañana el concierto del campus, ¿vas? Quedan pocas entradas", pt:"Bro, show do campus amanhã, vai? Sobram poucos ingressos", hi:"यार, कल कैंपस कॉन्सर्ट है, चलेगा? कुछ ही टिकट बचे"} },
  ],
  dosen: [
    { who: "them", text: {id:"Rani, progress bab 3 skripsimu bagaimana? Minggu ini konsultasi ya.", en:"Rani, how's chapter 3 of your thesis? Consultation this week.", es:"Rani, ¿cómo va el capítulo 3? Consulta esta semana.", pt:"Rani, como vai o capítulo 3? Consulta esta semana.", hi:"रानी, थीसिस का चैप्टर 3 कैसा चल रहा है? इस हफ्ते मिलना।"} },
  ],
  kelas: [
    { who: "them", text: {id:"Bimo: udah pada isi absen kewarganegaraan belum? buruan jam 12 ditutup", en:"Bimo: has everyone filled the civics attendance? Hurry, closes at 12", es:"Bimo: ¿todos firmaron asistencia? Corre, cierra a las 12", pt:"Bimo: todo mundo preencheu a chamada? Corre, fecha às 12", hi:"बिमो: सबने उपस्थिति भरी? जल्दी करो, 12 बजे बंद"} },
  ],
  kos: [
    { who: "them", text: {id:"Dek, besok kerja bakti jam 7 ya. Jangan lupa bangun pagi.", en:"Dear, cleanup duty at 7 tomorrow. Don't forget to wake up early.", es:"Cariño, limpieza a las 7 mañana. Despiértate temprano.", pt:"Querido, mutirão às 7 amanhã. Acorda cedo.", hi:"कल सुबह 7 बजे सफाई है। जल्दी उठना।"} },
  ],
  supplier: [
    { who: "them", text: {id:"Mbak, stok baru datang besok subuh. Yang kemarin laku semua.", en:"Ma'am, new stock arrives at dawn. Yesterday's batch sold out.", es:"Señora, stock nuevo llega al amanecer. El de ayer se vendió todo.", pt:"Dono, estoque novo chega de madrugada. O de ontem vendeu tudo.", hi:"नया स्टॉक सुबह आएगा। कल का सारा बिक गया।"} },
  ],
  pelanggan: [
    { who: "them", text: {id:"Mbak, stok yang kemarin ada lagi gak? Mau repeat order 3 pcs.", en:"Hi, is last week's item back? Want to reorder 3 pcs.", es:"Hola, ¿volvió el producto? Quiero repetir 3 uds.", pt:"Oi, voltou o produto? Quero repetir 3 un.", hi:"पिछला प्रोडक्ट वापस आया? 3 पीस और चाहिए।"} },
  ],
  kurir: [
    { who: "them", text: {id:"Mbak, paket #PRJ-88 udah kutinggal di pos ronda ya. Terima kasih.", en:"Ma'am, package #PRJ-88 left at the guard post. Thanks.", es:"Señora, paquete #PRJ-88 en el puesto de guardia. Gracias.", pt:"Dono, encomenda #PRJ-88 na portaria. Obrigado.", hi:"पार्सल #PRJ-88 गार्ड पोस्ट पर रख दिया। धन्यवाद।"} },
  ],
  grupdagang: [
    { who: "them", text: {id:"Pak Jaya: harga kulakan naik dikit minggu ini, stok aman dulu ya.", en:"Mr. Jaya: wholesale prices up a bit this week, stock up now.", es:"Sr. Jaya: precios al por mayor suben un poco, abastezcan.", pt:"Sr. Jaya: preços de atacado subiram um pouco, estoquem.", hi:"जया: इस हफ्ते थोक दाम थोड़े बढ़े, स्टॉक कर लो।"} },
  ],
  suami: [
    { who: "them", text: {id:"Dek, tadi aku transfer jatah bulanan. Cek ya sebelum belanja online 😄", en:"Dear, I sent the monthly allowance. Check before shopping online 😄", es:"Cariño, envié la mesada. Revisa antes de comprar online 😄", pt:"Querido, mandei a mesada. Confere antes de comprar online 😄", hi:"महीने का खर्च भेज दिया। ऑनलाइन खरीदने से पहले जाँच लो 😄"} },
  ],
  boss: [
    { who: "them", text: {id:"Deck untuk klien besok siang aku review ya. Jangan lupa lampiran filenya.", en:"I'll review the client deck tomorrow noon. Don't forget the attachment.", es:"Reviso el deck mañana al mediodía. No olvides el adjunto.", pt:"Reviso o deck amanhã ao meio-dia. Não esqueça o anexo.", hi:"कल दोपहर डेक रिव्यू करूँगा। अटैचमेंट मत भूलना।"} },
  ],
  hrd: [
    { who: "them", text: {id:"Pengumuman: slip gaji bulan ini bisa diunduh mulai tanggal 25.", en:"Announcement: this month's payslip downloads from the 25th.", es:"Anuncio: la boleta se descarga desde el día 25.", pt:"Aviso: o contracheque baixa a partir do dia 25.", hi:"घोषणा: सैलरी स्लिप 25 से डाउनलोड होगी।"} },
  ],
  temankantor: [
    { who: "them", text: {id:"Mau ikut lunch nanti? Warung baru sebelah kantor katanya enak.", en:"Joining lunch? New place next to the office is supposedly good.", es:"¿Almuerzas con nosotros? El lugar nuevo es bueno.", pt:"Vai almoçar? O lugar novo ao lado é bom.", hi:"लंच चलोगे? नयी जगह अच्छी है।"} },
  ],
  grupkantor: [
    { who: "them", text: {id:"Dimas: meeting jam 10 pindah ke ruang 3 ya semua.", en:"Dimas: 10am meeting moved to room 3, everyone.", es:"Dimas: reunión de 10 movida a sala 3.", pt:"Dimas: reunião das 10 mudou p/ sala 3.", hi:"दिमास: 10 बजे की मीटिंग रूम 3 में।"} },
  ],
  bendahara: [
    { who: "them", text: {id:"Reimburse akhir bulan diproses minggu depan. Siapkan nota ya.", en:"Month-end reimbursements process next week. Prepare receipts.", es:"Reembolsos se procesan la próxima semana. Guarda recibos.", pt:"Reembolsos processados na próxima semana. Guarde recibos.", hi:"रिइंबर्समेंट अगले हफ्ते। रसीद रखो।"} },
  ],
  anak: [
    { who: "them", text: {id:"Mi, nanti diambil jam 4 ya ada ekskul. Jangan lupa bawa uang kas.", en:"Mom, pick me up at 4, I have club. Bring the class fund.", es:"Mamá, recógeme a las 4, tengo extraescolar. Trae la cuota.", pt:"Mãe, me busca às 4, tenho atividade. Traz a taxa.", hi:"माँ, 4 बजे लेना, एक्टिविटी है। क्लास फंड लाना।"} },
  ],
  walikelas: [
    { who: "them", text: {id:"Bu, info study tour kelas Nadia: pembayaran sampai Jumat via TU sekolah.", en:"Ma'am, Nadia's class study tour: payment due Friday via school admin.", es:"Señora, viaje de la clase de Nadia: pago hasta viernes en administración.", pt:"Sra., excursão da classe da Nadia: pagamento até sexta na secretaria.", hi:"नादिया की क्लास का ट्रिप: शुक्रवार तक स्कूल ऑफिस में भुगतान।"} },
  ],
  gruportu: [
    { who: "them", text: {id:"Bu Guru: mari cek announcement grup untuk info SPP semester baru.", en:"Teacher: please check the group announcement for new semester fees.", es:"Profesora: revisa el anuncio del grupo para las cuotas.", pt:"Professora: veja o anúncio do grupo sobre as mensalidades.", hi:"टीचर: नए सेमेस्टर की फीस के लिए ग्रुप घोषणा देखें।"} },
  ],
  arisan: [
    { who: "them", text: {id:"Mbak Yuli: arisan undian bulan ini di rumah Bu Nani, jangan lupa ya.", en:"Yuli: this month's club draw is at Mrs. Nani's, don't forget.", es:"Yuli: el sorteo es en casa de la Sra. Nani.", pt:"Yuli: o sorteio é na casa da Sra. Nani.", hi:"यूली: इस महीने का ड्रा नानी आंटी के घर।"} },
  ],
  temen: [
    { who: "them", text: {id:"Bro, Sabtu nonton bareng? Kata orang filmnya bagus.", en:"Bro, movie Saturday? People say it's good.", es:"Bro, ¿película el sábado? Dicen que es buena.", pt:"Bro, filme sábado? Dizem que é bom.", hi:"यार, शनिवार मूवी? सब कह रहे अच्छी है।"} },
  ],
  bank: [
    { who: "them", text: {id:"Transaksi Rp50.000 berhasil pukul 08.02 WIB. Saldo Rp1.2••••", en:"Transaction Rp50,000 successful at 08:02. Balance Rp1.2••••", es:"Transacción Rp50.000 exitosa a las 08:02.", pt:"Transação Rp50.000 concluída às 08:02.", hi:"लेन-देन Rp50,000 सफल, सुबह 8:02।"} },
  ],
  gruprt: [
    { who: "them", text: {id:"Pak RT: Minggu pagi kerja bakti, tiap rumah minimal 1 orang hadir.", en:"Neighborhood head: Sunday cleanup, at least 1 person per house.", es:"Jefe del barrio: limpieza el domingo, 1 por casa.", pt:"Líder do bairro: mutirão domingo, 1 por casa.", hi:"मोहल्ला प्रमुख: रविवार सफाई, हर घर से 1 आदमी।"} },
  ],
  keluarga: [
    { who: "them", text: {id:"Om Sam: Minggu depan reuni keluarga di rumahnya, jam 10 pagi.", en:"Uncle Sam: family reunion at his place next Sunday, 10am.", es:"Tío Sam: reunión familiar el domingo, 10am.", pt:"Tio Sam: reunião familiar domingo, 10h.", hi:"अंकल सैम: रविवार को पारिवारिक मिलन, सुबह 10 बजे।"} },
  ],
};

/* smart canned auto-replies per contact when player sends free text (chatbot feel) */
const CONTACT_REPLIES = {
  ibu: {id:"Ya Nak, hati-hati ya. Kalau ada yang aneh cerita ke Ibu.", en:"Okay sweetie, stay careful. If something odd happens, tell Mom.", es:"Ok cariño, cuídate. Si pasa algo raro, cuéntame.", pt:"Ok querido, se cuida. Se algo estranho acontecer, me conta.", hi:"ठीक है बेटा, सावधान रहना। कुछ अजीब हो तो बताना।"},
  bimo: {id:"Haha santai bro. Yaudah kuy nonton ya sabtu depan!", en:"Haha chill bro. Alright, movie next Saturday then!", es:"Jaja tranqui. ¡Va, cine el sábado!", pt:"Haha tranquilo. Fechado, cinema sábado!", hi:"हहा ठीक है यार। तो शनिवार मूवी पक्की!"},
  dosen: {id:"Baik, catat ya konsultasi hari Kamis jam 10. Siapkan draft bab 3.", en:"Noted — consultation Thursday 10am. Prepare the chapter 3 draft.", es:"Anotado: consulta jueves 10am. Prepara el borrador.", pt:"Anotado: consulta quinta 10h. Prepare o rascunho.", hi:"नोट किया: गुरुवार 10 बजे मिलना। ड्राफ्ट तैयार करो।"},
  kelas: {id:"Bimo: sip udah aku tandain. Jangan lupa yang lain!", en:"Bimo: marked. Don't forget the others!", es:"Bimo: anotado. ¡No olviden los demás!", pt:"Bimo: anotado. Não esqueçam o resto!", hi:"बिमो: नोट किया। बाकी लोग मत भूलना!"},
  kos: {id:"Siap Bu, nanti aku bawa sapu ya 😄", en:"Yes ma'am, I'll bring a broom 😄", es:"Sí señora, llevo una escoba 😄", pt:"Sim senhora, levo uma vassoura 😄", hi:"जी आंटी, झाड़ू ले आऊँगा 😄"},
  supplier: {id:"Pak Jaya: siap Mbak, besok subuh langsung kirim ya.", en:"Mr. Jaya: yes ma'am, shipping at dawn tomorrow.", es:"Sr. Jaya: sí señora, envío al amanecer.", pt:"Sr. Jaya: sim dona, envio de madrugada.", hi:"जया: जी, कल सुबह भेज दूँगा।"},
  pelanggan: {id:"Mbak Sari: wah makasih infonya! Nanti aku order ya kak 🙏", en:"Mrs. Sari: thanks for the info! I'll order later 🙏", es:"Sra. Sari: ¡gracias por el aviso! Pido luego 🙏", pt:"Sra. Sari: obrigada pelo aviso! Peço depois 🙏", hi:"सारी: जानकारी के लिए धन्यवाद! बाद में ऑर्डर करूँगी 🙏"},
  kurir: {id:"Andi: siap Mbak, kalau ada kendala hubungi aku ya.", en:"Andi: yes ma'am, call me if there's any issue.", es:"Andi: sí señora, llámeme si hay problemas.", pt:"Andi: sim dona, me chama se precisar.", hi:"आंदी: जी, कोई दिक्कत हो तो बुलाइए।"},
  grupdagang: {id:"Pak Jaya: noted Mbak. Aman stoknya minggu ini.", en:"Mr. Jaya: noted. Stock is safe this week.", es:"Sr. Jaya: anotado. Stock seguro esta semana.", pt:"Sr. Jaya: anotado. Estoque seguro esta semana.", hi:"जया: नोट किया। इस हफ्ते स्टॉक ठीक है।"},
  suami: {id:"Hehe iya Dek. Belanja secukupnya ya, akhir bulan ini panjang 😄", en:"Hehe yes dear. Shop moderately, it's a long month 😄", es:"Jaja sí cariño. Compra con moderación 😄", pt:"Hehe sim querida. Compra com moderação 😄", hi:"हहा हाँ। थोड़ा संतुलित खर्च करना, महीना लंबा है 😄"},
  boss: {id:"Sudah kulampirkan filenya Bu Ratna. Terima kasih.", en:"I've attached the file, Mrs. Ratna. Thank you.", es:"Adjunté el archivo, Sra. Ratna. Gracias.", pt:"Anexei o arquivo, Sra. Ratna. Obrigado.", hi:"फाइल अटैच कर दी है, रत्ना मैडम। धन्यवाद।"},
  hrd: {id:"Terima kasih infonya. Akan saya cek tanggal 25 nanti.", en:"Thanks for the info. I'll check on the 25th.", es:"Gracias por el aviso. Revisaré el día 25.", pt:"Obrigado pelo aviso. Vou conferir dia 25.", hi:"जानकारी के लिए धन्यवाद। 25 को देखूँगा।"},
  temankantor: {id:"Gas! Aku ikut, jam 12 ya.", en:"Let's go! I'm in, 12pm then.", es:"¡Va! Me apunto, a las 12.", pt:"Bora! Eu vou, 12h então.", hi:"चलो! मैं आ रहा हूँ, 12 बजे।"},
  grupkantor: {id:"Dimas: oke ruang 3, noted. Sampai jumpa jam 10.", en:"Dimas: room 3, noted. See you at 10.", es:"Dimas: sala 3, anotado. Nos vemos a las 10.", pt:"Dimas: sala 3, anotado. Até às 10.", hi:"दिमास: रूम 3, नोट किया। 10 बजे मिलते हैं।"},
  bendahara: {id:"Pak Eko: siap, nota sudah saya kumpulkan. Terima kasih.", en:"Mr. Eko: ready, receipts collected. Thank you.", es:"Sr. Eko: listo, recibos recolectados.", pt:"Sr. Eko: pronto, recibos guardados.", hi:"एको: तैयार, रसीद जमा कर दी। धन्यवाद।"},
  anak: {id:"Nadia: iya Mi! Eh Mi, jangan lupa kasih tahu Ayah jam 4 diambil ya.", en:"Nadia: okay Mom! Mom, tell Dad pickup is at 4.", es:"Nadia: ¡ok mamá! Mamá, avisa a papá que a las 4.", pt:"Nadia: ok mãe! Mãe, avisa o pai que às 4.", hi:"नादिया: ठीक माँ! पापा को बोल देना 4 बजे।"},
  walikelas: {id:"Baik Bu, akan saya bayarkan Jumat lewat TU. Terima kasih.", en:"Alright, I'll pay Friday via the school office. Thank you.", es:"Bien, pagaré el viernes en administración.", pt:"Certo, pago sexta na secretaria.", hi:"ठीक है, शुक्रवार को स्कूल ऑफिस से भुगतान करूँगा।"},
  gruportu: {id:"Bu Guru: terima kasih sudah cek. Mari disampaikan ke yang lain ya Bu.", en:"Teacher: thanks for checking. Please pass it on.", es:"Profesora: gracias por revisar. Coméntalo con las demás.", pt:"Professora: obrigada por conferir. Repasse às demais.", hi:"टीचर: जाँचने के लिए धन्यवाद। बाकियों को बता दीजिए।"},
  arisan: {id:"Mbak Yuli: siap Mbak! Sampai jumpa Sabtu ya.", en:"Yuli: see you Saturday then!", es:"Yuli: ¡nos vemos el sábado!", pt:"Yuli: até sábado!", hi:"यूली: तो शनिवार मिलते हैं!"},
  temen: {id:"Reza: gas bro! Aku booking tiketnya ya.", en:"Reza: let's go! I'll book the tickets.", es:"Reza: ¡va! Yo reservo las entradas.", pt:"Reza: bora! Eu reservo os ingressos.", hi:"रेज़ा: चलो! मैं टिकट बुक करता हूँ।"},
  bank: {id:"Customer service otomatis: terima kasih telah menghubungi Bank Nusantara.", en:"Automated service: thank you for contacting Nusantara Bank.", es:"Servicio automático: gracias por contactar al Banco Nusantara.", pt:"Atendimento automático: obrigado por contatar o Banco Nusantara.", hi:"स्वचालित सेवा: नुसंतारा बैंक से संपर्क के लिए धन्यवाद।"},
  gruprt: {id:"Pak RT: siap Pak, rumah kami akan hadir. Terima kasih.", en:"Neighborhood head: noted, our house will attend. Thank you.", es:"Jefe del barrio: anotado, asistiremos.", pt:"Líder do bairro: anotado, estaremos lá.", hi:"प्रमुख: जी, हमारे घर से आएँगे। धन्यवाद।"},
  keluarga: {id:"Om Sam: wah asik! Kami datang jam 10 ya. Jangan lupa ajak Nadia.", en:"Uncle Sam: nice! We'll come at 10. Don't forget to bring Nadia.", es:"Tío Sam: ¡genial! Vamos a las 10. Trae a Nadia.", pt:"Tio Sam: ótimo! Vamos às 10. Traz a Nadia.", hi:"सैम: बढ़िया! हम 10 बजे आएँगे। नादिया को लाना।"},
};

/* ---------- chat previews per contact per lang ---------- */
const CHAT_PREVIEWS = {
  ibu:   {id:"Jangan lupa makan ya, Nak.", en:"Don't forget to eat, sweetie.", es:"No olvides comer, cariño.", pt:"Não esquece de comer, querido.", hi:"खाना खाना मत भूलना।"},
  bimo:  {id:"Bsk gas nonton konser kampus?", en:"Campus concert tomorrow, in?", es:"¿Concierto del campus mañana?", pt:"Show do campus amanhã, vai?", hi:"कल कैंपस कॉन्सर्ट चलेगा?"},
  dosen: {id:"Progress skripsimu bagaimana?", en:"How's your thesis progress?", es:"¿Cómo va tu tesis?", pt:"Como vai sua monografia?", hi:"थीसिस कैसी चल रही है?"},
  kelas: {id:"Bimo: udah pada isi absen belum?", en:"Bimo: has everyone filled attendance?", es:"Bimo: ¿todos firmaron?", pt:"Bimo: todo mundo assinou?", hi:"बिमो: सबने हाजिरी भरी?"},
  kos:   {id:"Dek, kerja bakti besok jam 7 ya.", en:"Dear, cleanup tomorrow at 7.", es:"Cariño, limpieza mañana a las 7.", pt:"Querido, mutirão amanhã às 7.", hi:"कल 7 बजे सफाई है।"},
  supplier: {id:"Stok baru datang besok subuh.", en:"New stock arrives at dawn.", es:"Stock nuevo llega al amanecer.", pt:"Estoque novo chega de madrugada.", hi:"नया स्टॉक सुबह आएगा।"},
  pelanggan: {id:"Mbak, stok yang kemarin ada lagi?", en:"Is the item back in stock?", es:"¿Volvió el producto?", pt:"Voltou o produto?", hi:"प्रोडक्ट वापस आया?"},
  kurir: {id:"Paket sudah ditinggal di pos ronda, Mbak.", en:"Package left at the guard post.", es:"Paquete dejado en el puesto de guardia.", pt:"Encomenda deixada na portaria.", hi:"पार्सल गार्ड पोस्ट पर रखा है।"},
  grupdagang: {id:"Pak Jaya: harga naik dikit minggu ini.", en:"Mr. Jaya: prices up a bit this week.", es:"Sr. Jaya: precios subieron un poco.", pt:"Sr. Jaya: preços subiram um pouco.", hi:"जया: इस हफ्ते दाम थोड़े बढ़े।"},
  suami: {id:"Tadi transfer jatah bulanan, cek ya.", en:"Sent the monthly allowance, check it.", es:"Envié la mesada, revisa.", pt:"Mandei a mesada, confere.", hi:"महीने का खर्च भेज दिया।"},
  boss:  {id:"Deck-ku kirim sebelum siang ya.", en:"Send me the deck before noon.", es:"Mándame el deck antes del mediodía.", pt:"Me manda o deck antes do meio-dia.", hi:"दोपहर से पहले डेक भेजो।"},
  hrd:   {id:"Slip gaji sudah bisa diunduh.", en:"Payslip is ready to download.", es:"La boleta ya se puede descargar.", pt:"O contracheque já pode ser baixado.", hi:"सैलरी स्लिप डाउनलोड कर सकते हो।"},
  temankantor: {id:"Mau ikut lunch nanti?", en:"Joining lunch later?", es:"¿Vas al almuerzo?", pt:"Vai almoçar com a gente?", hi:"लंच में चलोगे?"},
  grupkantor: {id:"Meeting 10 pindah ke ruang 3.", en:"10am meeting moved to room 3.", es:"Reunión de 10 movida a sala 3.", pt:"Reunião das 10 mudou p/ sala 3.", hi:"10 बजे की मीटिंग रूम 3 में।"},
  bendahara: {id:"Reimburse-ku sudah masuk?", en:"Has my reimbursement arrived?", es:"¿Llegó mi reembolso?", pt:"Chegou meu reembolso?", hi:"मेरा रिइंबर्समेंट आया?"},
  anak:  {id:"Mi, nanti diambil jam 4 ya.", en:"Mom, pick me up at 4.", es:"Mamá, recógeme a las 4.", pt:"Mãe, me busca às 4.", hi:"माँ, 4 बजे लेना।"},
  walikelas: {id:"Study tour pembayaran sampai Jumat.", en:"Study tour payment due Friday.", es:"Pago del viaje vence el viernes.", pt:"Pagamento da excursão até sexta.", hi:"स्टडी टूर पेमेंट शुक्रवार तक।"},
  gruportu: {id:"Bu Guru: cek announcement ya bu.", en:"Teacher: check the announcement.", es:"Profesora: mira el anuncio.", pt:"Professora: veja o anúncio.", hi:"टीचर: घोषणा देखें।"},
  arisan: {id:"Arisan bulan ini di rumah Bu Nani.", en:"This month's club is at Mrs. Nani's.", es:"Este mes en casa de la Sra. Nani.", pt:"Este mês na casa da Sra. Nani.", hi:"इस महीने नानी आंटी के घर।"},
  temen: {id:"Bro, nonton bareng Sabtu?", en:"Bro, movie Saturday?", es:"Bro, ¿película el sábado?", pt:"Bro, filme sábado?", hi:"यार, शनिवार मूवी?"},
  bank:  {id:"Transaksi berhasil. Saldo Rp••••.", en:"Transaction successful. Balance Rp••••.", es:"Transacción exitosa.", pt:"Transação concluída.", hi:"लेन-देन सफल।"},
  gruprt: {id:"Pak RT: kerja bakti Minggu pagi.", en:"Cleanup Sunday morning.", es:"Limpieza el domingo.", pt:"Mutirão domingo.", hi:"रविवार सुबह सफाई।"},
  keluarga: {id:"Minggu reuni di rumah Om Sam.", en:"Sunday reunion at Uncle Sam's.", es:"Domingo reunión en casa del tío Sam.", pt:"Domingo reunião na casa do tio Sam.", hi:"रविवार अंकल सैम के घर।"},
};
function chatPreviewFor(cid) { return L(CHAT_PREVIEWS[cid] || "👍"); }

/* ---------- day-based attack builder (multilingual) ---------- */
function buildAttack(profile, day, seed) {
  const A = {
    student: {
      phishing: { app: "chatloop", scenario: "wa_scholarship",
        from: {id:"Panitia Beasiswa Cendekia", en:"Cendekia Scholarship Committee", es:"Comité de Becas Cendekia", pt:"Comitê de Bolsas Cendekia", hi:"सेंदेकिया छात्रवृत्ति समिति"},
        notifText: {id:"Selamat! Kamu lolos tahap akhir beasiswa Cendekia. Klaim sebelum jam 3 sore…", en:"Congratulations! You made the final round of the Cendekia scholarship. Claim before 3pm…", es:"¡Felicidades! Pasaste a la final de la beca Cendekia. Reclama antes de las 3pm…", pt:"Parabéns! Você passou pra final da bolsa Cendekia. Resgate até 15h…", hi:"बधाई हो! आप सेंदेकिया छात्रवृत्ति के फाइनल में पहुँचे। दोपहर 3 बजे से पहले क्लेम करें…"} },
      account: { app: "mailbox", scenario: "mail_hr_slip",
        from: {id:"Tim Keamanan CampusHub", en:"CampusHub Security Team", es:"Equipo de Seguridad CampusHub", pt:"Equipe de Segurança CampusHub", hi:"CampusHub सुरक्षा टीम"},
        notifText: {id:"Aktivitas login mencurigakan terdeteksi. Verifikasi akunmu sekarang…", en:"Suspicious login activity detected. Verify your account now…", es:"Actividad sospechosa detectada. Verifica tu cuenta…", pt:"Atividade suspeita detectada. Verifique sua conta…", hi:"संदिग्ध लॉगिन गतिविधि मिली। अब खाता सत्यापित करें…"} },
      consequences: { app: "socialsquare", scenario: "social_overshare",
        from: {id:"Tim Verifikasi SocialSquare", en:"SocialSquare Verification Team", es:"Equipo de Verificación SocialSquare", pt:"Equipe de Verificação SocialSquare", hi:"SocialSquare सत्यापन टीम"},
        notifText: {id:"Akun kamu dilaporkan impersonation. Kirim data verifikasi 1x24 jam…", en:"Your account was reported for impersonation. Send verification data within 24h…", es:"Tu cuenta fue reportada por suplantación. Envía verificación en 24h…", pt:"Sua conta foi denunciada por fraude. Envie verificação em 24h…", hi:"आपका खाता धोखाधड़ी के लिए रिपोर्ट हुआ। 24 घंटे में सत्यापन भेजें…"} },
      recovery: { app: "chatloop", scenario: "report_fake_support",
        from: {id:"Tim Bantuan Pengaduan", en:"Complaint Help Team", es:"Equipo de Ayuda", pt:"Equipe de Ajuda", hi:"शिकायत सहायता टीम"},
        notifText: {id:"Kami bantu blokir dana yang hilang. Jangan lapor dulu, biar kami proses…", en:"We'll help block the lost funds. Don't report yet, let us process…", es:"Te ayudamos a bloquear el dinero. No denuncies aún…", pt:"Ajudamos a bloquear o dinheiro. Não denuncie ainda…", hi:"हम खोया पैसा ब्लॉक करने में मदद करेंगे। अभी रिपोर्ट मत करो…"} },
    },
    merchant: {
      phishing: { app: "chatloop", scenario: "wa_qris_refund",
        from: {id:"Pembeli Shopee", en:"Shopee Buyer", es:"Comprador de Shopee", pt:"Comprador da Shopee", hi:"शॉपी खरीदार"},
        notifText: {id:"Kak, refund QRIS pesanan kemarin gagal. Scan ini biar dana balik…", en:"Hi, yesterday's QRIS refund failed. Scan this so the money returns…", es:"Hola, el reembolso QR falló. Escanea esto para recuperar el dinero…", pt:"Oi, o reembolso QR de ontem falhou. Escaneia isso pra receber…", hi:"रिफंड विफल रहा। पैसा वापस पाने के लिए यह स्कैन करें…"} },
      account: { app: "dailymart", scenario: "mail_hr_slip",
        from: {id:"DailyMart Security", en:"DailyMart Security", es:"Seguridad DailyMart", pt:"Segurança DailyMart", hi:"DailyMart सुरक्षा"},
        notifText: {id:"Tokomu terindikasi penipuan. Verifikasi identitas 1x12 jam…", en:"Your shop is flagged for fraud. Verify identity within 12h…", es:"Tu tienda fue marcada por fraude. Verifica en 12h…", pt:"Sua loja foi marcada por fraude. Verifique em 12h…", hi:"आपकी दुकान धोखाधड़ी में चिन्हित। 12 घंटे में सत्यापित करें…"} },
      consequences: { app: "pocketpay", scenario: "wa_cs_otp",
        from: {id:"PocketPay Support", en:"PocketPay Support", es:"Soporte PocketPay", pt:"Suporte PocketPay", hi:"PocketPay सपोर्ट"},
        notifText: {id:"Saldo kamu dibekukan karena pelanggaran. Buka tiket sekarang…", en:"Your balance is frozen due to a violation. Open a ticket now…", es:"Tu saldo está congelado por infracción. Abre un ticket…", pt:"Seu saldo está congelado por violação. Abra um ticket…", hi:"उल्लंघन के कारण आपका बैलेंस फ्रीज़ है। अभी टिकट खोलें…"} },
      recovery: { app: "chatloop", scenario: "report_fake_support",
        from: {id:"Tim Bantuan Pengaduan", en:"Complaint Help Team", es:"Equipo de Ayuda", pt:"Equipe de Ajuda", hi:"शिकायत सहायता टीम"},
        notifText: {id:"Dana penipuan bisa kami tahan. Jangan lapor dulu, biar kami proses…", en:"We can hold the fraud funds. Don't report yet, let us process…", es:"Podemos retener el dinero. No denuncies aún…", pt:"Podemos reter o dinheiro. Não denuncie ainda…", hi:"हम धोखाधड़ी का पैसा रोक सकते हैं। अभी रिपोर्ट मत करो…"} },
    },
    worker: {
      phishing: { app: "mailbox", scenario: "mail_hr_slip",
        from: {id:"HRD Perusahaan", en:"Company HR", es:"RRHH", pt:"RH da Empresa", hi:"कंपनी HR"},
        notifText: {id:"Slip gaji bulan ini: konfirmasi data rekening via link…", en:"This month's payslip: confirm your account data via link…", es:"Boleta de pago: confirma tu cuenta vía enlace…", pt:"Contracheque: confirme seus dados via link…", hi:"सैलरी स्लिप: लिंक से खाता जानकारी कन्फर्म करें…"} },
      account: { app: "workdesk", scenario: "cred_password_reuse",
        from: {id:"IT Support", en:"IT Support", es:"Soporte IT", pt:"Suporte de TI", hi:"IT सपोर्ट"},
        notifText: {id:"Password kadaluarsa, reset segera via portal…", en:"Password expired, reset now via portal…", es:"Contraseña vencida, restablece ya…", pt:"Senha expirada, redefina já…", hi:"पासवर्ड एक्सपायर्ड, अभी रीसेट करें…"} },
      consequences: { app: "mailbox", scenario: "cred_password_reuse",
        from: {id:"Tim Keamanan Perusahaan", en:"Company Security Team", es:"Equipo de Seguridad", pt:"Equipe de Segurança", hi:"कंपनी सुरक्षा टीम"},
        notifText: {id:"Akun email kamu dikirim spam massal. Ganti password sekarang…", en:"Your email sent mass spam. Change your password now…", es:"Tu correo envió spam masivo. Cambia la contraseña…", pt:"Seu e-mail enviou spam em massa. Troque a senha…", hi:"आपके ईमेल से मास स्पैम गया। अभी पासवर्ड बदलें…"} },
      recovery: { app: "chatloop", scenario: "report_fake_support",
        from: {id:"Tim Bantuan Pengaduan", en:"Complaint Help Team", es:"Equipo de Ayuda", pt:"Equipe de Ajuda", hi:"शिकायत सहायता टीम"},
        notifText: {id:"Kami dari tim bantuan korban penipuan. Data diperlukan untuk blokir…", en:"We're the fraud-victim help team. Data needed to block…", es:"Somos el equipo de ayuda anti-fraude. Necesitamos datos…", pt:"Somos a equipe antifraude. Precisamos de dados…", hi:"हम धोखाधड़ी पीड़ित सहायता टीम हैं। ब्लॉक करने के लिए डेटा चाहिए…"} },
    },
    parent: {
      phishing: { app: "chatloop", scenario: "wa_spp_sekolah",
        from: {id:"Admin Sekolah", en:"School Admin", es:"Administración escolar", pt:"Administração escolar", hi:"स्कूल एडमिन"},
        notifText: {id:"Tagihan SPP semester baru, transfer ke rekening baru…", en:"New semester tuition, transfer to the new account…", es:"Colegiatura del semestre, transfiere a la cuenta nueva…", pt:"Mensalidade do semestre, transfira pra nova conta…", hi:"नए सेमेस्टर की फीस, नए खाते में भेजें…"} },
      account: { app: "messagebox", scenario: "wa_cs_otp",
        from: {id:"Bank Nusantara", en:"Nusantara Bank", es:"Banco Nusantara", pt:"Banco Nusantara", hi:"नुसंतारा बैंक"},
        notifText: {id:"Kartu kamu diblokir, verifikasi via link…", en:"Your card is blocked, verify via link…", es:"Tu tarjeta está bloqueada, verifica vía enlace…", pt:"Seu cartão está bloqueado, verifique via link…", hi:"आपका कार्ड ब्लॉक है, लिंक से सत्यापित करें…"} },
      consequences: { app: "pocketpay", scenario: "wa_cs_otp",
        from: {id:"PocketPay", en:"PocketPay", es:"PocketPay", pt:"PocketPay", hi:"PocketPay"},
        notifText: {id:"Transaksi tak dikenal Rp2.300.000…", en:"Unrecognized transaction Rp2,300,000…", es:"Transacción desconocida Rp2.300.000…", pt:"Transação desconhecida Rp2.300.000…", hi:"अज्ञात लेन-देन Rp2,300,000…"} },
      recovery: { app: "chatloop", scenario: "report_fake_support",
        from: {id:"Tim Bantuan Pengaduan", en:"Complaint Help Team", es:"Equipo de Ayuda", pt:"Equipe de Ajuda", hi:"शिकायत सहायता टीम"},
        notifText: {id:"Dana SPP yang salah transfer bisa kami tarik. Jangan lapor dulu…", en:"We can pull back the misdirected tuition. Don't report yet…", es:"Podemos recuperar la colegiatura. No denuncies aún…", pt:"Podemos recuperar a mensalidade. Não denuncie ainda…", hi:"गलत भेजी फीस वापस मिल सकती है। अभी रिपोर्ट मत करो…"} },
    },
    general: {
      phishing: { app: "messagebox", scenario: "sms_kuota_hadiah",
        from: {id:"Kurir Paket", en:"Package Courier", es:"Mensajería", pt:"Entregadora", hi:"कूरियर"},
        notifText: {id:"Paketmu tertahan, bayar bea Rp15.000 di link…", en:"Your package is held, pay Rp15,000 fee via link…", es:"Tu paquete está retenido, paga Rp15.000 via enlace…", pt:"Sua encomenda está retida, pague Rp15.000 via link…", hi:"आपका पार्सल रुका है, लिंक से Rp15,000 शुल्क दें…"} },
      account: { app: "socialsquare", scenario: "cred_password_reuse",
        from: {id:"SocialSquare Security", en:"SocialSquare Security", es:"Seguridad SocialSquare", pt:"Segurança SocialSquare", hi:"SocialSquare सुरक्षा"},
        notifText: {id:"Login dari perangkat tak dikenal…", en:"Login from an unknown device…", es:"Inicio de sesión desde un dispositivo desconocido…", pt:"Login de um dispositivo desconhecido…", hi:"अनजान डिवाइस से लॉगिन…"} },
      consequences: { app: "pocketpay", scenario: "wa_prize_link",
        from: {id:"PocketPay", en:"PocketPay", es:"PocketPay", pt:"PocketPay", hi:"PocketPay"},
        notifText: {id:"Saldo berkurang untuk transaksi tak dikenal…", en:"Balance reduced by unknown transaction…", es:"Saldo reducido por transacción desconocida…", pt:"Saldo reduzido por transação desconhecida…", hi:"अज्ञात लेन-देन से बैलेंस घटा…"} },
      recovery: { app: "chatloop", scenario: "report_fake_support",
        from: {id:"Tim Bantuan Pengaduan", en:"Complaint Help Team", es:"Equipo de Ayuda", pt:"Equipe de Ajuda", hi:"शिकायत सहायता टीम"},
        notifText: {id:"Korban penipuan? Kami bantu cairkan dana kembali…", en:"Fraud victim? We help recover your funds…", es:"¿Víctima de fraude? Te ayudamos a recuperar…", pt:"Vítima de fraude? Ajudamos a recuperar…", hi:"धोखाधड़ी का शिकार? हम पैसा वापस दिलाएंगे…"} },
    },
  };
  const t = (A[profile.archetype] || A.general);
  let ev = null;
  if (day === 2) ev = t.phishing;
  else if (day === 3) ev = t.account;
  else if (day === 4) ev = t.consequences;
  else if (day === 5) ev = t.recovery;
  if (!ev) return null;
  return { id: "atk" + day, seed, app: ev.app, scenario: ev.scenario,
           from: L(ev.from), notifText: L(ev.notifText), _fromRaw: ev.from, _notifRaw: ev.notifText };
}

/* ---------- build a world from profile ---------- */
function buildWorld(profile, day = 1) {
  const tpl = WORLD_TEMPLATES[profile.archetype] || WORLD_TEMPLATES.general;
  const seed = strSeed(profile.id + "|" + profile.archetype + "|" + LANG);
  const contacts = tpl.contacts.map(c => ({ ...c, name: L(c.name), rel: L(c.rel) }));

  /* AI-generated cast override (persona-adaptive NPCs from /api/story-context) */
  const cast = profile.cast;
  if (cast && Array.isArray(cast.npcs)) {
    const byRole = {};
    cast.npcs.forEach(n => { byRole[n.role] = n; });
    const cls = byRole.classmate, fr = byRole.best_friend, tch = byRole.homeroom_teacher;
    // class group contact → AI name + school
    const kelas = contacts.find(c => c.id === "kelas");
    if (kelas && cast.class_group) {
      contacts.forEach(c => { if (c.id === "kelas") { c.name = cast.class_group; c.rel = cast.school || c.rel; } });
    }
    // friend/teacher/parent/sibling by role mapping (id match if template has it)
    const mapRole = { "teman": "best_friend", "sahabat": "best_friend", "bimo": "best_friend",
                      "walikelas": "homeroom_teacher", "ibu": "parent", "adik": "sibling",
                      "guru": "homeroom_teacher", "ortu": "parent",
                      "dosen": "homeroom_teacher", "supir": "parent" };
    contacts.forEach(c => {
      const role = mapRole[c.id];
      if (role && byRole[role]) {
        c.name = byRole[role].name;
        if (byRole[role].avatar) c.avatar = byRole[role].avatar;
      }
    });
    // also fill any generic "Teman"/"Ibu"/"Bimo" named contacts
    contacts.forEach(c => {
      if (/^(Bimo|Teman|Ibu kandung|Adik|Bu Guru)/i.test(c.name) === false) return;
      const role = c.id === "kelas" ? null : (mapRole[c.id] || (c.avatar === "👩" ? "parent" : null));
      if (role && byRole[role]) c.name = byRole[role].name;
    });
  }

  const apps = tpl.apps.map(id => ({ ...APP_CATALOG[id] }));

  const attack = buildAttack(profile, day, seed);
  apps.find(a => a.id === "journal").badge = day;

  const notifs = tpl.normalNotifs.map(n => ({ ...n, id: nid(), read: false, from: L(n.from), text: L(n.text) }));
  INAPP.sms.forEach(s => notifs.push({ id: nid(), app: "messagebox", from: L(s.from), text: L(s.text), read: false }));
  if (attack && day >= 2) {
    notifs.unshift({ id: nid(), app: attack.app, from: attack.from, text: attack.notifText, attack: true, read: false });
  }

  return {
    profile, day,
    apps, contacts, notifs,
    attack: attack || null,
    wallpaper: tpl.wallpaper,
    phoneTime: "08:47",
    battery: 78,
  };
}

let _nid = 0;
function nid() { return "n" + (++_nid); }
function strSeed(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* ---------- in-app content (SMS list, settings, security) multilingual ---------- */
const INAPP = {
  sms: [
    { from: {id:"PocketPay",en:"PocketPay"}, text: {id:"Top-up Rp100.000 berhasil. Saldo Rp384.210.", en:"Top-up Rp100,000 successful. Balance Rp384,210."}, time: {id:"08:12",en:"08:12"} },
    { from: {id:"DailyMart",en:"DailyMart"}, text: {id:"Pesanan #DM-2214 diambil kurir. Sampai besok.", en:"Order #DM-2214 picked up. Arriving tomorrow."}, time: {id:"Kemarin",en:"Yesterday"} },
    { from: {id:"Kurir Andi",en:"Andi (Courier)",es:"Andi (Mensajero)",pt:"Andi (Entregador)",hi:"आंदी (कूरियर)"}, text: {id:"Paket #PRJ-88 dititip di pos ronda.", en:"Package #PRJ-88 left at the guard post.", es:"Paquete #PRJ-88 en el puesto de guardia.", pt:"Encomenda #PRJ-88 na portaria.", hi:"पार्सल #PRJ-88 गार्ड पोस्ट पर।"}, time: {id:"07:58",en:"07:58"} },
    { from: {id:"Bank Nusantara",en:"Nusantara Bank",es:"Banco Nusantara",pt:"Banco Nusantara",hi:"नुसंतारा बैंक"}, text: {id:"Transaksi Rp50.000 berhasil. Saldo Rp1.2••••.", en:"Transaction Rp50,000 successful. Balance Rp1.2••••.", es:"Transacción Rp50.000 exitosa.", pt:"Transação Rp50.000 concluída.", hi:"लेन-देन Rp50,000 सफल।"}, time: {id:"Kemarin",en:"Yesterday"} },
  ],
  perms: [
    { app: {id:"SenterPro",en:"TorchPro"}, icon: "🔦", perms: {id:"SMS · Kontak · Mikrofon", en:"SMS · Contacts · Microphone"}, bad: true },
    { app: {id:"SocialSquare",en:"SocialSquare"}, icon: "📸", perms: {id:"Kamera · Lokasi", en:"Camera · Location"}, bad: false },
    { app: {id:"PocketPay",en:"PocketPay"}, icon: "👛", perms: {id:"Kamera (scan QR)", en:"Camera (QR scan)"}, bad: false },
    { app: {id:"SafeBrowse",en:"SafeBrowse"}, icon: "🌐", perms: {id:"Lokasi (opsional)", en:"Location (optional)"}, bad: true },
  ],
  settings: [
    { icon: "📶", label: {id:"Jaringan & WiFi", en:"Network & WiFi"}, value: {id:"RumahKita_5G", en:"HomeNet_5G"} },
    { icon: "🔔", label: {id:"Notifikasi", en:"Notifications"}, value: "42" },
    { icon: "🔐", label: {id:"Kunci layar", en:"Screen lock"}, value: {id:"PIN 6 digit", en:"6-digit PIN"} },
    { icon: "👤", label: {id:"Akun", en:"Accounts"}, value: "1" },
    { icon: "🧩", label: {id:"Aplikasi", en:"Apps"}, value: "10" },
  ],
};

if (typeof module !== "undefined") module.exports = { APP_CATALOG, WORLD_TEMPLATES, STORY_DAYS, buildWorld, L, chatPreviewFor, INAPP };
