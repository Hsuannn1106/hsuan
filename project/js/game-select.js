// 遊戲選擇頁面功能
document.addEventListener('DOMContentLoaded', function() {
  initGameSelect();
});

function initGameSelect() {
  // 更新點數顯示
  updatePointsDisplay();
  
  // 綁定遊戲卡片點擊事件
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    const playBtn = card.querySelector('.play-btn');
    const gameType = card.dataset.game;
    
    playBtn.addEventListener('click', () => {
      startGame(gameType);
    });
    
    // 卡片點擊也可以開始遊戲
    card.addEventListener('click', (e) => {
      if (e.target !== playBtn) {
        startGame(gameType);
      }
    });
  });
}

function startGame(gameType) {
  // 添加點擊動畫效果
  const card = document.querySelector(`[data-game="${gameType}"]`);
  card.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    // 根據遊戲類型跳轉到對應頁面
    switch(gameType) {
      case 'game1':
        window.location.href = 'game1.html';
        break;
      case 'game2':
        window.location.href = 'game2.html';
        break;
      case 'game3':
        window.location.href = 'game3.html';
        break;
      default:
        console.error('未知的遊戲類型:', gameType);
    }
  }, 150);
}

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