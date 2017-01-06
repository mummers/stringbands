var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1847002595';
$('#searchTerm').append("<h2>Video</h2>");
var bandsTemplate = Handlebars.compile($('#bands-template').html());

// Get query string parameters
var q = document.URL;
var params = {};

q.replace(/[?&]([^=]+)[=]([^&#]+)/g, function(match, key, value){
  params[key] = value;
  return '';
});


function loadResults(sql, table){
  $(table).sheetrock({
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

var delay = 100;
setTimeout(function() {
  video = params['q'].split('+').join([separator = ' ']).trim();
  year = params['year'].split('+').join([separator = ' ']).trim();
  console.log(video);
  message = '<iframe class="embed-responsive-item" src="' + video + '"></iframe>';
  document.getElementById('video').innerHTML = message;
  document.getElementById('searchTerm').innerHTML = "<h2>" + year + " " + " String Band</h2>";
  sqlString = "select A,B,C,D,E,F,M,L,V,W where A = " + year + " order by A desc";
  document.getElementById('results-tag').innerHTML = year + " Results"
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
