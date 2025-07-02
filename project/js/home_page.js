const dialogueOptions = document.querySelectorAll('.dialogue-option');
    
    dialogueOptions.forEach((option, index) => {
      option.addEventListener('click', function() {
        const dialogueText = document.querySelector('.dialogue-text');
        
        // 根據不同選項顯示不同對話  //優化可加入AI，聊天機器人
        if (index === 0) {
          dialogueText.textContent = '=====ANS123=====';
        } else if (index === 1) {
          dialogueText.textContent = '=====ANS456=====';
        } else if (index === 2) {
          dialogueText.textContent = '=====ANS789=====';
        }
        
        // 更新對話選項
        dialogueOptions[0].textContent = '=====321=====';
        dialogueOptions[1].textContent = '=====654=====';
        dialogueOptions[2].textContent = '=====987=====';
      });
    });
    
    // 選單的點擊處理
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach((item, index) => {
      item.addEventListener('click', function() {
        // 移除所有活動狀態
        menuItems.forEach(mi => mi.classList.remove('active'));
        // 添加當前項目的活動狀態
        this.classList.add('active');
        
        // 根據點擊的菜單項目跳轉到相應頁面
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
      });
    });