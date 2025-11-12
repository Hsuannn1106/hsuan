/**
 * 迷宮遊戲 - 第三關
 * 功能：生成隨機迷宮，玩家控制角色走出迷宮
 */

// ==================== 遊戲狀態變數 ====================
let mazeSize = 10;                              // 迷宮大小
let maze = [];                                  // 迷宮數據陣列 (0=通道, 1=牆壁)
let playerPosition = { x: 1, y: 1 };            // 玩家當前位置
let endPosition;                                // 終點位置
let steps = 0;                                  // 玩家移動步數
let gameStartTime = null;                       // 遊戲開始時間
let gameCompleted = false;                      // 遊戲完成狀態

// ==================== 難度設定 ====================
const DIFFICULTY = {
  easy:   { size: 10, loopRatio: 0.35 },        // 簡單：小迷宮，較多迴路
  medium: { size: 21, loopRatio: 0.20 },        // 中等：中型迷宮，適中迴路
  hard:   { size: 31, loopRatio: 0.08 },        // 困難：大迷宮，較少迴路
};

// 使用簡單難度設定
const { size, loopRatio } = DIFFICULTY.easy;
mazeSize = size;
endPosition = { x: mazeSize - 2, y: mazeSize - 2 }; // 終點設在右下角附近

/**
 * 初始化遊戲
 * 設定遊戲狀態、生成迷宮、綁定事件監聽器
 */
function initGame() {
  // 記錄遊戲開始時間
  gameStartTime = Date.now();
  gameCompleted = false;
  
  // 生成迷宮和放置玩家
  generateMaze();
  placePlayer(playerPosition.x, playerPosition.y);
  
  // 更新UI顯示
  updateStepsCounter();
  updatePointsDisplay();
  
  // 綁定控制按鈕事件
  document.getElementById('upButton').addEventListener('click', () => movePlayer(0, -1));
  document.getElementById('downButton').addEventListener('click', () => movePlayer(0, 1));
  document.getElementById('leftButton').addEventListener('click', () => movePlayer(-1, 0));
  document.getElementById('rightButton').addEventListener('click', () => movePlayer(1, 0));
  
  // 綁定鍵盤事件
  document.addEventListener('keydown', handleKeyPress);
}

/**
 * 生成迷宮
 * 使用遞歸回溯算法生成迷宮，並渲染到DOM
 */
function generateMaze() {
  const mazeElement = document.getElementById('maze');
  
  // 清空並設定網格樣式
  mazeElement.innerHTML = '';
  mazeElement.style.gridTemplateColumns = `repeat(${mazeSize}, 1fr)`;
  mazeElement.style.gridTemplateRows = `repeat(${mazeSize}, 1fr)`;

  // 初始化網格 (全部設為牆壁)
  const grid = Array.from({ length: mazeSize }, () => Array(mazeSize).fill(1));
  
  // 四個方向：上、右、下、左 (每次移動2格以保持牆壁)
  const dirs = [[0, -2], [2, 0], [0, 2], [-2, 0]];

  /**
   * 陣列隨機排序函數
   */
  const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  /**
   * 遞歸雕刻通道
   * @param {number} x - 當前x座標
   * @param {number} y - 當前y座標
   */
  function carve(x, y) {
    grid[y][x] = 0; // 設為通道
    
    // 隨機嘗試四個方向
    shuffle(dirs).forEach(([dx, dy]) => {
      const nx = x + dx, ny = y + dy;
      // 檢查邊界和是否為未訪問的牆壁
      if (ny > 0 && ny < mazeSize - 1 && nx > 0 && nx < mazeSize - 1 && grid[ny][nx] === 1) {
        grid[y + dy / 2][x + dx / 2] = 0; // 打通中間的牆
        carve(nx, ny); // 遞歸繼續
      }
    });
  }

  // 從起點開始生成迷宮
  carve(1, 1);

  // 添加額外通道以增加迴路 (根據難度調整)
  for (let y = 1; y < mazeSize - 1; y++) {
    for (let x = 1; x < mazeSize - 1; x++) {
      if (grid[y][x] === 1 && Math.random() < loopRatio) {
        grid[y][x] = 0; // 隨機打通一些牆壁
      }
    }
  }

  // 確保終點區域可達
  grid[endPosition.y][endPosition.x] = 0;     // 終點
  grid[endPosition.y][endPosition.x - 1] = 0; // 終點左側
  grid[endPosition.y - 1][endPosition.x] = 0; // 終點上方

  maze = grid;

  // 渲染迷宮到DOM
  for (let y = 0; y < mazeSize; y++) {
    for (let x = 0; x < mazeSize; x++) {
      const cell = document.createElement('div');
      cell.className = `g3-cell ${maze[y][x] ? 'g3-wall' : ''}`;
      cell.dataset.x = x;
      cell.dataset.y = y;
      
      // 標記起點
      if (x === playerPosition.x && y === playerPosition.y) {
        cell.classList.add('g3-start');
        cell.textContent = '🏁';
      }
      
      // 標記終點
      if (x === endPosition.x && y === endPosition.y) {
        cell.classList.add('g3-end');
        cell.textContent = '🏆';
      }
      
      mazeElement.appendChild(cell);
    }
  }
}

