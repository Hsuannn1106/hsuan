    // 裝飾物品點擊處理
    const decorationItems = document.querySelectorAll('.decoration-item');
    decorationItems.forEach(item => {
      item.addEventListener('click', function() {
        alert('已添加裝飾：' + this.textContent);
      });
    });
    
    // 動物卡片點擊處理
    const animalCards = document.querySelectorAll('.animal-card');
    animalCards.forEach(card => {
      card.addEventListener('click', function() {
        const animalName = this.querySelector('.animal-name').textContent;
        alert('已選擇：' + animalName);
      });
    });
    
    // 照顧動作點擊處理
    const careActions = document.querySelectorAll('.care-action');
    careActions.forEach(action => {
      action.addEventListener('click', function() {
        const actionText = this.textContent.trim();
        alert('執行動作：' + actionText);
      });
    });