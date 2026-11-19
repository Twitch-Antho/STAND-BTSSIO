/* ============================================================
   STAND BTS SIO — Page de connexion (login.html)
   Vérifie l'identifiant / mot de passe, puis redirige vers admin.html.
   ------------------------------------------------------------
   ⚠️ Protection légère : le site est 100% statique, donc ces
   identifiants sont visibles dans le code source. Suffisant pour
   un stand d'une journée, mais ce n'est pas une vraie sécurité.
   ============================================================ */

(function () {
  "use strict";

  var IDENTIFIANT = "groupe";
  var MOT_DE_PASSE = "SISR2";

  var form = document.getElementById("login-form");
  var erreur = document.getElementById("login-erreur");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var u = document.getElementById("login-user").value.trim();
    var p = document.getElementById("login-pass").value;

    if (u === IDENTIFIANT && p === MOT_DE_PASSE) {
      try { sessionStorage.setItem("admin_ok", "1"); } catch (err) {}
      window.location.href = "admin.html";
    } else {
      erreur.hidden = false;
      document.getElementById("login-pass").value = "";
    }
  });
})();
