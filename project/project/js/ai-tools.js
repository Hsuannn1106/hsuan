// AI工具選擇器系統
class AIToolsSystem {
  constructor() {
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    const aiHelperBtn = document.getElementById('aiHelperBtn');
    const aiToolsOverlay = document.getElementById('aiToolsOverlay');
    const aiToolsClose = document.getElementById('aiToolsClose');
    
    if (aiHelperBtn) {
      aiHelperBtn.addEventListener('click', () => this.openTools());
    }
    
    if (aiToolsClose) {
      aiToolsClose.addEventListener('click', () => this.closeTools());
    }
    
    if (aiToolsOverlay) {
      aiToolsOverlay.addEventListener('click', (e) => {
        if (e.target === aiToolsOverlay) {
          this.closeTools();
        }
      });
    }
  }
  
  openTools() {
    const overlay = document.getElementById('aiToolsOverlay');
    if (overlay) {
      overlay.classList.add('active');
    }
  }
  
  closeTools() {
    const overlay = document.getElementById('aiToolsOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }
}

// 初始化AI工具系統
document.addEventListener('DOMContentLoaded', () => {
  new AIToolsSystem();
});