/**
 * 放置玩家到指定位置
 * @param {number} x - 目標x座標
 * @param {number} y - 目標y座標
 */
function placePlayer(x, y) {
  const player = document.getElementById('player');
  
  // 延遲執行以確保DOM已渲染完成
  setTimeout(() => {
    const cellSize = document.querySelector('.g3-cell').offsetWidth;
    // 計算玩家在迷宮中的像素位置 (置中對齊)
    player.style.left = `${x * cellSize + cellSize / 2 - player.offsetWidth / 2}px`;
    player.style.top = `${y * cellSize + cellSize / 2 - player.offsetHeight / 2}px`;
  }, 10);
}

/**
 * 移動玩家
 * @param {number} dx - x方向移動量
 * @param {number} dy - y方向移動量
 */
function movePlayer(dx, dy) {
  const newX = playerPosition.x + dx;
  const newY = playerPosition.y + dy;
  
  // 檢查邊界
  if (newX < 0 || newX >= mazeSize || newY < 0 || newY >= mazeSize) return;
  
  // 檢查是否撞牆
  if (maze[newY][newX] === 1) return;
  
  // 更新玩家位置
  playerPosition.x = newX;
  playerPosition.y = newY;
  placePlayer(newX, newY);
  
  // 增加步數並更新顯示
  steps++;
  updateStepsCounter();
  
  // 檢查是否到達終點
  if (newX === endPosition.x && newY === endPosition.y) {
    gameCompleted = true;
    createCelebration();                                    // 播放慶祝動畫
    document.removeEventListener('keydown', handleKeyPress); // 移除鍵盤監聽
    
    // 延遲顯示完成畫面
    setTimeout(() => {
      processGameCompletion(); // 處理遊戲完成邏輯
      showModal('completeModal'); // 顯示完成彈窗
    }, 1000);
  }
}

/**
 * 處理鍵盤按鍵事件
 * @param {KeyboardEvent} event - 鍵盤事件
 */
function handleKeyPress(event) {
  switch (event.key) {
    case 'ArrowUp':    movePlayer(0, -1);  break; // 上箭頭
    case 'ArrowDown':  movePlayer(0, 1);   break; // 下箭頭
    case 'ArrowLeft':  movePlayer(-1, 0);  break; // 左箭頭
    case 'ArrowRight': movePlayer(1, 0);   break; // 右箭頭
  }
}

/**
 * 更新步數計數器顯示
 */
function updateStepsCounter() {
  document.getElementById('stepsCounter').textContent = `步數: ${steps}`;
}

/**
 * 更新研究點數顯示
 */
function updatePointsDisplay() {
  if (window.pointsManager) {
    window.pointsManager.updateDisplay();
  } else {
    const pointsElement = document.querySelector('.player-info');
    if (pointsElement && typeof achievementSystem !== 'undefined') {
      const currentPoints = achievementSystem.getCurrentPoints();
      pointsElement.textContent = `研究點數: ${currentPoints}`;
    }
  }
}

/**
 * 處理遊戲完成邏輯
 * 計算獎勵、檢查成就、更新進度
 */
