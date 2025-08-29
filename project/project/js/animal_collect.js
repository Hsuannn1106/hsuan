// 動物圖鑑收集系統
// 此文件處理動物圖鑑的收集邏輯和獎勵系統

// 將grantGameReward函數暴露到全域，供其他遊戲頁面調用
window.grantGameReward = function(gameId) {
    if (typeof grantGameReward !== 'undefined') {
        grantGameReward(gameId);
    }
};

// 監聽遊戲完成事件
window.addEventListener('gameCompleted', function(event) {
    const gameId = event.detail.gameId;
    if (typeof grantGameReward !== 'undefined') {
        grantGameReward(gameId);
    }
});