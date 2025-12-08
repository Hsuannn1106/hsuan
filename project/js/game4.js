// 動物生態分類遊戲
const gameData = {
  animals: [
    { id: 'lion', emoji: '🦁', name: '獅子', habitat: 'grassland' },
    { id: 'zebra', emoji: '🦓', name: '斑馬', habitat: 'grassland' },
    { id: 'giraffe', emoji: '🦒', name: '長頸鹿', habitat: 'grassland' },
    { id: 'elephant', emoji: '🐘', name: '大象', habitat: 'grassland'  },

    { id: 'bear', emoji: '🐻', name: '熊', habitat: 'forest' },
    { id: 'deer', emoji: '🦌', name: '鹿', habitat: 'forest' },
    { id: 'squirrel', emoji: '🐿️', name: '松鼠', habitat: 'forest'  },
    { id: 'owl', emoji: '🦉', name: '貓頭鷹', habitat: 'forest' },

    { id: 'whale', emoji: '🐋', name: '鯨魚', habitat: 'ocean' },
    { id: 'dolphin', emoji: '🐬', name: '海豚', habitat: 'ocean' },
    { id: 'octopus', emoji: '🐙', name: '章魚', habitat: 'ocean' },
     { id: 'shark', emoji: '🦈', name: '鯊魚' , habitat: 'ocean'},
    
    { id: 'penguin', emoji: '🐧', name: '企鵝', habitat: 'arctic' },
    { id: 'reindeer', emoji: ' 🫎', name: '馴鹿', habitat: 'arctic' },
    { id: 'polarbear', emoji: '🐻‍❄️', name: '北極熊', habitat: 'arctic' }
  ],
  habitats: {
    forest: { count: 3 },
    ocean: { count: 3 },
    grassland: { count: 3 },
    arctic: { count: 1 }
  }
};

let correctCount = 0;
let totalAttempts = 0;
let gameCompleted = false;
let selectedAnimals = [];

// 聲音檔初始化
const correctSound = new Audio('../audio/correct.mp3');
const wrongSound = new Audio('../audio/wrong.mp3');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// 初始化遊戲
function initGame() {
  updatePointsDisplay();
  selectedAnimals = selectRandomAnimals();
  generateAnimals();
  setupDropZones();
}

// 隨機選擇動物
function selectRandomAnimals() {
  const selected = [];
  
  Object.keys(gameData.habitats).forEach(habitat => {
    const count = gameData.habitats[habitat].count;
    const availableAnimals = gameData.animals.filter(a => a.habitat === habitat);
    const shuffled = availableAnimals.sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, count));
  });
  
  return selected;
}

// 生成動物卡片
function generateAnimals() {
  const container = document.getElementById('animals-container');
  container.innerHTML = '';
  
  const shuffled = [...selectedAnimals].sort(() => Math.random() - 0.5);
  
  shuffled.forEach(animal => {
    const card = document.createElement('div');
    card.className = 'animal-card';
    card.draggable = true;
    card.dataset.animal = animal.id;
    card.dataset.habitat = animal.habitat;
    
    card.innerHTML = `
      <div class="animal-emoji">${animal.emoji}</div>
      <div class="animal-name">${animal.name}</div>
    `;
    
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    container.appendChild(card);
  });
}

// 設置放置區域
function setupDropZones() {
  const zones = ['forest-zone', 'ocean-zone', 'grassland-zone', 'arctic-zone'];
  
  zones.forEach(zoneId => {
    const zone = document.getElementById(zoneId);
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
  });
}

// 拖拽開始
function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.animal);
  e.target.classList.add('dragging');
}

// 拖拽結束
function handleDragEnd(e) {
  e.target.classList.remove('dragging');
}

// 拖拽懸停
function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

// 放置處理
function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  
  const animalId = e.dataTransfer.getData('text/plain');
  const animalCard = document.querySelector(`[data-animal="${animalId}"]`);
  const targetHabitat = e.currentTarget.id.replace('-zone', '');
  const correctHabitat = animalCard.dataset.habitat;
  
  totalAttempts++;
  
  if (targetHabitat === correctHabitat) {
    // 正確分類
    correctCount++;
    animalCard.classList.add('correct');
    e.currentTarget.appendChild(animalCard);
    
    // 更新計數
    updateHabitatCount(targetHabitat);
    updateScore();
    
    playSound(correctSound);
    
    // 檢查遊戲完成
    if (correctCount === selectedAnimals.length) {
      gameCompleted = true;
      setTimeout(() => {
        processGameCompletion();
        showModal('completeModal');
      }, 500);
    }
  } else {
    // 錯誤分類
    animalCard.classList.add('incorrect');
    setTimeout(() => animalCard.classList.remove('incorrect'), 1000);
    playSound(wrongSound);
    updateScore();
  }
}

