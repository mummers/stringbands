var darkBtn = document.getElementById('darkMode');

function applyDarkMode(){
	color = document.body.style.backgroundColor;
	color = color.replace(/[^\d,]/g, '').split(',');
	if (color == "255,255,255"){
		console.log("coming from light");
		setDark();
		sessionStorage.setItem("darkMode", "dark");
	}
	else{
		console.log("coming from dark");
		setLight();
		sessionStorage.setItem("darkMode", "light");
	}
}

function setDark(){
	darkBtn.innerHTML = "<i class='fa fa-lightbulb-o' aria-hidden='true'></i>";
	darkBtn.title = "Turn on Light Mode";
	document.body.style.backgroundColor = "#000000";
	document.getElementById('searchTerm').style.color = "#ffffff";
	document.getElementById('results-tag').style.color = "#ffffff";
	document.getElementsByClassName('my-3')[0].style.color = "#ffffff";
	document.getElementsByClassName('my-3')[1].style.color = "#ffffff";
	document.getElementById("bands").style.color = "#ffffff";
	document.getElementById("band-info-card").className = "card text-center text-white bg-dark";
	document.getElementById("parade-card").className = "card text-center text-white bg-dark";
	document.getElementById("custards-card").className = "card text-center text-white bg-dark";
	document.getElementById("lifetime-card").className = "card text-center text-white bg-dark";
	document.getElementById("viewers-card").className = "card text-center text-white bg-dark";
	document.getElementById("hof-card").className = "card text-center text-white bg-dark";
}

function setLight(){
	darkBtn.innerHTML = "<i class='fa fa-moon-o' aria-hidden='true'></i>";
	darkBtn.title = "Turn on Dark Mode";
	document.body.style.backgroundColor = "#ffffff";
	document.getElementById('searchTerm').style.color = "#000000";
	document.getElementById('results-tag').style.color = "#000000";
	document.getElementsByClassName('my-3')[0].style.color = "#000000";
	document.getElementsByClassName('my-3')[1].style.color = "#000000";
	document.getElementById("bands").style.color = "#000000";
	document.getElementById("band-info-card").className = "card text-center";
	document.getElementById("parade-card").className = "card text-center";
	document.getElementById("custards-card").className = "card text-center";
	document.getElementById("lifetime-card").className = "card text-center";
	document.getElementById("viewers-card").className = "card text-center";
	document.getElementById("hof-card").className = "card text-center";

}
