let currentPlayer = '😺';
let gameBoard = ['', '', '', '', '', '', '', '', ''];


function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();

}
function endGame(winner) {


    if (winner) {
        document.getElementById('gameOverSound').play(); // Reproduce el sonido de final de la partida
    }
}

function placeMarker(cell) {
    const index = Array.from(cell.parentNode.children).indexOf(cell);

    if (gameBoard[index] === '' && !checkWinner()) {
        gameBoard[index] = currentPlayer;
        cell.innerText = currentPlayer;

        if (currentPlayer === '😺') {
            playSound('meowSound'); // Reproduce el sonido del gato
        } else {
            playSound('barkSound'); // Reproduce el sonido del perro
        }


        if (checkWinner()) {
            alert(`Player ${currentPlayer} wins!`);
        } else if (!gameBoard.includes('')) {
            alert('It\'s a draw!');
        } else {
            currentPlayer = currentPlayer === '😺' ? '🐶' : '😺'; // 🐶 representa una cara de perro
        }
    }
}

// Resto del código permanece igual

function checkWinner() {

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}
function resetGame() {
    // Restablecer variables y contenido de celdas
    currentPlayer = '😺';
    gameBoard = ['', '', '', '', '', '', '', '', ''];

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerText = '';
    });
}

let backgroundMusic = document.getElementById('backgroundMusic');

function playBackgroundMusic() {
    backgroundMusic.play();
}

function pauseBackgroundMusic() {
    backgroundMusic.pause();
}

document.addEventListener('DOMContentLoaded', function () {

    playBackgroundMusic();
});

let isSoundOn = true;

function toggleSound() {
    const soundButton = document.getElementById('soundButton');
    const backgroundMusic = document.getElementById('backgroundMusic');

    if (isSoundOn) {
        pauseBackgroundMusic();
        soundButton.innerHTML = '<img src="effects/musicoff.svg" alt="Botón de Silencio">';
    } else {
        playBackgroundMusic();
        soundButton.innerHTML = '<img src="effects/music-solid.svg" alt="Botón de Sonido">';
    }

    isSoundOn = !isSoundOn;
}



