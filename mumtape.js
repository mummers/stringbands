var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1847002595';
$('#searchTerm').append("<h2>Random Mum Tape</h2>");

sqlString = "select A,V where V contains 'https' order by A desc";
loadResults(sqlString);

function loadResults(sql) {
  $('#themes').sheetrock({
    url: mySpreadsheet,
    query: sql
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
  ID = randomVid[1].replace("https://www.youtube.com/watch?v=", "");
  message = '<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + ID + '"></iframe>';
  year = randomVid[0];
  document.getElementById('themes').innerHTML = message;
  document.getElementById("themes").style.visibility = "visible";
  document.getElementById('year').innerHTML = 'Check out the results for <a href="index.html?q=' + year + '">' + year + '</a>.';
  apiKey = "AIzaSyBkW3JBO9VU6eI-2Ee9G4QfKV-gdcmDK70"
  $.getJSON("https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id=" + ID + "&key=" + apiKey, function(data) {
    videoTitle = data.items[0].snippet.localized.title;
    document.getElementById('searchTerm').innerHTML = "<h2>Random Mum Tape: " + videoTitle + "</h2>";
  });

}, delay);
