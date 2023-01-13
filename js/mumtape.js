var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1847002595';
var lastStandWinners = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=639470266';
var viewersChoice = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=2085823882';
var achievementawards = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1517009682';
var hofSheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1711796058';
var infoSheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1867154294';

var bandsTemplate = Handlebars.compile($('#bands-template').html());
var lifeTemplate = Handlebars.compile($('#life-template').html());
var viewersTemplate = Handlebars.compile($('#viewers-template').html());
var custardsTemplate = Handlebars.compile($('#custards-template').html());
var hofTemplate = Handlebars.compile($('#hof-template').html());
var infoTemplate = Handlebars.compile($('#info-template').html());
var bandInfoTemplate = Handlebars.compile($('#band-info-template').html());

var button = document.getElementById('btnSearch');
var showBtn = document.getElementById('showFilters');
showBtn.onclick = function() {
	$("#video-filters").toggle();
	$(this).text(function(i, v){
	               return v === 'Hide Filters' ? 'Show Filters' : 'Hide Filters'
							 })
};

function getOrdinal(n) {
    var s=["th","st","nd","rd"],
    v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
 }

button.onclick = function() {
	var yearTag = document.getElementById('yearText').value;
	var bandFilter = document.getElementById('bandsFilter').value;

	function saveItems() {
		sessionStorage.setItem("yearTag", yearTag);
		sessionStorage.setItem("bandTag", bandFilter);
	}
	if (yearTag == "") {
		sessionStorage.clear();
		sqlString = "select A,B,C,V where V contains 'https' and order by A desc";
		saveItems();
	} else if (bandFilter != "") {
		sqlString = "select A,B,C,V where V contains 'https' and A >" + year + "and (lower(C) like lower('%" + bandFilter + "%')) order by A desc";
		saveItems();
	} else {
		sqlString = "select A,B,C,V where V contains 'https' and A >" + year + "order by A desc";
		saveItems();
	}
	loadRandomVideo(sqlString);
}

if (sessionStorage.getItem("yearTag")) {
	document.getElementById("yearText").value = sessionStorage.getItem("yearTag");
} else {
	sessionStorage.setItem("yearTag", "1912");
}
if (sessionStorage.getItem("bandTag")) {
	document.getElementById('bandsFilter').value = sessionStorage.getItem("bandTag");
	bandFilter = sessionStorage.getItem("bandTag");
}

yearTag = sessionStorage.getItem("yearTag");

if (typeof bandFilter==="undefined"){
    sqlString = "select A,B,C,V where V contains 'https' and A >" + yearTag + "order by A desc";
}
else{
    sqlString = "select A,B,C,V where V contains 'https' and A >" + yearTag + "and (lower(C) like lower('%" + bandFilter + "%')) order by A desc";
}
loadRandomVideo(sqlString);

function loadResults(sql, table) {
  $(table).sheetrock({
    url: mySpreadsheet,
    query: sql
  });
}

function loadRandomVideo(sql){
  $('#themes').sheetrock({
    url: mySpreadsheet,
    query: sql,
    callback: function(error, options, response) {
			if (!error){
				if (yearTag >= 2023){
					year = parseInt(yearTag) + 1;
					document.getElementById('searchTerm').innerHTML = "<h2>Whoops! " + year +  " didn't happen yet! Try a different year.</h2>";
					document.getElementsByClassName('sidebar')[0].style.display = 'none';
					document.getElementById("themes").style.display = 'none';
					document.getElementById("bands").style.display = 'none';
					document.getElementsByClassName('embed-responsive')[0].style.display = 'none';
					$("#video-filters").toggle();
				}
				else{
					randomVid = chance.pickone(response.rows.slice(1));
					year = randomVid.cellsArray[0];
					band = randomVid.cellsArray[2];
					videoID = randomVid.cellsArray[3];
					message = '<iframe class="embed-responsive-item" src="' + videoID + '" allowfullscreen></iframe>';
					document.getElementById("themes").innerHTML = message;
					document.getElementById("themes").style.visibility = "visible";
					document.getElementById("searchTerm").innerHTML = "Random Mum Tape: " + year + " " + band + " String Band";
					sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where A = " + year + " order by A desc";
					document.getElementById("results-tag").innerHTML = year + " Results";
					document.getElementById("band-card-header").innerHTML = band + " " + year + " Info";
					sheetrock.defaults.rowTemplate = bandsTemplate;
					sheetrock.defaults.callback = myCallback;
					loadResults(sqlString, '#bands');
					loadYearData();
				}
		  }
      if (error){
        document.getElementById("themes").style.visibility = "visible";
        document.getElementById('searchTerm').innerHTML = "<h2>Whoops! Looks like there was an error. Trying again.</h2>";
        document.getElementById('themes').innerHTML = "<meta http-equiv='refresh' content='2' />";
        document.getElementById("bands").style.display = 'none';
      }
		}
  });
}

