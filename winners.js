// Define spreadsheet URL.
var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=635406709';

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
    $('#searchTerm').append("<h2>Band Win Tally</h2>");
    sqlString = "select A,B,C,D order by B desc";
    loadResults(sqlString, mySpreadsheet);
}

// define function to load results
function loadResults(sql, sheetURL){
  $('#bands').sheetrock({
    url: sheetURL,
    sql: sql,
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

$(document).ready(function()
  {
    $('#hof').tablesorter();
  }
);
