// 標籤切換
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // 這裡可以添加過濾物品的邏輯
        const category = this.textContent.trim();
        filterItems(category);
      });
    });
    
    // 過濾物品
    function filterItems(category) {
      const items = document.querySelectorAll('.item-slot:not(.empty-slot)');
      
      items.forEach(item => {
        if (category === '全部物品') {
          item.style.display = 'flex';
          return;
        }
        
        const itemName = item.querySelector('.item-name').textContent;
        let itemCategory = '';
        
        // 根據物品名稱判斷類別
        if (['蘋果', '香蕉'].includes(itemName)) {
          itemCategory = '食物';
        } else if (['樹木', '小屋', '岩石'].includes(itemName)) {
          itemCategory = '裝飾';
        } else if (['放大鏡', '筆記本', '相機'].includes(itemName)) {
          itemCategory = '研究';
        }
        
        if (itemCategory === category) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
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
        case '史詩':
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