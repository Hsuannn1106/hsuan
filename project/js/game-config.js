// 遊戲配置和數據管理
class GameConfig {
  static GAMES = {
    game1: {
      title: "森林探索完成！",
      icon: "🌳",
      description: "你成功學會了動物們的名稱！小動物們對你的知識印象深刻，現在你可以前往神秘的海洋區域繼續探險。",
      nextGame: "game2",
      nextArea: "海洋區域",
      rewards: [
        { icon: "💰", name: "研究點數", value: 75 },
        { icon: "📜", name: "森林探索證書", value: 1 },
        { icon: "🦊", name: "解鎖動物", value: 3 }
      ]
    },
    game2: {
      title: "海洋探索完成！",
      icon: "🌊",
      description: "你的觀察力令人驚嘆！海洋生物們認可了你的能力，那裡有更大的挑戰等著你。",
      nextGame: "game3",
      nextArea: "山地區域",
      rewards: [
        { icon: "💰", name: "研究點數", value: 100 },
        { icon: "🏅", name: "海洋生物學家徽章", value: 1 },
        { icon: "🐋", name: "解鎖動物", value: 3 }
      ]
    },
    game3: {
      title: "山地探索完成！",
      icon: "🏔️",
      description: "恭喜你完成了所有的探險挑戰！",
      nextGame: null,
      nextArea: "探險完成",
      rewards: [
        { icon: "💰", name: "研究點數", value: 125 },
        { icon: "👑", name: "登山專家證書", value: 1 },
        { icon: "🦅", name: "解鎖動物", value: 3 }
      ]
    }
  };

  static getGameData(gameId) {
    return this.GAMES[gameId] || null;
  }

  static getAllGames() {
    return Object.keys(this.GAMES);
  }

  static getTotalGames() {
    return Object.keys(this.GAMES).length;
  }
}

// 玩家進度管理
class PlayerProgress {
  static STORAGE_KEY = 'animalResearch_progress';

  static getProgress() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      completedGames: [],
      totalPoints: 0,
      achievements: [],
      unlockedAnimals: 0
    };
  }

  static saveProgress(progress) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  static completeGame(gameId, rewards) {
    const progress = this.getProgress();
    
    if (!progress.completedGames.includes(gameId)) {
      progress.completedGames.push(gameId);
      
      rewards.forEach(reward => {
        if (reward.name === '研究點數') {
          progress.totalPoints += reward.value;
        } else if (reward.name === '解鎖動物') {
          progress.unlockedAnimals += reward.value;
        }
      });
      
      this.saveProgress(progress);
    }
    
    return progress;
  }

  static getCurrentGameNumber(gameId) {
    const gameOrder = ['game1', 'game2', 'game3'];
    return gameOrder.indexOf(gameId) + 1;
  }
}