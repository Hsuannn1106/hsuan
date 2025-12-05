class GameProgressManager {
  constructor() {
    this.gameSequence = ['game1', 'game2', 'game3', 'game4'];
    this.gameNames = {
      game1: '森林區域',
      game2: '海洋區域', 
      game3: '山地區域',
      game4: '生態分類研究'
    };
    
    this.init();
  }
  
  init() {
    this.loadProgress();
  }
  
  loadProgress() {
    const saved = localStorage.getItem('animalResearchGameProgress');
    if (saved) {
      try {
        this.progress = JSON.parse(saved);
      } catch (error) {
        this.createDefaultProgress();
      }
    } else {
      this.createDefaultProgress();
    }
  }
  
  createDefaultProgress() {
    this.progress = {
      completedGames: [],
      unlockedGames: ['game1'],
      currentGame: 'game1',
      totalPoints: 0,
      finaleUnlocked: false
    };
    this.saveProgress();
  }
  
  saveProgress() {
    try {
      localStorage.setItem('animalResearchGameProgress', JSON.stringify(this.progress));
    } catch (error) {
      console.error('保存遊戲進度失敗:', error);
    }
  }
  
  completeGame(gameId) {
    const isFirstCompletion = !this.progress.completedGames.includes(gameId);
    
    if (isFirstCompletion) {
      this.progress.completedGames.push(gameId);
      
      const currentIndex = this.gameSequence.indexOf(gameId);
      if (currentIndex >= 0 && currentIndex < this.gameSequence.length - 1) {
        const nextGame = this.gameSequence[currentIndex + 1];
        if (!this.progress.unlockedGames.includes(nextGame)) {
          this.progress.unlockedGames.push(nextGame);
        }
        this.progress.currentGame = nextGame;
      }
      

      
      // 檢查是否完成所有遊戲，解鎖終章
      if (this.isAllGamesComplete()) {
        this.progress.finaleUnlocked = true;
        // 觸發終章解鎖事件
        this.triggerFinaleUnlock();
      }
      
      this.saveProgress();
      
      return true;
    }
    return false;
  }
  

  
  isGameUnlocked(gameId) {
    return this.progress.unlockedGames.includes(gameId);
  }
  
  isGameCompleted(gameId) {
    return this.progress.completedGames.includes(gameId);
  }
  
  getNextGame(currentGameId) {
    const currentIndex = this.gameSequence.indexOf(currentGameId);
    if (currentIndex >= 0 && currentIndex < this.gameSequence.length - 1) {
      return this.gameSequence[currentIndex + 1];
    }
    return null;
  }
  
  getProgressStats() {
    const completed = this.progress.completedGames.length;
    const total = this.gameSequence.length;
    return {
      completed: completed,
      total: total,
      percentage: Math.round((completed / total) * 100)
    };
  }
  
  isAllGamesComplete() {
    return this.progress.completedGames.length === this.gameSequence.length;
  }
  

  
  resetProgress() {
    this.progress = {
      completedGames: [],
      unlockedGames: ['game1'],
      currentGame: 'game1',
      totalPoints: 0,
      finaleUnlocked: false
    };
    this.saveProgress();
    
    localStorage.removeItem('collectedAnimals');
    
    if (window.itemRewardSystem) {
      window.itemRewardSystem.clearInventory();
    }
    
    if (window.achievementSystem) {
      Object.keys(window.achievementSystem.achievements).forEach(key => {
        window.achievementSystem.achievements[key].unlocked = false;
      });
      localStorage.removeItem('achievements_progress');
    }
  }
  
  isFinaleUnlocked() {
    return this.progress.finaleUnlocked === true;
  }
  
  triggerFinaleUnlock() {
    // 顯示終章解鎖通知
    this.showFinaleNotification();
    
    // 觸發自定義事件
    const event = new CustomEvent('finaleUnlocked', {
      detail: { message: '終章已解鎖' }
    });
    document.dispatchEvent(event);
  }
  
  showFinaleNotification() {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-popup finale-popup">
        <div class="achievement-popup-icon">🏆</div>
        <div class="achievement-popup-content">
          <div class="achievement-popup-title">終章解鎖！</div>
          <div class="achievement-popup-name">動物保護專家</div>
          <div class="achievement-popup-reward">
            恭喜完成所有遊戲！現在可以進入終章
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 5000);

    // 播放成就音效
    try {
      const audio = new Audio('../audio/achievement.mp3');
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } catch (e) {}
  }
}

window.gameProgressManager = new GameProgressManager();