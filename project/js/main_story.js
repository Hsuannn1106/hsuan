// 章節點擊展開/收起
document.querySelectorAll('.chapter-title').forEach((title, index) => {
  title.addEventListener('click', function() {
    const content = this.nextElementSibling;
    const status = this.querySelector('.chapter-status');
    
    // 檢查是否為鎖定狀態
    if (status.classList.contains('locked')) {
      showLockedMessage(this.closest('.story-chapter'));
      return;
    }
    
    // 如果是當前章節且可以進入遊戲，提供進入遊戲的選項
    if (status.classList.contains('current') && index < 3) {
      const gameId = ['game1', 'game2', 'game3'][index];
      if (gameProgressManager && gameProgressManager.isGameUnlocked(gameId) && !gameProgressManager.isGameCompleted(gameId)) {
        showGameEntryOption(gameId, index + 1);
        return;
      }
    }
    
    // 收起其他展開的章節
    document.querySelectorAll('.chapter-content.active').forEach(activeContent => {
      if (activeContent !== content) {
        activeContent.classList.remove('active');
      }
    });
    
    content.classList.toggle('active');
  });
});

// 顯示遊戲進入選項
function showGameEntryOption(gameId, chapterNumber) {
  const gameNames = {
    game1: '動物連連看',
    game2: '找不同遊戲', 
    game3: '迷宮探險'
  };
  
  const gameFiles = {
    game1: 'game1.html',
    game2: 'game2.html',
    game3: 'game3.html'
  };
  
  const message = document.createElement('div');
  message.className = 'game-entry-modal';
  message.innerHTML = `
    <div class="modal-content">
      <div class="modal-icon">🎮</div>
      <div class="modal-title">第${chapterNumber}章訓練</div>
      <div class="modal-message">準備開始${gameNames[gameId]}訓練嗎？</div>
      <div class="modal-buttons">
        <button class="modal-button primary" onclick="window.location.href='${gameFiles[gameId]}';">開始訓練</button>
        <button class="modal-button secondary" onclick="this.closest('.game-entry-modal').remove();">稍後再說</button>
      </div>
    </div>
  `;
  
  message.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;
  
  document.body.appendChild(message);
}

