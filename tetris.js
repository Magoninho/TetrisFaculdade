/*
   Jogo: Tetris
   Autor: Code Explained (www.codeexplained.org)
   Adaptado por: Gilson Filho
*/

// Assets 

// images
let tiles = document.getElementById("img-tiles");
let border = document.getElementById("img-playfield");
let menu = document.getElementById("img-menu");

// audio
let titlescreen = document.getElementById("audio-title");
let theme = document.getElementById("audio-theme");

let currentTheme = Math.floor(Math.random() * 4);
theme.src = `assets/music/theme${currentTheme}.mp3`;

theme.onended = () => {
	currentTheme = (currentTheme + 1) % 4;
	theme.src = `assets/music/theme${currentTheme}.mp3`;
	theme.load();
	theme.play();
}

titlescreen.play();


let GAME_STATE = "menu";

// Rotina principal

const I = [
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
	],
	[
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	]
];

const J = [
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 1],
		[0, 1, 0],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0]
	]
];

const L = [
	[
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[1, 0, 0]
	],
	[
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 0]
	]
];

const O = [
	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
	]
];

const S = [
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 0, 0],
		[0, 1, 1],
		[1, 1, 0]
	],
	[
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const T = [
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const Z = [
	[
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[1, 0, 0]
	]
];

const PECAS = [
	[Z, 0],
	[S, 1],
	[T, 2],
	[O, 3],
	[L, 4],
	[I, 5],
	[J, 6]
];

const LINHA = 20;
const COLUNA = 10;
const TAMANHO = 20;
const VAGO = "black";

var peca;
var proximasPecas = [];
var tabuleiro = [];

var inicioDescida;
var fimDeJogo = false;

var tela = document.getElementById("tela");
var c = tela.getContext("2d");

// deixa os tiles sem blur
c.imageSmoothingEnabled = false;


onkeydown = controlarPeca;


iniciarTabuleiro();

desenharTabuleiro();

gerarPeca();

inicioDescida = Date.now();

descerPeca();




// Sub-rotinas (funções)

function iniciarTabuleiro() {

	for (var i = 0; i < LINHA; i++) {
		tabuleiro[i] = [];

		for (var j = 0; j < COLUNA; j++) {
			tabuleiro[i][j] = VAGO;
		}
	}
}

function desenharTabuleiro() {

	for (var i = 0; i < LINHA; i++) {
		for (var j = 0; j < COLUNA; j++) {
			if (tabuleiro[i][j] == VAGO) {
				desenharQuadrado(j, i, tabuleiro[i][j]);
			} else {
				desenharTile(j, i, peca.tetraminoAtivo.cor);
			}
		}
	}
}

function desenharQuadrado(x, y, cor) {
	c.fillStyle = cor;
	c.fillRect(x * TAMANHO + 128, y * TAMANHO + 12, TAMANHO, TAMANHO);

	c.strokeStyle = "black";
	c.strokeRect(x * TAMANHO + 128, y * TAMANHO + 12, TAMANHO, TAMANHO);
}

function desenharTile(x, y, frame) {
	let sx = 0;
	let sy = frame * 8;
	c.drawImage(tiles, sx, sy, 8, 8, x * TAMANHO + 128, y * TAMANHO + 12, TAMANHO, TAMANHO);
}

function gerarPeca() {
	var r = Math.floor(Math.random() * PECAS.length);

	peca = {
		tetramino: PECAS[r][0],
		cor: PECAS[r][1],
		tetraminoN: 0,
		tetraminoAtivo: [[]],
		x: 3,
		y: -2
	};

	peca.tetraminoAtivo = peca.tetramino[peca.tetraminoN];

	// gerar mais 3 peças para serem as proximas
	// depois, esta função não será mais utilizada
	for (let i = 0; i < 3; i++) {
		r = Math.floor(Math.random() * PECAS.length);
		proximasPecas.push(
			{
				tetramino: PECAS[r][0],
				cor: PECAS[r][1],
				tetraminoN: 0,
				tetraminoAtivo: [[]],
				x: 3,
				y: -2
			}
		);
		proximasPecas[i].tetraminoAtivo = proximasPecas[i].tetramino[proximasPecas[i].tetraminoN];
	}
	console.log(proximasPecas);
}

function proximaPeca() {
	peca = proximasPecas[0];

	var r = Math.floor(Math.random() * PECAS.length);
	proximasPecas.push(
		{
			tetramino: PECAS[r][0],
			cor: PECAS[r][1],
			tetraminoN: 0,
			tetraminoAtivo: [[]],
			x: 3,
			y: -2
		}
	);
	proximasPecas[3].tetraminoAtivo = proximasPecas[3].tetramino[proximasPecas[3].tetraminoN];

	proximasPecas = proximasPecas.slice(1); // removendo a primeira peça
	console.log(proximasPecas);
	console.log(peca);
}

function desenharProximasPecas() {
	let images = document.getElementsByClassName("pieces");

	for (let i = 0; i < 3; i++) {
		switch (proximasPecas[i].tetramino) {
			case O:
				images[i].src = `assets/sprites/pieces/O.png`;
				break;
			case I:
				images[i].src = `assets/sprites/pieces/I.png`;
				break;
			case J:
				images[i].src = `assets/sprites/pieces/J.png`;
				break;
			case L:
				images[i].src = `assets/sprites/pieces/L.png`;
				break;
			case S:
				images[i].src = `assets/sprites/pieces/S.png`;
				break;
			case T:
				images[i].src = `assets/sprites/pieces/T.png`;
				break;
			case Z:
				images[i].src = `assets/sprites/pieces/Z.png`;
				break;

			default:
				break;
		}
	}

}

function descerPeca() {

	var agora = Date.now();
	var delta = agora - inicioDescida;



	if (GAME_STATE == "menu") {
		c.drawImage(menu, 0, 0, 504, 448)
	} else if (GAME_STATE == "gameover") {
		c.clearRect(0, 0, 504, 448);
		c.font = "30px NESFont";
		c.fillStyle = "red";
		c.textAlign = "center";
		c.fillText("GAME OVER", tela.width / 2, tela.height / 2);
	} else if (GAME_STATE == "game") {
		c.drawImage(border, 112, 0, 232, 428);
		desenharProximasPecas()

		if (delta > 1000) {

			moverAbaixo();
			c.drawImage(border, 112, 0, 232, 428);
			inicioDescida = Date.now();
		}
	}
	if (!fimDeJogo) {
		requestAnimationFrame(descerPeca);
	}


}

function moverAbaixo() {
	if (!colisao(0, 1, peca.tetraminoAtivo)) {
		apagarPeca();
		peca.y++;
		desenharPeca();
	} else {
		travarPeca();
		proximaPeca();
	}

}

function moverDireita() {
	if (!colisao(1, 0, peca.tetraminoAtivo)) {
		apagarPeca();
		peca.x++;
		desenharPeca();
	}
}

function moverEsquerda() {
	if (!colisao(-1, 0, peca.tetraminoAtivo)) {
		apagarPeca();
		peca.x--;
		desenharPeca();
	}
}

function colisao(x, y, p) {
	for (var i = 0; i < p.length; i++) {
		for (var j = 0; j < p.length; j++) {
			if (!p[i][j]) {
				continue;
			}

			var novoX = peca.x + j + x;
			var novoY = peca.y + i + y;

			if (novoX < 0 || novoX >= COLUNA || novoY >= LINHA) {
				return true;
			}

			if (novoY < 0) {
				continue;
			}

			if (tabuleiro[novoY][novoX] != VAGO) {
				return true;
			}
		}
	}

	return false;
}

function apagarPeca() {
	preencherPeca(VAGO);
}

function desenharPeca() {
	preencherTile(peca.cor);
}

function preencherPeca(cor) {
	for (var i = 0; i < peca.tetraminoAtivo.length; i++) {
		for (var j = 0; j < peca.tetraminoAtivo.length; j++) {
			if (peca.tetraminoAtivo[i][j]) {
				desenharQuadrado(peca.x + j, peca.y + i, cor);
			}
		}
	}
}

function preencherTile(frame) {
	for (var i = 0; i < peca.tetraminoAtivo.length; i++) {
		for (var j = 0; j < peca.tetraminoAtivo.length; j++) {
			if (peca.tetraminoAtivo[i][j]) {
				desenharTile(peca.x + j, peca.y + i, frame);
			}
		}
	}
}

function travarPeca() {
	for (var i = 0; i < peca.tetraminoAtivo.length; i++) {
		for (var j = 0; j < peca.tetraminoAtivo.length; j++) {
			if (!peca.tetraminoAtivo[i][j]) {
				continue;
			}

			if (peca.y + i < 0) {
				// fim de jogo
				GAME_STATE = "gameover";
				break;
			}

			tabuleiro[peca.y + i][peca.x + j] = peca.cor;
		}
	}

	for (var i = 0; i < LINHA; i++) {
		var linhaCheia = true;

		for (var j = 0; j < COLUNA; j++) {
			linhaCheia = linhaCheia && (tabuleiro[i][j] != VAGO);
		}

		if (linhaCheia) {
			for (var y = i; y > 1; y--) {
				for (var j = 0; j < COLUNA; j++) {
					tabuleiro[y][j] = tabuleiro[y - 1][j];
				}
			}

			for (var j = 0; j < COLUNA; j++) {
				tabuleiro[0][j] = VAGO;
			}
		}
	}

	desenharTabuleiro();
}

function rodarPeca() {
	var proximoPadrao = peca.tetramino[(peca.tetraminoN + 1) % peca.tetramino.length];
	var recuo = 0;

	if (colisao(0, 0, proximoPadrao)) {
		if (peca.x > COLUNA / 2) {
			recuo = -1;
		} else {
			recuo = 1;
		}
	}

	if (!colisao(recuo, 0, proximoPadrao)) {
		apagarPeca();
		peca.x += recuo;
		peca.tetraminoN = (peca.tetraminoN + 1) % peca.tetramino.length;
		peca.tetraminoAtivo = peca.tetramino[peca.tetraminoN];
		desenharPeca();
	}
}

function controlarPeca(evento) {
	var tecla = evento.keyCode;

	if (GAME_STATE == "menu" && tecla == 13) {
		c.clearRect(0, 0, 504, 448);
		titlescreen.load();
		theme.play();
		GAME_STATE = "game";
	}

	if (tecla == 37) {
		moverEsquerda();
		inicioDescida = Date.now();
	} else if (tecla == 38) {
		rodarPeca();
		inicioDescida = Date.now();
	} else if (tecla == 39) {
		moverDireita();
		inicioDescida = Date.now();
	} else if (tecla == 40) {
		moverAbaixo();
	}
}
