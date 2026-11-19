/* ============================================================
   STAND BTS SIO — Script Google Apps Script
   À coller dans l'éditeur Apps Script lié à ton Google Sheet.
   (Google Sheet -> Extensions -> Apps Script)

   - doPost : reçoit une inscription et l'ajoute en ligne.
   - doGet  : renvoie le total + la liste (en JSONP pour la page admin).
   ============================================================ */

var EN_TETE = ["Date", "Nom", "E-mail", "Telephone", "Naissance", "Ville", "Classe"];

/* Reçoit les inscriptions envoyées par le site (une par soumission) */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(5000); // évite les collisions si plusieurs scans en même temps
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Ajoute la ligne d'en-tête si la feuille est vide
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(EN_TETE);
    }

    var d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      d.nom || "",
      d.email || "",
      d.telephone || "",
      d.naissance || "",
      d.ville || "",
      d.classe || ""
    ]);

    return reponse({ ok: true }, e);
  } catch (err) {
    return reponse({ ok: false, error: String(err) }, e);
  } finally {
    lock.releaseLock();
  }
}

/* Renvoie le total + la liste des captures (lu par admin.html) */
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var valeurs = sheet.getDataRange().getValues();

  // On retire la ligne d'en-tête (la 1re)
  if (valeurs.length > 0) valeurs = valeurs.slice(1);

  var captures = valeurs.map(function (r) {
    var date = r[0];
    try { date = Utilities.formatDate(new Date(r[0]), "Europe/Paris", "dd/MM/yyyy HH:mm:ss"); }
    catch (x) { date = String(r[0]); }
    return {
      date_capture: date,
      nom: r[1], email: r[2], telephone: r[3],
      naissance: r[4], ville: r[5], classe: r[6]
    };
  });

  return reponse({ total: captures.length, captures: captures }, e);
}

/* Formate la réponse : JSONP si un paramètre ?callback= est présent, sinon JSON */
function reponse(obj, e) {
  var texte = JSON.stringify(obj);
  var cb = e && e.parameter && e.parameter.callback;
  if (cb) {
    return ContentService.createTextOutput(cb + "(" + texte + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(texte)
    .setMimeType(ContentService.MimeType.JSON);
}