// 更新棲息地計數
function updateHabitatCount(habitat) {
  const zone = document.getElementById(`${habitat}-zone`);
  const header = zone.parentElement.querySelector('.g4-habitat-header');
  const countSpan = header.querySelector('.count');
  const currentCount = zone.querySelectorAll('.animal-card').length;
  const totalCount = gameData.habitats[habitat].count;
  countSpan.textContent = `${currentCount}/${totalCount}`;
}

// 更新分數
function updateScore() {
  const correctCountElement = document.getElementById('correct-count');
  const accuracyElement = document.getElementById('accuracy');
  
  if (correctCountElement) {
    correctCountElement.textContent = correctCount;
  }
  
  if (accuracyElement) {
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    accuracyElement.textContent = `${accuracy}%`;
  }
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

// 處理遊戲完成
function processGameCompletion() {
  if (typeof achievementSystem === 'undefined') return;
  
  const gameCompletionData = {
    completed: true,
    gameType: 'classification',
    accuracy: Math.round((correctCount / totalAttempts) * 100)
  };
  
  // 基礎完成獎勵
  let basePoints = 50;
  let bonusPoints = 0;
  let rewards = [{ type: 'points', value: basePoints, name: '基礎獎勵' }];
  
  // 準確率獎勵
  const accuracy = gameCompletionData.accuracy;
  if (accuracy === 100) {
    bonusPoints += 50;
    rewards.push({ type: 'bonus', value: 50, name: '完美分類獎勵' });
  } else if (accuracy >= 90) {
    bonusPoints += 30;
    rewards.push({ type: 'bonus', value: 30, name: '優秀分類獎勵' });
  }
  
  // 生態學家獎勵
  bonusPoints += 25;
  rewards.push({ type: 'bonus', value: 25, name: '生態學家獎勵' });
  
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
  
  // 分類遊戲首次完成成就
  const classificationFirst = achievementSystem.checkAchievement('classification_first_complete', gameCompletionData);
  if (classificationFirst) {
    achievements.push(classificationFirst);
    rewards.push({ type: 'achievement', value: classificationFirst.reward.points, name: classificationFirst.reward.item });
  }
  
  // 完美分類成就
  if (accuracy === 100) {
    const perfectClassification = achievementSystem.checkAchievement('perfect_classification', gameCompletionData);
    if (perfectClassification) {
      achievements.push(perfectClassification);
      rewards.push({ type: 'achievement', value: perfectClassification.reward.points, name: perfectClassification.reward.item });
    }
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
  
  // 解鎖圖鑑
  unlockEncyclopedia();
  
  // 初始化獎勵流程
  initRewardFlow('game4');
  
  // 更新點數顯示
  updatePointsDisplay();
}

// 更新完成訊息
function updateCompleteMessage(totalPoints, rewards, achievements) {
  const messageElement = document.getElementById('completeMessage');
  if (!messageElement) return;
  
  let html = `<div class="reward-display">`;
  html += `<div class="reward-title">🎉 恭喜完成動物生態分類！</div>`;
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
      icon = '🌿';
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

// 解鎖圖鑑
function unlockEncyclopedia() {
  if (typeof encyclopediaSystem === 'undefined') return;
  
  selectedAnimals.forEach(animal => {
    encyclopediaSystem.unlockAnimal(animal.id);
  });
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
  if (typeof window.animalCollection !== 'undefined') {
    const rewardCount = Math.floor(Math.random() * 3) + 2;
    return window.animalCollection.grantRandomAnimals(rewardCount);
  }
  return [];
}

function showNextReward() {
  rewardFlow.step++;
  
  if (rewardFlow.step === 1) {
    showAnimalReward(rewardFlow.animalData);
  } else if (rewardFlow.step === 2) {
    showItemReward(rewardFlow.gameId);
  } else if (rewardFlow.step === 3) {
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
  if (typeof window.gameProgressManager !== 'undefined') {
    window.gameProgressManager.completeGame('game4');
  }
  window.location.href = 'main_story.html?completed=game4';
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
        <p>恭喜完成生態分類關卡，獲得 ${newAnimals.length} 張動物圖鑑</p>
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