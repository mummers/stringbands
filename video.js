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

function getOrdinal(n) {
    var s=["th","st","nd","rd"],
    v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
 }

function titleCase(str) {
  return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}

function loadResults(sql, table) {
  $(table).sheetrock({
    url: mySpreadsheet,
    query: sql,
    rowTemplate: bandsTemplate,
    callback: function(error, options, response) {
      if (!error) {
        var links = document.getElementsByTagName("tr");

        for (var i = 0; i < links.length; i++) {
          if (links[i].innerHTML.includes(band)) {
            links[i].className = "info";
          }
        }

        $('#bands').tablesorter();

        $("td.note:contains('bd')").siblings(".prize").addClass("bd");
        if ($(".bd").length != 0) {
          $(".bdNote").show();
        }
        $("td.note:contains('bs')").siblings(".prize").addClass("bs");
        if ($(".bs").length != 0) {
          $(".bsNote").show();
        }
        $("td.note:contains('dq')").siblings(".prize").addClass("dq");
        if ($(".dq").length != 0) {
          $(".dqNote").show();
        }
        $("td.note:contains('gp')").siblings(".prize").addClass("gp");
        if ($(".gp").length != 0) {
          $(".gpNote").show();
        }
        $("td.note:contains('no')").siblings(".prize").addClass("no");
        if ($(".no").length != 0) {
          $(".noNote").show();
        }
        $("td.note:contains('np')").siblings(".prize").addClass("np");
        if ($(".np").length != 0) {
          $(".npNote").show();
        }
        $("td.note:contains('sp')").siblings(".prize").addClass("sp");
        if ($(".sp").length != 0) {
          $(".spNote").show();
        }
        if ($(".band:contains('*')").length != 0) {
          $(".nbNote").show();
        }
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

var delay = 100;
setTimeout(function() {
  video = params['q'].split('+').join([separator = ' ']).trim();
  year = params['year'].split('+').join([separator = ' ']).trim();
  band = titleCase(params['band'].split('+').join([separator = ' ']).trim());
  message = '<iframe class="embed-responsive-item" src="' + video + '"></iframe>';
  document.getElementById('video').innerHTML = message;
  document.getElementById('searchTerm').innerHTML = "<h2>" + year + " " + band + " String Band</h2>";
  sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K where A = " + year + " order by A desc";
  document.getElementById('results-tag').innerHTML = year + " Results";
  loadResults(sqlString, '#bands');

}, delay);

setTimeout(function() {
  var table = document.getElementById("bands");
  if (table != null) {
    for (var i = 0; i < table.rows.length; i++) {
      for (var j = 0; j < table.rows[i].cells.length; j++)
        table.rows[i].cells[j].onclick = function() {
          if (this.cellIndex == 7) {
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
            if ($year < 1991) {
              breakdown = ('<h3>' + $band + " " + $year + '</h3>' +
                           '<i>' + getOrdinal($prize) + ' Prize' + '</i><br><br>' +
                           '<b>Music:</b> ' + $ge_music + '<br>' +
                           '<b>Presentation:</b> ' + $ge_visual + '<br>' +
                           '<b>Costume:</b> ' + $costume + '<br><br>' +
                           '<b>Total Points:</b> ' + $total + '<br>')
              swal({title: 'Point Breakdown', html: breakdown})
            } else if (costume_exists) {
               breakdown = ('<h3>' + $band + " " + $year + '</h3>' +
                            '<i>' + getOrdinal($prize) + ' Prize' + '</i><br><br>' +
                            '<b>Music Playing:</b> ' + $mp + '<br>' +
                            '<b>General Effect Music:</b> ' + $ge_music + '<br>' +
                            '<b>Visual Performance:</b> ' + $vp + '<br>' +
                            '<b>General Effect - Visual:</b> ' + $ge_visual + '<br>' +
                            '<b>Costume:</b> ' + $costume + '<br><br>' +
                            '<b>Total Points:</b> ' + $total + '<br>')
                swal({title: 'Point Breakdown', html: breakdown})
            } else if (playing_exists){
                breakdown = ('<h3>' + $band + " " + $year + '</h3>' +
                            '<i>' + getOrdinal($prize) + ' Prize' + '</i><br><br>' +
                            '<b>Music Playing:</b> ' + $mp + '<br>' +
                            '<b>General Effect Music:</b> ' + $ge_music + '<br>' +
                            '<b>Visual Performance:</b> ' + $vp + '<br>' +
                            '<b>General Effect - Visual:</b> ' + $ge_visual + '<br><br>' +
                            '<b>Total Points:</b> ' + $total + '<br>')
                swal({title: 'Point Breakdown', html: breakdown})
            } else {
              alert("No point breakdowns for " + $year + " are available.");
            }
          }
        }
    }
  };
}, 700);
