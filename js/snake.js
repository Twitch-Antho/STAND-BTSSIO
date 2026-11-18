/* ============================================================
   STAND BTS SIO — Un VRAI jeu Snake (la récompense)
   Jouable au clavier (flèches / ZQSD) et au tactile (boutons).
   Exposé en global : window.initSnake()
   ============================================================ */

function initSnake() {
  var canvas = document.getElementById("snake-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var CASE = 15;                       // taille d'une case en pixels
  var COLS = canvas.width / CASE;      // 20 colonnes
  var LIGNES = canvas.height / CASE;   // 20 lignes

  var serpent, direction, prochaineDir, pomme, score, boucle, enCours;

  var scoreEl = document.getElementById("snake-score");
  var btnStart = document.getElementById("snake-start");

  function reset() {
    serpent = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
    direction = { x: 1, y: 0 };
    prochaineDir = { x: 1, y: 0 };
    score = 0;
    majScore();
    poserPomme();
  }

  function poserPomme() {
    do {
      pomme = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * LIGNES)
      };
    } while (serpent.some(function (s) { return s.x === pomme.x && s.y === pomme.y; }));
  }

  function majScore() {
    if (scoreEl) scoreEl.textContent = score;
  }

  function demarrer() {
    reset();
    enCours = true;
    if (boucle) clearInterval(boucle);
    boucle = setInterval(tick, 110);
    if (btnStart) btnStart.textContent = "🔄 Recommencer";
  }

  function tick() {
    direction = prochaineDir;
    var tete = { x: serpent[0].x + direction.x, y: serpent[0].y + direction.y };

    // Traverse les murs (plus sympa pour une démo)
    if (tete.x < 0) tete.x = COLS - 1;
    if (tete.x >= COLS) tete.x = 0;
    if (tete.y < 0) tete.y = LIGNES - 1;
    if (tete.y >= LIGNES) tete.y = 0;

    // Collision avec soi-même
    if (serpent.some(function (s) { return s.x === tete.x && s.y === tete.y; })) {
      return perdu();
    }

    serpent.unshift(tete);

    if (tete.x === pomme.x && tete.y === pomme.y) {
      score++;
      majScore();
      poserPomme();
    } else {
      serpent.pop();
    }

    dessiner();
  }

  function dessiner() {
    ctx.fillStyle = "#0d1b2a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pomme
    ctx.fillStyle = "#e63946";
    ctx.fillRect(pomme.x * CASE + 2, pomme.y * CASE + 2, CASE - 4, CASE - 4);

    // Serpent
    serpent.forEach(function (s, i) {
      ctx.fillStyle = i === 0 ? "#ffd500" : "#28c76f";
      ctx.fillRect(s.x * CASE + 1, s.y * CASE + 1, CASE - 2, CASE - 2);
    });
  }

  function perdu() {
    clearInterval(boucle);
    enCours = false;
    ctx.fillStyle = "rgba(0,0,0,.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Perdu !", canvas.width / 2, canvas.height / 2 - 6);
    ctx.font = "15px Segoe UI, sans-serif";
    ctx.fillText("Score : " + score, canvas.width / 2, canvas.height / 2 + 18);
    if (btnStart) btnStart.textContent = "▶️ Rejouer";
  }

  function changerDir(x, y) {
    // Empêche le demi-tour instantané
    if (direction.x === -x && direction.y === -y) return;
    prochaineDir = { x: x, y: y };
  }

  // Commandes clavier
  document.addEventListener("keydown", function (e) {
    switch (e.key) {
      case "ArrowUp": case "z": case "Z": changerDir(0, -1); break;
      case "ArrowDown": case "s": case "S": changerDir(0, 1); break;
      case "ArrowLeft": case "q": case "Q": changerDir(-1, 0); break;
      case "ArrowRight": case "d": case "D": changerDir(1, 0); break;
      default: return;
    }
    e.preventDefault();
  });

  // Commandes tactiles (boutons fléchés)
  var dirs = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  document.querySelectorAll(".fleches button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var d = dirs[btn.dataset.dir];
      if (d) changerDir(d[0], d[1]);
    });
  });

  if (btnStart) btnStart.addEventListener("click", demarrer);

  // Affiche l'état initial
  reset();
  dessiner();
}
