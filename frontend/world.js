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
      { id: "ibu",   avatar: "👩", color: "#FDA4AF", rel: {id:"Ibu kandung", en:"Mom", es:"Madre", pt:"Mãe", hi:"माँ", fr:"Maman", it:"Mamma", de:"Mama"} , name: {id:"Ibu", en:"Mom", es:"Mamá", pt:"Mãe", hi:"माँ", fr:"Maman", it:"Mamma", de:"Mama"} },
      { id: "bimo",  avatar: "🧑‍🎤", color: "#93C5FD", rel: {id:"Sahabat SMA", en:"High-school best friend", es:"Mejor amigo del colegio", pt:"Melhor amigo do colégio", hi:"स्कूल का दोस्त", fr:"Meilleur ami du lycée", it:"Migliore amico del liceo", de:"Beste Freund/in aus der Schule"}, name: {id:"Bimo", en:"Bimo", es:"Bimo", pt:"Bimo", hi:"बिमो", fr:"Bimo", it:"Bimo", de:"Bimo"} },
      { id: "dosen", avatar: "👨‍🏫", color: "#FCD34D", rel: {id:"Dosen PA", en:"Academic advisor", es:"Tutor académico", pt:"Orientador acadêmico", hi:"प्रोफेसर", fr:"Conseiller académique", it:"Consulente accademico", de:"Akademische Beratung"}, name: {id:"Pak Hendra", en:"Mr. Hendra", es:"Sr. Hendra", pt:"Sr. Hendra", hi:"हेंद्रा सर", fr:"M. Hendra", it:"Sig. Hendra", de:"Hr. Hendra"} },
      { id: "kelas", avatar: "👥", color: "#86EFAC", rel: {id:"Grup kelas", en:"Class group", es:"Grupo de clase", pt:"Grupo da turma", hi:"कक्षा ग्रुप", fr:"Groupe de classe", it:"Gruppo di classe", de:"Klassengruppe"}, name: {id:"Kelas 4KA-07", en:"Class 4KA-07", es:"Clase 4KA-07", pt:"Turma 4KA-07", hi:"कक्षा 4KA-07", fr:"Classe 4KA-07", it:"Classe 4KA-07", de:"Klasse 4KA-07"} },
      { id: "kos",   avatar: "🏠", color: "#C4B5FD", rel: {id:"Ibu kos", en:"Landlady", es:"Casera", pt:"Senhoria", hi:"किराएदार मालकिन", fr:"Propriétaire", it:"Padrona di casa", de:"Vermieterin"}, name: {id:"Bu Ratmi (Kosan)", en:"Mrs. Ratmi (Dorm)", es:"Sra. Ratmi (Pensión)", pt:"Sra. Ratmi (República)", hi:"रत्मी आंटी (हॉस्टल)", fr:"Mme Ratmi (dortoir)", it:"Sig.ra Ratmi (dormitorio)", de:"Fr. Ratmi (Wohnheim)"} },
    ],
    normalNotifs: [
      { app: "chatloop", from: {id:"Kelas 4KA-07",en:"Class 4KA-07",es:"Clase 4KA-07",pt:"Turma 4KA-07",hi:"कक्षा 4KA-07", fr:"Classe 4KA-07", it:"Classe 4KA-07", de:"Klasse 4KA-07"}, text: {id:"Bimo: udah pada isi absen kewarganegaraan belum?", en:"Bimo: has everyone filled the attendance form?", es:"Bimo: ¿todos llenaron la lista de asistencia?", pt:"Bimo: todo mundo preencheu a chamada?", hi:"बिमो: सबने उपस्थिति भरी?", fr:"Bimo : tout le monde a rempli la feuille de présence ?", it:"Bimo: avete tutti compilato il foglio presenza?", de:"Bimo: Haben alle den Anwesenheitszettel ausgefüllt?"} },
      { app: "campushub", from: {id:"CampusHub",en:"CampusHub",es:"CampusHub",pt:"CampusHub",hi:"CampusHub", fr:"CampusHub", it:"CampusHub", de:"CampusHub"}, text: {id:"Jadwal UAS semester ini sudah rilis. Cek akademik.", en:"This semester's final exam schedule is out. Check the portal.", es:"El horario de exámenes finales ya está publicado.", pt:"O cronograma de provas finais saiu. Veja no portal.", hi:"फाइनल परीक्षा की टाइम-टेबल आ गई है।", fr:"Le calendrier des examens finaux du semestre est sorti. Vérifie le portail.", it:"Il calendario degli esami finali del semestre è online. Controlla il portale.", de:"Der Prüfungsplan dieses Semesters ist da. Sieh im Portal nach."} },
      { app: "chatloop", from: {id:"Bu Ratmi (Kosan)",en:"Mrs. Ratmi (Dorm)",es:"Sra. Ratmi (Pensión)",pt:"Sra. Ratmi (República)",hi:"रत्मी आंटी", fr:"Mme Ratmi (dortoir)", it:"Sig.ra Ratmi (dormitorio)", de:"Fr. Ratmi (Wohnheim)"}, text: {id:"Dek, besok ada acara kerja bakti ya, jam 7 pagi.", en:"Dear, there's a community cleanup tomorrow at 7am.", es:"Querido, mañana hay limpieza comunitaria a las 7am.", pt:"Querido, amanhã tem mutirão de limpeza às 7h.", hi:"कल सुबह 7 बजे सफाई कार्यक्रम है।", fr:"Chéri, il y a un nettoyage de quartier demain à 7h.", it:"Cara, domani alle 7 c'è la pulizia del quartiere.", de:"Schatz, morgen um 7 Uhr ist Nachbarschaftsputz."} },
      { app: "socialsquare", from: {id:"SocialSquare",en:"SocialSquare",es:"SocialSquare",pt:"SocialSquare",hi:"SocialSquare", fr:"SocialSquare", it:"SocialSquare", de:"SocialSquare"}, text: {id:"bimo_stylo dan 3 lainnya menandai kamu dalam foto.", en:"bimo_stylo and 3 others tagged you in a photo.", es:"bimo_stylo y 3 más te etiquetaron en una foto.", pt:"bimo_stylo e mais 3 marcaram você numa foto.", hi:"bimo_stylo और 3 और लोगों ने आपको फोटो में टैग किया।", fr:"bimo_stylo et 3 autres t'ont identifié sur une photo.", it:"bimo_stylo e altri 3 ti hanno taggato in una foto.", de:"bimo_stylo und 3 andere haben dich auf einem Foto markiert."} },
      { app: "pocketpay", from: {id:"PocketPay",en:"PocketPay",es:"PocketPay",pt:"PocketPay",hi:"PocketPay", fr:"PocketPay", it:"PocketPay", de:"PocketPay"}, text: {id:"Cashback Rp8.000 dari transaksi kopi kemarin sudah masuk.", en:"Rp8,000 cashback from yesterday's coffee has arrived.", es:"El cashback de Rp8.000 del café de ayer ya llegó.", pt:"O cashback de Rp8.000 do café de ontem chegou.", hi:"कल की कॉफी का कैशबैक आ गया है।", fr:"Le cashback de 8 000 Rp du café d'hier est arrivé.", it:"Il cashback di Rp8.000 del caffè di ieri è arrivato.", de:"Das Cashback von 8.000 Rp für den Kaffee von gestern ist da."} },
    ],
  },
  merchant: {
    archetype: "merchant",
    wallpaper: "linear-gradient(160deg, #1F2937, #7C2D12)",
    apps: ["chatloop", "messagebox", "mailbox", "safebrowse", "dailymart", "pocketpay", "workdesk", "settings", "security", "journal"],
    contacts: [
      { id: "supplier", avatar: "🧔", color: "#FDBA74", rel: {id:"Supplier dagang", en:"Goods supplier", es:"Proveedor", pt:"Fornecedor", hi:"सप्लायर", fr:"Fournisseur", it:"Fornitore", de:"Warenlieferant"}, name: {id:"Pak Jaya Supplier", en:"Mr. Jaya (Supplier)", es:"Sr. Jaya (Proveedor)", pt:"Sr. Jaya (Fornecedor)", hi:"जया (सप्लायर)", fr:"M. Jaya (fournisseur)", it:"Sig. Jaya (fornitore)", de:"Hr. Jaya (Lieferant)"} },
      { id: "pelanggan", avatar: "👩", color: "#F9A8D4", rel: {id:"Pelanggan langganan", en:"Regular customer", es:"Clienta frecuente", pt:"Cliente fiel", hi:"नियमित ग्राहक", fr:"Cliente fidèle", it:"Cliente abituale", de:"Stammkunde"}, name: {id:"Mbak Sari (Pelanggan)", en:"Mrs. Sari (Customer)", es:"Sra. Sari (Cliente)", pt:"Sra. Sari (Cliente)", hi:"सारी (ग्राहक)", fr:"Mme Sari (cliente)", it:"Sig.ra Sari (cliente)", de:"Fr. Sari (Kundin)"} },
      { id: "kurir", avatar: "🛵", color: "#7DD3FC", rel: {id:"Kurir langganan", en:"Regular courier", es:"Mensajero habitual", pt:"Entregador habitual", hi:"नियमित कूरियर", fr:"Coursier habituel", it:"Corriere abituale", de:"Üblicher Kurier"}, name: {id:"Kurir Andi", en:"Andi (Courier)", es:"Andi (Mensajero)", pt:"Andi (Entregador)", hi:"आंदी (कूरियर)", fr:"Andi (coursier)", it:"Andi (corriere)", de:"Andi (Kurier)"} },
      { id: "grupdagang", avatar: "👥", color: "#BEF264", rel: {id:"Grup bisnis", en:"Business group", es:"Grupo de negocio", pt:"Grupo de negócios", hi:"व्यापार ग्रुप", fr:"Groupe pro", it:"Gruppo di lavoro", de:"Geschäftsgruppe"}, name: {id:"Grup Kulakan Rakyat", en:"Wholesale Buyers Group", es:"Grupo de Compras al Mayor", pt:"Grupo de Compra Atacado", hi:"थोक खरीद ग्रुप", fr:"Groupe d'acheteurs en gros", it:"Gruppo acquirenti all'ingrosso", de:"Großkäufer-Gruppe"} },
      { id: "suami", avatar: "👨", color: "#A5B4FC", rel: {id:"Suami", en:"Husband", es:"Esposo", pt:"Marido", hi:"पति", fr:"Mari", it:"Marito", de:"Ehemann"}, name: {id:"Bang Don", en:"Don", es:"Don", pt:"Don", hi:"डॉन", fr:"Don", it:"Don", de:"Don"} },
    ],
    normalNotifs: [
      { app: "dailymart", from: {id:"DailyMart",en:"DailyMart", fr:"DailyMart", it:"DailyMart", de:"DailyMart"}, text: {id:"Pesanan #DM-2214 sudah diambil kurir. Estimasi sampai besok.", en:"Order #DM-2214 picked up by courier. Arriving tomorrow.", es:"El pedido #DM-2214 fue recogido. Llega mañana.", pt:"Pedido #DM-2214 coletado. Chega amanhã.", hi:"ऑर्डर #DM-2214 कूरियर ने ले लिया। कल पहुँचेगा।", fr:"Commande #DM-2214 prise par le coursier. Arrive demain.", it:"Ordine #DM-2214 ritirato dal corriere. Arriva domani.", de:"Bestellung #DM-2214 vom Kurier abgeholt. Kommt morgen."} },
      { app: "chatloop", from: {id:"Mbak Sari (Pelanggan)",en:"Mrs. Sari (Customer)", fr:"Mme Sari (cliente)", it:"Sig.ra Sari (cliente)", de:"Fr. Sari (Kundin)"}, text: {id:"Mbak, stok yang kemarin ada lagi gak? Mau repeat order.", en:"Is last week's item back in stock? I want to reorder.", es:"¿Volvió el producto de la semana pasada? Quiero repetir.", pt:"Voltou o produto da semana passada? Quero repetir.", hi:"पिछले हफ्ते का प्रोडक्ट वापस आया? दोबारा ऑर्डर करना है।", fr:"L'article de la semaine dernière est de retour en stock ? Je veux recommander.", it:"L'articolo della settimana scorsa è di nuovo disponibile? Voglio riordinarlo.", de:"Ist die Ware von letzter Woche wieder da? Ich will nachbestellen."} },
      { app: "pocketpay", from: {id:"PocketPay",en:"PocketPay", fr:"PocketPay", it:"PocketPay", de:"PocketPay"}, text: {id:"Pembayaran QR Rp75.000 diterima dari pembeli.", en:"QR payment Rp75,000 received from buyer.", es:"Pago QR de Rp75.000 recibido.", pt:"Pagamento QR de Rp75.000 recebido.", hi:"QR पेमेंट Rp75,000 प्राप्त हुई।", fr:"Paiement QR de 75 000 Rp reçu de l'acheteur.", it:"Pagamento QR di Rp75.000 ricevuto dall'acquirente.", de:"QR-Zahlung von 75.000 Rp vom Käufer erhalten."} },
      { app: "chatloop", from: {id:"Grup Kulakan Rakyat",en:"Wholesale Buyers Group", fr:"Groupe d'acheteurs en gros", it:"Gruppo acquirenti all'ingrosso", de:"Großkäufer-Gruppe"}, text: {id:"Pak Jaya: stok baru datang besok subuh, siap-siap.", en:"Mr. Jaya: new stock arrives at dawn, get ready.", es:"Sr. Jaya: stock nuevo llega al amanecer.", pt:"Sr. Jaya: estoque novo chega de madrugada.", hi:"जया: नया स्टॉक सुबह आता है।", fr:"M. Jaya : le nouveau stock arrive à l'aube, prépare-toi.", it:"Sig. Jaya: la nuova merce arriva all'alba, preparati.", de:"Hr. Jaya: Neue Ware kommt im Morgengrauen, mach dich bereit."} },
      { app: "mailbox", from: {id:"DailyMart",en:"DailyMart", fr:"DailyMart", it:"DailyMart", de:"DailyMart"}, text: {id:"Tips meningkatkan rating tokomu bulan ini.", en:"Tips to boost your shop rating this month.", es:"Consejos para subir tu calificación este mes.", pt:"Dicas para subir sua nota este mês.", hi:"इस महीने दुकान रेटिंग बढ़ाने के टिप्स।", fr:"Astuces pour booster la note de ta boutique ce mois-ci.", it:"Consigli per alzare la valutazione del tuo negozio questo mese.", de:"Tipps, um die Bewertung deines Shops diesen Monat zu steigern."} },
    ],
  },
  worker: {
    archetype: "worker",
    wallpaper: "linear-gradient(160deg, #0F172A, #1E3A8A)",
    apps: ["chatloop", "messagebox", "mailbox", "safebrowse", "workdesk", "pocketpay", "socialsquare", "settings", "security", "journal"],
    contacts: [
      { id: "boss", avatar: "👩‍💼", color: "#FDA4AF", rel: {id:"Atasan", en:"Manager", es:"Jefa", pt:"Chefe", hi:"बॉस", fr:"Manager", it:"Manager", de:"Chef"}, name: {id:"Bu Ratna (Manager)", en:"Mrs. Ratna (Manager)", es:"Sra. Ratna (Gerente)", pt:"Sra. Ratna (Gerente)", hi:"रत्ना मैनेजर", fr:"Mme Ratna (manager)", it:"Sig.ra Ratna (manager)", de:"Fr. Ratna (Chefin)"} },
      { id: "hrd", avatar: "🏢", color: "#93C5FD", rel: {id:"HRD", en:"HR", es:"RRHH", pt:"RH", hi:"HR", fr:"RH", it:"HR", de:"Personal"}, name: {id:"HRD Perusahaan", en:"Company HR", es:"RRHH", pt:"RH da Empresa", hi:"कंपनी HR", fr:"RH de l'entreprise", it:"HR aziendale", de:"Firmen-Personalabteilung"} },
      { id: "temankantor", avatar: "🧑", color: "#FCD34D", rel: {id:"Teman kerja", en:"Coworker", es:"Compañero", pt:"Colega", hi:"सहकर्मी", fr:"Collègue", it:"Collega", de:"Kollege"}, name: {id:"Dimas (Kantor)", en:"Dimas (Work)", es:"Dimas (Trabajo)", pt:"Dimas (Trabalho)", hi:"दिमास (ऑफिस)", fr:"Dimas (travail)", it:"Dimas (lavoro)", de:"Dimas (Arbeit)"} },
      { id: "grupkantor", avatar: "👥", color: "#86EFAC", rel: {id:"Grup kerja", en:"Work group", es:"Grupo de trabajo", pt:"Grupo de trabalho", hi:"वर्क ग्रुप", fr:"Groupe de travail", it:"Gruppo di lavoro", de:"Arbeitsgruppe"}, name: {id:"Tim Project Q4", en:"Q4 Project Team", es:"Equipo Q4", pt:"Equipe Q4", hi:"Q4 टीम", fr:"Q4 Project Team", it:"Q4 Project Team", de:"Q4 Project Team"} },
      { id: "bendahara", avatar: "🧑‍💼", color: "#C4B5FD", rel: {id:"Finance", en:"Finance", es:"Finanzas", pt:"Financeiro", hi:"फाइनेंस", fr:"Finance", it:"Finance", de:"Finance"}, name: {id:"Pak Eko (Finance)", en:"Mr. Eko (Finance)", es:"Sr. Eko (Finanzas)", pt:"Sr. Eko (Financeiro)", hi:"एको (फाइनेंस)", fr:"Mr. Eko (Finance)", it:"Mr. Eko (Finance)", de:"Mr. Eko (Finance)"} },
    ],
    normalNotifs: [
      { app: "workdesk", from: {id:"WorkDesk",en:"WorkDesk", fr:"WorkDesk", it:"WorkDesk", de:"WorkDesk"}, text: {id:"Reminder: evaluasi kinerja Q4 mengisi form sebelum Jumat.", en:"Reminder: complete the Q4 review form before Friday.", es:"Recordatorio: completa la evaluación Q4 antes del viernes.", pt:"Lembrete: complete a avaliação Q4 antes de sexta.", hi:"रिमाइंडर: शुक्रवार से पहले Q4 फॉर्म भरें।", fr:"Rappel : complétez le formulaire d'évaluation T4 avant vendredi.", it:"Promemoria: completa il modulo di revisione Q4 entro venerdì.", de:"Erinnerung: Q4-Review-Formular bis Freitag ausfüllen."} },
      { app: "chatloop", from: {id:"Tim Project Q4",en:"Q4 Project Team", fr:"Q4 Project Team", it:"Q4 Project Team", de:"Q4 Project Team"}, text: {id:"Dimas: deck buat klien udah aku revise, cek ya.", en:"Dimas: I revised the client deck, take a look.", es:"Dimas: revisé la presentación, mira.", pt:"Dimas: revisei o deck do cliente, olha.", hi:"दिमास: क्लाइंट डेक रिवाइज कर दिया।", fr:"Dimas : j'ai révisé la présentation client, jette un œil.", it:"Dimas: ho rivisto la presentazione per il cliente, dai un'occhiata.", de:"Dimas: Ich habe die Client-Deck überarbeitet, schau mal."} },
      { app: "mailbox", from: {id:"Mailbox",en:"Mailbox", fr:"Mailbox", it:"Mailbox", de:"Mailbox"}, text: {id:"Slip gaji bulan ini sudah tersedia di portal HR.", en:"This month's payslip is available in the HR portal.", es:"La boleta de pago ya está en el portal de RRHH.", pt:"O contracheque já está no portal de RH.", hi:"इस महीने की सैलरी स्लिप पोर्टल पर है।", fr:"La fiche de paie du mois est disponible sur le portail RH.", it:"La busta paga del mese è sul portale HR.", de:"Die Gehaltsabrechnung ist im HR-Portal verfügbar."} },
      { app: "workdesk", from: {id:"WorkDesk",en:"WorkDesk", fr:"WorkDesk", it:"WorkDesk", de:"WorkDesk"}, text: {id:"Meeting 10.00: sinkronasi timeline rilis produk baru.", en:"10:00 meeting: new product release timeline sync.", es:"Reunión 10:00: sincronización del lanzamiento.", pt:"Reunião 10h: sincronizar lançamento do produto.", hi:"10 बजे मीटिंग: प्रोडक्ट लॉन्च टाइमलाइन।", fr:"Réunion 10h : calendrier de sortie du nouveau produit.", it:"Riunione 10:00: calendario del nuovo prodotto.", de:"10-Uhr-Meeting: Zeitplan des Produktlaunchs."} },
    ],
  },
  parent: {
    archetype: "parent",
    wallpaper: "linear-gradient(160deg, #1F2937, #86198F)",
    apps: ["chatloop", "messagebox", "safebrowse", "pocketpay", "dailymart", "settings", "security", "journal", "mailbox", "socialsquare"],
    contacts: [
      { id: "anak", avatar: "👧", color: "#F9A8D4", rel: {id:"Anak SMA", en:"Teenage daughter", es:"Hija", pt:"Filha", hi:"बेटी", fr:"Teenage daughter", it:"Teenage daughter", de:"Teenage daughter"}, name: {id:"Nadia (Anak)", en:"Nadia (Daughter)", es:"Nadia (Hija)", pt:"Nadia (Filha)", hi:"नादिया (बेटी)", fr:"Nadia (Daughter)", it:"Nadia (Daughter)", de:"Nadia (Daughter)"} },
      { id: "walikelas", avatar: "👩‍🏫", color: "#FCD34D", rel: {id:"Wali kelas Nadia", en:"Nadia's homeroom teacher", es:"Tutora de Nadia", pt:"Professora da Nadia", hi:"नादिया की क्लास टीचर", fr:"Nadia's homeroom teacher", it:"Nadia's homeroom teacher", de:"Nadia's homeroom teacher"}, name: {id:"Bu Guru Wali Kelas", en:"Homeroom Teacher", es:"Tutora", pt:"Professora", hi:"क्लास टीचर", fr:"Homeroom Teacher", it:"Homeroom Teacher", de:"Homeroom Teacher"} },
      { id: "gruportu", avatar: "👥", color: "#86EFAC", rel: {id:"Grup orang tua", en:"Parents group", es:"Grupo de padres", pt:"Grupo de pais", hi:"पेरेंट्स ग्रुप", fr:"Parents group", it:"Parents group", de:"Parents group"}, name: {id:"Grup Ortu 12 IPA 2", en:"Parents of 12 IPA 2", es:"Padres de 12 IPA 2", pt:"Pais da 12 IPA 2", hi:"12 IPA 2 पेरेंट्स", fr:"Parents des 12 IPA 2", it:"Genitori della 12 IPA 2", de:"Eltern der 12 IPA 2"} },
      { id: "arisan", avatar: "💃", color: "#C4B5FD", rel: {id:"Arisan", en:"Community savings club", es:"Club de ahorro", pt:"Clube de economia", hi:"बचत ग्रुप", fr:"Community savings club", it:"Community savings club", de:"Community savings club"}, name: {id:"Arisan RT", en:"Neighborhood Club", es:"Club del barrio", pt:"Clube do bairro", hi:"पड़ोस क्लब", fr:"Neighborhood Club", it:"Neighborhood Club", de:"Neighborhood Club"} },
      { id: "suami", avatar: "👨", color: "#A5B4FC", rel: {id:"Suami", en:"Husband", es:"Esposo", pt:"Marido", hi:"पति", fr:"Mari", it:"Marito", de:"Ehemann"}, name: {id:"Pak Budi", en:"Mr. Budi", es:"Sr. Budi", pt:"Sr. Budi", hi:"बुडी जी", fr:"Mr. Budi", it:"Mr. Budi", de:"Mr. Budi"} },
    ],
    normalNotifs: [
      { app: "chatloop", from: {id:"Grup Ortu 12 IPA 2",en:"Parents of 12 IPA 2", fr:"Parents des 12 IPA 2", it:"Genitori della 12 IPA 2", de:"Eltern der 12 IPA 2"}, text: {id:"Bu Guru: info pembayaran study tour cek announcement.", en:"Teacher: check the announcement for study tour payment.", es:"Profesora: mira el anuncio del pago del viaje.", pt:"Professora: veja o anúncio do pagamento da excursão.", hi:"टीचर: स्टडी टूर पेमेंट की सूचना देखें।", fr:"Prof : vérifiez l'annonce pour le paiement du voyage.", it:"Insegnante: controlla l'avviso per il pagamento della gita.", de:"Lehrer: Sehen Sie die Mitteilung zur Fahrtzahlung."} },
      { app: "dailymart", from: {id:"DailyMart",en:"DailyMart", fr:"DailyMart", it:"DailyMart", de:"DailyMart"}, text: {id:"Belanja mingguan sampai besok sore. Kurir: Andi.", en:"Weekly groceries arriving tomorrow afternoon. Courier: Andi.", es:"Las compras llegan mañana. Mensajero: Andi.", pt:"As compras chegam amanhã. Entregador: Andi.", hi:"साप्ताहिक किराना कल आएगी। कूरियर: आंदी।", fr:"Courses de la semaine livrées demain aprèm. Coursier : Andi.", it:"Spesa settimanale in consegna domani pomeriggio. Corriere: Andi.", de:"Wochen_einkauf kommt morgen Nachmittag. Kurier: Andi."} },
      { app: "chatloop", from: {id:"Arisan RT",en:"Neighborhood Club", fr:"Neighborhood Club", it:"Neighborhood Club", de:"Neighborhood Club"}, text: {id:"Mbak Yuli: arisan undian bulan ini di rumah Bu Nani.", en:"Yuli: this month's club draw is at Mrs. Nani's.", es:"Yuli: el sorteo es en casa de la Sra. Nani.", pt:"Yuli: o sorteio é na casa da Sra. Nani.", hi:"यूली: इस महीने का ड्रा नानी आंटी के घर है।", fr:"Yuli : le tirage du club du mois est chez Mme Nani.", it:"Yuli: l'estrazione del club del mese è dalla Sig.ra Nani.", de:"Yuli: Die Club-Ziehung ist bei Frau Nani."} },
      { app: "pocketpay", from: {id:"PocketPay",en:"PocketPay", fr:"PocketPay", it:"PocketPay", de:"PocketPay"}, text: {id:"Tagihan listrik Rp340.000 jatuh tempo 3 hari lagi.", en:"Electricity bill Rp340,000 due in 3 days.", es:"Factura de luz Rp340.000 vence en 3 días.", pt:"Conta de luz Rp340.000 vence em 3 dias.", hi:"बिजली बिल Rp340,000 तीन दिन में ड्यू।", fr:"Facture d'électricité de 340 000 Rp à payer dans 3 jours.", it:"Bolletta luce Rp340.000 in scadenza tra 3 giorni.", de:"Stromrechnung 340.000 Rp in 3 Tagen fällig."} },
      { app: "chatloop", from: {id:"Nadia (Anak)",en:"Nadia (Daughter)", fr:"Nadia (Daughter)", it:"Nadia (Daughter)", de:"Nadia (Daughter)"}, text: {id:"Mi, nanti diambil jam 4 ya ada ekskul.", en:"Mom, pick me up at 4, I have extracurriculars.", es:"Mamá, recógeme a las 4, tengo extraescolares.", pt:"Mãe, me busca às 4, tenho atividade.", hi:"माँ, 4 बजे ले जाना, एक्टिविटी है।", fr:"Maman, viens me chercher à 16h, j'ai des activités.", it:"Mamma, vienimi a prendere alle 16, ho le attività extrascolastiche.", de:"Mama, hol mich um 16 Uhr ab, ich habe Nachmittagsprogramm."} },
    ],
  },
  general: {
    archetype: "general",
    wallpaper: "linear-gradient(160deg, #0F172A, #3F3F46)",
    apps: ["chatloop", "messagebox", "safebrowse", "pocketpay", "dailymart", "socialsquare", "settings", "security", "journal"],
    contacts: [
      { id: "temen", avatar: "🧑", color: "#93C5FD", rel: {id:"Teman", en:"Friend", es:"Amigo", pt:"Amigo", hi:"दोस्त", fr:"Friend", it:"Friend", de:"Friend"}, name: {id:"Reza", en:"Reza", es:"Reza", pt:"Reza", hi:"रेज़ा", fr:"Reza", it:"Reza", de:"Reza"} },
      { id: "bank", avatar: "🏦", color: "#86EFAC", rel: {id:"Bank", en:"Bank", es:"Banco", pt:"Banco", hi:"बैंक", fr:"Bank", it:"Bank", de:"Bank"}, name: {id:"Bank Nusantara", en:"Nusantara Bank", es:"Banco Nusantara", pt:"Banco Nusantara", hi:"नुसंतारा बैंक", fr:"Nusantara Bank", it:"Nusantara Bank", de:"Nusantara Bank"} },
      { id: "gruprt", avatar: "👥", color: "#BEF264", rel: {id:"Grup tetangga", en:"Neighborhood group", es:"Grupo del barrio", pt:"Grupo do bairro", hi:"पड़ोस ग्रुप", fr:"Neighborhood group", it:"Neighborhood group", de:"Neighborhood group"}, name: {id:"Grup RT 05", en:"Neighborhood 05", es:"Barrio 05", pt:"Vizinhança 05", hi:"मोहल्ला 05", fr:"Neighborhood 05", it:"Neighborhood 05", de:"Neighborhood 05"} },
      { id: "keluarga", avatar: "👨‍👩‍👧", color: "#FDA4AF", rel: {id:"Grup keluarga", en:"Family group", es:"Grupo familiar", pt:"Grupo da família", hi:"परिवार ग्रुप", fr:"Family group", it:"Family group", de:"Family group"}, name: {id:"Keluarga Besar", en:"Big Family", es:"Familia Grande", pt:"Família Grande", hi:"बड़ा परिवार", fr:"Big Family", it:"Big Family", de:"Big Family"} },
    ],
    normalNotifs: [
      { app: "chatloop", from: {id:"Reza",en:"Reza", fr:"Reza", it:"Reza", de:"Reza"}, text: {id:"Bro, nonton bareng Sabtu?", en:"Bro, movie night Saturday?", es:"Bro, ¿cine el sábado?", pt:"Bro, cinema sábado?", hi:"यार, शनिवार मूवी चलेगी?", fr:"Frérot, soirée film samedi ?", it:"Fratm, serata cinema sabato?", de:"Bruder, Samstag Filmabend?"} },
      { app: "pocketpay", from: {id:"PocketPay",en:"PocketPay", fr:"PocketPay", it:"PocketPay", de:"PocketPay"}, text: {id:"Top-up Rp100.000 berhasil. Saldo Rp384.210.", en:"Top-up Rp100,000 successful. Balance Rp384,210.", es:"Recarga de Rp100.000 exitosa.", pt:"Recarga de Rp100.000 concluída.", hi:"टॉप-अप Rp100,000 सफल।", fr:"Recharge de 100 000 Rp réussie. Solde 384 210 Rp.", it:"Ricarica Rp100.000 riuscita. Saldo Rp384.210.", de:"Aufladung 100.000 Rp erfolgreich. Kontostand 384.210 Rp."} },
      { app: "chatloop", from: {id:"Grup RT 05",en:"Neighborhood 05", fr:"Neighborhood 05", it:"Neighborhood 05", de:"Neighborhood 05"}, text: {id:"Pak RT: kerja bakti Minggu pagi ya, tiap rumah minimal 1 orang.", en:"Head of neighborhood: cleanup Sunday morning, at least 1 per house.", es:"Jefe del barrio: limpieza el domingo, 1 por casa.", pt:"Líder do bairro: mutirão domingo, 1 por casa.", hi:"मोहल्ला प्रमुख: रविवार सुबह सफाई, हर घर से 1 आदमी।", fr:"Chef de quartier : nettoyage dimanche matin, au moins 1 par maison.", it:"Capo del quartiere: pulizia domenica mattina, almeno 1 per casa.", de:"Nachbarschaftssprecher: Sonntagmorgen Putzaktion, mind. 1 pro Haus."} },
      { app: "dailymart", from: {id:"DailyMart",en:"DailyMart", fr:"DailyMart", it:"DailyMart", de:"DailyMart"}, text: {id:"Flash sale jam 8 malam nanti, voucher di app.", en:"Flash sale tonight at 8, vouchers in the app.", es:"Oferta flash hoy a las 8, cupones en la app.", pt:"Oferta flash hoje às 8h da noite.", hi:"आज रात 8 बजे फ्लैश सेल।", fr:"Vente flash ce soir à 20h, bons dans l'app.", it:"Flash sale stasera alle 20, voucher nell'app.", de:"Flash-Sale heute Abend um 20 Uhr, Gutscheine in der App."} },
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
    { who: "them", text: {id:"Nak, sudah makan belum? Jam segini masih di kampus?", en:"Sweetie, have you eaten? Still on campus at this hour?", es:"Cariño, ¿ya comiste? ¿Todavía en el campus?", pt:"Querido, já comeu? Ainda no campus?", hi:"बेटा, खाना खा लिया? अभी भी कैंपस पर हो?", fr:"Chérie, tu as mangé ? Encore sur le campus à cette heure ?", it:"Tesoro, hai mangiato? Ancora al campus a quest'ora?", de:"Schatz, hast du gegessen? Um diese Zeit noch auf dem Campus?"} },
    { who: "them", text: {id:"Ibu transfer uang saku tambahan ya tadi sore. Cek dulu sebelum dipakai.", en:"Mom sent extra allowance this afternoon. Check it before spending.", es:"Mamá envió dinero extra esta tarde. Verifícalo antes de gastar.", pt:"Mãe mandou mesada extra hoje. Confere antes de gastar.", hi:"माँ ने आज दोपहर अतिरिक्त पैसे भेजे। खर्च करने से पहले जाँच लो।", fr:"Maman a envoyé de l'argent extra cet aprèm. Vérifie avant de dépenser.", it:"La mamma ha mandato una paghetta extra oggi pomeriggio. Controlla prima di spendere.", de:"Mama hat heute Nachmittag extra Geld geschickt. Prüfe es vor dem Ausgeben."} },
  ],
  bimo: [
    { who: "them", text: {id:"Bro bsk konser kampus, gas gak? Tiket sisanya dikit", en:"Bro, campus concert tomorrow, you in? Few tickets left", es:"Bro, mañana el concierto del campus, ¿vas? Quedan pocas entradas", pt:"Bro, show do campus amanhã, vai? Sobram poucos ingressos", hi:"यार, कल कैंपस कॉन्सर्ट है, चलेगा? कुछ ही टिकट बचे", fr:"Frérot, concert du campus demain, tu viens ? Reste peu de places", it:"Fratm, concerto al campus domani, vieni? Restano pochi biglietti", de:"Bruder, morgen Campus-Konzert, dabei? Nur wenige Tickets"} },
  ],
  dosen: [
    { who: "them", text: {id:"Rani, progress bab 3 skripsimu bagaimana? Minggu ini konsultasi ya.", en:"Rani, how's chapter 3 of your thesis? Consultation this week.", es:"Rani, ¿cómo va el capítulo 3? Consulta esta semana.", pt:"Rani, como vai o capítulo 3? Consulta esta semana.", hi:"रानी, थीसिस का चैप्टर 3 कैसा चल रहा है? इस हफ्ते मिलना।", fr:"Rani, où en est le chapitre 3 de ta thèse ? Consultation cette semaine.", it:"Rani, com'è il capitolo 3 della tesi? Consulenza questa settimana.", de:"Rani, wie steht Kapitel 3 deiner Arbeit? Diese Woche Beratung."} },
  ],
  kelas: [
    { who: "them", text: {id:"Bimo: udah pada isi absen kewarganegaraan belum? buruan jam 12 ditutup", en:"Bimo: has everyone filled the civics attendance? Hurry, closes at 12", es:"Bimo: ¿todos firmaron asistencia? Corre, cierra a las 12", pt:"Bimo: todo mundo preencheu a chamada? Corre, fecha às 12", hi:"बिमो: सबने उपस्थिति भरी? जल्दी करो, 12 बजे बंद", fr:"Bimo : tout le monde a rempli la présence d'éducation civique ? Dépêchez-vous, ça ferme à 12h", it:"Bimo: tutti hanno compilato la presenza di cittadinanza? Fate presto, chiude a 12", de:"Bimo: Haben alle die Anwesenheit ausgefüllt? Beeilt euch, schließt um 12"} },
  ],
  kos: [
    { who: "them", text: {id:"Dek, besok kerja bakti jam 7 ya. Jangan lupa bangun pagi.", en:"Dear, cleanup duty at 7 tomorrow. Don't forget to wake up early.", es:"Cariño, limpieza a las 7 mañana. Despiértate temprano.", pt:"Querido, mutirão às 7 amanhã. Acorda cedo.", hi:"कल सुबह 7 बजे सफाई है। जल्दी उठना।", fr:"Chérie, service nettoyage demain à 7h. N'oublie pas de te lever tôt.", it:"Cara, domani pulizia alle 7. Non dimenticare di svegliarti presto.", de:"Schatz, morgen um 7 Putzdienst. Vergiss nicht, früh aufzustehen."} },
  ],
  supplier: [
    { who: "them", text: {id:"Mbak, stok baru datang besok subuh. Yang kemarin laku semua.", en:"Ma'am, new stock arrives at dawn. Yesterday's batch sold out.", es:"Señora, stock nuevo llega al amanecer. El de ayer se vendió todo.", pt:"Dono, estoque novo chega de madrugada. O de ontem vendeu tudo.", hi:"नया स्टॉक सुबह आएगा। कल का सारा बिक गया।", fr:"Madame, le nouveau stock arrive à l'aube. Le lot d'hier est épuisé.", it:"Signora, la nuova merce arriva all'alba. Il lotto di ieri è esaurito.", de:"Frau, neue Ware kommt im Morgengrauen. Gestige Charge ausverkauft."} },
  ],
  pelanggan: [
    { who: "them", text: {id:"Mbak, stok yang kemarin ada lagi gak? Mau repeat order 3 pcs.", en:"Hi, is last week's item back? Want to reorder 3 pcs.", es:"Hola, ¿volvió el producto? Quiero repetir 3 uds.", pt:"Oi, voltou o produto? Quero repetir 3 un.", hi:"पिछला प्रोडक्ट वापस आया? 3 पीस और चाहिए।", fr:"Bonjour, l'article de la semaine dernière est revenu ? Je veux recommander 3 pièces.", it:"Salve, è tornato l'articolo della settimana scorsa? Voglio riordinare 3 pezzi.", de:"Hallo, ist die Ware von letzter Woche wieder da? Ich will 3 Stück nachbestellen."} },
  ],
  kurir: [
    { who: "them", text: {id:"Mbak, paket #PRJ-88 udah kutinggal di pos ronda ya. Terima kasih.", en:"Ma'am, package #PRJ-88 left at the guard post. Thanks.", es:"Señora, paquete #PRJ-88 en el puesto de guardia. Gracias.", pt:"Dono, encomenda #PRJ-88 na portaria. Obrigado.", hi:"पार्सल #PRJ-88 गार्ड पोस्ट पर रख दिया। धन्यवाद।", fr:"Madame, le colis #PRJ-88 est déposé au poste de garde. Merci.", it:"Signora, il pacco #PRJ-88 è al posto di guardia. Grazie.", de:"Frau, Paket #PRJ-88 liegt an der Pforte. Danke."} },
  ],
  grupdagang: [
    { who: "them", text: {id:"Pak Jaya: harga kulakan naik dikit minggu ini, stok aman dulu ya.", en:"Mr. Jaya: wholesale prices up a bit this week, stock up now.", es:"Sr. Jaya: precios al por mayor suben un poco, abastezcan.", pt:"Sr. Jaya: preços de atacado subiram um pouco, estoquem.", hi:"जया: इस हफ्ते थोक दाम थोड़े बढ़े, स्टॉक कर लो।", fr:"M. Jaya : les prix de gros montent un peu cette semaine, stocke maintenant.", it:"Sig. Jaya: i prezzi all'ingrosso salgono un po', fai scorta ora.", de:"Hr. Jaya: Großhandelspreise leicht gestiegen, leg jetzt Vorrat an."} },
  ],
  suami: [
    { who: "them", text: {id:"Dek, tadi aku transfer jatah bulanan. Cek ya sebelum belanja online 😄", en:"Dear, I sent the monthly allowance. Check before shopping online 😄", es:"Cariño, envié la mesada. Revisa antes de comprar online 😄", pt:"Querido, mandei a mesada. Confere antes de comprar online 😄", hi:"महीने का खर्च भेज दिया। ऑनलाइन खरीदने से पहले जाँच लो 😄", fr:"Chérie, j'ai envoyé l'argent du mois. Vérifie avant de faire du shopping 😄", it:"Cara, ho inviato la paghetta del mese. Controlla prima di fare shopping 😄", de:"Schatz, ich habe das Monatsgeld geschickt. Prüfe es vor dem Online-Shopping 😄"} },
  ],
  boss: [
    { who: "them", text: {id:"Deck untuk klien besok siang aku review ya. Jangan lupa lampiran filenya.", en:"I'll review the client deck tomorrow noon. Don't forget the attachment.", es:"Reviso el deck mañana al mediodía. No olvides el adjunto.", pt:"Reviso o deck amanhã ao meio-dia. Não esqueça o anexo.", hi:"कल दोपहर डेक रिव्यू करूँगा। अटैचमेंट मत भूलना।", fr:"Je relirai la présentation client demain midi. N'oublie pas la pièce jointe.", it:"Rivedrò la presentazione domani a mezzogiorno. Non dimenticare l'allegato.", de:"Ich sehe mir die Client-Deck morgen Mittag an. Vergiss den Anhang nicht."} },
  ],
  hrd: [
    { who: "them", text: {id:"Pengumuman: slip gaji bulan ini bisa diunduh mulai tanggal 25.", en:"Announcement: this month's payslip downloads from the 25th.", es:"Anuncio: la boleta se descarga desde el día 25.", pt:"Aviso: o contracheque baixa a partir do dia 25.", hi:"घोषणा: सैलरी स्लिप 25 से डाउनलोड होगी।", fr:"Annonce : la fiche de paie du mois est téléchargeable dès le 25.", it:"Avviso: la busta paga del mese scarica dal 25.", de:"Info: Die Gehaltsabrechnung ist ab dem 25. abrufbar."} },
  ],
  temankantor: [
    { who: "them", text: {id:"Mau ikut lunch nanti? Warung baru sebelah kantor katanya enak.", en:"Joining lunch? New place next to the office is supposedly good.", es:"¿Almuerzas con nosotros? El lugar nuevo es bueno.", pt:"Vai almoçar? O lugar novo ao lado é bom.", hi:"लंच चलोगे? नयी जगह अच्छी है।", fr:"Tu viens déjeuner ? Le nouveau resto à côté du bureau est censé être bien.", it:"Vieni a pranzo? Il nuovo posto accanto all'ufficio dovrebbe essere buono.", de:"Kommst du zum Mittagessen? Der neue Laden neben dem Büro soll gut sein."} },
  ],
  grupkantor: [
    { who: "them", text: {id:"Dimas: meeting jam 10 pindah ke ruang 3 ya semua.", en:"Dimas: 10am meeting moved to room 3, everyone.", es:"Dimas: reunión de 10 movida a sala 3.", pt:"Dimas: reunião das 10 mudou p/ sala 3.", hi:"दिमास: 10 बजे की मीटिंग रूम 3 में।", fr:"Dimas : la réunion de 10h passe en salle 3, tout le monde.", it:"Dimas: la riunione delle 10 si sposta in sala 3, tutti.", de:"Dimas: Das 10-Uhr-Meeting ist in Raum 3, alle."} },
  ],
  bendahara: [
    { who: "them", text: {id:"Reimburse akhir bulan diproses minggu depan. Siapkan nota ya.", en:"Month-end reimbursements process next week. Prepare receipts.", es:"Reembolsos se procesan la próxima semana. Guarda recibos.", pt:"Reembolsos processados na próxima semana. Guarde recibos.", hi:"रिइंबर्समेंट अगले हफ्ते। रसीद रखो।", fr:"Les remboursements de fin de mois sont traités la semaine prochaine. Préparez les reçus.", it:"I rimborsi di fine mese si processano la prossima settimana. Preparate le ricevute.", de:"Die Monatsabschluss-Erstattungen laufen nächste Woche. Belege bereitlegen."} },
  ],
  anak: [
    { who: "them", text: {id:"Mi, nanti diambil jam 4 ya ada ekskul. Jangan lupa bawa uang kas.", en:"Mom, pick me up at 4, I have club. Bring the class fund.", es:"Mamá, recógeme a las 4, tengo extraescolar. Trae la cuota.", pt:"Mãe, me busca às 4, tenho atividade. Traz a taxa.", hi:"माँ, 4 बजे लेना, एक्टिविटी है। क्लास फंड लाना।", fr:"Maman, viens me chercher à 16h, j'ai le club. Apporte la caisse de classe.", it:"Mamma, vienimi a prendere alle 16, ho il club. Porta la cassa della classe.", de:"Mama, hol mich um 16 Uhr ab, ich habe AG. Bring das Klassengeld mit."} },
  ],
  walikelas: [
    { who: "them", text: {id:"Bu, info study tour kelas Nadia: pembayaran sampai Jumat via TU sekolah.", en:"Ma'am, Nadia's class study tour: payment due Friday via school admin.", es:"Señora, viaje de la clase de Nadia: pago hasta viernes en administración.", pt:"Sra., excursão da classe da Nadia: pagamento até sexta na secretaria.", hi:"नादिया की क्लास का ट्रिप: शुक्रवार तक स्कूल ऑफिस में भुगतान।", fr:"Madame, le voyage d'étude de la classe de Nadia : paiement vendredi via l'admin de l'école.", it:"Signora, la gita della classe di Nadia: pagamento venerdì tramite la segreteria.", de:"Frau, Klassenfahrt von Nadias Klasse: Zahlung Freitag über das Schulbüro."} },
  ],
  gruportu: [
    { who: "them", text: {id:"Bu Guru: mari cek announcement grup untuk info SPP semester baru.", en:"Teacher: please check the group announcement for new semester fees.", es:"Profesora: revisa el anuncio del grupo para las cuotas.", pt:"Professora: veja o anúncio do grupo sobre as mensalidades.", hi:"टीचर: नए सेमेस्टर की फीस के लिए ग्रुप घोषणा देखें।", fr:"Prof : veuillez vérifier l'annonce du groupe pour les frais du nouveau semestre.", it:"Insegnante: controlla l'avviso di gruppo per le tasse del nuovo semestre.", de:"Lehrer: Bitte sieh die Gruppenmitteilung zu den Semestergebühren."} },
  ],
  arisan: [
    { who: "them", text: {id:"Mbak Yuli: arisan undian bulan ini di rumah Bu Nani, jangan lupa ya.", en:"Yuli: this month's club draw is at Mrs. Nani's, don't forget.", es:"Yuli: el sorteo es en casa de la Sra. Nani.", pt:"Yuli: o sorteio é na casa da Sra. Nani.", hi:"यूली: इस महीने का ड्रा नानी आंटी के घर।", fr:"Yuli : le tirage du club du mois est chez Mme Nani, n'oublie pas.", it:"Yuli: l'estrazione del club del mese è dalla Sig.ra Nani, non dimenticare.", de:"Yuli: Die Club-Ziehung diesen Monats ist bei Frau Nani, vergiss nicht."} },
  ],
  temen: [
    { who: "them", text: {id:"Bro, Sabtu nonton bareng? Kata orang filmnya bagus.", en:"Bro, movie Saturday? People say it's good.", es:"Bro, ¿película el sábado? Dicen que es buena.", pt:"Bro, filme sábado? Dizem que é bom.", hi:"यार, शनिवार मूवी? सब कह रहे अच्छी है।", fr:"Frérot, cinéma samedi ? On dit que c'est bien.", it:"Fratm, cinema sabato? Dicono sia bello.", de:"Bruder, Samstag Kino? Soll gut sein."} },
  ],
  bank: [
    { who: "them", text: {id:"Transaksi Rp50.000 berhasil pukul 08.02 WIB. Saldo Rp1.2••••", en:"Transaction Rp50,000 successful at 08:02. Balance Rp1.2••••", es:"Transacción Rp50.000 exitosa a las 08:02.", pt:"Transação Rp50.000 concluída às 08:02.", hi:"लेन-देन Rp50,000 सफल, सुबह 8:02।", fr:"Transaction de 50 000 Rp réussie à 08:02. Solde 1,2•••• Rp", it:"Transazione Rp50.000 riuscita alle 08:02. Saldo Rp1.2••••", de:"Transaktion 50.000 Rp erfolgreich um 08:02. Kontostand 1,2•••• Rp"} },
  ],
  gruprt: [
    { who: "them", text: {id:"Pak RT: Minggu pagi kerja bakti, tiap rumah minimal 1 orang hadir.", en:"Neighborhood head: Sunday cleanup, at least 1 person per house.", es:"Jefe del barrio: limpieza el domingo, 1 por casa.", pt:"Líder do bairro: mutirão domingo, 1 por casa.", hi:"मोहल्ला प्रमुख: रविवार सफाई, हर घर से 1 आदमी।", fr:"Chef de quartier : nettoyage dimanche, au moins 1 personne par maison.", it:"Capo quartiere: pulizia domenica, almeno 1 persona per casa.", de:"Nachbarschaftssprecher: Sonntag Putzen, mind. 1 Person pro Haus."} },
  ],
  keluarga: [
    { who: "them", text: {id:"Om Sam: Minggu depan reuni keluarga di rumahnya, jam 10 pagi.", en:"Uncle Sam: family reunion at his place next Sunday, 10am.", es:"Tío Sam: reunión familiar el domingo, 10am.", pt:"Tio Sam: reunião familiar domingo, 10h.", hi:"अंकल सैम: रविवार को पारिवारिक मिलन, सुबह 10 बजे।", fr:"Oncle Sam : retrouvailles familiales chez lui dimanche prochain, 10h.", it:"Zio Sam: riunione di famiglia da lui domenica prossima, alle 10.", de:"Onkel Sam: Familienfeier bei ihm nächsten Sonntag, 10 Uhr."} },
  ],
};

