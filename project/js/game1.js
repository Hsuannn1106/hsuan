// 動物數據庫
const animalDatabase = [
  { id: 'tiger', emoji: '🐯', name: '老虎' },
  { id: 'elephant', emoji: '🐘', name: '大象' },
  { id: 'giraffe', emoji: '🦒', name: '長頸鹿' },
  { id: 'monkey', emoji: '🐒', name: '猴子' },
  { id: 'panda', emoji: '🐼', name: '熊貓' },
  { id: 'lion', emoji: '🦁', name: '獅子' },
  { id: 'zebra', emoji: '🦓', name: '斑馬' },
  { id: 'bear', emoji: '🐻', name: '熊' },
  { id: 'fox', emoji: '🦊', name: '狐狸' },
  { id: 'wolf', emoji: '🐺', name: '狼' },
  { id: 'rabbit', emoji: '🐰', name: '兔子' },
  { id: 'deer', emoji: '🦌', name: '鹿' },
  { id: 'koala', emoji: '🐨', name: '無尾熊' },
  { id: 'kangaroo', emoji: '🦘', name: '袋鼠' },
  { id: 'rhino', emoji: '🦏', name: '犀牛' }
];

// 連連看遊戲初始化
let selectedImage = null; //點選的圖片
let selectedName = null;  //點選的名稱
let correctPairs = 0;     //配對數量
const totalPairs = 5;     //配對總數
let currentAnimals = [];  //當前遊戲的動物

// 獲取遊戲元素
const connectionLines = document.querySelector('.g1-connection-lines');
const progressValue = document.querySelector('.g1-progress-value');
const progressText = document.querySelector('.g1-progress-text:first-child');
const progressPercent = document.querySelector('.g1-progress-text:last-child');

  // 聲音檔初始化
const correctSound = new Audio('../audio/correct.mp3');
const wrongSound = new Audio('../audio/wrong.mp3');
// 播放音效函式（可控制靜音）
let soundEnabled = true;

function playSound(sound) {
  if (!soundEnabled) return;
  sound.currentTime = 0;
  sound.play();
}

// 檢查是否匹配
function checkMatch() {
  const imageAnimal = selectedImage.dataset.animal;
  const nameAnimal = selectedName.dataset.animal;
  
  if (imageAnimal === nameAnimal) {
    // 匹配成功
    selectedImage.classList.add('matched');
    selectedName.classList.add('matched');
    
    // 繪製連線
    drawLine(selectedImage, selectedName);
    
    playSound(correctSound);

    // 更新進度
    correctPairs++;
    updateProgress();
    
    // 顯示正確彈窗
    //showModal('correctModal');
    
    // 如果所有配對都完成，顯示完成彈窗
    if (correctPairs === totalPairs) {
      setTimeout(() => {
        processGameCompletion();
        showModal('completeModal');
      }, 1000);
    }
  } else {
    // 匹配失敗
    showModal('incorrectModal');
    playSound(wrongSound);

  }
  
  // 重置選擇
  selectedImage.classList.remove('selected');
  selectedName.classList.remove('selected');
  selectedImage = null;
  selectedName = null;
}

//畫連線
function drawLine(image, name) {
  const imageRect = image.getBoundingClientRect();
  const nameRect = name.getBoundingClientRect();
  const containerRect = document.querySelector('.g1-connection-container').getBoundingClientRect();
  
  const x1 = imageRect.right - containerRect.left;
  const y1 = imageRect.top + imageRect.height / 2 - containerRect.top;
  const x2 = nameRect.left - containerRect.left;
  const y2 = nameRect.top + nameRect.height / 2 - containerRect.top;
  
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', '#FF8C00');
  line.setAttribute('stroke-width', '2');
  
  connectionLines.appendChild(line);
}

