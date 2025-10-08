class MapSystem {
  constructor() {
    this.gameData = {
      game1: {
        id: 'game1',
        name: '森林區域',
        icon: '🌳',
        description: '在這裡你可以探索森林中的各種動物，並通過連連看遊戲來學習牠們的名稱。',
        gameType: '連連看',
        difficulty: 'easy',
        estimatedTime: '5-10分鐘',
        htmlFile: 'game1.html'
      },
      game2: {
        id: 'game2',
        name: '海洋區域',
        icon: '🌊',
        description: '探索海洋生物的奧秘，通過找不同遊戲來訓練你的觀察力。',
        gameType: '找不同',
        difficulty: 'medium',
        estimatedTime: '8-15分鐘',
        htmlFile: 'game2.html'
      },
      game3: {
        id: 'game3',
        name: '山地區域',
        icon: '🏔️',
        description: '穿越山地迷宮，尋找珍稀動物，並學習牠們的生存技能。',
        gameType: '迷宮',
        difficulty: 'hard',
        estimatedTime: '10-20分鐘',
        htmlFile: 'game3.html'
      }
    };
    
    this.init();
  }
  
  init() {
    this.updatePointsDisplay();
    this.renderZones();
    this.bindEvents();
  }
  
  updatePointsDisplay() {
    const pointsElement = document.querySelector('.player-info');
    if (pointsElement && typeof achievementSystem !== 'undefined') {
      const currentPoints = achievementSystem.getCurrentPoints();
      pointsElement.textContent = `研究點數: ${currentPoints}`;
    }
  }
  
  renderZones() {
    const zonesContainer = document.querySelector('.zones');
    if (!zonesContainer) return;
    
    zonesContainer.innerHTML = '';
    
    Object.values(this.gameData).forEach(game => {
      const zoneElement = this.createZoneElement(game);
      zonesContainer.appendChild(zoneElement);
    });
  }
  
  createZoneElement(game) {
    const isUnlocked = gameProgressManager.isGameUnlocked(game.id);
    const isCompleted = gameProgressManager.isGameCompleted(game.id);
    
    const zone = document.createElement('div');
    zone.className = `zone ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;
    
    let html = `
      <div class="zone-image">${game.icon}</div>
      ${isCompleted ? '<div class="completion-badge">✅</div>' : ''}
      <h3>${game.name}</h3>
      <p>${game.description}</p>
      
      <div class="game-info">
        <span class="difficulty-badge ${game.difficulty}">${this.getDifficultyText(game.difficulty)}</span>
        <span class="time-estimate">⏱️ ${game.estimatedTime}</span>
      </div>
    `;
    
    if (isCompleted) {
      html += `
        <div class="progress-info">
          <p class="progress-text">🏆 已完成</p>
          <div class="reward-display">獲得：${game.gameType}專家證書</div>
        </div>
      `;
    }
    
    if (isUnlocked) {
      html += `
        <a href="${game.htmlFile}" class="game-btn">
          ${isCompleted ? '重新挑戰' : '進入' + game.gameType + '遊戲'}
        </a>
      `;
    } else {
      html += `
        <div class="locked-overlay">
          <div>
            <div class="lock-icon">🔒</div>
            <div>需要完成前一關卡</div>
          </div>
        </div>
      `;
    }
    
    zone.innerHTML = html;
    return zone;
  }
  
  getDifficultyText(difficulty) {
    const difficultyMap = {
      easy: '簡單',
      medium: '中等',
      hard: '困難',
      expert: '專家'
    };
    return difficultyMap[difficulty] || difficulty;
  }
  
  bindEvents() {
    const resetBtn = document.getElementById('reset-achievements');
    const resetModal = document.getElementById('resetConfirmModal');
    const confirmBtn = document.getElementById('confirmReset');
    const cancelBtn = document.getElementById('cancelReset');
    
    if (resetBtn && resetModal) {
      resetBtn.addEventListener('click', () => {
        resetModal.classList.add('show');
      });
      
      confirmBtn.addEventListener('click', () => {
        achievementSystem.resetAllAchievements();
        resetModal.classList.remove('show');
        
        setTimeout(() => {
          this.updatePointsDisplay();
          this.renderZones();
        }, 500);
      });
      
      cancelBtn.addEventListener('click', () => {
        resetModal.classList.remove('show');
      });
      
      resetModal.addEventListener('click', (e) => {
        if (e.target === resetModal) {
          resetModal.classList.remove('show');
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gameProgressManager !== 'undefined') {
    new MapSystem();
  }
});