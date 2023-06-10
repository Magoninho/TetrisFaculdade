// visto em sala de aula
function reverseBubbleSort(arr) {
	for (var i = 0; i < arr.length; i++) { 
		for (var j = 0; j < (arr.length - i - 1); j++) {
			if (arr[j] < arr[j + 1]) {
				var temp = arr[j]
				arr[j] = arr[j + 1]
				arr[j + 1] = temp
			}
		}
	}
	return arr;
}

function getObjectKey(obj, value) {
	return Object.keys(obj).find(key => obj[key] === value);
  }

class Ranking {
	constructor() {
		this.players = {...localStorage};
		console.log(this.players);
	}

	registerPlayer(score) {
		let name = prompt("NOME (MAX: 3 LETRAS):");
		while (name.length > 3) {
			alert("3 letras no máximo!")
			name = prompt("NOME (MAX: 3 LETRAS):");
		}
		if (localStorage.getItem(name) == null) {
			this.players[name] = score;
			localStorage.setItem(name, score);
		} else {
			if (parseInt(localStorage.getItem(name)) >= parseInt(score)) {
				return;
			} else {
				this.players[name] = score;
				localStorage.setItem(name, score);
			}
		}
	}

	renderRanking() {
		let heading = document.getElementById("h2-ranking");
		let items = this.getSortedRanking();
		let scores = Object.values(items);
		let names = Object.keys(items);

		for (let i = 0; i < scores.length; i++) {
			const score = scores[i];
			heading.innerHTML += `${i+1}. ${names[i].toUpperCase()} - ${score}<br>`;
		}

		document.getElementById("game-area").style.display = "none";
		document.getElementById("ranking").style.display = "flex";
		
	}

	getSortedRanking() {
		let scores = Object.values(this.players);
		let sortedObj = {};
		scores = reverseBubbleSort(scores);

		for (let i = 0; i < scores.length; i++) {
			const score = scores[i];
			const name = getObjectKey(this.players, score);
			sortedObj[name] = score;
		}
		return sortedObj;
	}
}