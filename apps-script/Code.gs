function doPost(e) {
  var sheet = SpreadsheetApp.openById('1_3dEpLzvbv-tFKU7aQSQLoGZ2KXslh1Z7cceL4Lr7P4').getSheets().filter(function(s) { return s.getSheetId() == 710934912; })[0];
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.data,
    data.nome,
    data.setor,
    data.projeto,
    data.problema,
    data.como_hoje,
    data.prioridade
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput('Formulario de Sugestoes - DPA')
    .setMimeType(ContentService.MimeType.TEXT);
}
