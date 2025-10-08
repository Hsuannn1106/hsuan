// 共用組件系統
class SharedComponents {
  // 創建頂部導航區域
  static createTopArea(showBackButton = true, backUrl = 'map.html') {
    return `
      <div class="hp-top-area">
        <div class="hp-top-left">
          <div class="hp-title">動物研究院</div>
          <div class="control-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A0522D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </div>
        </div>
        <div class="hp-top-right">
          <div class="player-info">研究點數: 0</div>
          ${showBackButton ? `<button class="back-button" onclick="window.location.href='${backUrl}'">返回地圖</button>` : ''}
        </div>
      </div>
    `;
  }

  // 創建左側菜單
  static createLeftMenu(activeItem = '') {
    const menuItems = [
      { icon: '📖', text: '主線劇情', id: 'story' },
      { icon: '🦊', text: '動物圖鑑', id: 'animals' },
      { icon: '🐾', text: '探索地圖', id: 'map' },
      { icon: '🧪', text: '研究實驗室', id: 'lab' },
      { icon: '🏆', text: '成就系統', id: 'achievements' },
      { icon: '🎒', text: '物品背包', id: 'inventory' }
    ];

    return `
      <div class="left-menu">
        ${menuItems.map(item => `
          <div class="menu-item ${activeItem === item.id ? 'active' : ''}">
            <span class="menu-icon">${item.icon}</span>
            <span>${item.text}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 創建遊戲完成彈窗
  static createCompleteModal(title = '關卡完成！', message = '你獲得了50研究點數！', buttonText = '返回地圖', buttonAction = "window.location.href='map.html'") {
    return `
      <div class="modal" id="completeModal">
        <div class="modal-content">
          <div class="modal-icon">🏆</div>
          <div class="modal-title">${title}</div>
          <div class="modal-message" id="completeMessage">${message}</div>
          <button class="modal-button" onclick="${buttonAction}">${buttonText}</button>
        </div>
      </div>
    `;
  }

  // 創建正確答案彈窗
  static createCorrectModal(title = '答案正確！', message = '你成功認出了這個動物，繼續加油！') {
    return `
      <div class="modal" id="correctModal">
        <div class="modal-content">
          <div class="modal-icon">🎉</div>
          <div class="modal-title">${title}</div>
          <div class="modal-message">${message}</div>
          <button class="modal-button">繼續</button>
        </div>
      </div>
    `;
  }

  // 創建錯誤答案彈窗
  static createIncorrectModal(title = '再想想看！', message = '別擔心，再試一次吧！') {
    return `
      <div class="modal" id="incorrectModal">
        <div class="modal-content">
          <div class="modal-icon">🤔</div>
          <div class="modal-title">${title}</div>
          <div class="modal-message">${message}</div>
          <button class="modal-button">確定</button>
        </div>
      </div>
    `;
  }

  // 獲取共用腳本標籤
  static getCommonScripts() {
    return [
      '../js/achievement_system.js',
      '../js/item-reward-system.js', 
      '../js/game_progress.js',
      '../js/animal_collect.js'
    ].map(src => `<script src="${src}"></script>`).join('\n  ');
  }

  // 獲取共用樣式標籤
  static getCommonStyles() {
    return [
      '../css/styles.css',
      '../css/home.css',
      '../css/modal.css',
      '../css/achievement_notification.css',
      '../css/reward_display.css',
      '../css/game_animal_reward.css'
    ].map(href => `<link rel="stylesheet" href="${href}">`).join('\n  ');
  }
}

// 初始化共用組件
function initSharedComponents() {
  // 更新研究點數顯示
  const playerInfo = document.querySelector('.player-info');
  if (playerInfo && typeof updatePlayerInfo === 'function') {
    updatePlayerInfo();
  }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', initSharedComponents);