/* smart canned auto-replies per contact when player sends free text (chatbot feel) */
const CONTACT_REPLIES = {
  ibu: {id:"Ya Nak, hati-hati ya. Kalau ada yang aneh cerita ke Ibu.", en:"Okay sweetie, stay careful. If something odd happens, tell Mom.", es:"Ok cariño, cuídate. Si pasa algo raro, cuéntame.", pt:"Ok querido, se cuida. Se algo estranho acontecer, me conta.", hi:"ठीक है बेटा, सावधान रहना। कुछ अजीब हो तो बताना।", fr:"D'accord chérie, sois prudente. S'il arrive quelque chose d'étrange, dis-le à Maman.", it:"Ok tesoro, stai attenta. Se succede qualcosa di strano, dillo alla mamma.", de:"Okay Schatz, pass auf. Wenn etwas Seltsames passiert, sag es Mama."},
  bimo: {id:"Haha santai bro. Yaudah kuy nonton ya sabtu depan!", en:"Haha chill bro. Alright, movie next Saturday then!", es:"Jaja tranqui. ¡Va, cine el sábado!", pt:"Haha tranquilo. Fechado, cinema sábado!", hi:"हहा ठीक है यार। तो शनिवार मूवी पक्की!", fr:"Haha tranquille frérot. Bon, cinéma samedi prochain alors !", it:"Haha tranquillo fratm. Va bene, cinema il prossimo sabato!", de:"Haha chill, Bruder. Gut, dann nächstes Wochenende Kino!"},
  dosen: {id:"Baik, catat ya konsultasi hari Kamis jam 10. Siapkan draft bab 3.", en:"Noted — consultation Thursday 10am. Prepare the chapter 3 draft.", es:"Anotado: consulta jueves 10am. Prepara el borrador.", pt:"Anotado: consulta quinta 10h. Prepare o rascunho.", hi:"नोट किया: गुरुवार 10 बजे मिलना। ड्राफ्ट तैयार करो।", fr:"Noté — consultation jeudi 10h. Prépare le brouillon du chapitre 3.", it:"Capito — consulenza giovedì alle 10. Prepara la bozza del capitolo 3.", de:"Notiert — Beratung Donnerstag 10 Uhr. Bereite Kapitel 3 vor."},
  kelas: {id:"Bimo: sip udah aku tandain. Jangan lupa yang lain!", en:"Bimo: marked. Don't forget the others!", es:"Bimo: anotado. ¡No olviden los demás!", pt:"Bimo: anotado. Não esqueçam o resto!", hi:"बिमो: नोट किया। बाकी लोग मत भूलना!", fr:"Bimo : marqué. N'oublie pas les autres !", it:"Bimo: segnato. Non dimenticare gli altri!", de:"Bimo: Erledigt. Vergiss die anderen nicht!"},
  kos: {id:"Siap Bu, nanti aku bawa sapu ya 😄", en:"Yes ma'am, I'll bring a broom 😄", es:"Sí señora, llevo una escoba 😄", pt:"Sim senhora, levo uma vassoura 😄", hi:"जी आंटी, झाड़ू ले आऊँगा 😄", fr:"Oui madame, j'apporterai un balai 😄", it:"Sì signora, porto la scopa 😄", de:"Ja Frau, ich bringe einen Besen mit 😄"},
  supplier: {id:"Pak Jaya: siap Mbak, besok subuh langsung kirim ya.", en:"Mr. Jaya: yes ma'am, shipping at dawn tomorrow.", es:"Sr. Jaya: sí señora, envío al amanecer.", pt:"Sr. Jaya: sim dona, envio de madrugada.", hi:"जया: जी, कल सुबह भेज दूँगा।", fr:"M. Jaya : oui madame, expédition à l'aube demain.", it:"Sig. Jaya: sì signora, spedizione all'alba domani.", de:"Hr. Jaya: Ja Frau, Versand morgen im Morgengrauen."},
  pelanggan: {id:"Mbak Sari: wah makasih infonya! Nanti aku order ya kak 🙏", en:"Mrs. Sari: thanks for the info! I'll order later 🙏", es:"Sra. Sari: ¡gracias por el aviso! Pido luego 🙏", pt:"Sra. Sari: obrigada pelo aviso! Peço depois 🙏", hi:"सारी: जानकारी के लिए धन्यवाद! बाद में ऑर्डर करूँगी 🙏", fr:"Mme Sari : merci pour l'info ! Je commanderai plus tard 🙏", it:"Sig.ra Sari: grazie per l'info! Ordino dopo 🙏", de:"Fr. Sari: Danke für die Info! Ich bestelle später 🙏"},
  kurir: {id:"Andi: siap Mbak, kalau ada kendala hubungi aku ya.", en:"Andi: yes ma'am, call me if there's any issue.", es:"Andi: sí señora, llámeme si hay problemas.", pt:"Andi: sim dona, me chama se precisar.", hi:"आंदी: जी, कोई दिक्कत हो तो बुलाइए।", fr:"Andi : oui madame, appelez-moi en cas de problème.", it:"Andi: sì signora, mi chiami se ci sono problemi.", de:"Andi: Ja, Frau, rufen Sie mich bei Problemen an."},
  grupdagang: {id:"Pak Jaya: noted Mbak. Aman stoknya minggu ini.", en:"Mr. Jaya: noted. Stock is safe this week.", es:"Sr. Jaya: anotado. Stock seguro esta semana.", pt:"Sr. Jaya: anotado. Estoque seguro esta semana.", hi:"जया: नोट किया। इस हफ्ते स्टॉक ठीक है।", fr:"M. Jaya : noté. Le stock est sûr cette semaine.", it:"Sig. Jaya: capito. La scorta è al sicuro questa settimana.", de:"Hr. Jaya: Notiert. Die Ware ist diese Woche sicher."},
  suami: {id:"Hehe iya Dek. Belanja secukupnya ya, akhir bulan ini panjang 😄", en:"Hehe yes dear. Shop moderately, it's a long month 😄", es:"Jaja sí cariño. Compra con moderación 😄", pt:"Hehe sim querida. Compra com moderação 😄", hi:"हहा हाँ। थोड़ा संतुलित खर्च करना, महीना लंबा है 😄", fr:"Hihi oui chérie. Fais des achats modérés, le mois est long 😄", it:"Eheh sì cara. Compra con misura, il mese è lungo 😄", de:"Hihi ja, Schatz. Kaufe maßvoll, der Monat ist lang 😄"},
  boss: {id:"Sudah kulampirkan filenya Bu Ratna. Terima kasih.", en:"I've attached the file, Mrs. Ratna. Thank you.", es:"Adjunté el archivo, Sra. Ratna. Gracias.", pt:"Anexei o arquivo, Sra. Ratna. Obrigado.", hi:"फाइल अटैच कर दी है, रत्ना मैडम। धन्यवाद।", fr:"J'ai joint le fichier, Mme Ratna. Merci.", it:"Ho allegato il file, Sig.ra Ratna. Grazie.", de:"Ich habe die Datei angehängt, Frau Ratna. Danke."},
  hrd: {id:"Terima kasih infonya. Akan saya cek tanggal 25 nanti.", en:"Thanks for the info. I'll check on the 25th.", es:"Gracias por el aviso. Revisaré el día 25.", pt:"Obrigado pelo aviso. Vou conferir dia 25.", hi:"जानकारी के लिए धन्यवाद। 25 को देखूँगा।", fr:"Merci pour l'info. Je vérifierai le 25.", it:"Grazie per l'info. Controllo il 25.", de:"Danke für die Info. Ich schaue am 25. nach."},
  temankantor: {id:"Gas! Aku ikut, jam 12 ya.", en:"Let's go! I'm in, 12pm then.", es:"¡Va! Me apunto, a las 12.", pt:"Bora! Eu vou, 12h então.", hi:"चलो! मैं आ रहा हूँ, 12 बजे।", fr:"On y va ! Je suis partant, 12h alors.", it:"Andiamo! Ci sto, allora a mezzogiorno.", de:"Los geht's! Ich bin dabei, dann um 12."},
  grupkantor: {id:"Dimas: oke ruang 3, noted. Sampai jumpa jam 10.", en:"Dimas: room 3, noted. See you at 10.", es:"Dimas: sala 3, anotado. Nos vemos a las 10.", pt:"Dimas: sala 3, anotado. Até às 10.", hi:"दिमास: रूम 3, नोट किया। 10 बजे मिलते हैं।", fr:"Dimas : salle 3, noté. À 10h.", it:"Dimas: sala 3, capito. Ci vediamo alle 10.", de:"Dimas: Raum 3, notiert. Bis 10."},
  bendahara: {id:"Pak Eko: siap, nota sudah saya kumpulkan. Terima kasih.", en:"Mr. Eko: ready, receipts collected. Thank you.", es:"Sr. Eko: listo, recibos recolectados.", pt:"Sr. Eko: pronto, recibos guardados.", hi:"एको: तैयार, रसीद जमा कर दी। धन्यवाद।", fr:"M. Eko : prêt, reçus collectés. Merci.", it:"Sig. Eko: pronto, ricevute raccolte. Grazie.", de:"Hr. Eko: Fertig, Belege gesammelt. Danke."},
  anak: {id:"Nadia: iya Mi! Eh Mi, jangan lupa kasih tahu Ayah jam 4 diambil ya.", en:"Nadia: okay Mom! Mom, tell Dad pickup is at 4.", es:"Nadia: ¡ok mamá! Mamá, avisa a papá que a las 4.", pt:"Nadia: ok mãe! Mãe, avisa o pai que às 4.", hi:"नादिया: ठीक माँ! पापा को बोल देना 4 बजे।", fr:"Nadia : d'accord Maman ! Maman, dis à Papa que c'est à 16h.", it:"Nadia: ok mamma! Mamma, di' a papà che il ritiro è alle 16.", de:"Nadia: Okay Mama! Mama, sag Papa, Abholung ist um 16 Uhr."},
  walikelas: {id:"Baik Bu, akan saya bayarkan Jumat lewat TU. Terima kasih.", en:"Alright, I'll pay Friday via the school office. Thank you.", es:"Bien, pagaré el viernes en administración.", pt:"Certo, pago sexta na secretaria.", hi:"ठीक है, शुक्रवार को स्कूल ऑफिस से भुगतान करूँगा।", fr:"D'accord, je paierai vendredi via le secrétariat. Merci.", it:"Va bene, pago venerdì tramite la segreteria. Grazie.", de:"Gut, ich zahle Freitag über das Schulbüro. Danke."},
  gruportu: {id:"Bu Guru: terima kasih sudah cek. Mari disampaikan ke yang lain ya Bu.", en:"Teacher: thanks for checking. Please pass it on.", es:"Profesora: gracias por revisar. Coméntalo con las demás.", pt:"Professora: obrigada por conferir. Repasse às demais.", hi:"टीचर: जाँचने के लिए धन्यवाद। बाकियों को बता दीजिए।", fr:"Prof : merci d'avoir vérifié. Veuillez transmettre.", it:"Insegnante: grazie per il controllo. Per favore inoltra.", de:"Lehrer: Danke fürs Prüfen. Bitte leite es weiter."},
  arisan: {id:"Mbak Yuli: siap Mbak! Sampai jumpa Sabtu ya.", en:"Yuli: see you Saturday then!", es:"Yuli: ¡nos vemos el sábado!", pt:"Yuli: até sábado!", hi:"यूली: तो शनिवार मिलते हैं!", fr:"Yuli : à samedi alors !", it:"Yuli: a sabato allora!", de:"Yuli: Dann bis Samstag!"},
  temen: {id:"Reza: gas bro! Aku booking tiketnya ya.", en:"Reza: let's go! I'll book the tickets.", es:"Reza: ¡va! Yo reservo las entradas.", pt:"Reza: bora! Eu reservo os ingressos.", hi:"रेज़ा: चलो! मैं टिकट बुक करता हूँ।", fr:"Reza : on y va ! Je réserve les billets.", it:"Reza: andiamo! Prenoto io i biglietti.", de:"Reza: Los! Ich buche die Tickets."},
  bank: {id:"Customer service otomatis: terima kasih telah menghubungi Bank Nusantara.", en:"Automated service: thank you for contacting Nusantara Bank.", es:"Servicio automático: gracias por contactar al Banco Nusantara.", pt:"Atendimento automático: obrigado por contatar o Banco Nusantara.", hi:"स्वचालित सेवा: नुसंतारा बैंक से संपर्क के लिए धन्यवाद।", fr:"Service automatisé : merci d'avoir contacté la Banque Nusantara.", it:"Servizio automatico: grazie per aver contattato Nusantara Bank.", de:"Automatischer Dienst: Danke, dass Sie die Nusantara Bank kontaktiert haben."},
  gruprt: {id:"Pak RT: siap Pak, rumah kami akan hadir. Terima kasih.", en:"Neighborhood head: noted, our house will attend. Thank you.", es:"Jefe del barrio: anotado, asistiremos.", pt:"Líder do bairro: anotado, estaremos lá.", hi:"प्रमुख: जी, हमारे घर से आएँगे। धन्यवाद।", fr:"Chef de quartier : noté, notre maison participera. Merci.", it:"Capo quartiere: capito, la nostra casa sarà presente. Grazie.", de:"Nachbarschaftssprecher: Notiert, unser Haus kommt. Danke."},
  keluarga: {id:"Om Sam: wah asik! Kami datang jam 10 ya. Jangan lupa ajak Nadia.", en:"Uncle Sam: nice! We'll come at 10. Don't forget to bring Nadia.", es:"Tío Sam: ¡genial! Vamos a las 10. Trae a Nadia.", pt:"Tio Sam: ótimo! Vamos às 10. Traz a Nadia.", hi:"सैम: बढ़िया! हम 10 बजे आएँगे। नादिया को लाना।", fr:"Oncle Sam : super ! Nous venons à 10h. N'oublie pas d'amener Nadia.", it:"Zio Sam: bello! Veniamo alle 10. Non dimenticare di portare Nadia.", de:"Onkel Sam: Schön! Wir kommen um 10. Vergiss nicht, Nadia mitzubringen."},
};

