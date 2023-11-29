//Deus me ajude nesse processo
import readline from 'readline';
import chalk from 'chalk';

var campo = [];
var linha;
var fimdejogo = false;
var direcao = 'up';
let ultimaDirecao = direcao;
let pontuacao = 0;

var cobra = {
    x: 5,
    y: 5,
    corpo: [{x: 6, y: 5}]
};
  
let comida = {x: Math.floor(Math.random() * 10) + 1, y: Math.floor(Math.random() * 10) + 1}; // Define a posição da comida

const rl = readline.createInterface({ // Cria a interface de entrada do usuário
    input: process.stdin,
    output: process.stdout,
});

for (var i = 0; i < 12; i++) { // Cria o campo do jogo
    linha = [];
    for (var j = 0; j < 12; j++) {
        linha.push(false);
    }
    campo.push(linha);
}

function capturaEntrada() { // Define o evento "keypress" no stdin
    rl.input.once('keypress', (key, data) => {
        console.log(data.name);
        if (data.name === 'up' && ultimaDirecao !== 'down') {
            direcao = 'up';
            ultimaDirecao = 'up';
        } else if (data.name === 'right' && ultimaDirecao !== 'left') {
            direcao = 'right';
            ultimaDirecao = 'right'
        } else if (data.name === 'down' && ultimaDirecao !== 'up') {
            direcao = 'down';
            ultimaDirecao = 'down'
        } else if (data.name === 'left' && ultimaDirecao !== 'right') {
            direcao = 'left';
            ultimaDirecao = 'left'
        }
    });
}

function desenhaJogo() { // Desenha o campo e a cobra
    console.clear();
    for (var i = 0; i < campo.length; i++) {
        var linhaStr = '';
        for (var j = 0; j < campo[i].length; j++) {
            var éCorpo = false;
            for (var k = 0; k < cobra.corpo.length; k++) {
                if (i === cobra.corpo[k].x && j === cobra.corpo[k].y) { // Verifica se a célula atual é o corpo da cobra
                    if (!fimdejogo) {
                    linhaStr += chalk.greenBright('██'); // Desenha o corpo da cobra
                    } else {
                        linhaStr += ('██');
                    }
                    éCorpo = true;
                    break;
                }
            }
            if (!éCorpo) {
                if ((i === 0 || i === campo.length-1) || (j === 0 || j === campo[i].length-1)) { // Desenha as bordas do jogo
                    linhaStr += ('██');
                } else if (i === cobra.x && j === cobra.y) { // Desenha a cabeça da cobra
                    linhaStr += chalk.green('██');
                } else if (i === comida.x && j === comida.y) { // Desenha a comida
                    if (!fimdejogo) {
                        linhaStr += chalk.greenBright('⬤ ');
                    } else {
                        linhaStr += chalk.red('⬤ ');
                    }
                } else if (campo[i][j] === false) { // Desenha uma célula vazia
                    linhaStr += '  ';
                } else {
                    linhaStr += '██';
                }
                verificaColisao();
            }
        }
        if (!fimdejogo) {
            console.log(linhaStr);
        } else {
            console.log(chalk.red(linhaStr))
        }
    }
    console.log('')
    fazCobraAndar();
}

function fazCobraAndar() { // Faz a cobra andar uma célula e retorna o valor da célula anteriormente dela para false
    setTimeout(() => {
        var linhaAnterior = cobra.x;
        var colunaAnterior = cobra.y;
        if (direcao === 'up') {
            cobra.x--;
        } else if (direcao === 'right') {
            cobra.y++;
        } else if (direcao === 'down') {
            cobra.x++;
        } else if (direcao === 'left') {
            cobra.y--;
        } 
        if (cobra.x <= 0 || cobra.y === 0 || cobra.x >= 11 || cobra.y === 11) { // verifica se bateu na borda
            fimdejogo = true;
            return;
        } else {
            for (var i = cobra.corpo.length - 1; i > 0; i--) {
                cobra.corpo[i].x = cobra.corpo[i - 1].x;
                cobra.corpo[i].y = cobra.corpo[i - 1].y;
            }
            cobra.corpo[0].x = linhaAnterior;
            cobra.corpo[0].y = colunaAnterior;
        }
        campo[linhaAnterior][colunaAnterior] = false; 
        campo[cobra.x][cobra.y] = true;
        verificaColisao();
    }, 250);
    console.log('Pontuação: ' + chalk.yellow(pontuacao));
}

function verificaColisao() { // Verifica se a cobra colidiu com a comida ou corpo
    if (cobra.x === comida.x && cobra.y === comida.y) {
        do {
            comida = {
                x: Math.floor(Math.random() * 10) + 1,
                y: Math.floor(Math.random() * 10) + 1
            };
        } while (verificaColisaoCorpo(comida.x,comida.y));
        pontuacao += 1;
        cresceCobra();
    } else {
        for (var i = 0; i < cobra.corpo.length; i++) {
            if (cobra.x === cobra.corpo[i].x && cobra.y === cobra.corpo[i].y) {
                fimdejogo = true;
                return;
            }
        }
    }
}

function verificaColisaoCorpo(x, y) {
    for (var i = 0; i < cobra.corpo.length; i++) {
      if (x === cobra.corpo[i].x && y === cobra.corpo[i].y) {
        return true;
      }
    }
    return false;
}

function cresceCobra() {
    var ultimaCelula = cobra.corpo[cobra.corpo.length - 1];
    cobra.corpo.push({x: ultimaCelula.x, y: ultimaCelula.y});
}

function loopPrincipal() {
    capturaEntrada();
    desenhaJogo();
    if (fimdejogo) {
        console.log(chalk.red('GAME OVER!'));
        rl.close();
        return;
    }
    setTimeout(loopPrincipal, 250);
}

loopPrincipal();