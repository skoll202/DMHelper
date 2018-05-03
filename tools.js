var monsters = [];
$.getJSON('monsters.json',function(data){monsters =data;});

var players = [];
$.getJSON('players.json',function(data){players =data;cleanInit();});

var turn = 0;
var turnCells = [];

var monsterCounter = {};

function print(message) {
	console.log(message);
}

function cleanInit() {
	for (var p in players) {
		players[p].init = 0;
	}
}

function nextTurn() {
	turn++;
	turnCells[1].innerHTML="VV";
	if (turn>=players.length) {
		turn = 0;
	}
	for (var c in turnCells) {
		document.getElementById(turnCells[c]).innerText="";
	}
	for (var cell in turnCells) {
		if (cell==turn) {
			document.getElementById(turnCells[cell]).innerText = ">>>";
		}
		else {
			document.getElementById(turnCells[cell]).innerText = "";
		}
	}
}

function save() {
	for (var p in players) {
		var init = document.getElementById(p+"init").value;
		players[p].init = init;
	}
}

function sortPlayers() {
	var sorted = [];
	for (var i=40;i>-10;i--) {
		for (p in players) {
			if (players[p].init==i) {
				sorted.push(players[p]);
			}
		}
	}
	players = sorted;
}

function fillSetup()
{	
	$("#turnTracker").hide();
	$("#monsters").hide();
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
  	setup.innerHTML+="<a href=#><img src='green-plus-sign-hi.png' width='15' height='15' onclick='addMonster()'></a>";
  	setup.innerHTML+="<br><a href=# onclick='fightNow()'>Fight!</a>";
  	document.getElementById("newMonster").addEventListener("keyup",function(event){if (event.keyCode===13) {addMonster()}});
  	$("#newMonster").focus();
}

function calcHP(monster) {
	var hpArray = monster.hit_dice.split('d');
	var hp = 0;
	for (i=0;i<hpArray[0];i++) {
		hp+=Math.floor(Math.random() * hpArray[1])+1;
	}
	return hp;
}

function getHP(id) {
	var hp = -1;
	hp = players[id].hitPoints;
	if (typeof hp == "undefined") {
		players[id].hitPoints = calcHP(players[id]);
		hp = players[id].hitPoints;
	}
	return hp;
}

function addHP(id) {
	var modCell = document.getElementById(id+"hpmod");
	if (parseInt(modCell.value)>-500) {
		players[id].hitPoints+=parseInt(modCell.value);
	}	
	modCell.value = "";
	var hpCell = document.getElementById(players[id].name+"HPCell");
	hpCell.innerHTML = getHP(id);
}

function fightNow() {
	save();
	sortPlayers();
	var setup = document.getElementById("setup");
	var turnTracker = document.getElementById("turnTracker");
	var monsterDiv = document.getElementById("monsters");
	$('#setup').hide();
	$("#turnTracker").show();
	$("#monsters").show();
	buildMonsterDiv();
	turnTracker.innerHTML="<table border='1' id='turnTable'><tr><td></td><td>Name</td><td>HP</td><td></td></tr></table>";
	var turnTable = document.getElementById("turnTable");
	for (var p in players) {
		var row = turnTable.insertRow();
		var turnCell = row.insertCell();
		var cellName = players[p].name+"TurnCell";
		turnCell.id = cellName;
		turnCells.push(cellName);
		var nameCell = row.insertCell();
		nameCell.innerHTML = players[p].name;
		var hpCell = row.insertCell();
		hpCell.innerHTML = getHP(p);
		var hpCellName = players[p].name+"HPCell";
		hpCell.id = hpCellName;
		var hpModCell = row.insertCell();
		var cellName2 = players[p].name+"HPModCell";
		hpModCell.id = cellName2;
		hpModCell.innerHTML = "<input id='"+p+"hpmod' size=4><a href=# onclick='addHP("+p+")'>Apply</a>";
	}		
	document.getElementById(turnCells[0]).innerHTML = ">>>";
	turnTracker.innerHTML+="<a href=# onclick='nextTurn()'>Next Turn</a>";
}

