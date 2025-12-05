// 背景音樂管理系統
class BGMManager {
  constructor() {
    this.bgm = null;
    this.isPlaying = false;
    this.volume = 0.3;
    this.autoPlayAttempted = false;
    this.init();
  }

  init() {
    // 創建音頻元素
    this.bgm = document.createElement('audio');
    this.bgm.src = '../audio/bgm.mp3';
    this.bgm.loop = true;
    this.bgm.volume = this.volume;
    
    // 從localStorage讀取音樂狀態
    const savedState = localStorage.getItem('bgm-enabled');
    this.isPlaying = savedState !== 'false';
    
    // 頁面載入時自動播放
    document.addEventListener('DOMContentLoaded', () => {
      this.attemptAutoPlay();
    });
    
    // 監聽用戶交互事件以啟動音樂
    this.setupUserInteractionListeners();
  }

  setupUserInteractionListeners() {
    const events = ['click', 'touchstart', 'keydown'];
    const handler = () => {
      if (!this.autoPlayAttempted && this.isPlaying) {
        this.play().catch(() => {});
        this.autoPlayAttempted = true;
        events.forEach(event => {
          document.removeEventListener(event, handler);
        });
      }
    };
    
    events.forEach(event => {
      document.addEventListener(event, handler);
    });
  }

  attemptAutoPlay() {
    if (this.isPlaying) {
      this.play().catch(() => {});
    }
  }

  play() {
    if (this.bgm) {
      return this.bgm.play().then(() => {
        this.isPlaying = true;
        this.autoPlayAttempted = true;
        this.saveState();
        this.updateUI();
      }).catch(() => {
        this.updateUI();
      });
    }
    return Promise.resolve();
  }

  pause() {
    if (this.bgm) {
      this.bgm.pause();
      this.isPlaying = false;
      this.saveState();
      this.updateUI();
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(vol) {
    this.volume = vol;
    if (this.bgm) {
      this.bgm.volume = vol;
    }
  }

  saveState() {
    localStorage.setItem('bgm-enabled', this.isPlaying);
  }

  updateUI() {
    // 更新所有音樂控制按鈕
    const musicButtons = document.querySelectorAll('.music-toggle, #musicToggle');
    musicButtons.forEach(btn => {
      if (btn) {
        btn.textContent = this.isPlaying ? '🔊' : '🔇';
        btn.title = this.isPlaying ? '關閉音樂' : '開啟音樂';
      }
    });
  }
}

// 創建全局BGM管理器實例
window.bgmManager = new BGMManager();

// 全局切換函數
function toggleMusic() {
  window.bgmManager.toggle();
}