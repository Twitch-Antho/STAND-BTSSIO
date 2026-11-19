# 📊 Brancher le site sur un Google Sheet (stockage central)

Objectif : que **chaque inscription** du site s'enregistre dans un Google Sheet,
et que la page admin affiche le **compteur + la liste partagés** entre tous les
téléphones.

> ⚠️ En mode central, tu collectes **réellement** les infos saisies par les
> visiteurs (dont des mineurs). Préviens-les, n'utilise ces données que pour la
> démo, et **supprime la feuille après le forum**.

## Étapes (≈ 5 min)

1. **Crée un Google Sheet** vide sur https://sheets.google.com (nomme-le ex.
   « Stand BTS SIO »).

2. Dans le Sheet : menu **Extensions → Apps Script**.

3. Supprime le code présent, puis **colle tout le contenu de `Code.gs`**
   (le fichier à côté de ce guide). Enregistre (icône disquette).

4. En haut à droite : **Déployer → Nouveau déploiement**.
   - Type (roue crantée) : **Application Web**
   - *Exécuter en tant que* : **Moi**
   - *Qui a accès* : **Tout le monde**
   - Clique **Déployer**, autorise l'accès à ton compte quand c'est demandé.

5. Copie l'**URL de l'application Web** (elle se termine par `/exec`).

6. Dans le repo, ouvre `js/config.js` et colle l'URL :

   ```js
   window.URL_SHEET = "https://script.google.com/macros/s/XXXXX/exec";
   ```

   Commit + push. C'est prêt ✅

## Vérifier que ça marche

- Remplis le formulaire du site → une nouvelle ligne doit apparaître dans le Sheet.
- Ouvre la page admin (login `groupe` / `SISR2`) → le compteur et la liste
  affichent les données du Sheet (communes à tous les appareils).

## Remettre à zéro avant le forum

Supprime les lignes de données dans le Google Sheet (garde la ligne d'en-tête).

## Revenir en mode local

Remets `window.URL_SHEET = "";` dans `js/config.js`.

## En cas de souci

- **Rien ne s'ajoute** : revérifie que *Qui a accès* = « Tout le monde », et que
  l'URL se termine bien par `/exec` (pas `/dev`).
- **L'admin n'affiche rien** : après chaque modification du `Code.gs`, il faut
  **redéployer** (Déployer → Gérer les déploiements → modifier → nouvelle version).
- Pense à recharger le site en navigation privée (cache).
