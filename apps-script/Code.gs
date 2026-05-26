function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.openById('1_3dEpLzvbv-tFKU7aQSQLoGZ2KXslh1Z7cceL4Lr7P4');

  // FEEDBACK
  if (data.action === 'feedback') {
    var feedbackSheet = ss.getSheets().filter(function(s) { return s.getSheetId() == 2142360946; })[0];
    feedbackSheet.appendRow([
      data.data,
      data.matricula,
      data.nome,
      data.departamento,
      data.cargo,
      data.sistema,
      data.nota,
      data.facilidade || '',
      data.facilitou || '',
      data.prefere || '',
      data.recomenda || '',
      data.mais_gostou || '',
      data.melhorar || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
  }

  // SUGESTAO / MELHORIA (sheet original)
  var sheet = ss.getSheets().filter(function(s) { return s.getSheetId() == 710934912; })[0];
  sheet.appendRow([
    data.data,
    data.nome,
    data.setor,
    data.projeto || '',
    data.descricao || data.problema || '',
    data.como_hoje || '',
    data.prioridade,
    data.tipo || 'Sugestao de Projeto',
    data.sistema || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  // Buscar colaborador por matricula
  if (e && e.parameter && e.parameter.matricula) {
    var ss = SpreadsheetApp.openById('1_3dEpLzvbv-tFKU7aQSQLoGZ2KXslh1Z7cceL4Lr7P4');
    var colabSheet = ss.getSheets().filter(function(s) { return s.getSheetId() == 482614982; })[0];
    var dados = colabSheet.getDataRange().getValues();
    var matricula = e.parameter.matricula.toString().trim();

    for (var i = 1; i < dados.length; i++) {
      if (dados[i][0].toString().trim() === matricula) {
        return ContentService.createTextOutput(JSON.stringify({
          found: true,
          nome: dados[i][1],
          departamento: dados[i][2],
          cargo: dados[i][3]
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ found: false })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput('Central de Sugestoes e Feedback - DPA').setMimeType(ContentService.MimeType.TEXT);
}