// 顯示鎖定訊息
function showLockedMessage(chapterElement) {
  const message = document.createElement('div');
  message.className = 'locked-message';
  
  // 檢查是否為第四章
  const chapterTitle = chapterElement.querySelector('.chapter-title span').textContent;
  const isChapter4 = chapterTitle.includes('第四章');
  
  let messageText = '🔒 此章節尚未解鎖，請先完成前置任務！';
  
  if (isChapter4) {
    const allGamesCompleted = ['game1', 'game2', 'game3'].every(game => 
      gameProgressManager.isGameCompleted(game)
    );
    const collectedAnimals = window.animals ? window.animals.filter(a => a.collected).length : 0;
    
    if (!allGamesCompleted) {
      messageText = '🔒 需要完成前三章所有訓練！';
    } else if (collectedAnimals < 15) {
      messageText = `🔒 需要收集至少15種動物圖鑑！目前：${collectedAnimals}/15`;
    }
  }
  
  message.innerHTML = messageText;
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #dc3545;
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    max-width: 300px;
    text-align: center;
  `;
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.remove();
  }, 3000);
}

// 初始化故事進度
function initializeStoryProgress() {
  // 基於遊戲進度管理器的狀態來設定章節狀態
  if (typeof gameProgressManager === 'undefined') {
    console.error('遊戲進度管理器未載入');
    return;
  }
  
  const progress = generateProgressFromGameState();
  updateChapterStatus(progress);
}

// 根據遊戲狀態生成章節進度
function generateProgressFromGameState() {
  const progress = {};
  
  // 第一章：動物認知訓練 (game1)
  if (gameProgressManager.isGameCompleted('game1')) {
    progress.chapter1 = 'completed';
  } else if (gameProgressManager.isGameUnlocked('game1')) {
    progress.chapter1 = 'current';
  } else {
    progress.chapter1 = 'locked';
  }
  
  // 第二章：海洋觀察力測試 (game2)
  if (gameProgressManager.isGameCompleted('game2')) {
    progress.chapter2 = 'completed';
  } else if (gameProgressManager.isGameUnlocked('game2')) {
    progress.chapter2 = 'current';
  } else {
    progress.chapter2 = 'locked';
  }
  
  // 第三章：草原迷宮探險 (game3)
  if (gameProgressManager.isGameCompleted('game3')) {
    progress.chapter3 = 'completed';
  } else if (gameProgressManager.isGameUnlocked('game3')) {
    progress.chapter3 = 'current';
  } else {
    progress.chapter3 = 'locked';
  }
  
  // 第四章：高級研究項目
  const allGamesCompleted = ['game1', 'game2', 'game3'].every(game => 
    gameProgressManager.isGameCompleted(game)
  );
  const collectedAnimals = window.animals ? window.animals.filter(a => a.collected).length : 0;
  
  if (allGamesCompleted && collectedAnimals >= 15) {
    progress.chapter4 = 'current';
  } else {
    progress.chapter4 = 'locked';
  }
  
  // 終章：動物保護專家
  progress.final = 'locked'; // 暫時鎖定
  
  return progress;
}

// 更新章節狀態
function updateChapterStatus(progress) {
  const chapters = document.querySelectorAll('.story-chapter');
  const statusMap = {
    'completed': { text: '已完成', class: 'completed' },
    'current': { text: '進行中', class: 'current' },
    'locked': { text: '未解鎖', class: 'locked' }
  };
  
  chapters.forEach((chapter, index) => {
    const statusElement = chapter.querySelector('.chapter-status');
    const playButton = chapter.querySelector('.play-button');
    const chapterKey = `chapter${index + 1}`;
    const finalKey = 'final';
    const key = index === chapters.length - 1 ? finalKey : chapterKey;
    
    if (progress[key]) {
      const status = statusMap[progress[key]];
      statusElement.textContent = status.text;
      statusElement.className = `chapter-status ${status.class}`;
      
      // 更新開始玩按鈕狀態
      if (playButton) {
        updatePlayButtonState(playButton, progress[key], index);
      }
    }
  });
}

// 更新開始玩按鈕狀態
function updatePlayButtonState(button, status, chapterIndex) {
  const gameId = button.dataset.game;
  
  if (status === 'locked') {
    button.disabled = true;
    if (gameId === 'chapter4') {
      button.textContent = '🔒 未解鎖';
    } else {
      button.textContent = '🔒 未解鎖';
    }
  } else if (status === 'completed') {
    button.disabled = false;
    button.textContent = '🔄 重新挑戰';
  } else if (status === 'current') {
    button.disabled = false;
    const gameNames = {
      game1: '🎮 開始動物連連看',
      game2: '🔍 開始找不同遊戲',
      game3: '🧭 開始迷宮探險',
      chapter4: '🔬 開始高級研究'
    };
    button.textContent = gameNames[gameId] || '🎮 開始遊戲';
  }
}

// 模擬章節完成（僅用於測試）
function completeChapter(chapterNumber) {
  const gameIds = ['game1', 'game2', 'game3'];
  const gameId = gameIds[chapterNumber - 1];
  
  if (gameId && gameProgressManager) {
    // 使用遊戲進度管理器完成遊戲
    gameProgressManager.completeGame(gameId);
    
    // 重新初始化進度顯示
    setTimeout(() => {
      initializeStoryProgress();
      showCompletionMessage(chapterNumber);
    }, 100);
  }
}

// 顯示完成訊息
function showCompletionMessage(identifier, customName) {
  const isGameId = typeof identifier === 'string' && identifier.startsWith('game');
  const message = document.createElement('div');
  message.className = 'completion-message';
  
  if (isGameId) {
    message.innerHTML = `🎉 恭喜完成${customName}！故事進度已更新`;
  } else {
    message.innerHTML = `🎉 恭喜完成第${identifier}章！獲得研究點數 +100`;
  }
  
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #28a745;
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    animation: slideIn 0.5s ease;
  `;
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.style.animation = 'slideOut 0.5s ease';
    setTimeout(() => message.remove(), 500);
  }, 3000);
}