// 更新進度
function updateProgress() {
  const percent = (correctPairs / totalPairs) * 100;
  progressValue.style.width = `${percent}%`;
  progressText.textContent = `進度：${correctPairs}/${totalPairs}`;
  progressPercent.textContent = `完成度：${percent}%`;
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
    gameType: 'matching'
  };
  
  // 基礎完成獎勵
  let basePoints = 50;
  let bonusPoints = 0;
  let rewards = [{ type: 'points', value: basePoints, name: '基礎獎勵' }];
  
  // 完美完成獎勵（一次性全對）
  bonusPoints += 25;
  rewards.push({ type: 'bonus', value: 25, name: '動物知識獎勵' });
  
  const totalPoints = basePoints + bonusPoints;
  
  // 更新研究點數
  const newTotal = achievementSystem.updateResearchPoints(totalPoints);
  
  // 檢查成就
  const achievements = [];
  
  // 連連看首次完成成就
  const matchingFirst = achievementSystem.checkAchievement('matching_first_complete', gameData);
  if (matchingFirst) {
    achievements.push(matchingFirst);
    rewards.push({ type: 'achievement', value: matchingFirst.reward.points, name: matchingFirst.reward.item });
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
  initRewardFlow('game1');
  
  // 更新點數顯示
  updatePointsDisplay();
}

// 更新完成訊息
function updateCompleteMessage(totalPoints, rewards, achievements) {
  const messageElement = document.getElementById('completeMessage');
  if (!messageElement) return;
  
  let html = `<div class="reward-display">`;
  html += `<div class="reward-title">🎉 恭喜完成動物連連看！</div>`;
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
      icon = '📚';
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
  
  /*🏆 解鎖了X個新成就*/
  if (achievements.length > 0) {
    html += `<div style="margin-top: 15px; font-size: 16px; color: #1a314eff;">`;
    html += `🏆 解鎖了 ${achievements.length} 個新成就！`;
    html += `</div>`;
  }
  
  html += `</div>`;
  
  messageElement.innerHTML = html;
}

// 顯示彈窗
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('show');
  
  const button = modal.querySelector('.modal-button');
  button.addEventListener('click', function() {
    modal.classList.remove('show');
    
    // 如果是完成彈窗，顯示下一個獎勵
    if (modalId === 'completeModal') {
      showNextReward();
    }
  });
}

// 隨機選擇動物
function selectRandomAnimals() {
  const shuffled = [...animalDatabase].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, totalPairs);
}

// 生成遊戲內容
function generateGameContent() {
  currentAnimals = selectRandomAnimals();
  
  const imagesContainer = document.querySelector('.g1-animal-images');
  const namesContainer = document.querySelector('.g1-animal-names');
  
  // 清空現有內容（保留標題）
  imagesContainer.innerHTML = '<div class="g1-column-title">動物圖片</div>';
  namesContainer.innerHTML = '<div class="g1-column-title">動物名稱</div>';
  
  // 創建隨機排序的動物列表
  const shuffledImages = [...currentAnimals].sort(() => 0.5 - Math.random());
  const shuffledNames = [...currentAnimals].sort(() => 0.5 - Math.random());
  
  // 生成圖片
  shuffledImages.forEach(animal => {
    const imageItem = document.createElement('div');
    imageItem.className = 'g1-animal-item';
    imageItem.dataset.animal = animal.id;
    imageItem.innerHTML = `<div class="g1-animal-image">${animal.emoji}</div>`;
    imagesContainer.appendChild(imageItem);
  });
  
  // 生成名稱
  shuffledNames.forEach(animal => {
    const nameItem = document.createElement('div');
    nameItem.className = 'g1-animal-item';
    nameItem.dataset.animal = animal.id;
    nameItem.innerHTML = `<div class="g1-animal-name">${animal.name}</div>`;
    namesContainer.appendChild(nameItem);
  });
}

// 重置遊戲狀態
function resetGameState() {
  selectedImage = null;
  selectedName = null;
  correctPairs = 0;
  
  // 清空連線
  connectionLines.innerHTML = '';
  
  // 重置進度
  updateProgress();
}

