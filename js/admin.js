/* ============================================================
   STAND BTS SIO — Page admin
   Affiche les captures stockées en local et permet de les
   exporter dans un fichier JavaScript (captures.js).
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     GARDE D'ACCÈS
     ------------------------------------------------------------
     On ne doit arriver ici qu'après être passé par login.html.
     Sinon, redirection vers la page de connexion.
     ⚠️ Protection légère : le site est 100% statique, donc
     contournable via le code source. Suffisant pour un stand.
     ============================================================ */
  if (sessionStorage.getItem("admin_ok") !== "1") {
    window.location.replace("login.html");
    return;
  }

  var btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.removeItem("admin_ok");
      window.location.href = "login.html";
    });
  }

  // Captures actuellement affichées (locales OU du Sheet) — sert à l'export.
  var capturesAffichees = [];

  function chargerLocal() {
    try {
      return JSON.parse(localStorage.getItem("captures_stand") || "[]");
    } catch (err) {
      return [];
    }
  }

  /* ---------- Point d'entrée : choisit la source (central ou local) ---------- */
  function afficher() {
    if (window.URL_SHEET) {
      chargerDepuisSheet();
    } else {
      rendre(chargerLocal(), null);
    }
  }

  /* ---------- Lecture du Google Sheet via JSONP (évite les soucis CORS) ---------- */
  function chargerDepuisSheet() {
    var liste = document.getElementById("liste");
    liste.innerHTML = '<p class="vide-admin">⏳ Chargement des données partagées…</p>';

    var url = window.URL_SHEET;
    var nomCb = "cbSheet_" + Date.now();
    var script = document.createElement("script");
    var fini = false;

    window[nomCb] = function (payload) {
      fini = true;
      nettoyer();
      var captures = (payload && payload.captures) ? payload.captures : [];
      var total = (payload && typeof payload.total === "number") ? payload.total : captures.length;
      rendre(captures, total);
    };

    function nettoyer() {
      try { delete window[nomCb]; } catch (e) { window[nomCb] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    script.onerror = function () {
      fini = true;
      nettoyer();
      // Repli sur les données locales en cas d'échec réseau
      liste.innerHTML = '<p class="vide-admin">⚠️ Impossible de joindre le Google Sheet. ' +
                        'Affichage des données locales de cet appareil.</p>';
      var local = chargerLocal();
      setTimeout(function () { rendre(local, null); }, 1200);
    };

    // Sécurité : timeout si aucune réponse
    setTimeout(function () { if (!fini) script.onerror(); }, 8000);

    script.src = url + (url.indexOf("?") > -1 ? "&" : "?") +
                 "callback=" + nomCb + "&t=" + Date.now();
    document.body.appendChild(script);
  }

  /* ---------- Rendu commun ---------- */
  function rendre(captures, totalCentral) {
    capturesAffichees = captures || [];
    document.getElementById("total").textContent = capturesAffichees.length;

    // Compteur : total du Sheet si dispo, sinon compteur local cumulé
    var compteur;
    if (typeof totalCentral === "number") {
      compteur = totalCentral;
    } else {
      compteur = parseInt(localStorage.getItem("compteur_pieges") || "0", 10);
      if (isNaN(compteur)) compteur = 0;
    }
    document.getElementById("compteur-total").textContent = compteur;

    var liste = document.getElementById("liste");
    if (capturesAffichees.length === 0) {
      liste.innerHTML = '<p class="vide-admin">Aucune capture pour le moment. ' +
                        'Les saisies apparaîtront ici. 👀</p>';
      return;
    }

    liste.innerHTML = capturesAffichees.map(function (c, i) {
      return '<div class="capture-carte">' +
        '<div class="entete"><span>#' + (i + 1) + '</span><span>' + echapper(c.date_capture || "") + '</span></div>' +
        champ("Nom", c.nom) +
        champ("E-mail", c.email) +
        champ("Téléphone", c.telephone) +
        champ("Naissance", c.naissance) +
        champ("Ville", c.ville) +
        champ("Classe au lycée", c.classe) +
      '</div>';
    }).join("");
  }

  function champ(label, valeur) {
    if (!valeur) return "";
    return '<div class="champ"><b>' + label + '</b><span>' + echapper(valeur) + '</span></div>';
  }

  function echapper(txt) {
    var div = document.createElement("div");
    div.textContent = String(txt);
    return div.innerHTML;
  }

  /* ---------- Export vers un fichier .js ---------- */
  function exporter() {
    var captures = capturesAffichees;
    if (!captures || captures.length === 0) {
      alert("Aucune capture à exporter.");
      return;
    }
    var contenu =
      "// Captures du stand BTS SIO — démonstration phishing\n" +
      "// Généré le " + new Date().toLocaleString("fr-FR") + "\n" +
      "// ATTENTION : données de démonstration, à supprimer après le forum.\n\n" +
      "const captures = " + JSON.stringify(captures, null, 2) + ";\n";

    var blob = new Blob([contenu], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "captures.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function vider() {
    if (window.URL_SHEET) {
      alert("Mode central activé : les données sont dans le Google Sheet.\n\n" +
            "Pour tout effacer, supprime les lignes directement dans le Google Sheet. " +
            "Ce bouton n'efface que la copie locale de cet appareil.");
    }
    if (!confirm("Effacer les captures locales de cet appareil ? (irréversible)")) return;
    localStorage.removeItem("captures_stand");
    localStorage.removeItem("compteur_pieges");
    afficher();
  }

  document.getElementById("btn-export").addEventListener("click", exporter);
  document.getElementById("btn-vider").addEventListener("click", vider);

  afficher();
})();
