var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1847002595';
$('#searchTerm').append("<h2>Random Mum Tape</h2>");

sqlString = "select A,V where V contains 'https' order by A desc";
loadResults(sqlString);

function loadResults(sql){
  $('#themes').sheetrock({
    url: mySpreadsheet,
    query: sql,
  });
}


var delay=1000; //1 second
setTimeout(function() {
	var video = ($('#themes td:nth-child(2)').map(function(){
	   return $(this).text();
	}).get());
  randomVid=chance.pickone(video);
  ID = randomVid.replace("https://www.youtube.com/watch?v=", "");
  message = '<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + ID + '"></iframe>';
  document.getElementById('themes').innerHTML = message;
  document.getElementById("themes").style.visibility = "visible";
  apiKey = "AIzaSyBkW3JBO9VU6eI-2Ee9G4QfKV-gdcmDK70"
  $.getJSON( "https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id=" + ID + "&key=" + apiKey, function( data ) {
   //var obj = $.parseJSON(data);
    alert(data.items[0].snippet.localized.title);
  });
}, delay);
