// Define Google spreadsheet URLs
var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1847002595';
var lastStandWinners = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=639470266';
var viewersChoice = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=2085823882';

// Compile the Handlebars template
var bandsTemplate = Handlebars.compile($('#bands-template').html());

// Get query string parameters
var q = document.URL;
var params = {};

q.replace(/[?&]([^=]+)[=]([^&#]+)/g, function(match, key, value){
  params[key] = value;
  return '';
});

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function getOrdinal(n) {
    var s=["th","st","nd","rd"],
    v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
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
  countdownMessage = "<h4>Happy New Year! " + today.getFullYear() + "Results will be posted after 8 PM EST.</h4>";   
} else {
  countdownMessage = "<h4>Only " + Math.ceil((nyd.getTime() - today.getTime()) / one_day) + " days left until New Year's Day!</h4>";
}

// Check for parameters
if(isEmpty(params)) {
    if (searchTerm > today.getFullYear()) {
        $('#searchTerm').html("<h2>" + searchTerm + " Themes and Line of March</h2>");
    } else {
        $('#searchTerm').html("<h2>" + searchTerm + " Results</h2>");
    }
    $('#searchTerm').append(countdownMessage);
    loadResults(createSQL(searchTerm), mySpreadsheet);
} else if (params['q'] && params['prize']) { // Search user input with prize attached
    searchTerm = params['q'].split('+').join([separator = ' ']).trim();
    prize = params['prize'].split('+').join([separator = ' ']).trim();
    sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K where (B = " + prize + " and (lower(C) like lower('%" + searchTerm + "%'))) order by A desc";
    $('#searchTerm').append("<h2>Search results for &ldquo;" + searchTerm + "&rdquo; and " + getOrdinal(prize) + " prize </h2>");
    loadResults(sqlString, mySpreadsheet);
} else if (params['q']) { // Search user input
    searchTerm = params['q'].split('+').join([separator = ' ']).trim();
    $('#searchTerm').append("<h2>Search results for &ldquo;" + searchTerm + "&rdquo;</h2>");
    loadResults(createSQL(searchTerm), mySpreadsheet);
} else if (params['p'] == 'lastStand') { // Custard's Last Stand Winners
    $('#searchTerm').append("<h2>Custard's Last Stand Winners</h2><h5>The punniest theme title given by Jake Hart.</h5>");
    sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K order by A desc";
    loadResults(sqlString, lastStandWinners);
} else if (params['p'] == 'viewers') { // Viewer's Choice Award Winners
    $('#searchTerm').append("<h2>Viewer's Choice Award Winners</h2><h5>With the introduction of the Viewer's Choice Awards, String Band fans are now able to vote online for their favorite performance. Following is a listing of the top String Bands since the awards' inception in 2006.</h5>");
    sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K order by A desc";
    loadResults(sqlString, viewersChoice);
} else if (params['p']){ // Search via button
    searchTerm = params['p'];
    if (params['p'] == 'firstBands') { // First Prize Bands
        $('#searchTerm').append("<h2>First Prize Bands</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K where B = 1 order by A desc";
    } else if (params['p'] == 'firstCaptains') { // First Prize Captains
        $('#searchTerm').append("<h2>First Prize Captains</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K where F = 1 order by A desc";
    } else if (params['p'] == 'secondBands') { // Second Prize Bands
        $('#searchTerm').append("<h2>Second Prize Bands</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K where B = 2 order by A desc";
    } else if (params['p'] == 'lastBands') { // Last Prize Bands
        $('#searchTerm').append("<h2>Last Prize, No Prize, and Disqualified Bands</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K where B = N order by A desc";
    } else if (params['p'] == 'randomYear') { // Random Year
        var year = chance.year({ min: 1902, max: today.getFullYear() });
        $('#searchTerm').append("<h2>Search results for &ldquo;" + year + "&rdquo;</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K where A = " + year + " order by A desc";
    } else if (params['p'] == 'randomBand') { // Random Band
        var band = chance.pickset(['Avalon', 'Aqua', 'Broomall', 'Burke', 'Duffy', 'Durning', 'Ferko', 'Fralinger', 'Greater Bucks', 'Greater Kensington', 'Greater Overbrook', 'Harrowgate', 'Hegeman', 'Irish American', 'Italian American', 'Pennsport', 'Polish American', 'Quaker City', 'South Philadelphia', 'Trilby', 'Two Street', 'Ukrainian American', 'Uptown', 'Woodland']);
        $('#searchTerm').append("<h2>Search results for &ldquo;" + band + "&rdquo;</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K where (lower(C) like lower('%" + band + "%')) order by A desc";
    } else if (params['p'] == 'leadoffBands') { // Leadoff Bands
        $('#searchTerm').append("<h2>Leadoff Bands</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K where M = 1 order by A desc";
    } else if (params['p'] == 'finaleBands') { // Finale Bands
        $('#searchTerm').append("<h2>Finale Bands</h2>");
        sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K where M = N order by A desc";
    }
  loadResults(sqlString, mySpreadsheet);
}

// define search string function
function createSQL(term) {
  return "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K where (A like '%" + term + "%') or (B like '" + term + "') or (lower(C) like lower('%" + term + "%')) or (lower(D) like lower('%" + term + "%')) or (lower(E) like lower('%" + term + "%')) or (F like '%" + term + "%') or (lower(O) like lower('%" + term + "%')) order by A desc, B asc";
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
  return input.toLowerCase().replace(/ +/g, "+").replace(/\\.+|,.+|'.+/g, "");
});

$(document).ready(function() { 
  $("#bands").tablesorter(); 
}); 
$( window ).load(function() {
  $("td.note:contains('bd')").siblings(".prize").addClass("bd");
  if($(".bd").length != 0) {
    $(".bdNote").show();
  }
  $("td.note:contains('bs')").siblings(".prize").addClass("bs");
  if($(".bs").length != 0) {
    $(".bsNote").show();
  }
  $("td.note:contains('dq')").siblings(".prize").addClass("dq");
  if($(".dq").length != 0) {
    $(".dqNote").show();
  }
  $("td.note:contains('gp')").siblings(".prize").addClass("gp");
  if($(".gp").length != 0) {
    $(".gpNote").show();
  }
  $("td.note:contains('no')").siblings(".prize").addClass("no");
  if($(".no").length != 0) {
    $(".noNote").show();
  }
  $("td.note:contains('np')").siblings(".prize").addClass("np");
  if($(".np").length != 0) {
    $(".npNote").show();
  }
  $("td.note:contains('sp')").siblings(".prize").addClass("sp");
  if($(".sp").length != 0) {
    $(".spNote").show();
  }
  if($(".band:contains('*')").length != 0) {
    $(".nbNote").show();
  }
});

setTimeout(function() {
  var table = document.getElementById("bands");
  var icon = "</i>";
  if (table != null) {
    for (var i = 0; i < table.rows.length; i++) {
      for (var j = 0; j < table.rows[i].cells.length; j++)
        table.rows[i].cells[j].onclick = function() {
          if (this.cellIndex == 7) {
            if (!this.innerHTML.includes(icon)) {
                var $row = $(this).closest("tr");
                var $year = $row.find(".year").text();
                var $prize = $row.find(".prize").text();
                var $band = $row.find(".band").text();
                var $mp = $row.find(".mp").text();
                var $ge_music = $row.find(".ge_music").text();
                var $vp = $row.find(".vp").text();
                var $ge_visual = $row.find(".ge_visual").text();
                var $costume = $row.find(".costume").text();
                var $total = $row.find(".total").text();

                if ($costume.length > 1) {
                  costume_exists = true;
                } else {
                  costume_exists = false;
                }

                if ($mp.length > 0) {
                  playing_exists = true;
                } else {
                  playing_exists = false;
                }

                breakdown = "breakdown"
                if ($year < 1991 && costume_exists) {
                  breakdown = ('<h3>' + $band + " " + $year + '</h3>' +
                    '<i>' + getOrdinal($prize) + ' Prize' + '</i><br><br>' +
                    '<b>Music:</b> ' + $ge_music + '<br>' +
                    '<b>Presentation:</b> ' + $ge_visual + '<br>' +
                    '<b>Costume:</b> ' + $costume + '<br><br>' +
                    '<b>Total Points:</b> ' + $total + '<br>')
                  swal({
                    title: 'Point Breakdown',
                    html: breakdown
                  })
                } else if (costume_exists) {
                  breakdown = ('<h3>' + $band + " " + $year + '</h3>' +
                    '<i>' + getOrdinal($prize) + ' Prize' + '</i><br><br>' +
                    '<b>Music Playing:</b> ' + $mp + '<br>' +
                    '<b>General Effect Music:</b> ' + $ge_music + '<br>' +
                    '<b>Visual Performance:</b> ' + $vp + '<br>' +
                    '<b>General Effect - Visual:</b> ' + $ge_visual + '<br>' +
                    '<b>Costume:</b> ' + $costume + '<br><br>' +
                    '<b>Total Points:</b> ' + $total + '<br>')
                  swal({
                    title: 'Point Breakdown',
                    html: breakdown
                  })
                } else if (playing_exists) {
                  breakdown = ('<h3>' + $band + " " + $year + '</h3>' +
                    '<i>' + getOrdinal($prize) + ' Prize' + '</i><br><br>' +
                    '<b>Music Playing:</b> ' + $mp + '<br>' +
                    '<b>General Effect Music:</b> ' + $ge_music + '<br>' +
                    '<b>Visual Performance:</b> ' + $vp + '<br>' +
                    '<b>General Effect - Visual:</b> ' + $ge_visual + '<br><br>' +
                    '<b>Total Points:</b> ' + $total + '<br>')
                  swal({
                    title: 'Point Breakdown',
                    html: breakdown
                  })
                } else {
                  alert("No point breakdowns for " + $year + " are available.");
                }
              }
            }
          }
        }
    };
}, 700);