function processGameCompletion() {
  if (typeof achievementSystem === 'undefined') return;
  
  // 遊戲數據
  const gameData = {
    completed: true,
    steps: steps,
    duration: Date.now() - gameStartTime
  };
  
  // ==================== 計算獎勵點數 ====================
  let basePoints = 50;  // 基礎完成獎勵
  let bonusPoints = 0;  // 額外獎勵
  let rewards = [{ type: 'points', value: basePoints, name: '基礎獎勵' }];
  
  // 根據步數給予額外獎勵
  if (steps <= 20) {
    bonusPoints += 100;
    rewards.push({ type: 'bonus', value: 100, name: '完美路線獎勵' });
  } else if (steps <= 30) {
    bonusPoints += 50;
    rewards.push({ type: 'bonus', value: 50, name: '優秀路線獎勵' });
  }
  
  const totalPoints = basePoints + bonusPoints;
  
  // 更新玩家研究點數
  let newTotal;
  if (window.pointsManager) {
    newTotal = window.pointsManager.addPoints(totalPoints);
  } else {
    newTotal = achievementSystem.updateResearchPoints(totalPoints);
  }
  
  // ==================== 檢查成就 ====================
  const achievements = [];
  
  // 首次完成迷宮成就
  const firstComplete = achievementSystem.checkAchievement('maze_first_complete', gameData);
  if (firstComplete) {
    achievements.push(firstComplete);
    rewards.push({ type: 'achievement', value: firstComplete.reward.points, name: firstComplete.reward.item });
  }
  
  // 速度通關成就
  const speedRunner = achievementSystem.checkAchievement('maze_speed_runner', gameData);
  if (speedRunner) {
    achievements.push(speedRunner);
    rewards.push({ type: 'achievement', value: speedRunner.reward.points, name: speedRunner.reward.item });
  }
  
  // 完美主義者成就 (最少步數)
  const perfectionist = achievementSystem.checkAchievement('maze_perfectionist', gameData);
  if (perfectionist) {
    achievements.push(perfectionist);
    rewards.push({ type: 'achievement', value: perfectionist.reward.points, name: perfectionist.reward.item });
  }
  
  // 研究點數里程碑成就
  const researchNovice = achievementSystem.checkAchievement('research_novice', { totalPoints: newTotal });
  if (researchNovice) {
    achievements.push(researchNovice);
  }
  
  // ==================== 更新UI和通知 ====================
  // 更新完成彈窗內容
  updateCompleteMessage(totalPoints, rewards, achievements);
  
  // 延遲顯示成就通知
  achievements.forEach((achievement, index) => {
    setTimeout(() => {
      achievementSystem.showAchievementNotification(achievement);
    }, 2000 + (index * 1000));
  });
  
  // 初始化獎勵流程 (動物收集等)
  initRewardFlow('game3');
  
  // 更新頂部點數顯示
  updatePointsDisplay();
}

/**
 * 更新遊戲完成彈窗的訊息內容
 * @param {number} totalPoints - 總獲得點數
 * @param {Array} rewards - 獎勵列表
 * @param {Array} achievements - 成就列表
 */