function myCallback(error, options, response) {
  if (!error) {
    $('#bands').tablesorter();
    if ($('#bands tr').length == 1) {
      $('#bands').append("<h3>No results.</h3>")
			document.getElementsByClassName('sidebar')[0].style.display = 'none';
    }
  } else {
    $('#bands').append('<h3>' + error + '</h3>');
  }
};


function loadYearData(){
	// define function to load parade information
  $('#parade-info').sheetrock({
    url: infoSheet,
		query: "select A,C,D,I,J where A = " + year + "order by A desc",
    rowTemplate: infoTemplate,
    callback: function (error, options, response){
      if(error){
        console.log(error);
        $('#parade-info').append('<h3 class="error">Error.</h3>');
      }
    }
  });
	// define function to load lifetime achievement winner
  $('#lifetime').sheetrock({
    url: achievementawards,
    query: "select A,B where A = " + year + "order by A desc",
    rowTemplate: lifeTemplate,
    callback: function (error, options, response){
      if(error){
        console.log(error);
        $('#lifetime').append('<h3 class="error">Error.</h3>');
      }
    }
  });
  // define function to load viewers choice
  $('#viewers').sheetrock({
    url: viewersChoice,
    query: "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where A = " + year + "order by A desc",
    rowTemplate: viewersTemplate,
    callback: function (error, options, response){
      if(error){
        console.log(error);
        $('#viewers').append('<h3 class="error">Error.</h3>');
      }
    }
  });
  // define function to load custards
  $('#custards').sheetrock({
    url: lastStandWinners,
    query: "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where A = " + year + "order by A desc",
    rowTemplate: custardsTemplate,
    callback: function (error, options, response){
      if(error){
        console.log(error);
        $('#custards').append('<h3 class="error">Error.</h3>');
      }
    }
  });
  // define function to load hof
  $('#hof-Inductees').sheetrock({
    url: hofSheet,
    query: "select A,B,C where A = " + year + "order by A desc",
    rowTemplate: hofTemplate,
    callback: function (error, options, response){
      if(error){
        console.log(error);
        $('#hof-Inductees').append('<h3 class="error">Error.</h3>');
      }
    }
  });
	// define function to load band info
  $('#band-info').sheetrock({
    url: mySpreadsheet,
    query: "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where A = " + year + " and (lower(C) like lower('%" + band + "%')) order by A desc",
    rowTemplate: bandInfoTemplate,
    callback: function(error, options, response) {
      if (error) {
        console.log(error);
        $('#band-info').append('<h3 class="error">Error.</h3>');
      }
    }
  });
}

