    // 菜單項目點擊處理
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach((item, index) => {
      item.addEventListener('click', function() {
        // 根據點擊的菜單項目跳轉到相應頁面
        if (!this.classList.contains('active')) {
          const menuText = this.querySelector('span:last-child').textContent.trim();
          switch(index) {
            case 0: // 主線劇情
              window.location.href = 'main_story.html';
              break;
            case 1: // 動物圖鑑
              window.location.href = 'animal_collect.html';
              break;
            case 2: // 探索地圖
              window.location.href = 'map.html';
              break;
            case 3: // 研究實驗室
              window.location.href = 'laboratory.html';
              break;
            case 4: // 成就系統
              window.location.href = 'achievement.html';
              break;
            case 5: // 物品背包
              window.location.href = 'inventory.html';
              break;
          }
        }
      });
    });