var monsters = [];
$.getJSON('monsters.json',function(data){monsters =data;});

var players = [];
$.getJSON('players.json',function(data){players =data;cleanInit();});

//Write 0 for all players initial init

function cleanInit() {
	for (var p in players) {
		players[p].init = 0;
	}
}

function save() {
	for (var p in players) {
		var init = document.getElementById(p+"init").value;
		players[p].init = init;
	}
}

function fillSetup()
{	
	var setup = document.getElementById("setup");
	setup.innerHTML = "";
	var i=1;
	for (var p in players) {
		var name = players[p].name;
		var init = players[p].init;	
		setup.innerHTML+="<div id='"+p+"line'><a href='#'><img src='red-x-hi.png' width='15' height='15' onclick=removePlayer('"+p+"')></a>"+name+"  "+"<input id='"+p+"init' size='4' value='"+init+"' tabindex="+i+"></div>";
		i++;
	}
	setup.innerHTML+="<input id='newMonster'>";
  	document.getElementById("newMonster").addEventListener("keyup",function(event){if (event.keyCode===13) {addMonster()}});
  	setup.innerHTML+="<a href=#><img src='green-plus-sign-hi.png' width='15' height='15' onclick='addMonster()'></a>";
}

function calcInit(id) {
	var dex = monsters[id].dexterity;
	return Math.floor(Math.random() * 20)+1+calcModifier(dex);
}

function removePlayer(name) {
  remove(name+"line");
  var index = players.indexOf(name);
  if (index !== -1) players.splice(index, 1);
}

function addMonster() {
  name = document.getElementById('newMonster').value;
  var i = 0;
  for (var monster in monsters)  {
	if (monsters[monster].name.toLowerCase()==name.toLowerCase()) {
		i = monster;
	}
  }
  newMonster = jQuery.extend(true, {}, monsters[i]);
  newMonster.init = calcInit(i);
  save();
  players.push(newMonster);
  
  fillSetup();
	name = newMonster.name;
	
	
	document.getElementById("newMonster").focus();
	document.getElementById("newMonster").addEventListener("keyup",function(event){if (event.keyCode===13) {addMonster()}});  
}