/* ---------- chat previews per contact per lang ---------- */
const CHAT_PREVIEWS = {
  ibu:   {id:"Jangan lupa makan ya, Nak.", en:"Don't forget to eat, sweetie.", es:"No olvides comer, cariño.", pt:"Não esquece de comer, querido.", hi:"खाना खाना मत भूलना।", fr:"N'oublie pas de manger, chéri.", it:"Non dimenticare di mangiare, tesoro.", de:"Vergiss nicht zu essen, Schatz."},
  bimo:  {id:"Bsk gas nonton konser kampus?", en:"Campus concert tomorrow, in?", es:"¿Concierto del campus mañana?", pt:"Show do campus amanhã, vai?", hi:"कल कैंपस कॉन्सर्ट चलेगा?", fr:"Concert du campus demain, tu viens ?", it:"Concerto al campus domani, vieni?", de:"Morgen Campus-Konzert, mit dabei?"},
  dosen: {id:"Progress skripsimu bagaimana?", en:"How's your thesis progress?", es:"¿Cómo va tu tesis?", pt:"Como vai sua monografia?", hi:"थीसिस कैसी चल रही है?", fr:"Où en es-tu de ta thèse ?", it:"Come procede la tua tesi?", de:"Wie läuft deine Abschlussarbeit?"},
  kelas: {id:"Bimo: udah pada isi absen belum?", en:"Bimo: has everyone filled attendance?", es:"Bimo: ¿todos firmaron?", pt:"Bimo: todo mundo assinou?", hi:"बिमो: सबने हाजिरी भरी?", fr:"Bimo : tout le monde a rempli la présence ?", it:"Bimo: tutti hanno firmato la presenza?", de:"Bimo: Haben alle angemeldet?"},
  kos:   {id:"Dek, kerja bakti besok jam 7 ya.", en:"Dear, cleanup tomorrow at 7.", es:"Cariño, limpieza mañana a las 7.", pt:"Querido, mutirão amanhã às 7.", hi:"कल 7 बजे सफाई है।", fr:"Chérie, nettoyage demain à 7h.", it:"Cara, domani pulizia alle 7.", de:"Schatz, morgen um 7 Uhr Aufräumen."},
  supplier: {id:"Stok baru datang besok subuh.", en:"New stock arrives at dawn.", es:"Stock nuevo llega al amanecer.", pt:"Estoque novo chega de madrugada.", hi:"नया स्टॉक सुबह आएगा।", fr:"Le nouveau stock arrive à l'aube.", it:"La nuova merce arriva all'alba.", de:"Neue Ware kommt im Morgengrauen."},
  pelanggan: {id:"Mbak, stok yang kemarin ada lagi?", en:"Is the item back in stock?", es:"¿Volvió el producto?", pt:"Voltou o produto?", hi:"प्रोडक्ट वापस आया?", fr:"L'article est de retour en stock ?", it:"L'articolo è di nuovo disponibile?", de:"Ist die Ware wieder verfügbar?"},
  kurir: {id:"Paket sudah ditinggal di pos ronda, Mbak.", en:"Package left at the guard post.", es:"Paquete dejado en el puesto de guardia.", pt:"Encomenda deixada na portaria.", hi:"पार्सल गार्ड पोस्ट पर रखा है।", fr:"Colis déposé au poste de garde.", it:"Pacco lasciato al posto di guardia.", de:"Paket an der Pforte hinterlegt."},
  grupdagang: {id:"Pak Jaya: harga naik dikit minggu ini.", en:"Mr. Jaya: prices up a bit this week.", es:"Sr. Jaya: precios subieron un poco.", pt:"Sr. Jaya: preços subiram um pouco.", hi:"जया: इस हफ्ते दाम थोड़े बढ़े।", fr:"M. Jaya : les prix montent un peu cette semaine.", it:"Sig. Jaya: prezzi un po' su questa settimana.", de:"Hr. Jaya: Preise diese Woche leicht gestiegen."},
  suami: {id:"Tadi transfer jatah bulanan, cek ya.", en:"Sent the monthly allowance, check it.", es:"Envié la mesada, revisa.", pt:"Mandei a mesada, confere.", hi:"महीने का खर्च भेज दिया।", fr:"J'ai envoyé l'argent du mois, vérifie.", it:"Ho inviato la paghetta del mese, controlla.", de:"Monatsgeld geschickt, prüfe es."},
  boss:  {id:"Deck-ku kirim sebelum siang ya.", en:"Send me the deck before noon.", es:"Mándame el deck antes del mediodía.", pt:"Me manda o deck antes do meio-dia.", hi:"दोपहर से पहले डेक भेजो।", fr:"Envoie-moi la présentation avant midi.", it:"Mandami la presentazione entro mezzogiorno.", de:"Schick mir die Deck vor Mittag."},
  hrd:   {id:"Slip gaji sudah bisa diunduh.", en:"Payslip is ready to download.", es:"La boleta ya se puede descargar.", pt:"O contracheque já pode ser baixado.", hi:"सैलरी स्लिप डाउनलोड कर सकते हो।", fr:"La fiche de paie est prête à télécharger.", it:"La busta paga è pronta da scaricare.", de:"Die Gehaltsabrechnung steht zum Download bereit."},
  temankantor: {id:"Mau ikut lunch nanti?", en:"Joining lunch later?", es:"¿Vas al almuerzo?", pt:"Vai almoçar com a gente?", hi:"लंच में चलोगे?", fr:"Joining lunch later?", it:"Joining lunch later?", de:"Joining lunch later?"},
  grupkantor: {id:"Meeting 10 pindah ke ruang 3.", en:"10am meeting moved to room 3.", es:"Reunión de 10 movida a sala 3.", pt:"Reunião das 10 mudou p/ sala 3.", hi:"10 बजे की मीटिंग रूम 3 में।", fr:"La réunion de 10h passe en salle 3.", it:"La riunione delle 10 si sposta in sala 3.", de:"Das 10-Uhr-Meeting ist in Raum 3."},
  bendahara: {id:"Reimburse-ku sudah masuk?", en:"Has my reimbursement arrived?", es:"¿Llegó mi reembolso?", pt:"Chegou meu reembolso?", hi:"मेरा रिइंबर्समेंट आया?", fr:"Mon remboursement est arrivé ?", it:"Il mio rimborso è arrivato?", de:"Ist meine Erstattung angekommen?"},
  anak:  {id:"Mi, nanti diambil jam 4 ya.", en:"Mom, pick me up at 4.", es:"Mamá, recógeme a las 4.", pt:"Mãe, me busca às 4.", hi:"माँ, 4 बजे लेना।", fr:"Maman, viens me chercher à 16h.", it:"Mamma, vienimi a prendere alle 16.", de:"Mama, hol mich um 16 Uhr ab."},
  walikelas: {id:"Study tour pembayaran sampai Jumat.", en:"Study tour payment due Friday.", es:"Pago del viaje vence el viernes.", pt:"Pagamento da excursão até sexta.", hi:"स्टडी टूर पेमेंट शुक्रवार तक।", fr:"Paiement du voyage d'étude vendredi.", it:"Pagamento gita venerdì.", de:"Zahlung der Klassenfahrt bis Freitag."},
  gruportu: {id:"Bu Guru: cek announcement ya bu.", en:"Teacher: check the announcement.", es:"Profesora: mira el anuncio.", pt:"Professora: veja o anúncio.", hi:"टीचर: घोषणा देखें।", fr:"Prof : vérifiez l'annonce.", it:"Insegnante: controlla l'avviso.", de:"Lehrer: Sehen Sie die Mitteilung."},
  arisan: {id:"Arisan bulan ini di rumah Bu Nani.", en:"This month's club is at Mrs. Nani's.", es:"Este mes en casa de la Sra. Nani.", pt:"Este mês na casa da Sra. Nani.", hi:"इस महीने नानी आंटी के घर।", fr:"Le club du mois est chez Mme Nani.", it:"Il club del mese è dalla Sig.ra Nani.", de:"Der Club diesen Monat ist bei Frau Nani."},
  temen: {id:"Bro, nonton bareng Sabtu?", en:"Bro, movie Saturday?", es:"Bro, ¿película el sábado?", pt:"Bro, filme sábado?", hi:"यार, शनिवार मूवी?", fr:"Bro, movie Saturday?", it:"Bro, movie Saturday?", de:"Bro, movie Saturday?"},
  bank:  {id:"Transaksi berhasil. Saldo Rp••••.", en:"Transaction successful. Balance Rp••••.", es:"Transacción exitosa.", pt:"Transação concluída.", hi:"लेन-देन सफल।", fr:"Transaction réussie. Solde •••• Rp.", it:"Transazione riuscita. Saldo Rp••••.", de:"Transaktion erfolgreich. Kontostand •••• Rp."},
  gruprt: {id:"Pak RT: kerja bakti Minggu pagi.", en:"Cleanup Sunday morning.", es:"Limpieza el domingo.", pt:"Mutirão domingo.", hi:"रविवार सुबह सफाई।", fr:"Cleanup Sunday morning.", it:"Cleanup Sunday morning.", de:"Cleanup Sunday morning."},
  keluarga: {id:"Minggu reuni di rumah Om Sam.", en:"Sunday reunion at Uncle Sam's.", es:"Domingo reunión en casa del tío Sam.", pt:"Domingo reunião na casa do tio Sam.", hi:"रविवार अंकल सैम के घर।", fr:"Retrouvailles dimanche chez l'oncle Sam.", it:"Domenica riunione dallo zio Sam.", de:"Sonntags Familienfeier bei Onkel Sam."},
};
function chatPreviewFor(cid) { return L(CHAT_PREVIEWS[cid] || "👍"); }