function updateCompleteMessage(totalPoints, rewards, achievements) {
  const messageElement = document.getElementById('completeMessage');
  if (!messageElement) return;
  
  // 構建HTML內容
  let html = `<div class="reward-display">`;
  html += `<div class="reward-title">🎉 恭喜完成迷宮探險！</div>`;
  html += `<div class="reward-items">`;
  
  // 顯示所有獲得的獎勵
  rewards.forEach(reward => {
    let className = 'reward-item';
    let icon = '🏆';
    
    // 根據獎勵類型設定樣式和圖標
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
  
  // 如果有解鎖成就，顯示成就提示
  if (achievements.length > 0) {
    html += `<div style="margin-top: 15px; font-size: 14px; color: #2C5282;">`;
    html += `🏆 解鎖了 ${achievements.length} 個新成就！`;
    html += `</div>`;
  }
  
  html += `</div>`;
  
  messageElement.innerHTML = html;
}

/**
 * 創建慶祝動畫效果
 * 在迷宮容器中隨機生成慶祝表情符號
 */
function createCelebration() {
  const mazeContainer = document.getElementById('mazeContainer');
  const emojis = ['🎉', '🎊', '✨', '🏆', '🌟']; // 慶祝表情符號
  
  // 生成20個隨機位置的慶祝元素
  for (let i = 0; i < 20; i++) {
    const celebration = document.createElement('div');
    celebration.className = 'g3-celebration';
    celebration.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    // 隨機位置
    celebration.style.left = `${Math.random() * 100}%`;
    celebration.style.top = `${Math.random() * 100}%`;
    
    // 隨機動畫延遲
    celebration.style.animationDelay = `${Math.random() * 1}s`;
    
    mazeContainer.appendChild(celebration);
  }
}

/**
 * 顯示彈出視窗
 * @param {string} modalId - 彈窗元素ID
 */
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('show'); // 顯示彈窗
  
  const button = modal.querySelector('.modal-button');
  button.addEventListener('click', function() {
    modal.classList.remove('show'); // 隱藏彈窗
    
    // 如果是完成彈窗，繼續獎勵流程
    if (modalId === 'completeModal') {
      showNextReward();
    }
  });
}

// ==================== 獎勵流程管理 ====================
/**
 * 獎勵流程狀態
 */
let rewardFlow = {
  gameId: null,     // 當前遊戲ID
  step: 0,          // 獎勵流程步驟
  animalData: null  // 動物獎勵數據
};

/**
 * 初始化獎勵流程
 * @param {string} gameId - 遊戲ID
 */
function initRewardFlow(gameId) {
  rewardFlow.gameId = gameId;
  rewardFlow.step = 0;
  rewardFlow.animalData = getAnimalRewardData(gameId);
}

function getAnimalRewardData(gameId) {
  // 使用統一的動物收集系統
  if (typeof window.animalCollection !== 'undefined') {
    const rewardCount = Math.floor(Math.random() * 3) + 2;
    return window.animalCollection.grantRandomAnimals(rewardCount);
  }
  return [];
}

function showNextReward() {
  rewardFlow.step++;
  
  if (rewardFlow.step === 1) {
    // 顯示動物獎勵
    showAnimalReward(rewardFlow.animalData);
  } else if (rewardFlow.step === 2) {
    // 顯示物品獎勵
    showItemReward(rewardFlow.gameId);
  } else if (rewardFlow.step === 3) {
    // 完成所有獎勵流程
    finishRewardFlow();
  }
}

function showItemReward(gameId) {
  if (typeof window.itemRewardSystem !== 'undefined') {
    window.itemRewardSystem.grantGameCompletionReward(gameId);
  } else {
    showNextReward();
  }
}

function finishRewardFlow() {
  // 更新遊戲進度
  if (typeof gameProgressManager !== 'undefined') {
    gameProgressManager.completeGame(rewardFlow.gameId);
  }
  // 所有獎勵顯示完成，跳轉到主線劇情頁面
  window.location.href = 'main_story.html?completed=' + rewardFlow.gameId;
}

function showAnimalReward(newAnimals) {
  if (!newAnimals || newAnimals.length === 0) {
    showNextReward();
    return;
  }
  
  const popup = document.createElement('div');
  popup.className = 'animal-reward-popup';
  popup.innerHTML = `
    <div class="reward-content">
      <div class="reward-header">
        <h2>🎉 獲得新動物圖鑑！</h2>
        <p>恭喜完成草原關卡，獲得 ${newAnimals.length} 張動物圖鑑</p>
      </div>
      <div class="reward-animals">
        ${newAnimals.map(animal => `
          <div class="reward-animal">
            <div class="animal-emoji">${animal.emoji}</div>
            <div class="animal-name">${animal.name}</div>
            <div class="animal-category">${getCategoryName(animal.category)}</div>
          </div>
        `).join('')}
      </div>
      <button class="reward-close-btn" onclick="this.parentElement.parentElement.remove(); showNextReward();">下一個</button>
    </div>
  `;
  
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add('show'), 100);
}

function getCategoryName(category) {
  const names = {
    forest: '森林',
    ocean: '海洋',
    farm: '農場',
    savanna: '草原'
  };
  return names[category] || '未知';
}

// ==================== 遊戲初始化 ====================
initGame(); // 啟動遊戲