// 自動背景音樂啟動腳本
(function() {
  // 確保BGM管理器存在後立即嘗試播放
  function initAutoPlay() {
    if (window.bgmManager) {
      // 立即嘗試自動播放
      window.bgmManager.attemptAutoPlay();
    } else {
      // 如果BGM管理器還未載入，等待一下再試
      setTimeout(initAutoPlay, 100);
    }
  }

  // 頁面載入完成後啟動
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoPlay);
  } else {
    initAutoPlay();
  }
})();