// 遊戲進度管理系統
class GameProgressManager {
  constructor() {
    this.gameSequence = ['game1', 'game2', 'game3'];
    this.gameNames = {
      game1: '森林區域',
      game2: '海洋區域', 
      game3: '山地區域'
    };
    
    this.init();
  }
  
  init() {
    this.loadProgress();
  }
  
  // 載入進度
  loadProgress() {
    const saved = localStorage.getItem('animalResearchGameProgress');
    if (saved) {
      this.progress = JSON.parse(saved);
    } else {
      this.progress = {
        completedGames: [],
        unlockedGames: ['game1'], // 第一關預設解鎖
        currentGame: 'game1',
        totalPoints: 0
      };
      this.saveProgress();
    }
  }
  
  // 保存進度
  saveProgress() {
    localStorage.setItem('animalResearchGameProgress', JSON.stringify(this.progress));
  }
  
  // 完成遊戲
  completeGame(gameId) {
    if (!this.progress.completedGames.includes(gameId)) {
      this.progress.completedGames.push(gameId);
      
      // 解鎖下一關
      const currentIndex = this.gameSequence.indexOf(gameId);
      if (currentIndex >= 0 && currentIndex < this.gameSequence.length - 1) {
        const nextGame = this.gameSequence[currentIndex + 1];
        if (!this.progress.unlockedGames.includes(nextGame)) {
          this.progress.unlockedGames.push(nextGame);
        }
        this.progress.currentGame = nextGame;
      }
      
      this.saveProgress();
      
      // 觸發動物圖鑑獎勵
      this.triggerAnimalReward(gameId);
      
      return true;
    }
    return false;
  }
  
  // 觸發動物圖鑑獎勵
  triggerAnimalReward(gameId) {
    // 發送自定義事件通知動物收集系統
    const event = new CustomEvent('gameCompleted', {
      detail: { gameId: gameId }
    });
    window.dispatchEvent(event);
    
    // 如果grantGameReward函數存在，直接調用
    if (typeof window.grantGameReward === 'function') {
      setTimeout(() => {
        window.grantGameReward(gameId);
      }, 500);
    }
  }
  
  // 檢查遊戲是否解鎖
  isGameUnlocked(gameId) {
    return this.progress.unlockedGames.includes(gameId);
  }
  
  // 檢查遊戲是否完成
  isGameCompleted(gameId) {
    return this.progress.completedGames.includes(gameId);
  }
  
  // 獲取下一個遊戲
  getNextGame(currentGameId) {
    const currentIndex = this.gameSequence.indexOf(currentGameId);
    if (currentIndex >= 0 && currentIndex < this.gameSequence.length - 1) {
      return this.gameSequence[currentIndex + 1];
    }
    return null;
  }
  
  // 獲取進度統計
  getProgressStats() {
    return {
      completed: this.progress.completedGames.length,
      total: this.gameSequence.length,
      percentage: Math.round((this.progress.completedGames.length / this.gameSequence.length) * 100)
    };
  }
  
  // 重置進度
  resetProgress() {
    this.progress = {
      completedGames: [],
      unlockedGames: ['game1'],
      currentGame: 'game1',
      totalPoints: 0
    };
    this.saveProgress();
    
    // 重置動物收集進度
    localStorage.removeItem('collectedAnimals');
  }
}

// 全域實例
window.gameProgressManager = new GameProgressManager();