/* ---------- day-based attack builder (multilingual) ---------- */
function buildAttack(profile, day, seed) {
  const A = {
    student: {
      phishing: { app: "settings", scenario: "story_komp_d2_wifi",
        from: {id:"Wi-Fi", en:"Wi-Fi", es:"Wi-Fi", pt:"Wi-Fi", hi:"Wi-Fi", fr:"Wi-Fi", it:"Wi-Fi", de:"Wi-Fi"},
        notifText: {id:"Jaringan Wi-Fi gratis terdeteksi — sinyal kuat, tanpa password. Konek sekarang?", en:"Free Wi-Fi detected — strong signal, no password. Connect now?", es:"Wi-Fi gratis detectado — señal fuerte, sin contraseña. ¿Conectar?", pt:"Wi-Fi grátis detectado — sinal forte, sem senha. Conectar?", hi:"मुफ़्त Wi-Fi मिला — मज़बूत सिग्नल, बिना पासवर्ड। कनेक्ट करें?", fr:"Wi-Fi gratuit détecté — signal fort, sans mot de passe. Se connecter ?", it:"Wi-Fi gratis rilevato — segnale forte, senza password. Connettersi?", de:"Gratis WLAN erkannt — starkes Signal, ohne Passwort. Jetzt verbinden?"} },
      account: { app: "chatloop", scenario: "story_komp_d3_takeover",
        from: {id:"Tim Dukungan Akun", en:"Account Support Team", es:"Equipo de Soporte", pt:"Equipe de Suporte", hi:"खाता सहायता टीम", fr:"Account Support Team", it:"Account Support Team", de:"Account Support Team"},
        notifText: {id:"Percobaan login dari perangkat tak dikenal. Kami bisa bantu pulihkan akunmu…", en:"Login attempt from unknown device. We can recover your account…", es:"Intento de login desconocido. Podemos recuperar tu cuenta…", pt:"Tentativa de login desconhecida. Podemos recuperar sua conta…", hi:"अज्ञात डिवाइस से लॉगिन प्रयास। हम खाता वापस पा सकते हैं…", fr:"Tentative de connexion depuis un appareil inconnu. Nous pouvons récupérer votre compte…", it:"Tentativo di accesso da dispositivo sconosciuto. Possiamo recuperare l'account…", de:"Anmeldeversuch von unbekanntem Gerät. Wir können dein Konto wiederherstellen…"} },
      consequences: { app: "phone", scenario: "story_komp_d4_otpcall",
        from: {id:"+62 812-xxxx (Petugas Dukungan)", en:"+62 812-xxxx (Support Officer)", es:"+62 812-xxxx (Soporte)", pt:"+62 812-xxxx (Suporte)", hi:"+62 812-xxxx (सहायता)", fr:"+62 812-xxxx (Agent support)", it:"+62 812-xxxx (Addetto supporto)", de:"+62 812-xxxx (Support-Mitarbeiter)"},
        notifText: {id:"Telepon masuk: 'Akun kompetisimu bermasalah. Bacakan kode OTP untuk verifikasi…'", en:"Incoming call: 'Your competition account has an issue. Read out the OTP code…'", es:"Llamada: 'Tu cuenta tiene problemas. Lee el código OTP…'", pt:"Ligação: 'Sua conta tem problemas. Leia o código OTP…'", hi:"कॉल: 'आपके खाते में समस्या है। OTP कोड पढ़ें…'", fr:"Appel entrant : 'Un problème avec votre compte concours. Lisez le code OTP…'", it:"Chiamata in arrivo: 'Problema con il tuo account gara. Leggi il codice OTP…'", de:"Eingehender Anruf: 'Problem mit deinem Wettbewerb-Konto. Lies den OTP-Code vor…'"} },
      recovery: { app: "chatloop", scenario: "story_komp_d5_threat",
        from: {id:"unknown_x9", en:"unknown_x9", es:"unknown_x9", pt:"unknown_x9", hi:"unknown_x9", fr:"unknown_x9", it:"unknown_x9", de:"unknown_x9"},
        notifText: {id:"Kami punya informasi pribadimu. 15 menit, atau kami sebar…", en:"We have your personal info. 15 minutes, or we leak it…", es:"Tenemos tu información. 15 minutos o la filtramos…", pt:"Temos suas informações. 15 minutos ou vazamos…", hi:"हमारे पास आपकी जानकारी है। 15 मिनट, वरना लीक…", fr:"Nous avons vos infos personnelles. 15 minutes, ou nous les publions…", it:"Abbiamo le tue info personali. 15 minuti o le diffondiamo…", de:"Wir haben deine persönlichen Daten. 15 Minuten, sonst veröffentlichen wir sie…"} },
    },
    merchant: {
      phishing: { app: "chatloop", scenario: "wa_qris_refund",
        from: {id:"Pembeli Shopee", en:"Shopee Buyer", es:"Comprador de Shopee", pt:"Comprador da Shopee", hi:"शॉपी खरीदार", fr:"Shopee Buyer", it:"Shopee Buyer", de:"Shopee Buyer"},
        notifText: {id:"Kak, refund QRIS pesanan kemarin gagal. Scan ini biar dana balik…", en:"Hi, yesterday's QRIS refund failed. Scan this so the money returns…", es:"Hola, el reembolso QR falló. Escanea esto para recuperar el dinero…", pt:"Oi, o reembolso QR de ontem falhou. Escaneia isso pra receber…", hi:"रिफंड विफल रहा। पैसा वापस पाने के लिए यह स्कैन करें…", fr:"Bonjour, le remboursement QRIS d'hier a échoué. Scanne ceci pour que l'argent revienne…", it:"Salve, il rimborso QRIS di ieri non è andato. Scansiona questo per far tornare i soldi…", de:"Hallo, die QRIS-Rückerstattung von gestern ist fehlgeschlagen. Scanne das, damit das Geld zurückkommt…"} },
      account: { app: "dailymart", scenario: "mail_hr_slip",
        from: {id:"DailyMart Security", en:"DailyMart Security", es:"Seguridad DailyMart", pt:"Segurança DailyMart", hi:"DailyMart सुरक्षा", fr:"DailyMart Security", it:"DailyMart Security", de:"DailyMart Security"},
        notifText: {id:"Tokomu terindikasi penipuan. Verifikasi identitas 1x12 jam…", en:"Your shop is flagged for fraud. Verify identity within 12h…", es:"Tu tienda fue marcada por fraude. Verifica en 12h…", pt:"Sua loja foi marcada por fraude. Verifique em 12h…", hi:"आपकी दुकान धोखाधड़ी में चिन्हित। 12 घंटे में सत्यापित करें…", fr:"Votre boutique est signalée pour fraude. Vérifiez votre identité sous 12h…", it:"Il tuo negozio è segnalato per frode. Verifica l'identità entro 12h…", de:"Dein Shop wurde wegen Betrug markiert. Verifiziere dich innerhalb von 12 Std…"} },
      consequences: { app: "pocketpay", scenario: "wa_cs_otp",
        from: {id:"PocketPay Support", en:"PocketPay Support", es:"Soporte PocketPay", pt:"Suporte PocketPay", hi:"PocketPay सपोर्ट", fr:"PocketPay Support", it:"PocketPay Support", de:"PocketPay Support"},
        notifText: {id:"Saldo kamu dibekukan karena pelanggaran. Buka tiket sekarang…", en:"Your balance is frozen due to a violation. Open a ticket now…", es:"Tu saldo está congelado por infracción. Abre un ticket…", pt:"Seu saldo está congelado por violação. Abra um ticket…", hi:"उल्लंघन के कारण आपका बैलेंस फ्रीज़ है। अभी टिकट खोलें…", fr:"Votre solde est gelé pour violation. Ouvrez un ticket maintenant…", it:"Il tuo saldo è congelato per violazione. Apri un ticket ora…", de:"Dein Guthaben ist wegen Verstoß eingefroren. Öffne jetzt ein Ticket…"} },
      recovery: { app: "chatloop", scenario: "report_fake_support",
        from: {id:"Tim Bantuan Pengaduan", en:"Complaint Help Team", es:"Equipo de Ayuda", pt:"Equipe de Ajuda", hi:"शिकायत सहायता टीम", fr:"Complaint Help Team", it:"Complaint Help Team", de:"Complaint Help Team"},
        notifText: {id:"Dana penipuan bisa kami tahan. Jangan lapor dulu, biar kami proses…", en:"We can hold the fraud funds. Don't report yet, let us process…", es:"Podemos retener el dinero. No denuncies aún…", pt:"Podemos reter o dinheiro. Não denuncie ainda…", hi:"हम धोखाधड़ी का पैसा रोक सकते हैं। अभी रिपोर्ट मत करो…", fr:"Nous pouvons bloquer les fonds frauduleux. Ne signalez pas encore, laissez-nous traiter…", it:"Possiamo bloccare i fondi truffati. Non segnalare ancora, lascia processare noi…", de:"Wir können das Betrugsgeld einfrieren. Melde noch nicht, lass uns abwickeln…"} },
    },
    worker: {
      phishing: { app: "mailbox", scenario: "mail_hr_slip",
        from: {id:"HRD Perusahaan", en:"Company HR", es:"RRHH", pt:"RH da Empresa", hi:"कंपनी HR", fr:"RH de l'entreprise", it:"HR aziendale", de:"Firmen-Personalabteilung"},
        notifText: {id:"Slip gaji bulan ini: konfirmasi data rekening via link…", en:"This month's payslip: confirm your account data via link…", es:"Boleta de pago: confirma tu cuenta vía enlace…", pt:"Contracheque: confirme seus dados via link…", hi:"सैलरी स्लिप: लिंक से खाता जानकारी कन्फर्म करें…", fr:"Fiche de paie du mois : confirmez vos données bancaires via le lien…", it:"Busta paga del mese: conferma i dati del conto via link…", de:"Gehaltsabrechnung: Bestätige deine Kontodaten per Link…"} },
      account: { app: "workdesk", scenario: "cred_password_reuse",
        from: {id:"IT Support", en:"IT Support", es:"Soporte IT", pt:"Suporte de TI", hi:"IT सपोर्ट", fr:"IT Support", it:"IT Support", de:"IT Support"},
        notifText: {id:"Password kadaluarsa, reset segera via portal…", en:"Password expired, reset now via portal…", es:"Contraseña vencida, restablece ya…", pt:"Senha expirada, redefina já…", hi:"पासवर्ड एक्सपायर्ड, अभी रीसेट करें…", fr:"Mot de passe expiré, réinitialisez maintenant via le portail…", it:"Password scaduta, resettala ora dal portale…", de:"Passwort abgelaufen, jetzt über das Portal zurücksetzen…"} },
      consequences: { app: "mailbox", scenario: "cred_password_reuse",
        from: {id:"Tim Keamanan Perusahaan", en:"Company Security Team", es:"Equipo de Seguridad", pt:"Equipe de Segurança", hi:"कंपनी सुरक्षा टीम", fr:"Company Security Team", it:"Company Security Team", de:"Company Security Team"},
        notifText: {id:"Akun email kamu dikirim spam massal. Ganti password sekarang…", en:"Your email sent mass spam. Change your password now…", es:"Tu correo envió spam masivo. Cambia la contraseña…", pt:"Seu e-mail enviou spam em massa. Troque a senha…", hi:"आपके ईमेल से मास स्पैम गया। अभी पासवर्ड बदलें…", fr:"Votre e-mail a envoyé du spam en masse. Changez votre mot de passe…", it:"La tua email ha inviato spam di massa. Cambia la password ora…", de:"Deine E-Mail hat Massenspam versendet. Ändere jetzt dein Passwort…"} },
      recovery: { app: "chatloop", scenario: "report_fake_support",
        from: {id:"Tim Bantuan Pengaduan", en:"Complaint Help Team", es:"Equipo de Ayuda", pt:"Equipe de Ajuda", hi:"शिकायत सहायता टीम", fr:"Complaint Help Team", it:"Complaint Help Team", de:"Complaint Help Team"},
        notifText: {id:"Kami dari tim bantuan korban penipuan. Data diperlukan untuk blokir…", en:"We're the fraud-victim help team. Data needed to block…", es:"Somos el equipo de ayuda anti-fraude. Necesitamos datos…", pt:"Somos a equipe antifraude. Precisamos de dados…", hi:"हम धोखाधड़ी पीड़ित सहायता टीम हैं। ब्लॉक करने के लिए डेटा चाहिए…", fr:"Nous sommes l'équipe d'aide aux victimes de fraude. Données requises pour bloquer…", it:"Siamo il team di aiuto vittime truffe. Servono dati per bloccare…", de:"Wir sind das Betrugsopfer-Hilfsteam. Daten nötig zum Blockieren…"} },
    },
    parent: {
      phishing: { app: "chatloop", scenario: "wa_spp_sekolah",
        from: {id:"Admin Sekolah", en:"School Admin", es:"Administración escolar", pt:"Administração escolar", hi:"स्कूल एडमिन", fr:"School Admin", it:"School Admin", de:"School Admin"},
        notifText: {id:"Tagihan SPP semester baru, transfer ke rekening baru…", en:"New semester tuition, transfer to the new account…", es:"Colegiatura del semestre, transfiere a la cuenta nueva…", pt:"Mensalidade do semestre, transfira pra nova conta…", hi:"नए सेमेस्टर की फीस, नए खाते में भेजें…", fr:"Frais de scolarité du nouveau semestre, virez sur le nouveau compte…", it:"Tasse del nuovo semestre, trasferisci sul nuovo conto…", de:"Studiengebühren des neuen Semesters, auf das neue Konto überweisen…"} },
      account: { app: "messagebox", scenario: "wa_cs_otp",
        from: {id:"Bank Nusantara", en:"Nusantara Bank", es:"Banco Nusantara", pt:"Banco Nusantara", hi:"नुसंतारा बैंक", fr:"Nusantara Bank", it:"Nusantara Bank", de:"Nusantara Bank"},
        notifText: {id:"Kartu kamu diblokir, verifikasi via link…", en:"Your card is blocked, verify via link…", es:"Tu tarjeta está bloqueada, verifica vía enlace…", pt:"Seu cartão está bloqueado, verifique via link…", hi:"आपका कार्ड ब्लॉक है, लिंक से सत्यापित करें…", fr:"Votre carte est bloquée, vérifiez via le lien…", it:"La tua carta è bloccata, verifica via link…", de:"Deine Karte ist gesperrt, per Link verifizieren…"} },
      consequences: { app: "pocketpay", scenario: "wa_cs_otp",
        from: {id:"PocketPay", en:"PocketPay", es:"PocketPay", pt:"PocketPay", hi:"PocketPay", fr:"PocketPay", it:"PocketPay", de:"PocketPay"},
        notifText: {id:"Transaksi tak dikenal Rp2.300.000…", en:"Unrecognized transaction Rp2,300,000…", es:"Transacción desconocida Rp2.300.000…", pt:"Transação desconhecida Rp2.300.000…", hi:"अज्ञात लेन-देन Rp2,300,000…", fr:"Unrecognized transaction Rp2,300,000…", it:"Unrecognized transaction Rp2,300,000…", de:"Unrecognized transaction Rp2,300,000…"} },
      recovery: { app: "chatloop", scenario: "report_fake_support",
        from: {id:"Tim Bantuan Pengaduan", en:"Complaint Help Team", es:"Equipo de Ayuda", pt:"Equipe de Ajuda", hi:"शिकायत सहायता टीम", fr:"Complaint Help Team", it:"Complaint Help Team", de:"Complaint Help Team"},
        notifText: {id:"Dana SPP yang salah transfer bisa kami tarik. Jangan lapor dulu…", en:"We can pull back the misdirected tuition. Don't report yet…", es:"Podemos recuperar la colegiatura. No denuncies aún…", pt:"Podemos recuperar a mensalidade. Não denuncie ainda…", hi:"गलत भेजी फीस वापस मिल सकती है। अभी रिपोर्ट मत करो…", fr:"Nous pouvons récupérer les frais de scolarité mal versés. Ne signalez pas encore…", it:"Possiamo recuperare le tasse pagate per errore. Non segnalare ancora…", de:"Wir können die falsch überwiesenen Gebühren zurückholen. Melde noch nicht…"} },
    },
    general: {
      phishing: { app: "messagebox", scenario: "sms_kuota_hadiah",
        from: {id:"Kurir Paket", en:"Package Courier", es:"Mensajería", pt:"Entregadora", hi:"कूरियर", fr:"Package Courier", it:"Package Courier", de:"Package Courier"},
        notifText: {id:"Paketmu tertahan, bayar bea Rp15.000 di link…", en:"Your package is held, pay Rp15,000 fee via link…", es:"Tu paquete está retenido, paga Rp15.000 via enlace…", pt:"Sua encomenda está retida, pague Rp15.000 via link…", hi:"आपका पार्सल रुका है, लिंक से Rp15,000 शुल्क दें…", fr:"Votre colis est retenu, payez 15 000 Rp de frais via le lien…", it:"Il tuo pacco è trattenuto, paga Rp15.000 di fee via link…", de:"Dein Paket wird festgehalten, zahle 15.000 Rp Gebühr per Link…"} },
      account: { app: "socialsquare", scenario: "cred_password_reuse",
        from: {id:"SocialSquare Security", en:"SocialSquare Security", es:"Seguridad SocialSquare", pt:"Segurança SocialSquare", hi:"SocialSquare सुरक्षा", fr:"SocialSquare Security", it:"SocialSquare Security", de:"SocialSquare Security"},
        notifText: {id:"Login dari perangkat tak dikenal…", en:"Login from an unknown device…", es:"Inicio de sesión desde un dispositivo desconocido…", pt:"Login de um dispositivo desconhecido…", hi:"अनजान डिवाइस से लॉगिन…", fr:"Connexion depuis un appareil inconnu…", it:"Accesso da un dispositivo sconosciuto…", de:"Anmeldung von unbekanntem Gerät…"} },
      consequences: { app: "pocketpay", scenario: "wa_prize_link",
        from: {id:"PocketPay", en:"PocketPay", es:"PocketPay", pt:"PocketPay", hi:"PocketPay", fr:"PocketPay", it:"PocketPay", de:"PocketPay"},
        notifText: {id:"Saldo berkurang untuk transaksi tak dikenal…", en:"Balance reduced by unknown transaction…", es:"Saldo reducido por transacción desconocida…", pt:"Saldo reduzido por transação desconhecida…", hi:"अज्ञात लेन-देन से बैलेंस घटा…", fr:"Solde réduit par une transaction inconnue…", it:"Saldo ridotto da una transazione sconosciuta…", de:"Kontostand durch unbekannte Transaktion gesunken…"} },
      recovery: { app: "chatloop", scenario: "report_fake_support",
        from: {id:"Tim Bantuan Pengaduan", en:"Complaint Help Team", es:"Equipo de Ayuda", pt:"Equipe de Ajuda", hi:"शिकायत सहायता टीम", fr:"Complaint Help Team", it:"Complaint Help Team", de:"Complaint Help Team"},
        notifText: {id:"Korban penipuan? Kami bantu cairkan dana kembali…", en:"Fraud victim? We help recover your funds…", es:"¿Víctima de fraude? Te ayudamos a recuperar…", pt:"Vítima de fraude? Ajudamos a recuperar…", hi:"धोखाधड़ी का शिकार? हम पैसा वापस दिलाएंगे…", fr:"Victime d'arnaque ? Nous aidons à récupérer vos fonds…", it:"Vittima di truffa? Ti aiutiamo a recuperare i fondi…", de:"Betrugsopfer? Wir helfen, dein Geld zurückzuholen…"} },
    },
  };
  const t = (A[profile.archetype] || A.general);
  let ev = null;
  // MD storyline order — day 1: Ch1 portal login first, Ch2 phishing after
  if (day === 1) ev = { app: "safebrowse", scenario: "story_komp_d1_password",
    from: {id:"Portal Kompetisi Digital", en:"Digital Competition Portal", es:"Portal de Competencia Digital", pt:"Portal de Competição Digital", fr:"Portail de Compétition Numérique", it:"Portale Competizione Digitale", de:"Digital-Wettbewerbsportal"},
    notifText: {id:"Sesi portal kedaluwarsa — masuk email + kata sandi untuk melanjutkan pendaftaran…", en:"Portal session expired — enter email + password to continue registration…", es:"Sesión del portal caducada — introduce correo y contraseña para continuar…", pt:"Sessão do portal expirada — insira e-mail e senha para continuar…", fr:"Session du portail expirée — saisissez e-mail et mot de passe pour continuer…", it:"Sessione del portale scaduta — inserisci email e password per continuare…", de:"Portalsitzung abgelaufen — E-Mail und Passwort eingeben, um fortzufahren…"} };
  else if (day === 2) ev = t.phishing;
  // MD order — day 3: Ch5 APK first, Ch6 account takeover after
  else if (day === 3) ev = { app: "chatloop", scenario: "story_komp_d3_apk",
    from: {id:"Teman Grup Lomba", en:"Contest Group Friend", es:"Amigo del grupo", pt:"Amigo do grupo", fr:"Ami du groupe", it:"Amico del gruppo", de:"Freund aus der Gruppe"},
    notifText: {id:"APK editor video PREMIUM gratis! Instal dari link ini, gak perlu Play Store~", en:"PREMIUM video editor APK for free! Install from this link, no Play Store needed~", es:"¡APK editor de video PREMIUM gratis! Instálala desde este enlace, sin Play Store~", pt:"APK editor de vídeo PREMIUM grátis! Instala deste link, sem Play Store~", fr:"APK montage vidéo PREMIUM gratuite ! Installe depuis ce ligne, sans Play Store~", it:"APK editor video PREMIUM gratis! Installa da questo link, senza Play Store~", de:"PREMIUM-Video-Editor-APK gratis! Über diesen Link installieren, ohne Play Store~"} };
  else if (day === 4) ev = t.consequences;
  else if (day === 5) ev = t.recovery;
  if (!ev) return null;
  // WiFi attack: show the AI-generated SSID from the world cast, not a hardcoded one
  if (ev.scenario === "story_komp_d2_wifi") {
    const cast = profile.cast || {};
    const ssid = cast.wifi_ssid || `${cast.cafe_name || "KafeKita"}_Free_WiFi`.replace(/\s+/g, "_");
    return { id: "atk" + day, seed, app: ev.app, scenario: ev.scenario,
             from: ssid, notifText: L(ev.notifText), _fromRaw: ev.from, _notifRaw: ev.notifText };
  }
  return { id: "atk" + day, seed, app: ev.app, scenario: ev.scenario,
           from: L(ev.from), notifText: L(ev.notifText), _fromRaw: ev.from, _notifRaw: ev.notifText };
}