// 重新開始遊戲
function restartGame() {
  resetGameState();
  generateGameContent();
  bindEvents();
}

// 初始化遊戲
function initGame() {
  updatePointsDisplay();
  generateGameContent();
  bindEvents();
  
  // 綁定重新開始按鈕
  const restartBtn = document.getElementById('restartGame');
  if (restartBtn) {
    restartBtn.addEventListener('click', restartGame);
  }
}

// 綁定事件
function bindEvents() {
  const animalImages = document.querySelectorAll('.g1-animal-images .g1-animal-item');
  const animalNames = document.querySelectorAll('.g1-animal-names .g1-animal-item');
  
  // 為動物圖片添加點擊事件
  animalImages.forEach(image => {
    image.addEventListener('click', function() {
      if (this.classList.contains('matched')) return;
      
      if (selectedImage) {
        selectedImage.classList.remove('selected');
      }
      
      this.classList.add('selected');
      selectedImage = this;
      
      if (selectedName) {
        checkMatch();
      }
    });
  });
  
  // 為動物名稱添加點擊事件
  animalNames.forEach(name => {
    name.addEventListener('click', function() {
      if (this.classList.contains('matched')) return;
      
      if (selectedName) {
        selectedName.classList.remove('selected');
      }
      
      this.classList.add('selected');
      selectedName = this;
      
      if (selectedImage) {
        checkMatch();
      }
    });
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
  
  // 預先獲得動物數據
  rewardFlow.animalData = getAnimalRewardData(gameId);
}

function getAnimalRewardData(gameId) {
  const forestAnimals = [
    { id: 1, name: '老虎', emoji: '🐅' },
    { id: 5, name: '熊貓', emoji: '🐼' },
    { id: 9, name: '狐狸', emoji: '🦊' },
    { id: 13, name: '兔子', emoji: '🐰' },
    { id: 17, name: '猴子', emoji: '🐵' },
    { id: 21, name: '松鼠', emoji: '🐿️' }
  ];
  
  const rewardCount = Math.floor(Math.random() * 3) + 2;
  const saved = localStorage.getItem('collectedAnimals');
  const collected = saved ? JSON.parse(saved) : [];
  const available = forestAnimals.filter(animal => !collected.includes(animal.id));
  
  if (available.length === 0) return [];
  
  const actualCount = Math.min(rewardCount, available.length);
  const newAnimals = [];
  
  for (let i = 0; i < actualCount; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const animal = available.splice(randomIndex, 1)[0];
    newAnimals.push(animal);
    collected.push(animal.id);
  }
  
  localStorage.setItem('collectedAnimals', JSON.stringify(collected));
  return newAnimals;
}

function showNextReward() {
  rewardFlow.step++;
  
  if (rewardFlow.step === 1) {
    // 顯示動物獎勵
    showAnimalReward(rewardFlow.animalData);
  } else if (rewardFlow.step === 2) {
    // 觸發物品獎勵
    if (typeof gameProgressManager !== 'undefined') {
      gameProgressManager.completeGame(rewardFlow.gameId);
    }
  }
}

function finishRewardFlow() {
  // 所有獎勵顯示完成，跳轉到過渡頁面
  window.location.href = 'story_transition.html?from=' + rewardFlow.gameId;
}

// 顯示動物獎勵彈窗
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
        <p>恭喜完成關卡，獲得 ${newAnimals.length} 張動物圖鑑</p>
      </div>
      <div class="reward-animals">
        ${newAnimals.map(animal => `
          <div class="reward-animal">
            <div class="animal-emoji">${animal.emoji}</div>
            <div class="animal-name">${animal.name}</div>
          </div>
        `).join('')}
      </div>
      <button class="reward-close-btn" onclick="this.parentElement.parentElement.remove(); showNextReward();">下一個</button>
    </div>
  `;
  
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add('show'), 100);
}

// 初始化遊戲
initGame();


