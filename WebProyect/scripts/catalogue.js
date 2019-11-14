const app = document.getElementById("gameContainer");
const loadIcon = document.getElementById("loadingIcon");

//Recibe una lista de todos los juegos que salieron en Octubre
function fetchGameList(){
	fetch("https://rawg-video-games-database.p.rapidapi.com/games?dates=2019-10-01,2019-10-30", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com",
		"x-rapidapi-key": "ba56e18dfbmsha0533de8919d27bp10d3dcjsn5229ce979bb3"
	}
	})
	.then((resp) => resp.json())
	.then(function (response) {
			var jsonGameList = response;
			//Envia el ID de cada uno de los juegos en la primera página
			for(var i = 0; i < 19; i++){
				fetchGameInfo(jsonGameList.results[i].id);
			}
	})
	.catch(function (err) {
			console.log("No se puedo obtener el recurso", err);
	});
}

//Recibe el ID de un juego y extrae la información relevante
function fetchGameInfo(gameID){
	fetch(("https://rawg-video-games-database.p.rapidapi.com/games/" + gameID), {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com",
		"x-rapidapi-key": "ba56e18dfbmsha0533de8919d27bp10d3dcjsn5229ce979bb3"
	}
	})
	.then((resp) => resp.json())
	.then(function (response) {
			var jsonGame = response;
			generateGame(jsonGame.background_image,jsonGame.name,jsonGame.released,jsonGame.developers[0].name,jsonGame.genres[0].name,jsonGame.description);
	})
	.catch(function (err) {
			console.log("No se puedo obtener el recurso", err);
	});
}

//Genera un contenedor con toda la información del juego
function generateGame(image,name,date,developer,genre,description){
	const gameInfo = document.createElement('div');
	gameInfo.setAttribute('class','gameInfo');
	const gameImage = document.createElement('div');
	gameImage.setAttribute('class','gameImage');
	const cover = document.createElement('img');
	cover.src = image;
	const gameText = document.createElement('div');
	gameText.setAttribute('class','gameText');
	const gameTitle = document.createElement('div');
	gameTitle.setAttribute('class','gameTitle');
	gameTitle.textContent = name;
	const gameData = document.createElement('div');
	gameData.setAttribute('class','gameData');
	gameData.innerHTML = ("Released: " + date + "<br> Developer: " + developer
	+ "<br> Genre: " + genre);
	const gameDescription = document.createElement('div');
	gameDescription.setAttribute('class','gameDescription');
	gameDescription.innerHTML = (description);

	app.appendChild(gameInfo);
	gameInfo.appendChild(gameImage);
	gameImage.appendChild(gameTitle);
	gameImage.appendChild(cover);
	gameInfo.appendChild(gameText);
	//gameText.appendChild(gameTitle);
	gameText.appendChild(gameData);
	gameText.appendChild(gameDescription);
}

window.onload= function(){
	loadIcon.removeAttribute('hidden');//Hacemos visible el icono de carga
	fetchGameList();
	loadIcon.setAttribute("hidden","");//Lo volvemos invisible el icono de carga
	userPaneSetup();
	inactivityTime();
}

//Lazy loading
document.addEventListener("DOMContentLoaded", function() {
	var games = [].slice.call(document.querySelectorAll(".gameInfo"));
  
	if ("IntersectionObserver" in window) {
	  let lazygameObserver = new IntersectionObserver(function(entries, observer) {
		entries.forEach(function(entry) {
		  if (entry.isIntersecting) {
			entry.target.classList.add("visible");
			lazygameObserver.unobserve(entry.target);
		  }
		});
	  });
  
	  games.forEach(function(game) {
		lazygameObserver.observe(game);
	  });
	}
  });

function userPaneSetup(){
	document.getElementById("userImage").onclick= function(){
		document.getElementById("blackBG").style.display = 'block';
	document.getElementById("userPanel").style.display = 'block';
	}
	document.getElementById("gameContainer").onclick= function(){
	document.getElementById("blackBG").style.display = 'none';
	document.getElementById("userPanel").style.display = 'none';
	}
	document.getElementById("searchBar").onclick= function(){
	document.getElementById("userPanel").style.display = 'none';
	document.getElementById("blackBG").style.display = 'none';
	}
	document.getElementById("userInfo").onmouseover= function(){
		document.getElementById("userInfo").style.backgroundColor= '#61616b';
	}
	document.getElementById("userInfo").onmouseout= function(){
		document.getElementById("userInfo").style.backgroundColor= '#3c3c42';
	}
}

//Inactividad del usuario
var inactivityTime = function () {
    var time;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
	document.onkeypress = resetTimer;
	document.onclick = resetTimer;
	window.addEventListener('scroll', resetTimer, true);

    function logout() {
		document.location = '../pages/login.html';
		//Hacer la parte de cierre de session
    }

    function resetTimer() {
        clearTimeout(time);
		time = setTimeout(logout, 60000);
		//60,0000  = 1 minuto
    }
};