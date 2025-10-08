class ItemRewardSystem {
  constructor() {
    this.itemPool = [
      { id: 'apple', name: '蘋果', icon: '🍎', type: '食物', rarity: '普通', description: '一個新鮮的蘋果，可以餵食動物。' },
      { id: 'banana', name: '香蕉', icon: '🍌', type: '食物', rarity: '普通', description: '一根香蕉，猴子的最愛。' },
      { id: 'carrot', name: '胡蘿蔔', icon: '🥕', type: '食物', rarity: '普通', description: '新鮮的胡蘿蔔，兔子的最愛。' },
      { id: 'fish', name: '魚', icon: '🐟', type: '食物', rarity: '稀有', description: '新鮮的魚，海洋動物的美食。' },
      { id: 'honey', name: '蜂蜜', icon: '🍯', type: '食物', rarity: '稀有', description: '甜美的蜂蜜，熊類動物的最愛。' },
      { id: 'tree', name: '樹木', icon: '🌳', type: '裝飾', rarity: '稀有', description: '一棵茂盛的樹木，可以放置在動物棲息地。' },
      { id: 'rock', name: '岩石', icon: '🪨', type: '裝飾', rarity: '普通', description: '一塊天然岩石，可以放置在動物棲息地。' },
      { id: 'flower', name: '花朵', icon: '🌸', type: '裝飾', rarity: '普通', description: '美麗的花朵，增加環境美觀度。' },
      { id: 'house', name: '小屋', icon: '🏠', type: '裝飾', rarity: '史詩', description: '一個精美的小屋，動物可以在裡面休息。' },
      { id: 'fountain', name: '噴泉', icon: '⛲', type: '裝飾', rarity: '史詩', description: '優雅的噴泉，提供清潔的水源。' },
      { id: 'magnifier', name: '放大鏡', icon: '🔍', type: '研究', rarity: '稀有', description: '一個高品質的放大鏡，可以用來研究動物的細節。' },
      { id: 'notebook', name: '筆記本', icon: '📓', type: '研究', rarity: '普通', description: '一本用來記錄研究筆記的本子。' },
      { id: 'camera', name: '相機', icon: '📷', type: '研究', rarity: '史詩', description: '一台高解析度相機，可以拍攝動物的照片。' },
      { id: 'telescope', name: '望遠鏡', icon: '🔭', type: '研究', rarity: '稀有', description: '觀察遠處動物的好工具。' },
      { id: 'compass', name: '指南針', icon: '🧭', type: '研究', rarity: '普通', description: '探索時不迷路的必備工具。' }
    ];
    
    this.loadInventory();
  }
  
  loadInventory() {
    const saved = localStorage.getItem('playerInventory');
    if (saved) {
      try {
        this.inventory = JSON.parse(saved);
      } catch (error) {
        this.inventory = {};
      }
    } else {
      this.inventory = {};
    }
  }
  
  saveInventory() {
    try {
      localStorage.setItem('playerInventory', JSON.stringify(this.inventory));
    } catch (error) {
      console.error('保存背包數據失敗:', error);
    }
  }
  
  grantGameCompletionReward(gameId) {
    const rewardCount = Math.floor(Math.random() * 3) + 3;
    const rewards = this.selectRandomItems(rewardCount);
    
    rewards.forEach(item => {
      this.addItemToInventory(item.id, 1);
    });
    
    this.showItemRewardPopup(gameId, rewards);
    
    return rewards;
  }
  
  selectRandomItems(count) {
    const selected = [];
    const availableItems = [...this.itemPool];
    
    for (let i = 0; i < count && availableItems.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      const item = availableItems[randomIndex];
      selected.push(item);
      
      if (Math.random() < 0.7) {
        availableItems.splice(randomIndex, 1);
      }
    }
    
    return selected;
  }
  
  addItemToInventory(itemId, quantity = 1) {
    if (this.inventory[itemId]) {
      this.inventory[itemId] += quantity;
    } else {
      this.inventory[itemId] = quantity;
    }
    this.saveInventory();
  }
  
  showItemRewardPopup(gameId, rewards) {
    const gameNames = { 
      game1: '森林區域', 
      game2: '海洋區域', 
      game3: '山地區域' 
    };
    
    this.addRewardPopupStyles();
    
    const popup = document.createElement('div');
    popup.className = 'item-reward-popup';
    popup.innerHTML = `
      <div class="item-reward-content">
        <div class="reward-header">
          <div class="reward-icon">🎁</div>
          <h2>獲得物品獎勵！</h2>
          <p>完成 ${gameNames[gameId] || '關卡'} 獲得以下物品：</p>
        </div>
        
        <div class="reward-items">
          ${rewards.map(item => `
            <div class="reward-item-card rarity-${item.rarity}">
              <div class="item-icon-large">${item.icon}</div>
              <div class="item-name">${item.name}</div>
              <div class="item-type">${item.type}</div>
              <div class="item-rarity-badge ${item.rarity}">${this.getRarityText(item.rarity)}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="reward-summary">
          <p>共獲得 ${rewards.length} 個物品，已添加到背包中！</p>
        </div>
        
        <button class="reward-close-btn" onclick="this.parentElement.parentElement.remove(); finishRewardFlow();">
          收下獎勵
        </button>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
      popup.classList.add('show');
    }, 200);
  }
  
  addRewardPopupStyles() {
    if (document.getElementById('item-reward-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'item-reward-styles';
    style.textContent = `
      .item-reward-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .item-reward-popup.show {
        opacity: 1;
      }
      
      .item-reward-content {
        background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
        border-radius: 20px;
        padding: 30px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        text-align: center;
        animation: slideIn 0.5s ease;
      }
      
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .reward-header {
        margin-bottom: 25px;
      }
      
      .reward-icon {
        font-size: 60px;
        margin-bottom: 15px;
      }
      
      .reward-header h2 {
        color: #2c3e50;
        margin: 10px 0;
        font-size: 28px;
      }
      
      .reward-header p {
        color: #7f8c8d;
        font-size: 16px;
      }
      
      .reward-items {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
        margin: 25px 0;
      }
      
      .reward-item-card {
        background: white;
        border-radius: 15px;
        padding: 20px 10px;
        border: 3px solid;
        transition: transform 0.3s ease;
      }
      
      .reward-item-card:hover {
        transform: translateY(-5px);
      }
      
      .reward-item-card.rarity-普通 { border-color: #95a5a6; }
      .reward-item-card.rarity-稀有 { border-color: #3498db; }
      .reward-item-card.rarity-史詩 { border-color: #9b59b6; }
      
      .item-icon-large {
        font-size: 40px;
        margin-bottom: 10px;
      }
      
      .item-name {
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 5px;
      }
      
      .item-type {
        color: #7f8c8d;
        font-size: 12px;
        margin-bottom: 8px;
      }
      
      .item-rarity-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: bold;
        color: white;
      }
      
      .item-rarity-badge.普通 { background: #95a5a6; }
      .item-rarity-badge.稀有 { background: #3498db; }
      .item-rarity-badge.史詩 { background: #9b59b6; }
      
      .reward-summary {
        margin: 25px 0;
        padding: 15px;
        background: #ecf0f1;
        border-radius: 10px;
      }
      
      .reward-close-btn {
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .reward-close-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
      }
    `;
    
    document.head.appendChild(style);
  }
  
  getRarityText(rarity) {
    return rarity;
  }
  
  getItemQuantity(itemId) {
    return this.inventory[itemId] || 0;
  }
  
  getAllItems() {
    return this.inventory;
  }
  
  getAllItemsWithStatus() {
    const result = [];
    this.itemPool.forEach(item => {
      result.push({
        ...item,
        quantity: this.inventory[item.id] || 0,
        owned: (this.inventory[item.id] || 0) > 0
      });
    });
    return result;
  }
}

window.itemRewardSystem = new ItemRewardSystem();