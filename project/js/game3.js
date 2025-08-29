// 迷宮遊戲數據
let mazeSize = 10;
let maze = [];
let playerPosition = { x: 1, y: 1 };
let endPosition;
let steps = 0;
let gameStartTime = null;
let gameCompleted = false;


// 難度參數
const DIFFICULTY = {
  easy:   { size: 10, loopRatio: 0.35 },
  medium: { size: 21, loopRatio: 0.20 },
  hard:   { size: 31, loopRatio: 0.08 },
};

const { size, loopRatio } = DIFFICULTY.easy;
mazeSize = size;
endPosition = { x: mazeSize - 2, y: mazeSize - 2 };

function initGame() {
  gameStartTime = Date.now();
  gameCompleted = false;
  generateMaze();
  placePlayer(playerPosition.x, playerPosition.y);
  updateStepsCounter();
  updatePointsDisplay();
  document.getElementById('upButton').addEventListener('click', () => movePlayer(0, -1));
  document.getElementById('downButton').addEventListener('click', () => movePlayer(0, 1));
  document.getElementById('leftButton').addEventListener('click', () => movePlayer(-1, 0));
  document.getElementById('rightButton').addEventListener('click', () => movePlayer(1, 0));
  document.addEventListener('keydown', handleKeyPress);
}

