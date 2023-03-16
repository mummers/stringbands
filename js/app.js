// Define Google spreadsheet URLs
var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1847002595';
var lastStandWinners = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=639470266';
var viewersChoice = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=2085823882';
var achievementawards = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1517009682';
var hofSheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1711796058';
var infoSheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=1867154294';
// Compile the Handlebars template
var bandsTemplate = Handlebars.compile($('#bands-template').html());
var lifeTemplate = Handlebars.compile($('#life-template').html());
var viewersTemplate = Handlebars.compile($('#viewers-template').html());
var custardsTemplate = Handlebars.compile($('#custards-template').html());
var hofTemplate = Handlebars.compile($('#hof-template').html());
var infoTemplate = Handlebars.compile($('#info-template').html());
// Get query string parameters
var q = document.URL;
var params = {};
q.replace(/[?&]([^=]+)[=]([^&#]+)/g, function(match, key, value) {
	params[key] = value;
	return '';
});

function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) return false;
	}
	return true;
}

function getOrdinal(n) {
	var s = ["th", "st", "nd", "rd"],
	v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
// Start with this year if no params
var searchTerm = 2023;
// Logic for countdown
var today = new Date();
var nyd = new Date(today.getFullYear() + 1, 0, 1);
var one_day = 1000 * 60 * 60 * 24;
var countdownMessage = "";
if (today.getMonth() == 0 && today.getDate() == 1) {
	//	countdownMessage = "<h4>Happy New Year! Due to weather, the " + today.getFullYear() + " parade has been postponed. Results will be posted after 8 PM EST on parade day.</h4><h4><a href=\"http://phl17.com/live/\">Watch the parade live here.</a></h4>";
		countdownMessage = "<h4>Happy New Year! " + today.getFullYear() + " Results will be posted after 8 PM EST.</h4><h4><a href=\"http://phl17.com/live/\">Watch the parade live here.</a></h4>";
} else {
	countdownMessage = "<h4>Only " + Math.ceil((nyd.getTime() - today.getTime()) / one_day) + " days left until New Year's Day!</h4>";
}
// Check for parameters
if (isEmpty(params)) {
	if (searchTerm > today.getFullYear()) {
		$('#searchTerm').html("<h1>" + searchTerm + " <small class=\"searchTerm\">Themes and Line Of March</small></h1>");
	} else {
		$('#searchTerm').html("<h1>" + searchTerm + " <small class=\"searchTerm\">Prizes and More</small></h1>");
	}
	$('#searchTerm').append(countdownMessage);
	loadResults(createSQL(searchTerm), mySpreadsheet);
} else if (params['band'] && params['prize'] && params['captainPrize']) { // Search band with prize and captains prize attached
	searchTerm = params['band'].split('+').join([separator = ' ']).trim();
	prize = params['prize'].split('+').join([separator = ' ']).trim();
	captainPrize = params['captainPrize'].split('+').join([separator = ' ']).trim();
	sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where (B = " + prize + " and F = " + captainPrize + " and (lower(C) like lower('%" + searchTerm + "%'))) order by A desc";
	$('#searchTerm').append("Search results for &ldquo;" + searchTerm + "&rdquo; and " + getOrdinal(prize) + " prize band, " + getOrdinal(captainPrize) + " prize captain");
	loadResults(sqlString, mySpreadsheet);
} else if (params['captain'] && params['captainPrize']) { // Search captain with captains prize attached
	searchTerm = params['captain'].split('+').join([separator = ' ']).trim();
	captainPrize = params['captainPrize'].split('+').join([separator = ' ']).trim();
	sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where (F = " + captainPrize + " and (lower(E) like lower('%" + searchTerm + "%'))) order by A desc";
	$('#searchTerm').append("Search results for &ldquo;" + searchTerm + "&rdquo; and " + getOrdinal(captainPrize) + " prize captain");
	loadResults(sqlString, mySpreadsheet);
} else if (params['band'] && params['prize']) { // Search band with prize attached
	searchTerm = params['band'].split('+').join([separator = ' ']).trim();
	prize = params['prize'].split('+').join([separator = ' ']).trim();
	sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where (B = " + prize + " and (lower(C) like lower('%" + searchTerm + "%'))) order by A desc";
	$('#searchTerm').append("Search results for &ldquo;" + searchTerm + "&rdquo; and " + getOrdinal(prize) + " prize");
	loadResults(sqlString, mySpreadsheet);
} else if (params['q']) { // Search user input
	searchTerm = params['q'].split('+').join([separator = ' ']).trim();
	$('#searchTerm').append("Search results for &ldquo;" + searchTerm + "&rdquo;");
	loadResults(createSQL(searchTerm), mySpreadsheet);
} else if (params['concept'] && params['prize']) { // Search concept and prize
	searchTerm = "Concept and Prize";
	concept = params['concept'].split('+').join([separator = ' ']).trim();
	prize = params['prize'].split('+').join([separator = ' ']).trim();
	sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where (B = " + prize + " and (lower(O) like lower('%" + concept + "%'))) order by A desc";
	$('#searchTerm').append("Search results for &ldquo;" + concept + "&rdquo; and " + getOrdinal(prize) + " prize");
	loadResults(sqlString, mySpreadsheet);
	document.getElementById("main-table").className = "col-md-12";
} else if (params['p'] == 'lastStand') { // Custard's Last Stand Winners
	searchTerm = "Custards";
	$('#searchTerm').append("Custard's Last Stand Winners<br><h5>The punniest theme title given by Jake Hart.</h5>");
	sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T order by A desc";
	document.getElementsByClassName('sidebar')[0].style.display = 'none';
	loadResults(sqlString, lastStandWinners);
	document.getElementById("main-table").className = "col-md-12";
} else if (params['p'] == 'viewers') { // Viewer's Choice Award Winners
	searchTerm = "Viewers";
	$('#searchTerm').append("Viewer's Choice Award Winners<br><h5>With the introduction of the Viewer's Choice Awards, String Band fans are now able to vote online for their favorite performance. Following is a listing of the top String Bands since the awards' inception in 2006.</h5>");
	sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T order by A desc";
	document.getElementsByClassName('sidebar')[0].style.display = 'none';
	loadResults(sqlString, viewersChoice);
	document.getElementById("main-table").className = "col-md-12";
} else if (params['p']) { // Search via button
	searchTerm = params['p'];
	if (params['p'] == 'firstBands') { // First Prize Bands
		$('#searchTerm').append("First Prize Bands");
		sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where B = 1 order by A desc";
	} else if (params['p'] == 'firstCaptains') { // First Prize Captains
		$('#searchTerm').append("First Prize Captains");
		sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where F = 1 order by A desc";
	} else if (params['p'] == 'secondBands') { // Second Prize Bands
		$('#searchTerm').append("Second Prize Bands");
		sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where B = 2 order by A desc";
	} else if (params['p'] == 'lastBands') { // Last Prize Bands
		$('#searchTerm').append("Last Prize, No Prize, and Disqualified Bands");
		sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where B = N order by A desc";
	} else if (params['p'] == 'leadoffBands') { // Leadoff Bands
		$('#searchTerm').append("Leadoff Bands");
		sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where M = 1 order by A desc";
	} else if (params['p'] == 'finaleBands') { // Finale Bands
		$('#searchTerm').append("Finale Bands");
		sqlString = "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where M = N order by A desc";
	}
	loadResults(sqlString, mySpreadsheet);
}
// define search string function
function createSQL(term) {
	return "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where (A like '%" + term + "%') or (B like '" + term + "') or (lower(C) like lower('%" + term + "%')) or (lower(D) like lower('%" + term + "%')) or (lower(E) like lower('%" + term + "%')) or (F like '%" + term + "%') or (lower(O) like lower('%" + term + "%')) or (lower(Q) like lower('%" + term + "%')) or (lower(R) like lower('%" + term + "%')) or (lower(S) like lower('%" + term + "%')) or (lower(T) like lower('%" + term + "%')) order by A desc, B asc";
}
// define function to load results
function loadResults(sql, sheetURL) {
	$('#bands').sheetrock({
		url: sheetURL,
		query: sql,
		rowTemplate: bandsTemplate,
		callback: function(error, options, response) {
			if (!error) {
				$('#bands').tablesorter();
				loadNotes();
				if ($('#bands tr').length == 1) {
					$('#bands').append('<h3 class="empty">No results.</h3>')
					document.getElementsByClassName('sidebar')[0].style.display = 'none';
				}
			} else {
				$('#bands').append('<h3 class="error">Error.</h3>');
			}
		}
	});
	if (searchTerm == '2021'){
		document.getElementsByClassName('sidebar')[0].style.display = 'none';
		document.getElementById("main-table").className = "col-md-12";
	}
	else {
		if (isNaN(searchTerm)) {
			document.getElementsByClassName('sidebar')[0].style.display = 'none';
			document.getElementById("main-table").className = "col-md-12";
		} else {
			loadYearData();
			document.getElementById("main-table").className = "col-md-8";
		}
	}
}

function loadYearData() {
	// define function to load parade information
	$('#parade-info').sheetrock({
		url: infoSheet,
		query: "select A,C,D,I,J where A = " + searchTerm + "order by A desc",
		rowTemplate: infoTemplate,
		callback: function(error, options, response) {
			if (error) {
				console.log(error);
				$('#parade-info').append('<h3>Error.</h3>');
			}
		}
	});
	// define function to load lifetime achievement winner
	$('#lifetime').sheetrock({
		url: achievementawards,
		query: "select A,B where A = " + searchTerm + "order by A desc",
		rowTemplate: lifeTemplate,
		callback: function(error, options, response) {
			if (error) {
				console.log(error);
				$('#lifetime').append('<h3 class="error">Error.</h3>');
			}
		}
	});
	// define function to load viewers choice
	$('#viewers').sheetrock({
		url: viewersChoice,
		query: "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where A = " + searchTerm + "order by A desc",
		rowTemplate: viewersTemplate,
		callback: function(error, options, response) {
			if (error) {
				console.log(error);
				$('#viewers').append('<h3 class="error">Error.</h3>');
			}
		}
	});
	// define function to load custards
	$('#custards').sheetrock({
		url: lastStandWinners,
		query: "select A,B,C,D,E,F,M,L,V,W,G,H,I,J,K,X,Q,R,S,T where A = " + searchTerm + "order by A desc",
		rowTemplate: custardsTemplate,
		callback: function(error, options, response) {
			if (error) {
				console.log(error);
				$('#custards').append('<h3 class="error">Error.</h3>');
			}
		}
	});
	// define function to load hof
	$('#hof-Inductees').sheetrock({
		url: hofSheet,
		query: "select A,B,C where A = " + searchTerm + "order by A desc",
		rowTemplate: hofTemplate,
		callback: function(error, options, response) {
			if (error) {
				console.log(error);
				$('#hof-Inductees').append('<h3 class="error">Error.</h3>');
			}
		}
	});
}

Handlebars.registerHelper("normalize", function(input) {
	return input.toLowerCase().replace(/ +/g, "+").replace(/\\.+|,.+|'.+/g, "");
});


function loadNotes() {
	const notes = [
	  { class: 'bd', note: 'bd-j', noteClass: 'bdNote' },
	  { class: 'bs', note: 'bs-j', noteClass: 'bsNote' },
	  { class: 'dq', note: 'dq', noteClass: 'dqNote' },
	  { class: 'gp', note: 'gp', noteClass: 'gpNote' },
	  { class: 'no', note: 'no-j', noteClass: 'noNote' },
	  { class: 'np', note: 'np-j', noteClass: 'npNote' },
	  { class: 'sp', note: 'sp-j', noteClass: 'spNote' },
	  { class: 'COVID', note: 'no-covid', noteClass: 'covidNote' }
	];
  
	notes.forEach(({ class: noteClass, note, noteClass: showClass }) => {
	  $(`td.note:contains('${note}')`).siblings('.prize').addClass(noteClass);
	  if ($(`.${noteClass}`).length) {
		$(`.${showClass}`).show();
	  }
	});
  
	if ($('.band:contains("*")').length) {
	  $('.nbNote').show();
	}
}


window.onload = function() {
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
					if (!costume_exists && !playing_exists) {
						swal({
							title: "No Breakdown Available.",
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
						costume = ""
					} else if (visual_exists) { // 1991-2013
						music = `<b>Music Playing:</b> ${$mp} <br>
						<b>General Effect Music:</b> ${$ge_music} <br>`
						presentation = `<b>Visual Performance:</b> ${$vp}<br>
						<b>General Effect - Visual:</b> ${$ge_visual}<br>`
						costume = `<b>Costume:</b> ${$costume}<br><br>`
					}
					var breakdown = `<h3>${$band} ${$year}</h3>
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
						title: "Point Breakdown",
						html: breakdown
					})
				}
			}
		}
	}; // if (table != null)
	if (isNaN(searchTerm)) {
		$(".year-col").show();
	} else {
		if (searchTerm < 1916) {
			document.getElementsByClassName("sidebar")[0].style.display = "none";
			document.getElementById("main-table").className = "col-md-12";
		}
		if (searchTerm < 1956) {
			document.getElementById("hof-card").style.display = "none";
		}
		if (searchTerm < 2006) {
			document.getElementById("viewers-card").style.display = "none";
		}
		if (searchTerm < 2003) {
			document.getElementById("custards-card").style.display = "none";
			document.getElementById("lifetime-card").style.display = "none";
		}
		if (searchTerm > 2020) {
			document.getElementById("custards-card").style.display = "none";
			document.getElementById("viewers-card").style.display = "none";
		}
		$(".year-col").hide();
	}
};

function custardsAlert() {
	swal({
		title: "What is the Custard\'s Last Stand Award?",
		html: "The punniest theme title given by Jake Hart."
	})
}

function lifetimeAlert() {
	swal({
		title: "What is the Lifetime Achievement Award?",
		html: "Each year the String Band Association presents a lifetime achievement award to a string band member for his or her individual accomplishments for the String Band Association going above and beyond to improve the quality of the Parade and promote the spirit of mummery."
	})
}

function viewersAlert() {
	swal({
		title: "What is the Viewer\'s Choice Award?",
		html: "With the introduction of the Viewer's Choice Awards, String Band fans are now able to vote online for their favorite performance."
	})
}
