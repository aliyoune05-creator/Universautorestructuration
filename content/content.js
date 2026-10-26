/* ═══════════════════════════════════════════════════════════════
   UNIVERS AUTO — Données du site
   ✏️  C'EST ICI QUE TOUT SE MODIFIE : coordonnées, réseaux,
       véhicules et descriptions. Le site se met à jour tout
       seul, sans toucher au HTML ni au CSS.
   ═══════════════════════════════════════════════════════════════ */
window.UNIVERS_AUTO = {

  /* ── MARQUE & COORDONNÉES ────────────────────────────────── */
  brand: {
    name: "Univers Auto",
    slogan: "Ingénierie de précision, mobilité d'exception",
    city: "Abidjan, Côte d'Ivoire",
    // WhatsApp — format international, chiffres uniquement
    waNumber: "2250702800200",
    waDisplay: "+225 07 02 800 200",
    // Téléphone cliquable (même ligne directe)
    telNumber: "+2250702800200",
    telDisplay: "07 02 800 200",
    email: "universauto9@gmail.com",
    hours: "Lun – Dim : 8h00 – 20h00"
  },

  /* ── SHOWROOM ────────────────────────────────────────────── */
  showroom: {
    name: "Showroom Univers Auto",
    district: "Angré Château",
    address: "Angré Château, Cocody — Abidjan, Côte d'Ivoire",
    mapsUrl: "https://maps.google.com/?q=Angr%C3%A9+Ch%C3%A2teau,+Abidjan,+C%C3%B4te+d%27Ivoire"
  },

  /* ── RÉSEAUX SOCIAUX (remplacez par vos liens officiels) ── */
  socials: [
    { id: "tiktok",    name: "TikTok",    handle: "@universauto.ci", url: "https://tiktok.com/@universauto.ci" },
    { id: "facebook",  name: "Facebook",  handle: "/UniversAuto",    url: "https://www.facebook.com/universauto.ci" },
    { id: "instagram", name: "Instagram", handle: "@universauto.ci", url: "https://instagram.com/universauto.ci" },
    { id: "youtube",   name: "YouTube",   handle: "@universauto.ci", url: "https://youtube.com/@universauto.ci" },
    { id: "whatsapp",  name: "WhatsApp",  handle: "07 02 800 200",   url: "https://wa.me/2250702800200?text=Bonjour%20Univers%20Auto%20!%20Je%20souhaite%20des%20informations%20sur%20vos%20véhicules." }
  ],

  /* ── CATÉGORIES DE LA GALERIE ────────────────────────────── */
  categories: ["tous", "suv", "berlines", "coupes", "electriques"],
  labels: {
    "tous": "Tous",
    "suv": "SUV",
    "berlines": "Berlines",
    "coupes": "Coupés",
    "electriques": "Électriques"
  },

  /* ── LES 20 VÉHICULES (modifiez titres & descriptions) ─────
     src   → fichier dans /images
     cat   → suv | berlines | coupes | electriques
  ─────────────────────────────────────────────────────────────── */
  gallery: [
    {
      src: "images/veh-01-g63.png",
      title: "Mercedes-Benz G 63 AMG",
      cat: "suv",
      desc: "L'icône de Berlin réinventée à Abidjan. Le G-Wagen impose sa silhouette de cube au milieu de la lumière, 585 chevaux de pure présence, noir perle baigné d'or."
    },
    {
      src: "images/veh-02-range-rover.png",
      title: "Range Rover Autobiography LWB",
      cat: "suv",
      desc: "Le grand seigneur du luxe britannique. En longue wheelbase, les places arrière deviennent une suite business : sièges capitaine, toit panoramique et un silence de première classe."
    },
    {
      src: "images/veh-03-lx600.png",
      title: "Lexus LX 600",
      cat: "suv",
      desc: "Le drapeau japonais du SUV premium : V6 biturbo 409 ch, finition Executive Lounge et un confort réglé comme une montre. La route du bord de mer n'a jamais été aussi majestueuse."
    },
    {
      src: "images/veh-04-escalade.png",
      title: "Cadillac Escalade V",
      cat: "suv",
      desc: "Le roi américain du full-size. V8 biturbo 682 ch, écran panoramique et présence de colosse. Dans un Escalade V, chaque arrivée est un événement."
    },
    {
      src: "images/veh-05-cayenne.png",
      title: "Porsche Cayenne Turbo S",
      cat: "suv",
      desc: "Le SUV le plus sportif du monde : 640 ch, 0 à 100 km/h en 3,3 s, et un confort digne d'un état des lieux présidentiel. La performance que la ville n'attend pas."
    },
    {
      src: "images/veh-06-q8.png",
      title: "Audi Q8 55 TFSI quattro",
      cat: "suv",
      desc: "L'élégance coupé d'Ingolstadt : transmission quattro, phares matriciels et cockpit virtuel. Un équilibre parfait entre technologie et esthétique, en chrome graphite."
    },
    {
      src: "images/veh-07-x7.png",
      title: "BMW X7 M60i",
      cat: "suv",
      desc: "La grande famille M : V8 530 ch, traction intégrale et suspension adaptative. Une présence massive qui traverse Abidjan avec la précision d'un chirurgien."
    },
    {
      src: "images/veh-08-landcruiser.png",
      title: "Toyota Land Cruiser 300 VXR",
      cat: "suv",
      desc: "L'intouchable du haut de gamme ivoirien. Robuste, prestigieux et redoutable en revente : la valeur refuge de la mobilité, V6 400 ch et allure de chef d'État."
    },
    {
      src: "images/veh-09-s580.png",
      title: "Mercedes-Benz S 580 4MATIC",
      cat: "berlines",
      desc: "La référence mondiale de la berline de prestige. Classe S, sièges massants, éclairage d'ambiance à 64 couleurs : l'automobile d'affaires réinventée, au plus haut niveau."
    },
    {
      src: "images/veh-10-b760i.png",
      title: "BMW 760i xDrive",
      cat: "berlines",
      desc: "La M Performance en 7 Série : V8 585 ch, sièges massage Executive, phares laser. Une voiture d'apparat avec un secret — l'envie de dépasser."
    },
    {
      src: "images/veh-11-a8l.png",
      title: "Audi A8 L quattro",
      cat: "berlines",
      desc: "Longue wheelbase, confort VIP et pilotage assisté nouvelle génération. L'A8 L est une suite mobile : silence absolu, technologie en avance, dignité absolue."
    },
    {
      src: "images/veh-12-g90.png",
      title: "Genesis G90",
      cat: "berlines",
      desc: "Le fleuron coréen qui fait taire les snobs. V6 biturbo 409 ch, sièges massants et abitacle plus luxueux que bien des 5 étoiles. Un choix rare, donc un choix signature."
    },
    {
      src: "images/veh-13-eqs.png",
      title: "Mercedes-Benz EQS 450+",
      cat: "electriques",
      desc: "L'électrique au sommet de la classe S : jusqu'à 770 km d'autonomie, Hyperscreen de 141 pouces et un silence de cathédrale. L'avenir de l'automobile d'affaires a atterri à Abidjan."
    },
    {
      src: "images/veh-14-911.png",
      title: "Porsche 911 Carrera 4S",
      cat: "coupes",
      desc: "La voiture de sport qui n'a jamais cessé d'être une icône. Flat-six 450 ch, arrière vivant, lignes intemporelles : la pièce de collection qui a encore le cœur d'une arme."
    },
    {
      src: "images/veh-15-m4.png",
      title: "BMW M4 Competition",
      cat: "coupes",
      desc: "510 ch, boîte manuelle six rapports, carrosserie agressive. La M4 est la déclaration de guerre de la famille M : de la pure émotion de conduite, signée Berlin."
    },
    {
      src: "images/veh-16-amggt.png",
      title: "Mercedes-AMG GT 63 S",
      cat: "coupes",
      desc: "Sous le long capot, un V8 biturbo de 639 ch ; dans l'habitacle 2+2, le calme d'une suite. Une présence qui arrête le trafic, une performance qui le fait fuir."
    },
    {
      src: "images/veh-17-taycan.png",
      title: "Porsche Taycan Turbo",
      cat: "electriques",
      desc: "La 911, électrifiée : 680 ch en boost, 0 à 100 km/h en 2,8 s, architecture 800 V pour des recharges éclair. L'émotion sportive, avec une conscience épurée."
    },
    {
      src: "images/veh-18-etrongt.png",
      title: "Audi e-tron GT quattro",
      cat: "electriques",
      desc: "L'électrique quattro dessiné comme un coupé concept : 646 ch, centre de gravité bas et silhouette primée. La technologie et l'émotion, enfin d'accord."
    },
    {
      src: "images/veh-19-modelx.png",
      title: "Tesla Model X Plaid",
      cat: "electriques",
      desc: "1 020 chevaux, 0 à 100 km/h en 2,5 s, portières Faucon et mises à jour en continu : le SUV électrique qui a redéfini ce que peut signifier le mot performance."
    },
    {
      src: "images/veh-20-ioniq5.png",
      title: "Hyundai Ioniq 5",
      cat: "electriques",
      desc: "La coupé-SUV électrique World Car of the Year : 217 kW, recharge ultra-rapide 350 kW, design rétrofuturiste. L'électrique premium devient enfin à la portée de tous."
    }
  ]

  /* ✏️ AJOUTEZ UN VÉHICULE : copiez un bloc { src, title, cat, desc }
     et placez l'image dans /images. Le site l'affiche tout seul. */
};
