var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1847002595';
$('#searchTerm').append("<h2>Random Mum Tape</h2>");

sqlString = "select A,B,C,V where V contains 'https' order by A desc";
loadResults(sqlString, '#themes');

function loadResults(sql, table) {
  $(table).sheetrock({
    url: mySpreadsheet,
    query: sql,
    labels: ['Year', 'Band Prize', 'Band', 'Theme Title', 'Captain', 'Captain Prize']
  });
}

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
  document.getElementById('year-tag').innerHTML = '<a href="index.html?q=' + year + '" target="_blank">' + 'Check out the full results for ' + year + ' here</a>.';
  document.getElementById('searchTerm').innerHTML = "<h2>Random Mum Tape: " + year + " " + band + " String Band</h2>";
  sqlString = "select A,B,C,D,E,F where A = " + year + " order by A desc";
  loadResults(sqlString, '#results');
}, delay);

setTimeout(function() {
  var links = document.getElementsByTagName("tr");

  for (var i = 0; i < links.length; i++) {
    if (links[i].innerHTML.includes(band)) {
      links[i].className = "info";
    }
  }
}, 1200);
