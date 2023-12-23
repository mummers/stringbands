var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1847002595';
var bandsTemplate = Handlebars.compile($('#bands-template').html());

sqlQuery = "select O, count(C), max(A), min(B) group by O order by O";

loadResults(sqlQuery);
function loadResults(sql){
  $('#bands').sheetrock({
    url: mySpreadsheet,
    query: sql,
    rowTemplate: bandsTemplate,
    callback: function (error, options, response){
      if(!error){
        $('#bands').tablesorter();
        if ($('#bands tr').length == 1) {
          $('#bands').append("<h3>No results.</h3>")
        }
      } else {
        $('#bands').append('<h3>Error.</h3>');
      }
    }
  });
}

Handlebars.registerHelper("normalize", function(input) {
  return input.toLowerCase().replace(/ +/g, "+").replace(/\.+|,.+|'.+/g, "");
});
