# 🏎️ UNIVERS AUTO — Site vitrine automobile de luxe

> **Concessionnaire premium à Abidjan** — Ingénierie de précision, mobilité d'exception.

Site vitrine statique (HTML · CSS · JS, zéro dépendance, zéro build),
style **Luxe Automobile 6 étoiles**, livré avec **20 véhicules Ultra HD**
générés (SUV, berlines, coupés, électriques), hologrammes de services,
carte 3D du showroom Angré Château, carte interactive d'Abidjan et
**recherche intelligente** de tout le contenu du site.

## 📦 Contenu de l'archive

```
├── index.html          → Structure complète du site (SEO intégré)
├── styles.css          → Design system premium (palette royale auto)
├── script.js           → Moteur immersif (16 systèmes interactifs)
├── content/
│   ├── content.js      → ★ TOUTE la collection + coordonnées (modifiable)
│   └── README.md       → Guide de modification du contenu
├── images/
│   ├── logo.png                 → Logo officiel Univers Auto
│   ├── veh-*.png (×20)          → Véhicules Ultra HD générés
│   └── hol-*.png (×4)           → Hologrammes des services
├── GUIDE-MISE-EN-LIGNE.md       → Pas à pas de publication
└── README.md                    → Ce fichier
```

## 🎨 Choix de direction artistique appliqués

### Palette royale automobile (exigée)
| Rôle | Couleur | Hex |
|---|---|---|
| Noir perle (puissance) | ⬛ | `#0A0A0A` |
| Or impérial (prestige) | 🟨 | `#FFD700` |
| Blanc diamant (pureté) | ⬜ | `#FFFFFF` |
| Bleu saphir (confiance) | 🟦 | `#0F52BA` |
| Argent chrome (techno auto) | ⬜ | `#C0C0C0` |

Le vert n'apparaît que comme **couleur de marque** (icônes WhatsApp) —
jamais dans l'interface.

### Typographie
- **Montserrat** (400→900) — corps, titres, interface : modernité mécanique.
- **Playfair Display** (italique) — accents de prestige (« précision »,
  « d'exception », bandeau défilant) : élégance 6 étoiles.

### Animations & immersion
1. **Préloader** cinématique (logo + barre or/saphir « Allumage du système »).
2. **Slogan animé** « Ingénierie de précision, mobilité d'exception » —
   décodage cybernétique + néon **or impérial ↔ chrome** pulsant.
3. **Particules** or/chrome/saphir en canvas dans le hero (pause hors-écran).
4. **Parallaxe** : fond hero (zoom lent), contenu hero, véhicules de la galerie.
5. **Tilt 3D** des 4 cartes services + halo radial qui suit la souris.
6. **Hologrammes animés** : balayage lumineux (scanline or/saphir), flicker
   de projection et flottement des visuels des services.
7. **Galerie immersive** : filtres (Tous/SUV/Berlines/Coupés/Électriques),
   hover zoom + légende complète, **lightbox** clavier (←/→/Échap) + swipe.
8. **Recherche intelligente** : instantanée sur véhicules, services et
   sections ; Entrée pour le 1ᵉʳ résultat, flèches pour naviguer.
9. **Carte 3D Angré Château** : inclinaison perspective qui suit la souris,
   marqueur showroom pulsant, POI au survol (CFAO, Angré Golf, Bd Vauguin…).
10. **Carte interactive Abidjan** : 11 communes survolables, panneau au clic,
    zoom molette/boutons, glisser-déposer, marqueur showroom pulsant.
11. **Compteurs** animés (120+ véhicules, 98%, 20 exposés, 120 pts contrôle).
12. **Curseur personnalisé** or + halo élastique (desktop).
13. **Bandeau marquee** or défilant des 6 univers de la marque.
14. **Formulaire** : labels flottants, validation live, succès animé +
    **relais WhatsApp** avec message pré-rempli.
15. **FAB WhatsApp** dernière génération : double anneau pulsant, infobulle.
16. **Réseaux sociaux** (TikTok, Facebook, Instagram, YouTube, WhatsApp) en
    couleurs de marque officielles, générés depuis `content.js`.

### Contact & réseaux
- WhatsApp : **07 02 800 200** (`wa.me/2250702800200`) — FAB + nav + cartes.
- Téléphone cliquable : **07 02 800 200** (`tel:+2250702800200`).
- Email : **universauto9@gmail.com** (mailto, contact + footer).
- Showroom : **Angré Château, Cocody — Abidjan** (lien Google Maps).
- Réseaux : `@universauto.ci` — ⚠️ à remplacer par vos liens officiels
  dans `content/content.js` (champ `socials`).

### SEO & accessibilité
- `<title>`, meta description, Open Graph, favicon, `lang="fr"`.
- HTML sémantique, `aria-label`, navigation clavier, focus visibles,
  `prefers-reduced-motion` respecté, `alt` sur toutes les images.

## ▶️ Lancer le site en local
- **Double-cliquer** sur `index.html` (fonctionne hors-ligne), ou
- `python3 -m http.server 8080` → `http://localhost:8080`.

## 📋 Note images
20 véhicules générés IA Ultra HD dans la palette or/saphir/chrome :
8 SUV (G 63 AMG, Range Rover, LX 600, Escalade V, Cayenne Turbo S, Q8,
X7 M60i, Land Cruiser 300), 4 berlines (S 580, 760i, A8 L, G90),
3 coupés (911, M4, AMG GT) et 5 électriques (EQS, Taycan, e-tron GT,
Model X, Ioniq 5). + 4 hologrammes de services. L'œuvre est
**intemporelle** : aucune date n'apparaît sur le site. Si votre hébergeur
limite le poids, compressez les PNG en WebP via squoosh.app — le site
resterait identique visuellement.
