var monsters = [];
$.getJSON('monsters.json',function(data){monsters =data;});

var players = [];
$.getJSON('players.json',function(data){players =data;});

function calcHP(id) {
	var hpArray = monsters[id].hit_dice.split('d');
	var hp = 0;
	for (i=0;i<hpArray[0];i++) {
		hp+=Math.floor(Math.random() * hpArray[1])+1;
		console.log(hp);
	}
	return hp;
}

function calcInit(id) {
	var dex = monsters[id].dexterity;
	return Math.floor(Math.random() * 20)+1+calcModifier(dex);
}

function calcModifier(stat) {
	var mod = [-5,-5,-4,-4,-3,-3,-2,-2,-1,-1,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10];
	return mod[stat];
}