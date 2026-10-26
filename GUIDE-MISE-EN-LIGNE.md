# 🚀 Guide de mise en ligne — Univers Auto

Ce guide vous accompagne pas à pas pour publier le site en production.
Aucun serveur, aucun compte complexe : c'est un site **100% statique**.

## 1. Choisir un hébergeur (gratuit ou pas cher)

| Hébergeur | Coût | Difficulté |
|---|---|---|
| **Netlify** | Gratuit | ⭐ (glisser-déposer du dossier) |
| **Vercel** | Gratuit | ⭐ |
| **Cloudflare Pages** | Gratuit | ⭐ |
| **GitHub Pages** | Gratuit | ⭐⭐ |
| **Hébergeur classique** (OVH, o2switch…) | ~7 €/an | ⭐⭐ |

## 2. Option A — Netlify par glisser-déposer (2 min)

1. Allez sur <https://app.netlify.com/drop>.
2. **Glissez-déposez** le dossier `univers-auto` (celui qui contient
   `index.html`) dans la zone du site.
3. Netlify publie immédiatement le site sur une adresse
   `https://xxxxxx.netlify.app`.
4. Dans *Site settings → Change site name*, choisissez votre nom
   (ex. `univers-auto` → `https://univers-auto.netlify.app`).

## 3. Option B — Compte `.ci` professionnel (recommandé)

1. Déposez le **contenu du dossier** `univers-auto` (index.html, styles.css,
   script.js, `content/`, `images/`) dans le dossier `public_html/` de votre
   hébergeur, via le gestionnaire de fichiers ou FTP (FileZilla).
2. Pointez votre nom de domaine (`universauto.ci` ou autre) vers l'hébergeur.
3. Activez le **HTTPS gratuit** (Let's Encrypt) — l'hébergeur le propose
   généralement en 1 clic.
4. Vérifiez : `https://www.votredomaine.ci` → le site s'affiche.

## 4. Personnaliser avant de publier (3 min)

Ouvrez **`content/content.js`** et modifiez :

- `brand.waNumber` / `brand.telDisplay` — vos numéros (format international
  sans le `+` pour `waNumber`, ex. `2250702800200`).
- `brand.email` — votre email.
- `showroom` — adresse exacte du showroom + lien Google Maps.
- `socials` — **vos liens officiels** TikTok / Facebook / Instagram / YouTube.
- `gallery` — les 20 véhicules : titres et descriptions (l'outil
  `content/README.md` détaille le format).

Chaque modification se reflète **immédiatement** sur le site, sans toucher
à d'autre fichier.

## 5. Optimiser le poids (optionnel, si limite d'hébergement)

Le dossier `images/` contient des PNG Ultra HD. Pour alléger sans perte
visible :

1. Ouvrez <https://squoosh.app>.
2. Glissez les PNG, choisissez **WebP**, qualité ~75.
3. Remplacez les fichiers et mettez à jour les `src` dans
   `content/content.js` (ou renommez en `.webp` et changez l'extension).

## 6. Vérifications finales

- [ ] Le site s'ouvre sur `https://…` (cadenas vert).
- [ ] Le bouton **Devis** en haut à droite ouvre WhatsApp avec votre numéro.
- [ ] Le formulaire de contact fonctionne et propose le relais WhatsApp.
- [ ] La carte Abidjan et la carte 3D Angré s'ouvrent / zooment.
- [ ] La recherche trouve un véhicule (tapez « G63 ») et ouvre la lightbox.
- [ ] Le site est propre sur mobile (375 px).
- [ ] Le nom de domaine et les réseaux sociaux pointent vers les bons liens.

**C'est tout. Votre concession est en ligne. 🏁**
