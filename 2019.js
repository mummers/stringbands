var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=882897653';
var bandsTemplate = Handlebars.compile($('#bands-template').html());

function loadResults() {
  $('#bands').sheetrock({
    url: mySpreadsheet,
    query: "select B,C,D,E,F order by B asc",
    rowTemplate: bandsTemplate,
    callback: function(error, options, response) {
      if (!error) {
        $('#bands').tablesorter();
      }
    }
  });
}

loadResults();

Handlebars.registerHelper("normalize", function(input) {
  return input.toLowerCase().replace(/ +/g, "+").replace(/\\.+|,.+|'.+/g, "");
});