function generateMaze() {
  const mazeElement = document.getElementById('maze');
  mazeElement.innerHTML = '';
  mazeElement.style.gridTemplateColumns = `repeat(${mazeSize}, 1fr)`;
  mazeElement.style.gridTemplateRows = `repeat(${mazeSize}, 1fr)`;

  const grid = Array.from({ length: mazeSize }, () => Array(mazeSize).fill(1));
  const dirs = [[0, -2], [2, 0], [0, 2], [-2, 0]];

  const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  function carve(x, y) {
    grid[y][x] = 0;
    shuffle(dirs).forEach(([dx, dy]) => {
      const nx = x + dx, ny = y + dy;
      if (ny > 0 && ny < mazeSize - 1 && nx > 0 && nx < mazeSize - 1 && grid[ny][nx] === 1) {
        grid[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    });
  }

  carve(1, 1);

  for (let y = 1; y < mazeSize - 1; y++) {
    for (let x = 1; x < mazeSize - 1; x++) {
      if (grid[y][x] === 1 && Math.random() < loopRatio) grid[y][x] = 0;
    }
  }

  // 確保終點可達
  grid[endPosition.y][endPosition.x] = 0;
  grid[endPosition.y][endPosition.x - 1] = 0;
  grid[endPosition.y - 1][endPosition.x] = 0;

  maze = grid;

  for (let y = 0; y < mazeSize; y++) {
    for (let x = 0; x < mazeSize; x++) {
      const cell = document.createElement('div');
      cell.className = `g3-cell ${maze[y][x] ? 'g3-wall' : ''}`;
      cell.dataset.x = x;
      cell.dataset.y = y;
      if (x === playerPosition.x && y === playerPosition.y) {
        cell.classList.add('g3-start');
        cell.textContent = '🏁';
      }
      if (x === endPosition.x && y === endPosition.y) {
        cell.classList.add('g3-end');
        cell.textContent = '🏆';
      }
      mazeElement.appendChild(cell);
    }
  }
}

function placePlayer(x, y) {
  const player = document.getElementById('player');
  setTimeout(() => {
    const cellSize = document.querySelector('.g3-cell').offsetWidth;
    player.style.left = `${x * cellSize + cellSize / 2 - player.offsetWidth / 2}px`;
    player.style.top = `${y * cellSize + cellSize / 2 - player.offsetHeight / 2}px`;
  }, 10);
}

function movePlayer(dx, dy) {
  const newX = playerPosition.x + dx;
  const newY = playerPosition.y + dy;
  if (newX < 0 || newX >= mazeSize || newY < 0 || newY >= mazeSize) return;
  if (maze[newY][newX] === 1) return;
  playerPosition.x = newX;
  playerPosition.y = newY;
  placePlayer(newX, newY);
  steps++;
  updateStepsCounter();
  if (newX === endPosition.x && newY === endPosition.y) {
    gameCompleted = true;
    createCelebration();
    document.removeEventListener('keydown', handleKeyPress);
    setTimeout(() => {
      processGameCompletion();
      showModal('completeModal');
    }, 1000);
  }
}

function handleKeyPress(event) {
  switch (event.key) {
    case 'ArrowUp': movePlayer(0, -1); break;
    case 'ArrowDown': movePlayer(0, 1); break;
    case 'ArrowLeft': movePlayer(-1, 0); break;
    case 'ArrowRight': movePlayer(1, 0); break;
  }
}

function updateStepsCounter() {
  document.getElementById('stepsCounter').textContent = `步數: ${steps}`;
}

// 更新點數顯示
function updatePointsDisplay() {
  const pointsElement = document.querySelector('.player-info');
  if (pointsElement && typeof achievementSystem !== 'undefined') {
    const currentPoints = achievementSystem.getCurrentPoints();
    pointsElement.textContent = `研究點數: ${currentPoints}`;
  }
}

// 處理遊戲完成
function processGameCompletion() {
  if (typeof achievementSystem === 'undefined') return;
  
  const gameData = {
    completed: true,
    steps: steps,
    duration: Date.now() - gameStartTime
  };
  
  // 基礎完成獎勵
  let basePoints = 50;
  let bonusPoints = 0;
  let rewards = [{ type: 'points', value: basePoints, name: '基礎獎勵' }];
  
  // 步數獎勵
  if (steps <= 20) {
    bonusPoints += 100;
    rewards.push({ type: 'bonus', value: 100, name: '完美路線獎勵' });
  } else if (steps <= 30) {
    bonusPoints += 50;
    rewards.push({ type: 'bonus', value: 50, name: '優秀路線獎勵' });
  }
  
  const totalPoints = basePoints + bonusPoints;
  
  // 更新研究點數
  const newTotal = achievementSystem.updateResearchPoints(totalPoints);
  
  // 檢查成就
  const achievements = [];
  
  // 首次完成成就
  const firstComplete = achievementSystem.checkAchievement('maze_first_complete', gameData);
  if (firstComplete) {
    achievements.push(firstComplete);
    rewards.push({ type: 'achievement', value: firstComplete.reward.points, name: firstComplete.reward.item });
  }
  
  // 速度成就
  const speedRunner = achievementSystem.checkAchievement('maze_speed_runner', gameData);
  if (speedRunner) {
    achievements.push(speedRunner);
    rewards.push({ type: 'achievement', value: speedRunner.reward.points, name: speedRunner.reward.item });
  }
  
  // 完美主義者成就
  const perfectionist = achievementSystem.checkAchievement('maze_perfectionist', gameData);
  if (perfectionist) {
    achievements.push(perfectionist);
    rewards.push({ type: 'achievement', value: perfectionist.reward.points, name: perfectionist.reward.item });
  }
  
  // 研究點數成就
  const researchNovice = achievementSystem.checkAchievement('research_novice', { totalPoints: newTotal });
  if (researchNovice) {
    achievements.push(researchNovice);
  }
  
  // 更新完成訊息
  updateCompleteMessage(totalPoints, rewards, achievements);
  
  // 顯示成就通知
  achievements.forEach((achievement, index) => {
    setTimeout(() => {
      achievementSystem.showAchievementNotification(achievement);
    }, 2000 + (index * 1000));
  });
  
  // 更新點數顯示
  updatePointsDisplay();
}

// 更新完成訊息
function updateCompleteMessage(totalPoints, rewards, achievements) {
  const messageElement = document.getElementById('completeMessage');
  if (!messageElement) return;
  
  let html = `<div class="reward-display">`;
  html += `<div class="reward-title">🎉 恭喜完成迷宮探險！</div>`;
  html += `<div class="reward-items">`;
  
  // 顯示獲得的獎勵
  rewards.forEach(reward => {
    let className = 'reward-item';
    let icon = '🏆';
    
    if (reward.type === 'points') {
      className += ' points-reward';
      icon = '💰';
    } else if (reward.type === 'achievement') {
      className += ' achievement-badge';
      icon = '🏅';
    } else if (reward.type === 'bonus') {
      className += ' special-item';
      icon = '⭐';
    }
    
    html += `
      <div class="${className}">
        <div class="reward-item-icon">${icon}</div>
        <div class="reward-item-name">${reward.name}</div>
        <div class="reward-item-description">+${reward.value} 點數</div>
      </div>
    `;
  });
  
  html += `</div>`;
  
  if (achievements.length > 0) {
    html += `<div style="margin-top: 15px; font-size: 14px; color: #2C5282;">`;
    html += `🏆 解鎖了 ${achievements.length} 個新成就！`;
    html += `</div>`;
  }
  
  html += `</div>`;
  
  messageElement.innerHTML = html;
}




function createCelebration() {
  const mazeContainer = document.getElementById('mazeContainer');
  const emojis = ['🎉', '🎊', '✨', '🏆', '🌟'];
  for (let i = 0; i < 20; i++) {
    const celebration = document.createElement('div');
    celebration.className = 'g3-celebration';
    celebration.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    celebration.style.left = `${Math.random() * 100}%`;
    celebration.style.top = `${Math.random() * 100}%`;
    celebration.style.animationDelay = `${Math.random() * 1}s`;
    mazeContainer.appendChild(celebration);
  }
}



function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('show');
  const button = modal.querySelector('.modal-button');
  button.addEventListener('click', function() {
    modal.classList.remove('show');
    if (modalId === 'completeModal') {
      if (typeof gameProgressManager !== 'undefined') {
        gameProgressManager.completeGame('game3');
      }
      // 前往故事過渡頁面
      window.location.href = 'story_transition.html?from=game3';
    }
  });
}

initGame();
