// Define Google spreadsheet URL
var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1847002595';

// Compile the Handlebars template for HR leaders.
var bandsTemplate = Handlebars.compile($('#bands-template').html());
  
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

// Start with this year if no params
var searchTerm = new Date().getFullYear();

// Check for parameters
if (params == 0) {
    $('#searchTerm').html("<h2>" + searchTerm + " Results</h2>");
    loadResults(createSQL(searchTerm));
} else if (params['q']) { // Search user input
    searchTerm = params['q'].split('+').join([separator = ' ']).trim();
    $('#searchTerm').append("<h2>Search results for &ldquo;" + searchTerm + "&rdquo;</h2>");
    loadResults(createSQL(searchTerm));
} else if (params['p']){ // Search via button
    searchTerm = params['p'];
    if (params['p'] == 'firstBands') {
        $('.firstBands').addClass('active');
        $('#searchTerm').append("<h2>First Prize Bands</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,U where B = 1 order by A desc";
    } else if (params['p'] == 'firstCaptains') {
        $('.firstCaptains').addClass('active');
        $('#searchTerm').append("<h2>First Prize Captains</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,U where F = 1 order by A desc";
    } else if (params['p'] == 'randomYear') {
        $('.randomYear').addClass('active');
        var year = chance.year({ min: 1975, max: 2016 });
        $('#searchTerm').append("<h2>randomYear</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,U where A = " + year + " order by A desc";
    }
    loadResults(sqlString);
}

// define search string function
function createSQL(term) {
    return "select A,B,C,D,E,F,M,L,U where (A like '%" + term + "%') or (B like '" + term + "') or (lower(C) like lower('%" + term + "%')) or (lower(D) like lower('%" + term + "%')) or (lower(E) like lower('%" + term + "%')) or (F like '%" + term + "%') or (lower(N) like lower('%" + term + "%')) order by A desc, B asc";
}

// define function to load results
function loadResults(sql){
  $('#bands').sheetrock({
    url: mySpreadsheet,
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
    $('#bands').tablesorter(); 
  } 
); 