// 檢查是否從遊戲完成頁面跳轉而來
function checkGameCompletionRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const fromGame = urlParams.get('completed');
  
  if (fromGame) {
    // 顯示完成慶祝訊息
    const gameNames = {
      game1: '動物認知訓練',
      game2: '海洋觀察力測試',
      game3: '草原迷宮探險'
    };
    
    setTimeout(() => {
      showCompletionMessage(fromGame, gameNames[fromGame] || '訓練');
    }, 500);
    
    // 清除URL參數
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// 添加CSS動畫
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
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
  .modal-button.primary {
    background-color: #4299e1;
    color: white;
  }
  .modal-button.primary:hover {
    background-color: #3182ce;
  }
  .modal-button.secondary {
    background-color: #e2e8f0;
    color: #4a5568;
  }
  .modal-button.secondary:hover {
    background-color: #cbd5e0;
  }
  .settings-modal .modal-content {
    background: white;
    border-radius: 15px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px 15px;
    border-bottom: 1px solid #e2e8f0;
  }
  .modal-header h3 {
    margin: 0;
    color: #2d3748;
  }
  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #a0aec0;
  }
  .modal-body {
    padding: 20px 25px;
  }
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }
  .setting-info {
    flex: 1;
  }
  .setting-title {
    font-weight: bold;
    color: #2d3748;
    margin-bottom: 5px;
  }
  .setting-desc {
    color: #718096;
    font-size: 14px;
    line-height: 1.4;
  }
  .reset-button {
    background: #e53e3e;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s ease;
  }
  .reset-button:hover {
    background: #c53030;
  }
  .modal-button.danger {
    background: #e53e3e;
    color: white;
  }
  .modal-button.danger:hover {
    background: #c53030;
  }
`;
document.head.appendChild(style);

// 監聽遊戲完成事件
window.addEventListener('gameCompleted', function(event) {
  // 當遊戲完成時，重新初始化進度並導向主線劇情
  setTimeout(() => {
    initializeStoryProgress();
  }, 500);
});

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

// 綁定開始玩按鈕事件
function bindPlayButtonEvents() {
  document.querySelectorAll('.play-button').forEach(button => {
    button.addEventListener('click', function() {
      if (this.disabled) return;
      
      const gameId = this.dataset.game;
      const gameFiles = {
        game1: 'game1.html',
        game2: 'game2.html',
        game3: 'game3.html'
      };
      
      if (gameId === 'chapter4') {
        showChapter4Message();
      } else if (gameFiles[gameId]) {
        window.location.href = gameFiles[gameId];
      }
    });
  });
}

// 顯示第四章訊息
function showChapter4Message() {
  const message = document.createElement('div');
  message.className = 'chapter4-message';
  message.innerHTML = `
    <div class="modal-content">
      <div class="modal-icon">🎉</div>
      <div class="modal-title">恭喜解鎖高級研究！</div>
      <div class="modal-message">
        你已經完成了所有基礎訓練並收集了足夠的動物圖鑑！<br>
        高級研究項目即將開放，敬請期待！
      </div>
      <button class="modal-button primary" onclick="this.closest('.chapter4-message').remove();">了解</button>
    </div>
  `;
  
  message.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;
  
  document.body.appendChild(message);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  // 確保遊戲進度管理器已載入
  if (typeof gameProgressManager !== 'undefined') {
    initializeStoryProgress();
    updatePointsDisplay();
    bindPlayButtonEvents();
    
    // 預設展開當前進行中的章節
    setTimeout(() => {
      const currentChapter = document.querySelector('.chapter-status.current');
      if (currentChapter) {
        const content = currentChapter.closest('.story-chapter').querySelector('.chapter-content');
        content.classList.add('active');
      }
    }, 100);
  } else {
    console.error('遊戲進度管理器未載入，請檢查依賴');
  }
  
  // 檢查遊戲完成跳轉
  checkGameCompletionRedirect();
});

// 顯示設定彈窗
function showSettingsModal() {
  const modal = document.createElement('div');
  modal.className = 'settings-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>遊戲設定</h3>
        <button class="modal-close" onclick="this.closest('.settings-modal').remove()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-title">重置遊戲進度</div>
            <div class="setting-desc">清空所有遊戲進度、收集的動物和物品背包</div>
          </div>
          <button class="reset-button" onclick="confirmReset()">重置遊戲</button>
        </div>
      </div>
    </div>
  `;
  
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  document.body.appendChild(modal);
}

// 確認重置
function confirmReset() {
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
  
  document.querySelectorAll('.settings-modal, .confirm-modal').forEach(modal => modal.remove());
  
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
    window.location.reload();
  }, 2000);
}

// 開發者工具：快速完成章節（僅用於測試）
window.devCompleteChapter = completeChapter;