Handlebars.registerHelper("normalize", function(input) {
  return input.toLowerCase().replace(/ +/g, "+").replace(/\\.+|,.+|'.+/g, "");
});

$(document).ready(function() {
  $("td.note:contains('bd-j')").siblings(".prize").addClass("bd");
  if($(".bd").length != 0) {
    $(".bdNote").show();
  }
  $("td.note:contains('bs-j')").siblings(".prize").addClass("bs");
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
  $("td.note:contains('no-j')").siblings(".prize").addClass("no");
  if($(".no").length != 0) {
    $(".noNote").show();
  }
  $("td.note:contains('np-j')").siblings(".prize").addClass("np");
  if($(".np").length != 0) {
    $(".npNote").show();
  }
  $("td.note:contains('sp-j')").siblings(".prize").addClass("sp");
  if($(".sp").length != 0) {
    $(".spNote").show();
  }
  if($(".band:contains('*')").length != 0) {
    $(".nbNote").show();
  }
});

setTimeout(function() {
	$('#bands').tablesorter();
	const table = document.getElementById("bands");
	const icon = "</i>";
	if (table != null) {
		for (var i = 0; i < table.rows.length; i++) {
			for (var j = 0; j < table.rows[i].cells.length; j++) {
				table.rows[i].cells[j].onclick = function() {
					if (this.cellIndex !== 7 || this.innerHTML.includes(icon)) {
						return;
					}
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
					var $costumer = $row.find(".costumer").text();
					var $designer = $row.find(".designer").text();
					var $arranger = $row.find(".arranger").text();
					var $choreographer = $row.find(".choreographer").text();
					var costume_exists = $costume.length > 0;
					var visual_exists = $vp.length > 0;
					var playing_exists = $mp.length > 0;
					var breakdown = "breakdown"
					if (!costume_exists && !playing_exists) {
						swal({
							title: 'No Breakdown Available.',
							html: `No point breakdowns for ${$band} in ${$year} are available.`
						})
						return;
					}
					if ($year < 1991 && costume_exists) { // before 1990
						music = `<b>Music:</b> ${$ge_music}<br>`
						presentation = `<strong>Presentation:</strong> ${$ge_visual}<br>`
						costume = `<b>Costume:</b> ${$costume}<br>`
					} else if (playing_exists && !costume_exists) { // 2014-present day
						music = `<b>Music Playing:</b> ${$mp} <br>
                     <b>General Effect Music:</b> ${$ge_music} <br>`
						presentation = `<b>Visual Performance:</b> ${$vp}<br>
                       <b>General Effect - Visual:</b> ${$ge_visual}<br><br>`
						costume = ''
					} else if (visual_exists) { // 1991-2013
						music = `<b>Music Playing:</b> ${$mp} <br>
                     <b>General Effect Music:</b> ${$ge_music} <br>`
						presentation = `<b>Visual Performance:</b> ${$vp}<br>
                       <b>General Effect - Visual:</b> ${$ge_visual}<br>`
						costume = `<b>Costume:</b> ${$costume}<br><br>`
					}
					breakdown = `<h3>${$band} ${$year}</h3>
              <i>${getOrdinal($prize)} Prize</i><br><br>
              ${music}
              ${presentation}
              ${costume}
              <strong>Total Points:</strong> ${$total}<br><br>
              <strong>Costumer:</strong> ${$costumer}<br>
              <strong>Costume/Set Designer:</strong> ${$designer}<br>
              <strong>Music Arranger:</strong> ${$arranger}<br>
              <strong>Choreographer:</strong> ${$choreographer}<br>`
					swal({
						title: 'Point Breakdown',
						html: breakdown
					})
				}
			}
		}
	}; // if (table != null)
  if (!isNaN(year)) {
    if (year < 1956){
      document.getElementById("hof-card").style.display = "none";
    }
    if (year < 2006){
      document.getElementById("viewers-card").style.display = "none";
    }
    if (year < 2003){
      document.getElementById("custards-card").style.display = "none";
      document.getElementById("lifetime-card").style.display = "none";
    }
  }
	var links = document.getElementsByTagName("tr");
  for (var i = 0; i < links.length; i++) {
    if (links[i].innerHTML.includes(band)) {
      links[i].className = "table-info";
    }
  }
}, 2200);

function custardsAlert() {
	swal({
		title: 'What is the Custard\'s Last Stand Award?',
		html: "The punniest theme title given by Jake Hart."
	})
}

function lifetimeAlert() {
	swal({
		title: 'What is the Lifetime Achievement Award?',
		html: "Each year the String Band Association presents a lifetime achievement award to a string band member for his or her individual accomplishments for the String Band Association going above and beyond to improve the quality of the Parade and promote the spirit of mummery."
	})
}

function viewersAlert() {
	swal({
		title: 'What is the Viewer\'s Choice Award?',
		html: "With the introduction of the Viewer's Choice Awards, String Band fans are now able to vote online for their favorite performance."
	})
}
