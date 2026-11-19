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

  function charger() {
    try {
      return JSON.parse(localStorage.getItem("captures_stand") || "[]");
    } catch (err) {
      return [];
    }
  }

  function afficher() {
    var captures = charger();
    document.getElementById("total").textContent = captures.length;

    // Variable compteur : total cumulé de personnes piégées
    var compteur = parseInt(localStorage.getItem("compteur_pieges") || "0", 10);
    if (isNaN(compteur)) compteur = 0;
    document.getElementById("compteur-total").textContent = compteur;

    var liste = document.getElementById("liste");

    if (captures.length === 0) {
      liste.innerHTML = '<p class="vide-admin">Aucune capture pour le moment. ' +
                        'Les saisies apparaîtront ici. 👀</p>';
      return;
    }

    liste.innerHTML = captures.map(function (c, i) {
      return '<div class="capture-carte">' +
        '<div class="entete"><span>#' + (i + 1) + '</span><span>' + (c.date_capture || "") + '</span></div>' +
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
    var captures = charger();
    if (captures.length === 0) {
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
    if (!confirm("Effacer toutes les captures de cet appareil ? (irréversible)")) return;
    localStorage.removeItem("captures_stand");
    afficher();
  }

  document.getElementById("btn-export").addEventListener("click", exporter);
  document.getElementById("btn-vider").addEventListener("click", vider);

  afficher();
})();
