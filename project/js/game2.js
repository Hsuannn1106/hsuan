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
  
  // 添加圖片點擊事件
  addImageClickEvents();
  
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

// 聲音檔初始化
const correctSound = new Audio('../audio/correct.mp3');

// 播放音效函式（可控制靜音）
let soundEnabled = true;

function playSound(sound) {
  if (!soundEnabled) return;
  sound.currentTime = 0;
  sound.play();
}


// 創建差異點（隱藏的正確區域）
function createDifferenceSpot(imageId, x, y, index) {
  const spot = document.createElement('div');
  spot.className = 'g2-difference-spot';
  spot.dataset.index = index;
  spot.style.left = `${x}px`;
  spot.style.top = `${y}px`;
  spot.style.display = 'none'; // 隱藏差異點，只用於位置檢測
  
  document.querySelector(`#${imageId} .g2-image`).appendChild(spot);
}

// 添加圖片點擊事件
function addImageClickEvents() {
  const rightImage = document.querySelector('#rightImage .g2-image');
  
  rightImage.addEventListener('click', function(event) {
    const rect = this.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // 檢查是否點擊在正確位置
    const clickedDifference = checkClickPosition(clickX, clickY);
    
    if (clickedDifference !== -1) {
      // 點擊正確位置，顯示圓圈
      const spot = document.querySelector(`.g2-difference-spot[data-index="${clickedDifference}"]`);
      if (!spot.classList.contains('found')) {
        revealDifference(clickedDifference);
      }
    }
    // 如果點擊錯誤位置，什麼都不做（允許點擊但無反應）
  });
}

// 檢查點擊位置是否在差異點範圍內
function checkClickPosition(clickX, clickY) {
  const tolerance = 25; // 點擊容錯範圍
  
  for (let i = 0; i < differences.length; i++) {
    const diff = differences[i].right;
    const distance = Math.sqrt(
      Math.pow(clickX - diff.x, 2) + Math.pow(clickY - diff.y, 2)
    );
    
    if (distance <= tolerance) {
      return i;
    }
  }
  
  return -1; // 沒有找到匹配的差異點
}

// 顯示差異點
function revealDifference(index) {
  const spots = document.querySelectorAll(`.g2-difference-spot[data-index="${index}"]`);
  spots.forEach(spot => {
    spot.classList.add('found');
    spot.style.display = 'block'; // 顯示找到的圓圈
  });
  
  foundDifferences++;
  updateDifferencesCounter();
  
  playSound(correctSound);

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
  let newTotal;
  if (window.pointsManager) {
    newTotal = window.pointsManager.addPoints(totalPoints);
  } else {
    newTotal = achievementSystem.updateResearchPoints(totalPoints);
  }
  
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
  
  // 初始化獎勵流程
  initRewardFlow('game2');
  
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
      showNextReward();
    } else if (modalId === 'failModal') {
      window.location.reload();
    }
  });
}



// 獎勵流程管理
let rewardFlow = {
  gameId: null,
  step: 0,
  animalData: null
};

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
        <p>恭喜完成海洋關卡，獲得 ${newAnimals.length} 張動物圖鑑</p>
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

// 初始化遊戲
initGame();