let currentPlayer = '😺';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let vsAI = false; 
let isSoundOn = true;

// Variables de puntaje
let catScore = 0;
let opponentScore = 0;
let drawsScore = 0;

let backgroundMusic = document.getElementById('backgroundMusic');

// --- INICIO Y NAVEGACIÓN ---

function startGame() {
    vsAI = false;
    resetScores(); 
    setupGameDisplay();
}

function startAI() {
    vsAI = true;
    resetScores(); 
    setupGameDisplay();
}

function setupGameDisplay() {
    const titleContainer = document.querySelector('.title-container');
    const gameContainer = document.querySelector('.container');
    
    // Iniciar música si el sonido está activado
    if (isSoundOn) {
        backgroundMusic.play().catch(e => console.log("Audio esperando interacción del usuario..."));
    }
    
    playSound('meow2');

    titleContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    
    autoResetAfterMatch();
}

function goToHome() {
    const titleContainer = document.querySelector('.title-container');
    const gameContainer = document.querySelector('.container');

    playSound('meowSound');
    
    // DETENER MÚSICA AL VOLVER AL INICIO
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; 

    titleContainer.style.display = 'block';
    gameContainer.style.display = 'none';
}

// --- LÓGICA DEL MARCADOR ---

function resetScores() {
    catScore = 0;
    opponentScore = 0;
    drawsScore = 0;
    updateScoreUI();
}

function updateScoreUI() {
    document.getElementById('score-cat').innerText = catScore;
    document.getElementById('score-opponent').innerText = opponentScore;
    document.getElementById('score-draws').innerText = drawsScore;
    
    const label = document.getElementById('opponent-label');
    if (label) {
        label.innerText = vsAI ? "Robot" : "Perro";
    }
}

// --- LÓGICA DEL JUEGO ---

function placeMarker(cell) {
    const index = Array.from(cell.parentNode.children).indexOf(cell);
    if (gameBoard[index] !== '' || checkWinner()) return;

    executeMove(index, currentPlayer);

    if (checkWinner() || !gameBoard.includes('')) {
        checkGameStatus();
        return;
    }

    if (vsAI) {
        const allCells = document.querySelectorAll('.cell');
        allCells.forEach(c => c.style.pointerEvents = 'none');

        setTimeout(() => {
            const bestMoveIndex = getBestMove();
            executeMove(bestMoveIndex, '🤖');
            checkGameStatus();
            allCells.forEach(c => c.style.pointerEvents = 'auto');
        }, 500);
    } else {
        currentPlayer = (currentPlayer === '😺') ? '🐶' : '😺';
    }
}

function executeMove(index, marker) {
    gameBoard[index] = marker;
    const cells = document.querySelectorAll('.cell');
    cells[index].innerText = marker;
    
    if (marker === '😺') playSound('meowSound');
    else if (marker === '🐶') playSound('barkSound');
    else playSound('meowSound'); 
}

function checkGameStatus() {
    let result = null;
    if (checkWinLogic(gameBoard, '😺')) { catScore++; result = "😺 win!"; }
    else if (checkWinLogic(gameBoard, '🐶')) { opponentScore++; result = "🐶 win!"; }
    else if (checkWinLogic(gameBoard, '🤖')) { opponentScore++; result = "🤖 win!"; }
    else if (!gameBoard.includes('')) { drawsScore++; result = "It's a draw!"; }

    if (result) {
        updateScoreUI();
        showModal(result);
    }
}

function resetGame() {
    resetScores();
    autoResetAfterMatch();
    if (isSoundOn) playSound('meowSound');
}

// --- IA MINIMAX ---

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = '🤖';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) { bestScore = score; move = i; }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinLogic(board, '🤖')) return 10 - depth;
    if (checkWinLogic(board, '😺')) return depth - 10;
    if (!board.includes('')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = '🤖';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = '😺';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinLogic(board, player) {
    const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return winPatterns.some(p => board[p[0]] === player && board[p[1]] === player && board[p[2]] === player);
}

function checkWinner() {
    return checkWinLogic(gameBoard, '😺') || checkWinLogic(gameBoard, '🐶') || checkWinLogic(gameBoard, '🤖');
}

// --- UI Y MODALES ---

function showModal(message) {
    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content');
    const modalMessage = document.getElementById('modalMessage');
    
    modalMessage.textContent = message;
    modal.style.display = 'block';
    setTimeout(() => { modalContent.style.opacity = '1'; }, 10);

    setTimeout(() => {
        modalContent.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            autoResetAfterMatch();
        }, 500);
    }, 2500);
}

function autoResetAfterMatch() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = '😺';
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = '';
        cell.style.pointerEvents = 'auto';
    });
}

// --- SONIDO Y MÚSICA ---

function playSound(soundId) {
    if (!isSoundOn) return; 
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => {});
    }
}

function toggleSound() {
    const soundButton = document.getElementById('soundButton');
    
    if (isSoundOn) {
        backgroundMusic.pause();
        soundButton.innerHTML = '<img src="effects/music-off.svg" alt="Silencio">';
        isSoundOn = false;
    } else {
        isSoundOn = true;
        // Solo intentamos reproducir si estamos en la pantalla de juego
        const gameContainer = document.querySelector('.container');
        if (gameContainer.style.display === 'block') {
            backgroundMusic.play().catch(e => {});
        }
        soundButton.innerHTML = '<img src="effects/music-solid.svg" alt="Sonido">';
    }
}