function calcInit(id) {
	var dex = monsters[id].dexterity;
	return Math.floor(Math.random() * 20)+1+calcModifier(dex);
}

function removePlayer(name) {
  if (name !== -1) players.splice(name, 1);
  fillSetup();
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
  
  //account for multiple monsters of the same type
  if (typeof monsterCounter[newMonster.name]=="undefined") {
  	monsterCounter[newMonster.name]=1;
  }
  else {
  	monsterCounter[newMonster.name]++;
  }
  newMonster.name+="_"+monsterCounter[newMonster.name];
  players.push(newMonster);
  
  fillSetup();
	name = newMonster.name;
}

function printModifier(stat) {
	var str = "";
	var mod = calcModifier(stat);
	if (mod>0) {
		str="+"+mod;
	}
	else {
		str=""+mod;
	}
	return str;
}

function stat(stat) {
	if (typeof stat == "undefined") {
		return 10;
	}
	else {
		return stat;
	}
}

function showDetails(id) {
	for (var p in players) {
		$("#"+players[p].name+"Details").hide();
	}
	$("#"+players[id].name+"Details").show();
}

function buildMonsterDiv() {
	var monsterDiv = document.getElementById("monsters");
	monsterDiv.innerHTML="";
	for (var p in players) {
		var name = players[p].name;
		var monster = players[p];
		monsterDiv.innerHTML+="<div id=''"+name+"NameDiv'>";
		monsterDiv.innerHTML+="<a href=# id='"+name+"' onclick='showDetails("+p+")'>"+name+"</a>";
		monsterDiv.innerHTML+="</div>";
		monsterDiv.innerHTML+="<div id='"+name+"Details'></div>";
		var monsterDetails = document.getElementById(name+"Details");
		monsterDetails.innerHTML+="<table border=2 id='"+name+"DetailsTable'><tr><td>AC:"+monster.armorClass+"</td><td>HP:"+getHP(p)+"</td><td>CR: "+monster.challengeRating+"</td></tr>"+
		"<tr><td>Str<br>"+monster.strength+" ("+printModifier(monster.strength)+")</td><td>Dex<br>"+monster.dexterity+" ("+printModifier(monster.dexterity)+")</td><td>Con<br>"+monster.constitution+" ("+printModifier(monster.constitution)+")</td></tr>"+
		"<tr><td>Int<br>"+monster.intelligence+" ("+printModifier(monster.intelligence)+")</td><td>Wis<br>"+monster.wisdom+" ("+printModifier(monster.wisdom)+")</td><td>Cha<br>"+stat(monster.charisma)+" ("+printModifier(stat(monster.charisma))+")</td></tr>"+
		"";
		monsterDetails.innerHTML+="";
		monsterDetails.innerHTML+="</table>";
		monsterDetails.innerHTML+="Size:"+monster.size+"<br>";
		var table = document.getElementById(name+"DetailsTable");
		//Special Abilities
		var row = table.insertRow();
		var cell = row.insertCell();
		cell.colSpan = 3;
		cell.innerHTML = "<b>Special Abilities</b>";
		if (typeof monster.special_abilities != 'undefined') {
			for (var a in monster.special_abilities) {
				var row = table.insertRow();
				var cell = row.insertCell();
				cell.colSpan = 3;
				cell.innerHTML = monster.special_abilities[a].name+"<br>"+monster.special_abilities[a].desc;
			}
		}
		else {
			var row = table.insertRow();
			var cell = row.insertCell();
			cell.colSpan = 3;
			cell.innerHTML = "None";
		}
		
		//Actions
		var row = table.insertRow();
		var cell = row.insertCell();
		cell.colSpan = 3;
		cell.innerHTML = "<b>Actions</b>";
		if (typeof monster.actions != 'undefined') {
			for (var a in monster.actions) {
				var row = table.insertRow();
				var cell = row.insertCell();
				cell.colSpan = 3;
				cell.innerHTML = monster.actions[a].name+"<br>"+monster.actions[a].desc;
			}
		}
		else {
			var row = table.insertRow();
			var cell = row.insertCell();
			cell.colSpan = 3;
			cell.innerHTML = "None";
		}
		$("#"+name+"Details").hide();
	}
}
