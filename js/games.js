// ==================== 游戏管理 ====================
let currentGame = null;

function showGame(gameType) {
    // 隐藏菜单
    document.querySelector('.games-menu').classList.add('hidden');

    // 显示游戏区域
    const gameArea = document.getElementById('game-area');
    gameArea.classList.remove('hidden');

    // 隐藏所有游戏
    document.querySelectorAll('.game-container').forEach(el => el.classList.add('hidden'));

    // 显示选中的游戏
    currentGame = gameType;
    if (gameType === 'memory') {
        document.getElementById('memory-game').classList.remove('hidden');
        initMemoryGame();
    } else if (gameType === 'catch') {
        document.getElementById('catch-game').classList.remove('hidden');
        document.getElementById('catch-start').classList.remove('hidden');
    } else if (gameType === 'clicker') {
        document.getElementById('clicker-game').classList.remove('hidden');
        document.getElementById('clicker-start').classList.remove('hidden');
    }
}

// ==================== 记忆翻牌游戏 ====================
const emojis = ['🌟', '🎈', '🌸', '🍀', '🦋', '🌈', '💎', '🔥'];
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryMoves = 0;
let memoryTimer = null;
let memorySeconds = 0;

function initMemoryGame() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';

    // 重置状态
    memoryCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    flippedCards = [];
    matchedPairs = 0;
    memoryMoves = 0;
    memorySeconds = 0;

    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-time').textContent = '0';

    // 清除旧计时器
    if (memoryTimer) clearInterval(memoryTimer);
    memoryTimer = setInterval(() => {
        memorySeconds++;
        document.getElementById('memory-time').textContent = memorySeconds;
    }, 1000);

    // 创建卡片
    memoryCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        card.addEventListener('click', () => flipCard(card));
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
        return;
    }

    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        memoryMoves++;
        document.getElementById('memory-moves').textContent = memoryMoves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.emoji === card2.dataset.emoji;

    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === emojis.length) {
            clearInterval(memoryTimer);
            setTimeout(() => {
                alert(`恭喜完成！\n用时: ${memorySeconds}秒\n步数: ${memoryMoves}步`);
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '?';
            card2.textContent = '?';
            flippedCards = [];
        }, 1000);
    }
}

// ==================== 接气球游戏 ====================
let catchScore = 0;
let catchLives = 3;
let catchGameActive = false;
let catchInterval = null;
let balloonSpeed = 3000;

function startCatchGame() {
    catchScore = 0;
    catchLives = 3;
    catchGameActive = true;
    balloonSpeed = 3000;

    document.getElementById('catch-score').textContent = '0';
    document.getElementById('catch-lives').textContent = '❤️❤️❤️';
    document.getElementById('catch-start').classList.add('hidden');

    // 清除旧气球
    document.querySelectorAll('.balloon').forEach(el => el.remove());

    // 开始生成气球
    catchInterval = setInterval(createBalloon, 1000);

    // 键盘控制篮子
    const basket = document.getElementById('basket');
    let basketX = 50;

    document.onkeydown = (e) => {
        if (!catchGameActive) return;
        if (e.key === 'ArrowLeft' && basketX > 5) basketX -= 5;
        if (e.key === 'ArrowRight' && basketX < 95) basketX += 5;
        basket.style.left = basketX + '%';
    };

    // 触摸控制
    const catchArea = document.getElementById('catch-area');
    catchArea.ontouchmove = (e) => {
        if (!catchGameActive) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = catchArea.getBoundingClientRect();
        basketX = ((touch.clientX - rect.left) / rect.width) * 100;
        basketX = Math.max(5, Math.min(95, basketX));
        basket.style.left = basketX + '%';
    };
}

function createBalloon() {
    if (!catchGameActive) return;

    const area = document.getElementById('catch-area');
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = ['🎈', '🎊', '🎉', '🎁'][Math.floor(Math.random() * 4)];
    balloon.style.left = Math.random() * 90 + 5 + '%';
    balloon.style.animationDuration = (balloonSpeed / 1000) + 's';
    area.appendChild(balloon);

    // 检测碰撞
    const checkCollision = setInterval(() => {
        if (!catchGameActive) {
            clearInterval(checkCollision);
            return;
        }

        const balloonRect = balloon.getBoundingClientRect();
        const basketRect = document.getElementById('basket').getBoundingClientRect();
        const areaRect = document.getElementById('catch-area').getBoundingClientRect();

        // 接住气球
        if (balloonRect.bottom >= basketRect.top &&
            balloonRect.bottom <= basketRect.bottom &&
            balloonRect.left < basketRect.right &&
            balloonRect.right > basketRect.left) {
            catchScore += 10;
            document.getElementById('catch-score').textContent = catchScore;
            balloon.remove();
            clearInterval(checkCollision);

            // 加速
            if (catchScore % 50 === 0) {
                balloonSpeed = Math.max(1000, balloonSpeed - 300);
            }
        }

        // 掉落
        if (balloonRect.top > areaRect.bottom) {
            catchLives--;
            document.getElementById('catch-lives').textContent = '❤️'.repeat(catchLives);
            balloon.remove();
            clearInterval(checkCollision);

            if (catchLives <= 0) {
                endCatchGame();
            }
        }
    }, 50);

    // 清理
    setTimeout(() => {
        balloon.remove();
        clearInterval(checkCollision);
    }, balloonSpeed);
}

function endCatchGame() {
    catchGameActive = false;
    clearInterval(catchInterval);
    document.onkeydown = null;
    alert(`游戏结束！\n最终得分: ${catchScore}`);
    document.getElementById('catch-start').classList.remove('hidden');
}

// ==================== 点点乐游戏 ====================
let clickerScore = 0;
let clickerTime = 30;
let clickerActive = false;
let clickerTimer = null;

function startClickerGame() {
    clickerScore = 0;
    clickerTime = 30;
    clickerActive = true;

    document.getElementById('clicker-score').textContent = '0';
    document.getElementById('clicker-time').textContent = '30';
    document.getElementById('clicker-start').classList.add('hidden');

    moveTarget();

    clickerTimer = setInterval(() => {
        clickerTime--;
        document.getElementById('clicker-time').textContent = clickerTime;

        if (clickerTime <= 0) {
            endClickerGame();
        }
    }, 1000);
}

function moveTarget() {
    if (!clickerActive) return;

    const target = document.getElementById('clicker-target');
    const area = document.getElementById('clicker-area');

    const maxX = area.clientWidth - 60;
    const maxY = area.clientHeight - 60;

    target.style.left = Math.random() * maxX + 'px';
    target.style.top = Math.random() * maxY + 'px';
}

function hitTarget() {
    if (!clickerActive) return;

    clickerScore += 10;
    document.getElementById('clicker-score').textContent = clickerScore;

    // 点击效果
    const target = document.getElementById('clicker-target');
    target.style.transform = 'scale(1.5)';
    setTimeout(() => {
        target.style.transform = 'scale(1)';
        moveTarget();
    }, 100);
}

function endClickerGame() {
    clickerActive = false;
    clearInterval(clickerTimer);
    alert(`时间到！\n最终得分: ${clickerScore}`);
    document.getElementById('clicker-start').classList.remove('hidden');
}
