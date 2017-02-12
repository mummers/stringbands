var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=882897653';
var bandsTemplate = Handlebars.compile($('#bands-template').html());
function loadResults() {
  $('#bands').sheetrock({
    url: mySpreadsheet,
    query: "select A,B,C order by A desc",
    rowTemplate: bandsTemplate,
    callback: function(error, options, response) {
      if (!error) {
        $('#bands').tablesorter();
      }
    }
  });
}
