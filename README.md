# 🍽️ STAND BTS SIO — Démo phishing « Repas gratuit au Petit Saint-B »

Mini-site web de **sensibilisation à l'ingénierie sociale** pour un stand du
**Forum des Métiers du Numérique** (BTS SIO – SISR, Lycée Saint-Bénigne, Dijon).

> ⚠️ **Projet pédagogique encadré par un professeur.** Le but est d'éduquer, pas
> de nuire : aucune donnée n'est envoyée sur Internet.

## 🎯 Le principe

1. Un **QR code** affiché devant le stand annonce « **REPAS GRATUIT** » au
   restaurant du lycée, *Le Petit Saint-B*.
2. Le visiteur scanne et arrive sur ce site : une offre « trop belle » avec un
   **formulaire d'infos personnelles** à remplir pour « réserver » son repas.
3. Dès qu'il valide, le site révèle le piège : **« Vous venez de vous faire
   piéger ! »**, lui montre ce qu'il vient de donner à un inconnu, et explique
   les bons réflexes.

C'est une démonstration classique de **phishing / quishing** (hameçonnage par QR code).

## 🔒 Sécurité & vie privée

- Site **100% statique** (HTML/CSS/JS), **aucun serveur**.
- Les infos saisies **ne quittent jamais l'appareil** : elles sont stockées
  en local (`localStorage`) uniquement pour la démonstration.
- C'est volontaire : ça prouve le danger **sans** créer de vraie fuite de données.

## 📂 Structure

```
index.html      → page appât + formulaire + écran de révélation
admin.html      → page équipe : voir les captures + exporter en .js
css/style.css   → tout le style
js/script.js    → faux compte à rebours, capture, révélation du piège
js/admin.js     → affichage + export des captures (captures.js)
```

## 🕹️ Utilisation au stand

1. Héberger le site (voir ci-dessous) et générer un **QR code** pointant vers
   l'URL, avec la légende « REPAS GRATUIT ».
2. Le visiteur scanne avec **son propre téléphone** → la révélation s'affiche
   sur son écran, vous commentez ensemble.
3. Option : sur une **tablette partagée** du stand, la page `admin.html` liste
   toutes les saisies faites sur cet appareil et permet de les **exporter dans
   un fichier `captures.js`** (à supprimer après le forum).

## 🚀 Héberger gratuitement (GitHub Pages)

1. Dépôt GitHub → **Settings** → **Pages**
2. *Source* : branche `main`, dossier `/root`
3. L'URL publique `https://<utilisateur>.github.io/STAND-BTSSIO/` est celle à
   mettre dans le QR code.

## 💡 Techniques de manipulation utilisées (à expliquer au public)

- **Fausse urgence** : compte à rebours « offre valable aujourd'hui seulement ».
- **Preuve sociale truquée** : fausses notes 5★ et faux témoignages.
- **Appât du gratuit** : « 100% offert », « aucune carte requise ».
- **Sur-collecte** : nom, e-mail, téléphone, date de naissance, ville et classe
  = de quoi vous identifier et monter une arnaque ciblée.

---

*Démonstration pédagogique — BTS SIO (SISR). À usage éducatif uniquement.*
