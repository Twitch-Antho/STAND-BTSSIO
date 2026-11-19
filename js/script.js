/* ============================================================
   STAND BTS SIO — Logique de la démonstration
   1. Faux compte à rebours (manipulation : fausse urgence)
   2. Capture du formulaire -> enregistrement local (fichier JS)
   3. Révélation pédagogique du piège
   ------------------------------------------------------------
   IMPORTANT : rien n'est envoyé sur Internet. Toutes les données
   restent UNIQUEMENT dans le navigateur (localStorage) de la
   personne. C'est une démonstration de sensibilisation.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Faux compte à rebours ---------- */
  var compteur = document.getElementById("compteur");
  if (compteur) {
    var restant = 299; // 4 min 59 s
    setInterval(function () {
      if (restant > 0) restant--;
      var m = String(Math.floor(restant / 60)).padStart(2, "0");
      var s = String(restant % 60).padStart(2, "0");
      compteur.textContent = m + ":" + s;
    }, 1000);
  }

  /* ---------- 2. Capture du formulaire ---------- */
  var form = document.getElementById("formulaire");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var data = {
      nom: form.nom.value.trim(),
      email: form.email.value.trim(),
      telephone: form.telephone.value.trim(),
      naissance: form.naissance.value,
      ville: form.ville.value.trim(),
      classe: form.classe.value.trim(),
      date_capture: new Date().toLocaleString("fr-FR")
    };

    // Vérif minimale : au moins un nom et un email
    if (!data.nom || !data.email) {
      alert("Merci de remplir au moins ton nom et ton e-mail 🙂");
      return;
    }

    enregistrerCapture(data);
    incrementerCompteur();
    afficherPiege(data);
  });

  /* ---------- Compteur de personnes piégées ----------
     Variable persistante incrémentée à CHAQUE inscription.
     Elle n'est pas remise à zéro quand on vide la liste des captures :
     c'est le total cumulé depuis le début. */
  function incrementerCompteur() {
    var n = parseInt(localStorage.getItem("compteur_pieges") || "0", 10);
    if (isNaN(n)) n = 0;
    try {
      localStorage.setItem("compteur_pieges", String(n + 1));
    } catch (err) {
      // localStorage indisponible : pas grave pour la démo
    }
  }

  /* ---------- Enregistrement local (= le "fichier JS") ---------- */
  function enregistrerCapture(data) {
    var captures = [];
    try {
      captures = JSON.parse(localStorage.getItem("captures_stand") || "[]");
    } catch (err) {
      captures = [];
    }
    captures.push(data);
    try {
      localStorage.setItem("captures_stand", JSON.stringify(captures));
    } catch (err) {
      // localStorage indisponible (navigation privée) : pas grave pour la démo
    }
  }

  /* ---------- 3. Révélation du piège ---------- */
  function afficherPiege(data) {
    var appat = document.getElementById("appat");
    var piege = document.getElementById("piege");
    if (appat) appat.hidden = true;

    // Construction du récapitulatif de ce que la personne a donné
    var lignes = [
      ligne("Nom complet", data.nom),
      ligne("E-mail", data.email),
      ligne("Téléphone", data.telephone),
      ligne("Date de naissance", formaterDate(data.naissance)),
      ligne("Ville", data.ville),
      ligne("Classe au lycée", data.classe, true)
    ].filter(Boolean).join("");

    piege.innerHTML = [
      '<div class="piege-contenu">',

        '<div class="alerte-titre">',
          '<span class="emoji-geant">🎣</span>',
          '<h1>Vous venez de vous faire piéger !</h1>',
        '</div>',

        '<p class="piege-intro">Il n\'y a pas de "repas gratuit au Petit Saint-B". Ce stand est une démonstration ',
        'du <strong>BTS SIO</strong> sur le <strong>phishing</strong> et le <strong>QR code piégé</strong> (quishing). ',
        'Venez nous voir au stand, on vous explique tout !</p>',

        // Récap des données volées
        '<div class="carte">',
          '<h2>📋 Ce que vous venez de donner à un inconnu :</h2>',
          lignes,
        '</div>',

        // Pourquoi c'est grave
        '<div class="carte">',
          '<h2>🚨 Pourquoi c\'était dangereux</h2>',
          '<ul class="liste-lecon">',
            '<li>Vous avez scanné un <strong>QR code inconnu</strong> sans savoir où il menait.</li>',
            '<li>Une offre <strong>"trop belle pour être vraie"</strong> (gratuit + urgent) est le piège classique.</li>',
            '<li>Le faux <strong>compte à rebours</strong> et les <strong>faux avis</strong> servaient à vous presser.</li>',
            '<li>Même des infos "banales" (nom, e-mail, téléphone, date de naissance, classe) suffisent à vous <strong>identifier</strong> et à préparer une arnaque ciblée.</li>',
            '<li>Votre <strong>classe et votre lycée</strong> permettent à un inconnu de savoir où vous trouver.</li>',
          '</ul>',
        '</div>',

        // Bonne nouvelle
        '<div class="carte bonne-nouvelle">',
          '<h2>😌 Rassurez-vous</h2>',
          '<p>Ces informations sont restées <strong>uniquement sur votre téléphone</strong> et n\'ont été envoyées nulle part. ',
          'C\'est une démo encadrée par un professeur. Mais si c\'était un vrai pirate… il aurait déjà tout récupéré.</p>',
          '<p style="margin-top:10px"><strong>Le réflexe :</strong> ne donnez jamais vos infos perso contre une "récompense gratuite" 😉</p>',
        '</div>',

        // Les bons réflexes
        '<div class="carte">',
          '<h2>🛡️ Les bons réflexes</h2>',
          '<ul class="liste-lecon liste-conseils">',
            '<li>Méfiez-vous des QR codes dans la rue ou sur des affiches.</li>',
            '<li>Vérifiez l\'adresse (URL) de la page avant de taper quoi que ce soit.</li>',
            '<li>Ne donnez jamais vos infos perso contre une "récompense gratuite".</li>',
            '<li>Utilisez un mot de passe <strong>différent</strong> par site + la double authentification (2FA).</li>',
            '<li>Une offre urgente qui vous presse = signal d\'alarme.</li>',
          '</ul>',
        '</div>',

        // Clôture
        '<div class="carte bonne-nouvelle snake-bloc">',
          '<h2>👏 Bien joué d\'avoir lu jusqu\'ici</h2>',
          '<p>Passez nous voir au stand : on vous explique comment repérer ces pièges au quotidien. ',
          'Vous saurez désormais flairer l\'arnaque 😉</p>',
        '</div>',

        '<p class="pied-piege">Démonstration pédagogique · BTS SIO (SISR) · Lycée Saint-Bénigne, Dijon<br>',
        'Forum des Métiers du Numérique</p>',

      '</div>'
    ].join("");

    piege.hidden = false;
    window.scrollTo(0, 0);
  }

  /* ---------- Petites fonctions utilitaires ---------- */
  function ligne(label, valeur, danger) {
    if (!valeur) return "";
    return '<div class="recap-ligne' + (danger ? " danger" : "") + '">' +
             '<span class="label">' + label + '</span>' +
             '<span class="valeur">' + echapper(valeur) + '</span>' +
           '</div>';
  }

  function formaterDate(d) {
    if (!d) return "";
    var p = d.split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : d;
  }

  function echapper(txt) {
    var div = document.createElement("div");
    div.textContent = String(txt);
    return div.innerHTML;
  }

})();
