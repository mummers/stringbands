// Define Google spreadsheet URL
var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1711796058';

// Compile the Handlebars template
var bandsTemplate = Handlebars.compile($('#hof-template').html());

// Get query string parameters
var params = [], hash;
var q = document.URL.split('?')[1];
if(q != undefined){
    q = q.split('&');
    for(var i = 0; i < q.length; i++){
        hash = q[i].split('=');
        params.push(hash[1]);
        params[hash[0]] = hash[1];
    }
}

// Check for parameters
if (params == 0) {
    sqlString = "select A,B,C order by A desc";
    loadResults(sqlString, mySpreadsheet);
}

// define function to load results
function loadResults(sql, sheetURL){
  $('#hof').sheetrock({
    url: sheetURL,
    sql: sql,
    rowTemplate: bandsTemplate,
    callback: function (error, options, response){
      if(!error){
        $('#hof').tablesorter();
        if ($('#hof tr').length == 1) {
          $('#hof').append("<h3>No results.</h3>")
        }
      } else {
        $('#hof').append('<h3>Error.</h3>');
      }
    }
  });
}

Handlebars.registerHelper("normalize", function(input) {
  return input.toLowerCase().replace(/ +/g, "+").replace(/\.+|,.+|'.+/g, "");
});
