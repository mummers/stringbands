var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1847002595';
$('#searchTerm').append("<h2>Random Mum Tape</h2>");

sqlString = "select A,B,C,V where V contains 'https' order by A desc";
loadResults(sqlString, '#themes');

var bandsTemplate = Handlebars.compile($('#bands-template').html());

function loadResults(sql, table) {
  $(table).sheetrock({
    url: mySpreadsheet,
    query: sql
  });
}

function myCallback(error, options, response) {
  if (!error) {
    $('#bands').tablesorter();
    if ($('#bands tr').length == 1) {
      $('#bands').append("<h3>No results.</h3>")
    }
  } else {
    $('#bands').append('<h3>' + error + '</h3>');
  }
};

var delay = 700;
setTimeout(function() {
  var myTableArray = [];
  $("table#themes tr").each(function() {
    var arrayOfThisRow = [];
    var tableData = $(this).find('td');
    if (tableData.length > 0) {
      tableData.each(function() {
        arrayOfThisRow.push($(this).text());
      });
      myTableArray.push(arrayOfThisRow);
    }
  });
  randomVid = chance.pickone(myTableArray);
  ID = randomVid[3].replace("https://www.youtube.com/watch?v=", "");
  message = '<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + ID + '"></iframe>';
  year = randomVid[0];
  band = randomVid[2];
  document.getElementById('themes').innerHTML = message;
  document.getElementById("themes").style.visibility = "visible";
  document.getElementById('searchTerm').innerHTML = "<h2>Random Mum Tape: " + year + " " + band + " String Band</h2>";
  sqlString = "select A,B,C,D,E,F,M,L,V,W where A = " + year + " order by A desc";
  sheetrock.defaults.rowTemplate = bandsTemplate
  sheetrock.defaults.callback = myCallback
  loadResults(sqlString, '#bands');
}, delay);

Handlebars.registerHelper("normalize", function(input) {
  return input.toLowerCase().replace(/ +/g, "+").replace(/\\.+|,.+|'.+/g, "");
});

setTimeout(function() {
  var links = document.getElementsByTagName("tr");

  for (var i = 0; i < links.length; i++) {
    if (links[i].innerHTML.includes(band)) {
      links[i].className = "info";
    }
  }
  
  $("#bands").tablesorter();
  
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

}, 1200);

