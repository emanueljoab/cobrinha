const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');
const infoDiv = document.getElementById('info');
const tituloDiv = document.getElementById('titulo');
const subtituloDiv = document.getElementById('subtitulo');
const setas = document.querySelectorAll('.botoes');

const tamanhoQuadrado = 50;
const numLinhas = 10;
const numColunas = 10;

const campoMatriz = [];

let comidaX;
let comidaY;

let cobra;

let direcao;
let direcaoAnterior;

let score = 0;
let fimdejogo;
let vitoria;

// 0 = campo vazio
// 1 = cobra
// 2 = comida
// 3 = corpo

function desenharCampo() {
    for (let i = 0; i < numLinhas; i++) {
        for (let j = 0; j < numColunas; j++) {
            const x = j * tamanhoQuadrado;
            const y = i * tamanhoQuadrado;
            if (!fimdejogo) {
                ctx.fillStyle = campoMatriz[i][j] === 1 ? 'darkgreen' : (campoMatriz[i][j] === 2 ? 'darkred' : (campoMatriz[i][j] === 3 ? 'green' : 'black'));
                ctx.fillRect(x, y, tamanhoQuadrado, tamanhoQuadrado);
            } else {
                ctx.fillStyle = campoMatriz[i][j] === 1 ? 'red' : (campoMatriz[i][j] === 2 ? 'darkred' : (campoMatriz[i][j] === 3 ? 'red' : 'black'));
                ctx.fillRect(x, y, tamanhoQuadrado, tamanhoQuadrado);
            }
            // Adiciona borda ao retângulo
            ctx.strokeStyle = 'gray'; // Cor da borda (pode ajustar conforme necessário)
            ctx.lineWidth = 0.5; // Largura da borda (pode ajustar conforme necessário)
            ctx.strokeRect(x, y, tamanhoQuadrado, tamanhoQuadrado);
        }
    }
}   

function iniciarJogo() {
    campoMatriz.length = 0;
    // Cria uma matriz 10x10 para o campo
    for (let i = 0; i < numLinhas; i++) {
        campoMatriz.push([]);
        for (let j = 0; j < numColunas; j++) {
            campoMatriz[i].push(0); // Atribui o valor 0 à posição do campo vazio
        }
    }
    
    // Inicializa a cobra
    cobra = {
        x: 6,
        y: 5,
        corpo: [{ x: 7, y: 5 }]
    };

    campoMatriz[cobra.x][cobra.y] = 1; // Atribui o valor 1 à posição da cobra

    campoMatriz[cobra.corpo[0].x][cobra.corpo[0].y] = 3; // Atribui o valor 3 à posição do corpo

    // Inicializa a direção
    direcao = 'cima';
    direcaoAnterior = 'cima';

    // Inicializa as variáveis de pontuação e fim de jogo
    score = 0;
    fimdejogo = false;
    vitoria = false;

    // Fluxo do jogo
    comida();
    jogo();
}

function comida() {
    do {
        comidaX = Math.floor(Math.random() * numLinhas);
        comidaY = Math.floor(Math.random() * numColunas);
    } while (campoMatriz[comidaX][comidaY] !== 0);

    campoMatriz[comidaX][comidaY] = 2; // Atribui o valor 2 à posição da comida
}

function andarCobra(novaDirecao) {
    direcaoAnterior = direcao;
    direcao = novaDirecao;

    let posicaoAnterior = { x: cobra.x, y: cobra.y };

    if (direcao === 'cima') {
        cobra.x = Math.max(0, cobra.x - 1);  // Ensure cobra.x doesn't go below 0
    } else if (direcao === 'baixo') {
        cobra.x = Math.min(numLinhas - 1, cobra.x + 1);  // Ensure cobra.x doesn't go above numLinhas - 1
    } else if (direcao === 'esquerda') {
        cobra.y = Math.max(0, cobra.y - 1);  // Ensure cobra.y doesn't go below 0
    } else if (direcao === 'direita') {
        cobra.y = Math.min(numColunas - 1, cobra.y + 1);  // Ensure cobra.y doesn't go above numColunas - 1
    }

    if (cobra.x === comidaX && cobra.y === comidaY) {
        cobra.corpo.unshift(posicaoAnterior);
        score++;
        comida();
    } else {
        const ultimoSegmento = cobra.corpo.pop();
        cobra.corpo.unshift(posicaoAnterior);
        campoMatriz[ultimoSegmento.x][ultimoSegmento.y] = 0;
    }
    
    // Update the position of the snake's head
    campoMatriz[cobra.x][cobra.y] = 1;
    
    // Update the position of the snake's body
    for (let i = 0; i < cobra.corpo.length; i++) {
        campoMatriz[cobra.corpo[i].x][cobra.corpo[i].y] = 3;
    }

    verificaColisao();
}

