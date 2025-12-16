class MapSystem {
  constructor() {
    // 等待依賴系統載入
    this.waitForDependencies().then(() => {
      this.initializeSystem();
    });
  }
  
  async waitForDependencies() {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      if (window.pointsManager && window.gameProgressManager) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    console.log('依賴系統載入超時，使用預設值');
    return false;
  }
  
  initializeSystem() {
    this.gameData = {
      game1: {
        id: 'game1',
        name: '動物連連看',
        icon: '🔗',
        description: '在這裡你可以探索各種動物，並通過連連看遊戲來學習牠們的名稱',
        gameType: '連連看',
        htmlFile: 'game1.html'
      },
      game2: {
        id: 'game2',
        name: '找不同遊戲',
        icon: '🔍',
        description: '探索動物的奧秘，通過找不同遊戲來訓練你的觀察力',
        gameType: '找不同',
        htmlFile: 'game2.html'
      },
      game3: {
        id: 'game3',
        name: '迷宮探險',
        icon: '🕵️',
        description: '穿越迷宮，找到出口',
        gameType: '迷宮',
        htmlFile: 'game3.html'
      },
      game4: {
        id: 'game4',
        name: '動物生態分類',
        icon: '🗂️',
        description: '進入研究實驗室，學習動物的生態分類，成為真正的動物學家',
        gameType: '生態分類',
        htmlFile: 'game4.html'
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
    if (pointsElement) {
      try {
        const currentPoints = window.pointsManager ? window.pointsManager.getPoints() : 0;
        pointsElement.textContent = `研究點數: ${currentPoints}`;
      } catch (error) {
        console.log('點數顯示錯誤:', error);
        pointsElement.textContent = '研究點數: 0';
      }
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
    let isUnlocked = false;
    let isCompleted = false;
    
    try {
      isUnlocked = window.gameProgressManager ? window.gameProgressManager.isGameUnlocked(game.id) : (game.id === 'game1');
      isCompleted = window.gameProgressManager ? window.gameProgressManager.isGameCompleted(game.id) : false;
    } catch (error) {
      console.log('遊戲狀態檢查錯誤:', error);
      isUnlocked = game.id === 'game1';
      isCompleted = false;
    }
    
    const zone = document.createElement('div');
    zone.className = `zone ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;
    
    let html = `
      <div class="zone-image">${game.icon}</div>
      ${isCompleted ? '<div class="completion-badge">✅</div>' : ''}
      <h3>${game.name}</h3>
      <p>${game.description}</p>
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
  
  
  bindEvents() {
    const resetBtn = document.getElementById('reset-achievements');
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.showResetConfirmModal();
      });
    }
  }
  
  // 顯示重置確認對話框
  showResetConfirmModal() {
    const confirmModal = document.createElement('div');
    confirmModal.className = 'confirm-modal';
    confirmModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-icon">⚠️</div>
        <div class="modal-title">確認重置遊戲</div>
        <div class="modal-message">
          此操作將清空：<br>
          • 所有遊戲進度<br>
          • 收集的動物圖鑑<br>
          • 獲得的成就<br>
          • 物品背包內容<br>
          • 研究點數和金幣<br><br>
          <strong>此操作無法復原，確定要繼續嗎？</strong>
        </div>
        <div class="modal-buttons">
          <button class="modal-button danger" onclick="mapSystem.executeReset()">確定重置</button>
          <button class="modal-button secondary" onclick="this.closest('.confirm-modal').remove()">取消</button>
        </div>
      </div>
    `;
    
    confirmModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10001;
    `;
    
    document.body.appendChild(confirmModal);
  }
  
  // 執行重置
  executeReset() {
    if (window.gameProgressManager) {
      window.gameProgressManager.resetProgress();
    }
    
    if (window.pointsManager) {
      window.pointsManager.reset();
    }
    
    if (window.achievementSystem) {
      window.achievementSystem.resetAllAchievements();
    }
    
    document.querySelectorAll('.confirm-modal').forEach(modal => modal.remove());
    
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-icon">✅</div>
        <div class="modal-title">重置完成</div>
        <div class="modal-message">遊戲已重置，頁面將重新載入</div>
      </div>
    `;
    
    successModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10002;
    `;
    
    document.body.appendChild(successModal);
    
    setTimeout(() => {
      window.location.href = 'start.html';
    }, 2000);
  }
}

// 全局變數以便在onclick中使用
let mapSystem;

// 添加CSS樣式
const style = document.createElement('style');
style.textContent = `
  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
  .modal-icon {
    font-size: 3rem;
    margin-bottom: 15px;
  }
  .modal-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2d3748;
    margin-bottom: 10px;
  }
  .modal-message {
    color: #4a5568;
    margin-bottom: 25px;
    line-height: 1.5;
  }
  .modal-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  .modal-button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .modal-button.danger {
    background: #e53e3e;
    color: white;
  }
  .modal-button.danger:hover {
    background: #c53030;
  }
  .modal-button.secondary {
    background-color: #e2e8f0;
    color: #4a5568;
  }
  .modal-button.secondary:hover {
    background-color: #cbd5e0;
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  // 等待所有系統載入完成
  const initMap = () => {
    try {
      mapSystem = new MapSystem();
    } catch (error) {
      console.log('地圖系統初始化錯誤:', error);
      // 重試一次
      setTimeout(() => {
        try {
          mapSystem = new MapSystem();
        } catch (retryError) {
          console.log('地圖系統重試失敗:', retryError);
        }
      }, 500);
    }
  };
  
  setTimeout(initMap, 100);
});