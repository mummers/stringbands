var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1608025329';
var bandsTemplate = Handlebars.compile($('#bands-template').html());
var today = new Date();
var upcomingYear = today.getFullYear() + 1;
function loadResults() {
  $('#bands').sheetrock({
    url: mySpreadsheet,
    query: "select B,C,D,E order by B asc",
    rowTemplate: bandsTemplate,
    callback: function(error, options, response) {
      if (!error) {
        $('#bands').tablesorter();
        document.getElementById('searchTerm').innerHTML = "<h2>" + upcomingYear + " Line Of March And Theme Concepts</h2>";
      }
    }
  });
}

loadResults();

Handlebars.registerHelper("normalize", function(input) {
  return input.toLowerCase().replace(/ +/g, "+").replace(/\\.+|,.+|'.+/g, "");
});
