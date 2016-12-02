// Define Google spreadsheet URLs
var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1847002595';
var lastStandWinners = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=639470266';
var viewersChoice = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=2085823882';

// Compile the Handlebars template
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
var searchTerm = 2017;

// Logic for countdown
var today = new Date();  
var nyd = new Date(today.getFullYear() + 1, 0, 1);
var one_day=1000*60*60*24;
var countdownMessage = "";
if (today.getMonth() == 0 && today.getDate() == 1)   
{  
  countdownMessage = "<h3>Happy New Year! " + today.getFullYear() + "Results will be posted after 8 PM EST.</h3>";   
} else {
  countdownMessage = "<p>Only " + Math.ceil((nyd.getTime() - today.getTime()) / one_day) + " days left until New Year's Day!</p>";
}

// Check for parameters
if (params == 0) {
    if (searchTerm > today.getFullYear()) {
        $('#searchTerm').html("<h2>" + searchTerm + " Themes and Line of March</h2>");
    } else {
        $('#searchTerm').html("<h2>" + searchTerm + " Results</h2>");
    }
    $('#searchTerm').append(countdownMessage);
    loadResults(createSQL(searchTerm), mySpreadsheet);
} else if (params['q']) { // Search user input
    searchTerm = params['q'].split('+').join([separator = ' ']).trim();
    $('#searchTerm').append("<h2>Search results for &ldquo;" + searchTerm + "&rdquo;</h2>");
    loadResults(createSQL(searchTerm), mySpreadsheet);
} else if (params['p'] == 'lastStand') { // Custard's Last Stand Winners
    $('#searchTerm').append("<h2>Custard's Last Stand Winners</h2><h5>The punniest theme title given by Jake Hart.</h5>");
    sqlString = "select A,B,C,D,E,F,M,L,V order by A desc";
    loadResults(sqlString, lastStandWinners);
} else if (params['p'] == 'viewers') { // Viewer's Choice Award Winners
    $('#searchTerm').append("<h2>Viewer's Choice Award Winners</h2><h5>With the introduction of the Viewer's Choice Awards, String Band fans are now able to vote online for their favorite performance. Following is a listing of the top String Bands since the awards' inception in 2006.</h5>");
    sqlString = "select A,B,C,D,E,F,M,L,V order by A desc";
    loadResults(sqlString, viewersChoice);
} else if (params['p']){ // Search via button
    searchTerm = params['p'];
    if (params['p'] == 'firstBands') { // First Prize Bands
        $('#searchTerm').append("<h2>First Prize Bands</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V where B = 1 order by A desc";
    } else if (params['p'] == 'firstCaptains') { // First Prize Captains
        $('#searchTerm').append("<h2>First Prize Captains</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V where F = 1 order by A desc";
    } else if (params['p'] == 'secondBands') { // Second Prize Bands
        $('#searchTerm').append("<h2>Second Prize Bands</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V where B = 2 order by A desc";
    } else if (params['p'] == 'lastBands') { // Last Prize Bands
        $('#searchTerm').append("<h2>Last Prize and Disqualified Bands</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V where B = N order by A desc";
    } else if (params['p'] == 'randomYear') { // Random Year
        var year = chance.year({ min: 1902, max: today.getFullYear() });
        $('#searchTerm').append("<h2>Search results for &ldquo;" + year + "&rdquo;</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V where A = " + year + " order by A desc";
    } else if (params['p'] == 'randomBand') { // Random Band
        var band = chance.pickset(['Avalon', 'Aqua', 'Broomall', 'Burke', 'Duffy', 'Durning', 'Ferko', 'Fralinger', 'Greater Bucks', 'Greater Kensington', 'Greater Overbrook', 'Harrowgate', 'Hegeman', 'Irish American', 'Italian American', 'Pennsport', 'Polish American', 'Quaker City', 'South Philadelphia', 'Trilby', 'Two Street', 'Ukrainian American', 'Uptown', 'Woodland']);
        $('#searchTerm').append("<h2>Search results for &ldquo;" + band + "&rdquo;</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V where (lower(C) like lower('%" + band + "%')) order by A desc";
    } else if (params['p'] == 'leadoffBands') { // Leadoff Bands
        $('#searchTerm').append("<h2>Leadoff Bands</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V where M = 1 order by A desc";
    } else if (params['p'] == 'finaleBands') { // Finale Bands
        $('#searchTerm').append("<h2>Finale Bands</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V where M = N order by A desc";
    }
  loadResults(sqlString, mySpreadsheet);
}

// define search string function
function createSQL(term) {
    return "select A,B,C,D,E,F,M,L,V where (A like '%" + term + "%') or (B like '" + term + "') or (lower(C) like lower('%" + term + "%')) or (lower(D) like lower('%" + term + "%')) or (lower(E) like lower('%" + term + "%')) or (F like '%" + term + "%') or (lower(O) like lower('%" + term + "%')) order by A desc, B asc";
}

// define function to load results
function loadResults(sql, sheetURL){
  $('#bands').sheetrock({
    url: sheetURL,
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

$(document).ready(function() 
  { 
    $('#bands').tablesorter(); 
  } 
); 
