let currentPlayer = '😺';
let gameBoard = ['', '', '', '', '', '', '', '', ''];


function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();

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
            showModal(`${currentPlayer} win!`);
        } else if (!gameBoard.includes('')) {
            showModal('It\'s a draw!');
        } else {
            currentPlayer = currentPlayer === '😺' ? '🐶' : '😺';
        }
    }
}

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}
function showModal(message) {
    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;

    // Muestra el modal con transición
    modal.style.display = 'block';
    // Oculta el modal después de 2 segundos
    setTimeout(function () {
        closeModal();
        setTimeout(function () {
            restartGame();
        }, 500);
    }, 2000);
    setTimeout(function () {
        modalContent.style.opacity = '1';
    }, 10); // Espera un breve momento antes de cambiar la opacidad
}

function closeModal() {
    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content');

    // Oculta el modal con transición
    modalContent.style.opacity = '0';
    setTimeout(function () {
        modal.style.display = 'none';
    }, 500); // Espera a que termine la transición antes de ocultar completamente el modal
}


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

function startGame() {
    const titleContainer = document.querySelector('.title-container');
    const gameContainer = document.querySelector('.container');

    playBackgroundMusic();

    playSound('meow2');


    titleContainer.style.display = 'none';
    gameContainer.style.display = 'block';


    resetGame();
}

function startAI() {
    showModal('Pronto vendrá modo vs IA. Por favor, espera...');
}

function goToHome() {
    const titleContainer = document.querySelector('.title-container');
    const gameContainer = document.querySelector('.container');

    playSound('meowSound');

    backgroundMusic.currentTime = 0;

    // Muestra la pantalla de título y oculta el juego
    titleContainer.style.display = 'block';
    gameContainer.style.display = 'none';

    // Detener música si está reproduciéndose
    pauseBackgroundMusic();

    // Reiniciar el juego
    resetGame();
}

function restartGame() {
    // Reiniciar el juego
    resetGame();



    // Mostrar la pantalla del juego
    const titleContainer = document.querySelector('.title-container');
    const gameContainer = document.querySelector('.container');

    titleContainer.style.display = 'none';
    gameContainer.style.display = 'block';

    // Iniciar el juego nuevamente
    startGame();
}





