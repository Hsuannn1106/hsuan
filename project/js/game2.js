// 遊戲數據
const differences = [
  { left: { x: 20, y: 30 }, right: { x: 20, y: 30 } },
  { left: { x: 70, y: 150 }, right: { x: 70, y: 150 } },
  { left: { x: 200, y: 100 }, right: { x: 200, y: 100 } },
  { left: { x: 300, y: 250 }, right: { x: 300, y: 250 } },
  { left: { x: 150, y: 350 }, right: { x: 150, y: 350 } }
];

let foundDifferences = 0;
let hintsLeft = 3;
let timeLeft = 180; // 3分鐘
let timerInterval;

// 初始化遊戲
function initGame() {
  // 建立差異點
  differences.forEach((diff, index) => {
    createDifferenceSpot('leftImage', diff.left.x, diff.left.y, index);
    createDifferenceSpot('rightImage', diff.right.x, diff.right.y, index);
  });
  
  // 更新計數器
  updateDifferencesCounter();
  updateHintCount();
  
  // 啟動計時器
  startTimer();
  
  // 添加提示按鈕事件
  document.getElementById('hintButton').addEventListener('click', showHint);
}

// 創建差異點
function createDifferenceSpot(imageId, x, y, index) {
  const spot = document.createElement('div');
  spot.className = 'g2-difference-spot';
  spot.dataset.index = index;
  spot.style.left = `${x}px`;
  spot.style.top = `${y}px`;
  
  // 只有右邊圖片可以點擊
  if (imageId === 'rightImage') {
    spot.addEventListener('click', function() {
      if (!this.classList.contains('found')) {
        const spotIndex = parseInt(this.dataset.index);
        revealDifference(spotIndex);
      }
    });
  }
  
  document.querySelector(`#${imageId} .g2-image`).appendChild(spot);
}

// 顯示差異點
function revealDifference(index) {
  const spots = document.querySelectorAll(`.g2-difference-spot[data-index="${index}"]`);
  spots.forEach(spot => {
    spot.classList.add('found');
  });
  
  foundDifferences++;
  updateDifferencesCounter();
  
  // 顯示正確彈窗
  showModal('correctModal');
  
  // 檢查是否完成遊戲
  if (foundDifferences === differences.length) {
    gameComplete();
  }
}

// 更新差異計數器
function updateDifferencesCounter() {
  document.getElementById('differencesCounter').textContent = `找到: ${foundDifferences}/${differences.length}`;
}

// 更新提示計數
function updateHintCount() {
  document.getElementById('hintCount').textContent = hintsLeft;
  document.getElementById('hintButton').disabled = hintsLeft <= 0;
}

// 顯示提示
function showHint() {
  if (hintsLeft <= 0) return;
  
  // 找到一個未發現的差異
  const unfoundIndices = [];
  differences.forEach((diff, index) => {
    const spot = document.querySelector(`.g2-difference-spot[data-index="${index}"]`);
    if (!spot.classList.contains('found')) {
      unfoundIndices.push(index);
    }
  });
  
  if (unfoundIndices.length > 0) {
    const randomIndex = unfoundIndices[Math.floor(Math.random() * unfoundIndices.length)];
    const spot = document.querySelector(`.g2-difference-spot[data-index="${randomIndex}"]`);
    
    // 創建提示動畫
    const hint = document.createElement('div');
    hint.className = 'g2-hint-animation';
    hint.style.left = spot.style.left;
    hint.style.top = spot.style.top;
    
    spot.parentNode.appendChild(hint);
    
    // 3秒後移除提示
    setTimeout(() => {
      hint.remove();
    }, 3000);
    
    // 減少提示次數
    hintsLeft--;
    updateHintCount();
  }
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
  
  // 計算得分
  const timeBonus = Math.floor(timeLeft / 10);
  const totalPoints = 50 + timeBonus;
  
  document.getElementById('completeMessage').textContent = `你獲得了${totalPoints}研究點數！時間獎勵：+${timeBonus}`;
  
  setTimeout(() => {
    showModal('completeModal');
  }, 1000);
}

// 遊戲失敗
function gameFailed() {
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