function posicaoCobra() {
    scoreDiv.innerHTML = `${score}`;
    infoDiv.innerHTML = `X: ${cobra.x}, Y: ${cobra.y}`;
    scoreDiv.style.opacity = 1;
    if (fimdejogo) {
        tituloDiv.innerHTML = 'GAME OVER';
        tituloDiv.style.display = 'block';
        tituloDiv.style.color = 'white';
        subtituloDiv.innerHTML = 'Reiniciar';
        subtituloDiv.style.display = 'block';
    } else if (vitoria) {
        tituloDiv.innerHTML = 'VENCEU!';
        tituloDiv.style.display = 'block';
        tituloDiv.style.color = 'green';
        subtituloDiv.innerHTML ='Reiniciar';
        subtituloDiv.style.display = 'block';
    } else {
        tituloDiv.style.display = 'none';
        subtituloDiv.style.display = 'none';
    }
}

function verificaColisao() {
    // Verifica colisão com a borda
     if (cobra.corpo.some(segmento => segmento.x === cobra.x && segmento.y === cobra.y)) {
        console.log(cobra.x, cobra.y);
        fimdejogo = true;
    } else if (score == 98) {
        vitoria = true;
    }
}

function jogo() {
    function iteracaoDoJogo() {
        if (!fimdejogo && !vitoria) {
            andarCobra(direcao);
            posicaoCobra();
            desenharCampo();
            if (score <= 4) {
                setTimeout(iteracaoDoJogo, 500); // Agendando a próxima iteração
            } else if (score >= 5 && score <= 14) {
                setTimeout(iteracaoDoJogo, 400);
            } else if (score >= 15 && score <= 29) {
                setTimeout(iteracaoDoJogo, 300);
            } else if (score >= 30 && score <= 49) {
                setTimeout(iteracaoDoJogo, 200);
            } else {
                setTimeout(iteracaoDoJogo, 100);
            }
        }
    }
    iteracaoDoJogo(); // Iniciando a primeira iteração
}

function telaInicial() {
    for (let i = 0; i < numLinhas; i++) {
        campoMatriz.push([]);
        for (let j = 0; j < numColunas; j++) {
            campoMatriz[i].push(0);
        }
    }
    
    cobra = {
        x: 6,
        y: 5,
        corpo: [{ x: 7, y: 5 }]
    };

    campoMatriz[cobra.x][cobra.y] = 1;
    campoMatriz[cobra.corpo[0].x][cobra.corpo[0].y] = 3;

    desenharCampo();

    scoreDiv.innerHTML = `${score}`;
    scoreDiv.style.opacity = 0;
}

function mudarDirecao(novaDirecao) {
    direcao = novaDirecao;
    
}

telaInicial();

// Adicionando os eventos keydown e keyup
document.addEventListener('keydown', function(event) {
    // Lógica para definir a cor quando a tecla é pressionada
    if (event.key === 'ArrowUp' && direcaoAnterior !== 'baixo') {
        direcao = 'cima';
        setas[1].style.backgroundColor = 'white';
        setas[1].style.color = 'black';
    } else if (event.key === 'ArrowDown' && direcaoAnterior !== 'cima') {
        direcao = 'baixo';
        setas[7].style.backgroundColor = 'white';
        setas[7].style.color = 'black';
    } else if (event.key === 'ArrowLeft' && direcaoAnterior !== 'direita') {
        direcao = 'esquerda';
        setas[3].style.backgroundColor = 'white';
        setas[3].style.color = 'black';
    } else if (event.key === 'ArrowRight' && direcaoAnterior !== 'esquerda') {
        direcao = 'direita';
        setas[5].style.backgroundColor = 'white';
        setas[5].style.color = 'black';
    }
});

document.addEventListener('keyup', function(event) {
    // Restaura a cor padrão ao soltar a tecla
    setas.forEach(seta => {
        seta.style.backgroundColor = '';
        seta.style.color = '';
    });
});
