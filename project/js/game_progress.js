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
      totalPoints: 0
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
  
  resetProgress() {
    this.progress = {
      completedGames: [],
      unlockedGames: ['game1'],
      currentGame: 'game1',
      totalPoints: 0
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
}

window.gameProgressManager = new GameProgressManager();