// 迷宮遊戲數據
const mazeSize = 10; // 10x10 迷宮
let maze = [];
let playerPosition = { x: 0, y: 0 };
let endPosition = { x: mazeSize - 1, y: mazeSize - 1 };
let steps = 0;
let timeLeft = 120; // 2分鐘
let timerInterval;

// 初始化遊戲
function initGame() {
  // 生成迷宮
  generateMaze();
  
  // 放置玩家
  placePlayer(playerPosition.x, playerPosition.y);
  
  // 更新步數計數器
  updateStepsCounter();
  
  // 啟動計時器
  startTimer();
  
  // 添加控制按鈕事件
  document.getElementById('upButton').addEventListener('click', () => movePlayer(0, -1));
  document.getElementById('downButton').addEventListener('click', () => movePlayer(0, 1));
  document.getElementById('leftButton').addEventListener('click', () => movePlayer(-1, 0));
  document.getElementById('rightButton').addEventListener('click', () => movePlayer(1, 0));
  
  // 添加鍵盤控制
  document.addEventListener('keydown', handleKeyPress);
}

// 生成迷宮
function generateMaze() {
  const mazeElement = document.getElementById('maze');
  mazeElement.style.gridTemplateColumns = `repeat(${mazeSize}, 1fr)`;
  mazeElement.style.gridTemplateRows = `repeat(${mazeSize}, 1fr)`;
  
  // 創建基本迷宮結構
  for (let y = 0; y < mazeSize; y++) {
    maze[y] = [];
    for (let x = 0; x < mazeSize; x++) {
      // 0 = 路徑, 1 = 牆
      maze[y][x] = Math.random() < 0.3 ? 1 : 0;
      
      const cell = document.createElement('div');
      cell.className = `g3-cell ${maze[y][x] === 1 ? 'g3-wall' : ''}`;
      cell.dataset.x = x;
      cell.dataset.y = y;
      mazeElement.appendChild(cell);
    }
  }
  
  // 確保起點和終點是路徑
  maze[0][0] = 0;
  maze[mazeSize - 1][mazeSize - 1] = 0;
  
  // 標記起點和終點
  const startCell = mazeElement.querySelector('[data-x="0"][data-y="0"]');
  startCell.classList.add('g3-start');
  startCell.textContent = '🏁';
  
  const endCell = mazeElement.querySelector(`[data-x="${mazeSize - 1}"][data-y="${mazeSize - 1}"]`);
  endCell.classList.add('g3-end');
  endCell.textContent = '🏆';
  
  // 確保有一條可行路徑
  ensurePath();
}

// 確保有一條從起點到終點的路徑
function ensurePath() {
  // 簡單的方法：創建一條直接路徑
  for (let i = 0; i < mazeSize; i++) {
    // 水平路徑
    maze[0][i] = 0;
    const horizontalCell = document.querySelector(`[data-x="${i}"][data-y="0"]`);
    horizontalCell.classList.remove('g3-wall');
    
    // 垂直路徑
    maze[i][mazeSize - 1] = 0;
    const verticalCell = document.querySelector(`[data-x="${mazeSize - 1}"][data-y="${i}"]`);
    verticalCell.classList.remove('g3-wall');
  }
}

// 放置玩家
function placePlayer(x, y) {
  const player = document.getElementById('player');
  const cellSize = document.querySelector('.g3-cell').offsetWidth;
  
  player.style.left = `${x * cellSize + cellSize / 2 - player.offsetWidth / 2}px`;
  player.style.top = `${y * cellSize + cellSize / 2 - player.offsetHeight / 2}px`;
}

// 移動玩家
function movePlayer(dx, dy) {
  const newX = playerPosition.x + dx;
  const newY = playerPosition.y + dy;
  
  // 檢查是否超出邊界
  if (newX < 0 || newX >= mazeSize || newY < 0 || newY >= mazeSize) {
    return;
  }
  
  // 檢查是否撞牆
  if (maze[newY][newX] === 1) {
    return;
  }
  
  // 更新玩家位置
  playerPosition.x = newX;
  playerPosition.y = newY;
  placePlayer(newX, newY);
  
  // 增加步數
  steps++;
  updateStepsCounter();
  
  // 檢查是否到達終點
  if (newX === endPosition.x && newY === endPosition.y) {
    gameComplete();
  }
}

// 處理鍵盤按鍵
function handleKeyPress(event) {
  switch (event.key) {
    case 'ArrowUp':
      movePlayer(0, -1);
      break;
    case 'ArrowDown':
      movePlayer(0, 1);
      break;
    case 'ArrowLeft':
      movePlayer(-1, 0);
      break;
    case 'ArrowRight':
      movePlayer(1, 0);
      break;
  }
}

// 更新步數計數器
function updateStepsCounter() {
  document.getElementById('stepsCounter').textContent = `步數: ${steps}`;
}

// 啟動計時器
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `時間: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameFailed();
    }
  }, 1000);
}

// 遊戲完成
function gameComplete() {
  clearInterval(timerInterval);
  document.removeEventListener('keydown', handleKeyPress);
  
  // 添加慶祝效果
  createCelebration();
  
  // 計算得分
  const timeBonus = Math.floor(timeLeft / 5);
  const stepPenalty = Math.floor(steps / 10);
  const totalPoints = 50 + timeBonus - stepPenalty;
  
  document.getElementById('completeMessage').textContent = 
    `你獲得了${totalPoints}研究點數！\n時間獎勵：+${timeBonus} | 步數：-${stepPenalty}`;
  
  setTimeout(() => {
    showModal('completeModal');
  }, 1500);
}

// 創建慶祝效果
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

// 遊戲失敗
function gameFailed() {
  document.removeEventListener('keydown', handleKeyPress);
  showModal('failModal');
}

// 顯示彈窗
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('show');
  
  const button = modal.querySelector('.modal-button');
  button.addEventListener('click', function() {
    modal.classList.remove('show');
    
    if (modalId === 'completeModal') {
      window.location.href = 'map.html';
    } else if (modalId === 'failModal') {
      window.location.reload();
    }
  });
}

// 初始化遊戲
initGame();