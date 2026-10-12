/* ============================================================
   HumanPatch — site docs (About/Privacy/Terms/Accessibility/Contact)
   Ported & localized from HumanPatch-GUI concept. Multilingual.
   ============================================================ */

const DOC_ORDER = ["about", "privacy", "terms", "access", "contact"];

const DOCS = {
  about: {
    title: {id: "Tentang", en: "About", es: "Acerca de", fr: "À propos", it: "Informazioni", de: "Über", pt: "Sobre"},
    body: {id: [
      ["p", "HumanPatch adalah petualangan keamanan siber yang adaptif. Peta dan alur ceritanya sama — tetapi dialog, pesan, dan tantangan berubah sesuai karakter yang kamu mainkan dan keputusan yang kamu ambil."],
      ["p", "Lawanmu adalah mesin skenario terkontrol. Teks generatif (AI) menyusul di lapisan adversary. Dunia di dalam HP ini fiktif: aplikasi, kontak, dan pesan semuanya simulasi."],
      ["h", "Untuk siapa"],
      ["ul", ["Pengguna pertama di negara berkembang yang baru aktif digital", "Siapa pun yang ingin belajar mengenali penipuan lewat pengalaman, bukan ceramah", "Pelatih dan pendidik yang butuh simulasi aman"]],
    ], en: [
      ["p", "HumanPatch is an adaptive cybersecurity adventure. The map is shared — dialogue, messages, and challenges change with the character you play and the actions you take."],
      ["p", "The adversary is a controlled scenario engine; generative AI layers in later. Everything inside this phone is simulated: apps, contacts, messages."],
      ["h", "Who it's for"],
      ["ul", ["First-time internet users in developing countries", "Anyone who learns scams by experiencing them safely, not lectures", "Trainers and educators needing a safe simulation"]],
    ], es: [
      ["p", "HumanPatch es una aventura de ciberseguridad adaptativa. El mapa es compartido: diálogo, mensajes y retos cambian según el personaje y tus decisiones."],
      ["p", "El adversario es un motor de escenarios controlado. Todo dentro de este teléfono es simulado."],
      ["h", "Para quién"],
      ["ul", ["Usuarios primerizos en países en desarrollo", "Quien prefiera aprender viviendo estafas de forma segura", "Formadores que necesiten una simulación segura"]],
    ],
    fr: [["p", "HumanPatch est une aventure de cybersécurité adaptative. Le dialogue, les messages et les défis changent selon le personnage joué et vos décisions. Tout est simulé."]],
    it: [["p", "HumanPatch è un'avventura di cybersicurezza adattiva. Dialoghi, messaggi e sfide cambiano col personaggio e le tue decisioni. Tutto è simulato."]],
    de: [["p", "HumanPatch ist ein adaptives Cybersicherheits-Abenteuer. Dialoge, Nachrichten und Herausforderungen ändern sich mit Charakter und Entscheidungen. Alles ist simuliert."]],
    pt: [
      ["p", "HumanPatch é uma aventura adaptativa de segurança digital. O mapa é compartilhado — diálogos, mensagens e desafios mudam com o personagem e suas escolhas."],
      ["p", "O adversário é um motor de cenários controlado. Tudo dentro deste celular é simulado."],
      ["h", "Para quem"],
      ["ul", ["Usuários digitais de primeira viagem em países em desenvolvimento", "Quem prefere aprender golpes vivendo-os com segurança", "Treinadores que precisam de simulação segura"]],
    ]},
  },
  privacy: {
    title: {id: "Privasi", en: "Privacy", es: "Privacidad", fr: "Confidentialité", it: "Privacy", de: "Datenschutz", pt: "Privacidade"},
    body: {id: [
      ["p", "Akun demo, hash kata sandi, dan progres karakter tersimpan di browser ini. Tidak ada yang dikirim ke server HumanPatch selain interaksi latihan yang dianonimkan."],
      ["p", "Nama karakter fiktif. Jangan pernah memasukkan kata sandi atau data rahasia asli ke halaman simulasi — kolom itu tidak disimpan sebagai kredensial."],
    ], en: [
      ["p", "Demo accounts, password hashes, and character progress stay in this browser. Nothing is sent to a HumanPatch server except anonymized practice interactions."],
      ["p", "Character names are fictional. Never enter real passwords or secrets into a simulated page — those fields are not stored as credentials."],
    ], es: [
      ["p", "Las cuentas demo y el progreso se quedan en este navegador. Nada se envía salvo interacciones anonimizadas."],
      ["p", "Los nombres son ficticios. Nunca ingreses contraseñas reales en páginas simuladas."],
    ],
    fr: [["p", "Les comptes démo et la progression restent dans ce navigateur. N'entrez jamais de vrais mots de passe dans des pages simulées."]],
    it: [["p", "Gli account demo e i progressi restano in questo browser. Non inserire mai password vere in pagine simulate."]],
    de: [["p", "Demo-Konten und Fortschritt bleiben in diesem Browser. Gib nie echte Passwörter in simulierte Seiten ein."]],
    pt: [
      ["p", "Contas demo e progresso ficam neste navegador. Nada é enviado além de interações anonimizadas."],
      ["p", "Nomes são fictícios. Nunca digite senhas reais em páginas simuladas."],
    ]},
  },
  terms: {
    title: {id: "Ketentuan", en: "Terms", es: "Términos", fr: "Conditions", it: "Termini", de: "Nutzungsbedingungen", pt: "Termos"},
    body: {id: [
      ["p", "HumanPatch adalah demo pelatihan. Ini bukan keamanan akun produksi, dan tidak mengirim email phishing sungguhan."],
      ["p", "Adegan, pengirim, dan halaman di dalam dunia adalah fiktif. Jangan menggunakannya terhadap orang sungguhan."],
    ], en: [
      ["p", "HumanPatch is a training demo. It does not provide production account security, and it does not send real phishing mail."],
      ["p", "Scenes, senders, and pages inside the world are fictional. Do not use them against real people."],
    ], es: [
      ["p", "HumanPatch es una demo de entrenamiento. No envía correos de phishing reales."],
      ["p", "Escenas y remitentes son ficticios. No los uses contra personas reales."],
    ],
    fr: [["p", "HumanPatch est une démo de formation. Elle n'envoie pas de vrais mails de phishing. Les scènes sont fictives."]],
    it: [["p", "HumanPatch è una demo di formazione. Non invia vere email di phishing. Le scene sono immaginarie."]],
    de: [["p", "HumanPatch ist eine Trainings-Demo. Keine echten Phishing-Mails. Alle Szenen sind fiktiv."]],
    pt: [
      ["p", "HumanPatch é uma demo de treinamento. Não envia e-mails de phishing reais."],
      ["p", "Cenas e remetentes são fictícios. Não use contra pessoas reais."],
    ]},
  },
  access: {
    title: {id: "Aksesibilitas", en: "Accessibility", es: "Accesibilidad", fr: "Accessibilité", it: "Accessibilità", de: "Barrierefreiheit", pt: "Acessibilidade"},
    body: {id: [
      ["p", "Teks dan kontrol memenuhi target sentuh 44px. Dunia bisa dimainkan sepenuhnya dengan keyboard."],
      ["p", "Animasi berhenti ketika sistem meminta reduced motion. Warna bukan satu-satunya cara membaca status — selalu ada ikon atau teks."],
    ], en: [
      ["p", "Text and controls meet a 44px touch target. The world is fully playable with a keyboard."],
      ["p", "Motion stops when the system requests reduced motion. Color is never the only signal — icons or text always accompany it."],
    ], es: [
      ["p", "Controles con objetivo táctil de 44px. El mundo es jugable con teclado."],
      ["p", "La animación se detiene con 'reduced motion'. El color nunca es la única señal."],
    ],
    fr: [["p", "Contrôles avec cible tactile de 44px. Jouable au clavier. Les animations s'arrêtent si le système demande « reduced motion »."]],
    it: [["p", "Controlli con target tattile da 44px. Giocabile con la tastiera. Le animazioni si fermano con « reduced motion »."]],
    de: [["p", "Steuerung mit 44px-Touchziel. Mit Tastatur spielbar. Animationen stoppen bei reduced motion."]],
    pt: [
      ["p", "Controles com alvo de toque de 44px. O mundo é jogável com teclado."],
      ["p", "Animações param com 'reduced motion'. Cor nunca é o único sinal."],
    ]},
  },
  contact: {
    title: {id: "Kontak", en: "Contact", es: "Contacto", fr: "Contact", it: "Contatti", de: "Kontakt", pt: "Contato"},
    body: {id: [
      ["p", "Demo ini tidak punya inbox dukungan. Pertanyaan tentang sebuah adegan seharusnya muncul di debrief — di sana setiap keputusan dijelaskan."],
      ["p", "Untuk korespondensi tim (hackathon/juri), hubungi melalui halaman tim di platform acara."],
    ], en: [
      ["p", "This demo has no support inbox. Questions about a stage belong in the debrief — it explains the decision you just made."],
      ["p", "For team correspondence (hackathon/judges), reach us via the team page on the event platform."],
    ], es: [
      ["p", "Esta demo no tiene buzón de soporte. Las preguntas pertenecen al debrief."],
      ["p", "Para el equipo del hackathon, escríbenos vía la plataforma del evento."],
    ],
    fr: [["p", "Pas de boîte de support pour cette démo. Les questions sur une scène trouvent leur réponse dans le debrief."]],
    it: [["p", "Nessuna casella di supporto per questa demo. Le domande trovano risposta nel debrief."]],
    de: [["p", "Kein Support-Postfach für diese Demo. Fragen werden im Debrief beantwortet."]],
    pt: [
      ["p", "Esta demo não tem caixa de suporte. Perguntas pertencem ao debrief."],
      ["p", "Para a equipe do hackathon, fale pela plataforma do evento."],
    ]},
  },
};

if (typeof module !== "undefined") module.exports = { DOCS, DOC_ORDER };