/* ---------- second incident per day (storyline chapter B) ----------
   Each day carries TWO chapters: after the first incident resolves, the
   second lands in the notification bar. Channels follow the storyline spec. */
const ATTACK_B = {
  1: { app: "chatloop", scenario: "story_komp_d1_phishing",
    from: {id:"Panitia Kompetisi Nasional", en:"National Competition Committee", es:"Comité Nacional", pt:"Comitê Nacional", fr:"Comité National", it:"Comitato Nazionale", de:"Nationaler Wettbewerbssausschuss"},
    notifText: {id:"Selamat! Kamu terpilih finalis kompetisi nasional. Konfirmasi 10 menit!", en:'Congrats! You are a national finalist. Confirm within 10 minutes!', es:"¡Felicidades! Eres finalista. ¡Confirma en 10 minutos!", pt:"Parabéns! Você é finalista. Confirme em 10 minutos!", fr:"Félicitations ! Tu es finaliste national. Confirme sous 10 minutes !", it:"Congratulazioni! Sei finalista nazionale. Conferma entro 10 minuti!", de:"Glückwunsch! Du bist Landesfinalist. Bestätige in 10 Minuten!"} },
  2: { app: "chatloop", scenario: "story_komp_d2_privacy",
    from: {id:"Ketua Tim (grup lomba)", en:"Team Captain (contest group)", es:"Capitán del equipo", pt:"Capitã da equipe", fr:"Capitaine d'équipe", it:"Capitano della squadra", de:"Teamkapitän"},
    notifText: {id:"Foto tim kita keren! Kartu pelajarmu kelihatan jelas — ayo upload bareng!", en:"Our team photo is great! Your student ID is clearly visible — let's upload it together!", es:"¡La foto del equipo quedó genial! Tu carnet se ve claro — ¡súbela!", pt:"A foto da equipe ficou ótima! Seu cartão estudantil aparece — vamos postar!", fr:"La photo d'équipe est top ! Ta carte scolaire se voit clairement — on la poste ?", it:"La foto della squadra è fantastica! La tua tessera si vede bene — pubblichiamola!", de:"Das Teamfoto ist toll! Dein Schülerausweis ist deutlich sichtbar — lass es hochladen!"} },
  3: { app: "chatloop", scenario: "story_komp_d3_takeover",
    from: {id:"Tim Dukungan Akun", en:"Account Support Team", es:"Equipo de Soporte", pt:"Equipe de Suporte", fr:"Account Support Team", it:"Account Support Team", de:"Account Support Team"},
    notifText: {id:"Percobaan login dari perangkat tak dikenal. Kami bisa bantu pulihkan akunmu…", en:"Login attempt from unknown device. We can recover your account…", es:"Intento de login desconocido. Podemos recuperar tu cuenta…", pt:"Tentativa de login desconhecida. Podemos recuperar sua conta…", fr:"Tentative de connexion depuis un appareil inconnu. Nous pouvons récupérer votre compte…", it:"Tentativo di accesso da dispositivo sconosciuto. Possiamo recuperare l'account…", de:"Anmeldeversuch von unbekanntem Gerät. Wir können dein Konto wiederherstellen…"} },
  4: { app: "chatloop", scenario: "story_komp_d4_qris",
    from: {id:"Keuangan Panitia Lomba", en:"Contest Finance Committee", es:"Finanzas del comité", pt:"Finanças do comitê", fr:"Finances du comité", it:"Finanze del comitato", de:"Finanzkomitee"},
    notifText: {id:"FINALIS WAJIB BAYAR biaya administrasi Rp 250.000 via QRIS hari ini. Hadiah langsung diproses!", en:"FINALISTS MUST PAY a Rp 250,000 admin fee via QRIS today. Prize processed instantly!", es:"LOS FINALISTAS DEBEN PAGAR 250.000 Rp de administración por QRIS hoy. ¡El premio se procesa ya!", pt:"FINALISTAS DEVEM PAGAR taxa de R$ 250.000 via QRIS hoje. Prêmio processado na hora!", fr:"LES FINALISTES DOIVENT PAYER 250 000 Rp de frais via QRIS aujourd'hui. Gain traité immédiatement !", it:"I FINALISTI DEVONO PAGARE 250.000 Rp di amministrazione via QRIS oggi. Premio elaborato subito!", de:"FINALISTEN MÜSSEN heute 250.000 Rp Verwaltungsgebühr per QRIS zahlen. Gewinn sofort bearbeitet!"} },
  5: { app: "messagebox", scenario: "story_komp_d5_family",
    from: {id:"Ibu (rumah)", en:"Mom (home)", es:"Mamá (casa)", pt:"Mãe (casa)", fr:"Maman (maison)", it:"Mamma (casa)", de:"Mama (zu Hause)"},
    notifText: {id:"Nak, ada telepon 'bank' minta nomor kartu & kode. Kartunya sudah aku kasih, kode belum. Itu beneran bank ya?", en:"Sweetie, a 'bank' called asking for card number & code. I gave the card, not the code yet. Is that a real bank?", es:"Cariño, el 'banco' llamó pidiendo tarjeta y código. Di la tarjeta, aún no el código. ¿Es un banco real?", pt:"Querido, o 'banco' ligou pedindo cartão e código. Dei o cartão, ainda não o código. É um banco real?", fr:"Chéri, la « banque » a appelé pour la carte et le code. J'ai donné la carte, pas encore le code. C'est une vraie banque ?", it:"Tesoro, la 'banca' ha chiamato chiedendo carta e codice. Ho dato la carta, non ancora il codice. È una banca vera?", de:"Schatz, die 'Bank' hat angerufen und nach Karte und Code gefragt. Die Karte habe ich gegeben, den Code noch nicht. Ist das eine echte Bank?"} },
};
function buildAttackB(profile, day, seed) {
  const ev = ATTACK_B[day];
  if (!ev) return null;
  return { id: "atkB" + day, seed, app: ev.app, scenario: ev.scenario,
           from: L(ev.from), notifText: L(ev.notifText), _fromRaw: ev.from, _notifRaw: ev.notifText, slot: "b" };
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
  if (attack) {
    // every day's incident lands in the notification bar first (check-first flow)
    notifs.unshift({ id: nid(), app: attack.app, from: attack.from, text: attack.notifText, attack: true, read: false });
  }
  // the day's SECOND chapter sits in reserve — it surfaces in the notif bar
  // the moment the first incident resolves (two chapters per day, in sequence)
  const attackB = buildAttackB(profile, day, seed);

  return {
    profile, day,
    apps, contacts, notifs,
    attack: attack || null,
    attackB: attackB || null,
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
    { from: {id:"PocketPay",en:"PocketPay", fr:"PocketPay", it:"PocketPay", de:"PocketPay"}, text: {id:"Top-up Rp100.000 berhasil. Saldo Rp384.210.", en:"Top-up Rp100,000 successful. Balance Rp384,210.", fr:"Recharge de 100 000 Rp réussie. Solde 384 210 Rp.", it:"Ricarica Rp100.000 riuscita. Saldo Rp384.210.", de:"Aufladung 100.000 Rp erfolgreich. Kontostand 384.210 Rp."}, time: {id:"08:12",en:"08:12", fr:"08:12", it:"08:12", de:"08:12"} },
    { from: {id:"DailyMart",en:"DailyMart", fr:"DailyMart", it:"DailyMart", de:"DailyMart"}, text: {id:"Pesanan #DM-2214 diambil kurir. Sampai besok.", en:"Order #DM-2214 picked up. Arriving tomorrow.", fr:"Commande #DM-2214 récupérée. Arrive demain.", it:"Ordine #DM-2214 ritirato. Arriva domani.", de:"Bestellung #DM-2214 abgeholt. Kommt morgen an."}, time: {id:"Kemarin",en:"Yesterday", fr:"Yesterday", it:"Yesterday", de:"Yesterday"} },
    { from: {id:"Kurir Andi",en:"Andi (Courier)",es:"Andi (Mensajero)",pt:"Andi (Entregador)",hi:"आंदी (कूरियर)", fr:"Andi (coursier)", it:"Andi (corriere)", de:"Andi (Kurier)"}, text: {id:"Paket #PRJ-88 dititip di pos ronda.", en:"Package #PRJ-88 left at the guard post.", es:"Paquete #PRJ-88 en el puesto de guardia.", pt:"Encomenda #PRJ-88 na portaria.", hi:"पार्सल #PRJ-88 गार्ड पोस्ट पर।", fr:"Colis #PRJ-88 déposé au poste de garde.", it:"Pacco #PRJ-88 lasciato al posto di guardia.", de:"Paket #PRJ-88 an der Pforte hinterlegt."}, time: {id:"07:58",en:"07:58", fr:"07:58", it:"07:58", de:"07:58"} },
    { from: {id:"Bank Nusantara",en:"Nusantara Bank",es:"Banco Nusantara",pt:"Banco Nusantara",hi:"नुसंतारा बैंक", fr:"Nusantara Bank", it:"Nusantara Bank", de:"Nusantara Bank"}, text: {id:"Transaksi Rp50.000 berhasil. Saldo Rp1.2••••.", en:"Transaction Rp50,000 successful. Balance Rp1.2••••.", es:"Transacción Rp50.000 exitosa.", pt:"Transação Rp50.000 concluída.", hi:"लेन-देन Rp50,000 सफल।", fr:"Transaction de 50 000 Rp réussie. Solde 1,2•••• Rp.", it:"Transazione Rp50.000 riuscita. Saldo Rp1.2••••.", de:"Transaktion 50.000 Rp erfolgreich. Kontostand 1,2•••• Rp."}, time: {id:"Kemarin",en:"Yesterday", fr:"Yesterday", it:"Yesterday", de:"Yesterday"} },
  ],
  perms: [
    { app: {id:"SenterPro",en:"TorchPro", fr:"TorchPro", it:"TorchPro", de:"TorchPro"}, icon: "🔦", perms: {id:"SMS · Kontak · Mikrofon", en:"SMS · Contacts · Microphone", fr:"SMS · Contacts · Micro", it:"SMS · Contatti · Microfono", de:"SMS · Kontakte · Mikrofon"}, bad: true },
    { app: {id:"SocialSquare",en:"SocialSquare", fr:"SocialSquare", it:"SocialSquare", de:"SocialSquare"}, icon: "📸", perms: {id:"Kamera · Lokasi", en:"Camera · Location", fr:"Camera · Location", it:"Camera · Location", de:"Camera · Location"}, bad: false },
    { app: {id:"PocketPay",en:"PocketPay", fr:"PocketPay", it:"PocketPay", de:"PocketPay"}, icon: "👛", perms: {id:"Kamera (scan QR)", en:"Camera (QR scan)", fr:"Camera (QR scan)", it:"Camera (QR scan)", de:"Camera (QR scan)"}, bad: false },
    { app: {id:"SafeBrowse",en:"SafeBrowse", fr:"SafeBrowse", it:"SafeBrowse", de:"SafeBrowse"}, icon: "🌐", perms: {id:"Lokasi (opsional)", en:"Location (optional)", fr:"Location (optional)", it:"Location (optional)", de:"Location (optional)"}, bad: true },
  ],
  settings: [
    { icon: "📶", label: {id:"Jaringan & WiFi", en:"Network & WiFi", fr:"Network & WiFi", it:"Network & WiFi", de:"Network & WiFi"}, value: {id:"RumahKita_5G", en:"HomeNet_5G", fr:"HomeNet_5G", it:"HomeNet_5G", de:"HomeNet_5G"} },
    { icon: "🔔", label: {id:"Notifikasi", en:"Notifications", fr:"Notifications", it:"Notifications", de:"Notifications"}, value: "42" },
    { icon: "🔐", label: {id:"Kunci layar", en:"Screen lock", fr:"Screen lock", it:"Screen lock", de:"Screen lock"}, value: {id:"PIN 6 digit", en:"6-digit PIN", fr:"6-digit PIN", it:"6-digit PIN", de:"6-digit PIN"} },
    { icon: "👤", label: {id:"Akun", en:"Accounts", fr:"Accounts", it:"Accounts", de:"Accounts"}, value: "1" },
    { icon: "🧩", label: {id:"Aplikasi", en:"Apps", fr:"Apps", it:"Apps", de:"Apps"}, value: "10" },
  ],
};

if (typeof module !== "undefined") module.exports = { APP_CATALOG, WORLD_TEMPLATES, STORY_DAYS, buildWorld, L, chatPreviewFor, INAPP };
