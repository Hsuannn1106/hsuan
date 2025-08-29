// 故事過渡系統
class StoryTransitionSystem {
  constructor() {
    this.elements = {};
    this.currentGame = null;
    this.gameData = null;
    this.init();
  }
  
  init() {
    try {
      this.cacheElements();
      this.getCurrentGame();
      
      if (!this.isValidGame()) {
        this.redirectToMap();
        return;
      }
      
      this.loadStoryContent();
      this.bindEvents();
      this.updateProgress();
    } catch (error) {
      console.error('初始化錯誤:', error);
      this.redirectToMap();
    }
  }
  
  cacheElements() {
    this.elements = {
      title: document.getElementById('storyTitle'),
      description: document.getElementById('storyDescription'),
      icon: document.querySelector('.story-icon'),
      rewards: document.getElementById('storyRewards'),
      continueButton: document.getElementById('continueButton'),
      mapButton: document.getElementById('mapButton'),
      progressFill: document.getElementById('progressFill'),
      progressText: document.getElementById('progressText')
    };
  }
  
  getCurrentGame() {
    const urlParams = new URLSearchParams(window.location.search);
    this.currentGame = urlParams.get('from');
    this.gameData = GameConfig.getGameData(this.currentGame);
  }
  
  isValidGame() {
    return this.currentGame && this.gameData;
  }
  
  redirectToMap() {
    window.location.href = 'map.html';
  }
  
  loadStoryContent() {
    if (!this.gameData) return;
    
    // 保存進度
    PlayerProgress.completeGame(this.currentGame, this.gameData.rewards);
    
    // 更新內容
    this.elements.title.textContent = this.gameData.title;
    this.elements.description.textContent = this.gameData.description;
    this.elements.icon.textContent = this.gameData.icon;
    
    // 更新獎勵和按鈕
    this.renderRewards(this.gameData.rewards);
    this.updateContinueButton(this.gameData);
  }
  
  updateContinueButton(story) {
    const buttonText = story.nextGame ? `前往${story.nextArea}` : '查看成就';
    this.elements.continueButton.textContent = buttonText;
  }
  
  renderRewards(rewards) {
    if (!rewards || !this.elements.rewards) return;
    
    const rewardsHTML = this.generateRewardsHTML(rewards);
    this.elements.rewards.innerHTML = rewardsHTML;
  }
  
  generateRewardsHTML(rewards) {
    const header = '<h3 style="margin-bottom: 0.9375rem; color: #2d3748;">🎁 獲得獎勵</h3>';
    const items = rewards.map(reward => `
      <div class="reward-item">
        <div class="reward-info">
          <span class="reward-icon">${this.escapeHtml(reward.icon)}</span>
          <span class="reward-name">${this.escapeHtml(reward.name)}</span>
        </div>
        <span class="reward-value">+${this.escapeHtml(String(reward.value))}</span>
      </div>
    `).join('');
    
    return header + items;
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  updateProgress() {
    const currentNumber = PlayerProgress.getCurrentGameNumber(this.currentGame);
    const totalGames = GameConfig.getTotalGames();
    const progressPercent = (currentNumber / totalGames) * 100;
    
    if (this.elements.progressFill && this.elements.progressText) {
      this.elements.progressFill.style.width = `${progressPercent}%`;
      this.elements.progressText.textContent = `進度：${currentNumber}/${totalGames}`;
    }
  }
  
  bindEvents() {
    if (this.elements.continueButton) {
      this.elements.continueButton.addEventListener('click', () => this.handleContinue());
    }
    
    if (this.elements.mapButton) {
      this.elements.mapButton.addEventListener('click', () => this.goToMap());
    }
  }
  
  handleContinue() {
    if (!this.gameData) {
      this.goToMap();
      return;
    }
    
    const nextUrl = this.gameData.nextGame ? `${this.gameData.nextGame}.html` : 'achievement.html';
    window.location.href = nextUrl;
  }
  
  goToMap() {
    window.location.href = 'map.html';
  }
}

// 初始化故事過渡系統
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new StoryTransitionSystem());
} else {
  new StoryTransitionSystem();
}