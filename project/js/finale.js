class FinaleSystem {
  constructor() {
    this.init();
  }
  
  init() {
    this.updatePointsDisplay();
    this.updateStats();
    this.setCertificateDate();
    this.checkAccess();
  }
  
  updatePointsDisplay() {
    const pointsElement = document.querySelector('.player-info');
    if (pointsElement && window.pointsManager) {
      const currentPoints = window.pointsManager.getPoints();
      pointsElement.textContent = `研究點數: ${currentPoints}`;
    }
  }
  
  updateStats() {
    const totalPointsElement = document.getElementById('totalPoints');
    const gamesCompletedElement = document.getElementById('gamesCompleted');
    
    if (totalPointsElement && window.pointsManager) {
      const points = window.pointsManager.getPoints();
      this.animateNumber(totalPointsElement, 0, points, 2000);
    }
    
    if (gamesCompletedElement && window.gameProgressManager) {
      const completed = window.gameProgressManager.progress.completedGames.length;
      this.animateNumber(gamesCompletedElement, 0, completed, 1500);
    }
  }
  
  animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(start + (end - start) * progress);
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  setCertificateDate() {
    const dateElement = document.getElementById('certificateDate');
    if (dateElement) {
      const now = new Date();
      const dateString = now.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      dateElement.textContent = `頒發日期：${dateString}`;
    }
  }
  
  checkAccess() {
    // 檢查是否真的完成了所有遊戲
    if (window.gameProgressManager && !window.gameProgressManager.isAllGamesComplete()) {
      // 如果沒有完成所有遊戲，重定向到地圖
      setTimeout(() => {
        alert('請先完成所有遊戲才能進入終章！');
        window.location.href = 'map.html';
      }, 1000);
    }
  }
}

// 重製遊戲功能
function resetGame() {
  showResetConfirmModal();
}

// 顯示重置確認對話框
function showResetConfirmModal() {
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
        <button class="modal-button danger" onclick="executeReset()">確定重置</button>
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
function executeReset() {
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
      <div class="modal-message">遊戲已重置，即將返回開始頁面</div>
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
  setTimeout(() => {
    new FinaleSystem();
  }, 100);
});