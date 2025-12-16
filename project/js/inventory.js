// 動態載入背包物品
function loadInventoryItems() {
  if (typeof window.itemRewardSystem === 'undefined') return;
  
  const allItems = window.itemRewardSystem.getAllItemsWithStatus();
  const inventoryGrid = document.querySelector('.inventory-grid');
  
  if (!inventoryGrid) return;
  
  // 清空現有物品
  inventoryGrid.innerHTML = '';
  
  // 統計物品數量
  let foodCount = 0, decorCount = 0, researchCount = 0, ownedCount = 0;
  
  // 添加所有物品（包括未擁有的）
  allItems.forEach(item => {
    const itemSlot = createItemSlot(item, item.quantity);
    inventoryGrid.appendChild(itemSlot);
    
    if (item.owned) {
      ownedCount++;
      // 統計分類數量
      if (item.type === '食物') foodCount += item.quantity;
      else if (item.type === '裝飾') decorCount += item.quantity;
      else if (item.type === '研究') researchCount += item.quantity;
    }
  });
  
  // 更新統計數據
  updateInventoryStats(ownedCount, foodCount, decorCount, researchCount);
}

// 創建物品格子
function createItemSlot(itemData, quantity) {
  const slot = document.createElement('div');
  const isOwned = quantity > 0;
  slot.className = `item-slot ${!isOwned ? 'locked-item' : ''}`;
  
  if (isOwned) {
    slot.onclick = () => showItemDetails(
      itemData.name, itemData.type, itemData.rarity, 
      itemData.description, '', itemData.icon
    );
  }
  
  slot.innerHTML = `
    <div class="item-icon">${isOwned ? itemData.icon : '❓'}</div>
    <div class="item-name">${isOwned ? itemData.name : '未知物品'}</div>
    <div class="item-rarity rarity-${itemData.rarity}">${itemData.rarity}</div>
    ${isOwned ? `<div class="item-quantity">${quantity}</div>` : '<div class="locked-overlay">🔒</div>'}
  `;
  
  return slot;
}

// 更新背包統計
function updateInventoryStats(ownedItems, foodCount, decorCount, researchCount) {
  const stats = document.querySelectorAll('.inventory-stat .stat-value');
  if (stats.length >= 4) {
    stats[0].textContent = `${ownedItems}/30`;
    stats[1].textContent = foodCount;
    stats[2].textContent = decorCount;
    stats[3].textContent = researchCount;
  }
}

// 標籤切換
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    
    const category = this.textContent.trim();
    filterItems(category);
  });
});

// 頁面載入時初始化背包
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    loadInventoryItems();
    addInventoryStyles();
  }, 100);
});

// 監聽localStorage變化，當inventory被清空時自動更新顯示
window.addEventListener('storage', function(e) {
  if (e.key === 'playerInventory') {
    setTimeout(() => {
      loadInventoryItems();
    }, 100);
  }
});

// 添加物品背包樣式
function addInventoryStyles() {
  if (document.getElementById('inventory-locked-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'inventory-locked-styles';
  style.textContent = `
    .locked-item {
      background: #f5f5f5 !important;
      opacity: 0.6;
      cursor: not-allowed !important;
    }
    
    .locked-item .item-icon {
      filter: grayscale(100%);
      font-size: 24px;
    }
    
    .locked-item .item-name {
      color: #999 !important;
    }
    
    .locked-overlay {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(0,0,0,0.7);
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    
    .item-slot {
      position: relative;
    }
  `;
  
  document.head.appendChild(style);
}
    
    // 過濾物品
    function filterItems(category) {
      if (typeof window.itemRewardSystem === 'undefined') return;
      
      const allItems = window.itemRewardSystem.getAllItemsWithStatus();
      const inventoryGrid = document.querySelector('.inventory-grid');
      
      if (!inventoryGrid) return;
      
      // 清空並重新渲染
      inventoryGrid.innerHTML = '';
      
      // 過濾物品
      const filteredItems = allItems.filter(item => {
        if (category === '全部物品') return true;
        return item.type === category;
      });
      
      // 添加過濾後的物品
      filteredItems.forEach(item => {
        const itemSlot = createItemSlot(item, item.quantity);
        inventoryGrid.appendChild(itemSlot);
      });
    }
    
    // 顯示物品詳情
    function showItemDetails(name, type, rarity, description, stats, icon) {
      document.getElementById('modalName').textContent = name;
      document.getElementById('modalRarity').textContent = `類型：${type} | 稀有度：${rarity}`;
      document.getElementById('modalDescription').textContent = description;
      document.getElementById('modalStats').textContent = stats;
      document.getElementById('modalIcon').textContent = icon;
      
      // 設置稀有度顏色
      let rarityClass = '';
      switch (rarity) {
        case '普通':
          rarityClass = 'rarity-common';
          break;
        case '稀有':
          rarityClass = 'rarity-rare';
          break;
        case '高級':
          rarityClass = 'rarity-epic';
          break;
        case '傳說':
          rarityClass = 'rarity-legendary';
          break;
      }
      
      document.getElementById('modalRarity').className = rarityClass;
      
      // 顯示彈窗
      document.getElementById('itemModal').style.display = 'flex';
    }
    
    // 關閉物品詳情彈窗
    function closeItemModal() {
      document.getElementById('itemModal').style.display = 'none';
    }
    
    // 使用物品
    function useItem() {
      const itemName = document.getElementById('modalName').textContent;
      alert(`使用了 ${itemName}`);
      closeItemModal();
    }