// 遊戲數據
const differences = [
  { left: { x: 65, y: 110 }, right: { x: 65, y: 110 } },
  { left: { x: 150, y: 120 }, right: { x: 150, y: 120 } },
  { left: { x: 180, y: 320 }, right: { x: 180, y: 320 } },
  { left: { x: 350, y: 320 }, right: { x: 350, y: 320 } },
  { left: { x: 375, y: 270 }, right: { x: 375, y: 270 } },
  { left: { x: 385, y: 200 }, right: { x: 385, y: 200 } },
  { left: { x: 70, y: 165 }, right: { x: 70, y: 165 } }

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
  updatePointsDisplay();
  
  // 啟動計時器
  startTimer();
  
  // 添加提示按鈕事件
  document.getElementById('hintButton').addEventListener('click', showHint);
}

// 更新點數顯示
function updatePointsDisplay() {
  const pointsElement = document.querySelector('.player-info');
  if (pointsElement && typeof achievementSystem !== 'undefined') {
    const currentPoints = achievementSystem.getCurrentPoints();
    pointsElement.textContent = `研究點數: ${currentPoints}`;
  }
}

// 聲音檔初始化
const correctSound = new Audio('../audio/correct.mp3');

// 播放音效函式（可控制靜音）
let soundEnabled = true;

function playSound(sound) {
  if (!soundEnabled) return;
  sound.currentTime = 0;
  sound.play();
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
  //showModal('correctModal');
  
  playSound(correctSound)

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
    }, 5000); 
    
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
  processGameCompletion();
  
  setTimeout(() => {
    showModal('completeModal');
  }, 1000);
}

// 處理遊戲完成
function processGameCompletion() {
  if (typeof achievementSystem === 'undefined') return;
  
  const gameData = {
    completed: true,
    gameType: 'spot_difference',
    timeLeft: timeLeft,
    hintsUsed: 3 - hintsLeft
  };
  
  // 基礎完成獎勵
  let basePoints = 50;
  let bonusPoints = 0;
  let rewards = [{ type: 'points', value: basePoints, name: '基礎獎勵' }];
  
  // 時間獎勵
  const timeBonus = Math.floor(timeLeft / 10);
  if (timeBonus > 0) {
    bonusPoints += timeBonus;
    rewards.push({ type: 'bonus', value: timeBonus, name: '時間獎勵' });
  }
  
  // 觀察力獎勵（不用提示）
  if (hintsLeft === 3) {
    bonusPoints += 30;
    rewards.push({ type: 'bonus', value: 30, name: '觀察大師獎勵' });
  }
  
  const totalPoints = basePoints + bonusPoints;
  
  // 更新研究點數
  const newTotal = achievementSystem.updateResearchPoints(totalPoints);
  
  // 檢查成就
  const achievements = [];
  
  // 找不同首次完成成就
  const spotDifferenceFirst = achievementSystem.checkAchievement('spot_difference_first_complete', gameData);
  if (spotDifferenceFirst) {
    achievements.push(spotDifferenceFirst);
    rewards.push({ type: 'achievement', value: spotDifferenceFirst.reward.points, name: spotDifferenceFirst.reward.item });
  }
  
  // 不用提示成就
  const noHints = achievementSystem.checkAchievement('spot_difference_no_hints', gameData);
  if (noHints) {
    achievements.push(noHints);
    rewards.push({ type: 'achievement', value: noHints.reward.points, name: noHints.reward.item });
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
  html += `<div class="reward-title">🎉 恭喜完成找不同遊戲！</div>`;
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
      if (typeof gameProgressManager !== 'undefined') {
        gameProgressManager.completeGame('game2');
      }
      // 前往故事過渡頁面
      window.location.href = 'story_transition.html?from=game2';
    } else if (modalId === 'failModal') {
      window.location.reload();
    }
  });
}

// 初始化遊戲
initGame();