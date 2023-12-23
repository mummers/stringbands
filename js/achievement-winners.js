var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1517009682';
var bandsTemplate = Handlebars.compile($('#winners-template').html());

sqlQuery = "select A,B order by A desc";
loadResults(sqlQuery, mySpreadsheet);

function loadResults(sql, sheetURL){
  $('#winners').sheetrock({
    url: sheetURL,
    sql: sql,
    rowTemplate: bandsTemplate,
    callback: function (error, options, response){
      if(!error){
        $('#winners').tablesorter();
        if ($('#winners tr').length == 1) {
          $('#winners').append("<h3>No results.</h3>")
        }
      } else {
        $('#winners').append('<h3 class="error">Error.</h3>');
      }
    }
  });
}

Handlebars.registerHelper("normalize", function(input) {
  return input.toLowerCase().replace(/ +/g, "+").replace(/\.+|,.+|'.+/g, "");
});
