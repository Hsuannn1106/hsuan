class PointsManager {
  constructor() {
    this.storageKey = 'research_points';
    this.coinsKey = 'game_coins';
    this.listeners = [];
    this.init();
  }

  init() {
    // 確保初始值存在
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, '0');
    }
    if (!localStorage.getItem(this.coinsKey)) {
      localStorage.setItem(this.coinsKey, '0');
    }
  }

  // 獲取研究點數
  getPoints() {
    return parseInt(localStorage.getItem(this.storageKey) || '0');
  }

  // 獲取金幣
  getCoins() {
    return parseInt(localStorage.getItem(this.coinsKey) || '0');
  }

  // 設置研究點數
  setPoints(points) {
    const newPoints = Math.max(0, parseInt(points));
    localStorage.setItem(this.storageKey, newPoints.toString());
    this.notifyListeners('points', newPoints);
    return newPoints;
  }

  // 設置金幣
  setCoins(coins) {
    const newCoins = Math.max(0, parseInt(coins));
    localStorage.setItem(this.coinsKey, newCoins.toString());
    this.notifyListeners('coins', newCoins);
    return newCoins;
  }

  // 增加研究點數
  addPoints(amount) {
    const current = this.getPoints();
    return this.setPoints(current + amount);
  }

  // 減少研究點數
  subtractPoints(amount) {
    const current = this.getPoints();
    return this.setPoints(current - amount);
  }

  // 增加金幣
  addCoins(amount) {
    const current = this.getCoins();
    return this.setCoins(current + amount);
  }

  // 減少金幣
  subtractCoins(amount) {
    const current = this.getCoins();
    return this.setCoins(current - amount);
  }

  // 檢查是否有足夠的點數
  hasEnoughPoints(amount) {
    return this.getPoints() >= amount;
  }

  // 檢查是否有足夠的金幣
  hasEnoughCoins(amount) {
    return this.getCoins() >= amount;
  }

  // 添加監聽器
  addListener(callback) {
    this.listeners.push(callback);
  }

  // 移除監聽器
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // 通知所有監聽器
  notifyListeners(type, value) {
    this.listeners.forEach(callback => {
      try {
        callback(type, value);
      } catch (error) {
        console.error('點數監聽器錯誤:', error);
      }
    });
  }

  // 更新頁面顯示
  updateDisplay() {
    const pointsElements = document.querySelectorAll('#research-points, .player-info');
    const coinsElements = document.querySelectorAll('#coins');

    pointsElements.forEach(element => {
      if (element.id === 'research-points') {
        element.textContent = this.getPoints();
      } else if (element.classList.contains('player-info')) {
        element.textContent = `研究點數: ${this.getPoints()}`;
      }
    });

    coinsElements.forEach(element => {
      element.textContent = this.getCoins();
    });
  }

  // 重置所有點數
  reset() {
    this.setPoints(0);
    this.setCoins(0);
  }
}

// 創建全域實例
window.pointsManager = new PointsManager();

// 頁面載入時自動更新顯示
document.addEventListener('DOMContentLoaded', () => {
  if (window.pointsManager) {
    window.pointsManager.updateDisplay();
  }
});

// 監聽storage變化，實現跨頁面同步
window.addEventListener('storage', (e) => {
  if (e.key === 'research_points' || e.key === 'game_coins') {
    if (window.pointsManager) {
      window.pointsManager.updateDisplay();
    }
  }
});