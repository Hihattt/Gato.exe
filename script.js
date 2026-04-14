let currentPlayer = '😺';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let vsAI = false; 
let aiDifficulty = 'hard'; 
let isSoundOn = true;

// Variables de puntaje
let catScore = 0;
let opponentScore = 0;
let drawsScore = 0;

let backgroundMusic = document.getElementById('backgroundMusic');



function startGame() {
    vsAI = false;
    resetGame(); 
    cambiarColores('#9572be', '#874ecc'); 
    setupGameDisplay();
}

function showDifficultyMenu() {
    document.getElementById('ai-menu').style.display = 'none';
    document.getElementById('difficulty-options').style.display = 'block';
}

function hideDifficultyMenu() {
    document.getElementById('ai-menu').style.display = 'block';
    document.getElementById('difficulty-options').style.display = 'none';
}

function startAI(level) {
    vsAI = true;
    aiDifficulty = level; 
    resetGame(); 

    if (level === 'easy') {
        cambiarColores('#72be85', '#4ecc70'); 
    } else {
        cambiarColores('#be7272', '#cc4e4e'); 
    }

    setupGameDisplay();
    hideDifficultyMenu();
}

function cambiarColores(color1, color2) {
    const root = document.documentElement;
    root.style.setProperty('--bg-color-1', color1);
    root.style.setProperty('--bg-color-2', color2);
    root.style.setProperty('--btn-color', color2);
}

function setupGameDisplay() {
    const titleContainer = document.querySelector('.title-container');
    const gameContainer = document.querySelector('.container');
    
    if (isSoundOn) backgroundMusic.play().catch(e => {});
    
    playSound('meow2');
    titleContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    autoResetBoard();
}

function goToHome() {
    const titleContainer = document.querySelector('.title-container');
    const gameContainer = document.querySelector('.container');
    
    playSound('meowSound');
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; 

    cambiarColores('#9572be', '#874ecc'); 
    
    titleContainer.style.display = 'block';
    gameContainer.style.display = 'none';
}


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
            let moveIndex;
            if (aiDifficulty === 'easy') {
                let available = gameBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
                moveIndex = available[Math.floor(Math.random() * available.length)];
            } else {
                moveIndex = getBestMove();
            }

            executeMove(moveIndex, '🤖');
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
    
    // SONIDOS POR PERSONAJE
    if (marker === '😺') {
        playSound('meowSound');
    } else if (marker === '🐶') {
        playSound('barkSound');
    } else if (marker === '🤖') {
        playSound('robotSound'); // NUEVO SONIDO ROBOT
    }
}

// IA 

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
    if (getWinningPattern(board, '🤖')) return 10 - depth;
    if (getWinningPattern(board, '😺')) return depth - 10;
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



function checkGameStatus() {
    let result = null;
    const players = ['😺', '🐶', '🤖'];

    for (let p of players) {
        let winningPattern = getWinningPattern(gameBoard, p);
        if (winningPattern) {
            if (p === '😺') { catScore++; result = "😺 WIN!"; }
            else { opponentScore++; result = `${p} WIN!`; }
            highlightWinner(winningPattern);
            break;
        }
    }
    if (!result && !gameBoard.includes('')) {
        drawsScore++; result = "DRAW";
    }
    if (result) {
        updateScoreUI();
        showModal(result);
    }
}

function getWinningPattern(board, player) {
    const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return winPatterns.find(p => board[p[0]] === player && board[p[1]] === player && board[p[2]] === player) || null;
}

function highlightWinner(pattern) {
    const cells = document.querySelectorAll('.cell');
    pattern.forEach(index => cells[index].classList.add('winner-cell'));
}

function checkWinner() {
    return getWinningPattern(gameBoard, '😺') || getWinningPattern(gameBoard, '🐶') || getWinningPattern(gameBoard, '🤖');
}

function updateScoreUI() {
    document.getElementById('score-cat').innerText = catScore;
    document.getElementById('score-opponent').innerText = opponentScore;
    document.getElementById('score-draws').innerText = drawsScore;
    
    const label = document.getElementById('opponent-label');
    if (vsAI) {
        label.innerText = aiDifficulty === 'easy' ? "Robot" : "Robot";
    } else {
        label.innerText = "Perro";
    }
}

// FUNCIÓN RESET CON EFECTO DE VIENTO Y SONIDO
function resetGame() {
    // 1. Sonido de viento
    playSound('windSound');

    // 2. Crear ráfaga visual
    const wind = document.createElement('div');
    wind.className = 'wind-swipe animate-wind';
    document.body.appendChild(wind);

    // 3. Sacudir marcador
    const scoreBoard = document.querySelector('.score-board');
    scoreBoard.classList.add('shake-points');

    // 4. Borrar puntos a mitad
    setTimeout(() => {
        catScore = 0;
        opponentScore = 0;
        drawsScore = 0;
        updateScoreUI();
        autoResetBoard();
    }, 400);

    // 5. Limpiar
    setTimeout(() => {
        wind.remove();
        scoreBoard.classList.remove('shake-points');
    }, 800);
}

function autoResetBoard() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = '😺';
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = '';
        cell.style.pointerEvents = 'auto';
        cell.classList.remove('winner-cell');
    });
}

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
            autoResetBoard();
        }, 500);
    }, 2500);
}


function playSound(soundId) {
    if (!isSoundOn) return; 
    const sound = document.getElementById(soundId);
    if (sound) { sound.currentTime = 0; sound.play().catch(e => {}); }
}

function toggleSound() {
    const soundButton = document.getElementById('soundButton');
    if (isSoundOn) {
        backgroundMusic.pause();
        soundButton.innerHTML = '<img src="effects/music-off.svg" alt="Mute">';
        isSoundOn = false;
    } else {
        isSoundOn = true;
        if (document.querySelector('.container').style.display === 'block') backgroundMusic.play().catch(e => {});
        soundButton.innerHTML = '<img src="effects/music-solid.svg" alt="Sound">';
    }
}
