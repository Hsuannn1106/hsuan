// 等待DOM完全載入后再執行
document.addEventListener('DOMContentLoaded', function() {
  // 更新研究點數顯示
  function updatePointsDisplay() {
    const pointsElement = document.querySelector('.player-info');
    if (pointsElement && typeof achievementSystem !== 'undefined') {
      const currentPoints = achievementSystem.getCurrentPoints();
      pointsElement.textContent = `研究點數: ${currentPoints}`;
    }
  }
  
  // 初始化時更新點數顯示
  setTimeout(updatePointsDisplay, 100);
  const dialogueOptions = document.querySelectorAll('.dialogue-option');
  const dialogueText = document.querySelector('.dialogue-text');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  /*// AI Agent 回應庫
  const aiResponses = {
    '你好': '你好！我是動物研究院的AI助手，有什麼我可以幫助你的嗎？',
    '你是誰': '我是動物研究院的AI助手，可以回答你關於動物的問題，或者陪你聊天！',
    '狐狸': '狐狸是犬科動物，有著尖尖的耳朵和蓬鬆的尾巴。牠們非常聰明，在許多文化中都被視為狡猾的象徵。',
    '貓': '貓是人類最常見的寵物之一，屬於貓科動物。牠們有著靈活的身體和敏銳的感官，是優秀的獵手。',
    '狗': '狗是人類最忠實的朋友，已經和人類共同生活了數千年。牠們有各種不同的品種，可以幫助人類完成各種任務。',
    '大象': '大象是地球上最大的陸地動物，有著長長的鼻子和大大的耳朵。牠們非常聰明，有著複雜的社會結構。',
    '鳥': '鳥類是唯一擁有羽毛的動物，大多數鳥類都能飛行。全世界有超過10,000種不同的鳥類。',
    '魚': '魚類生活在水中，通過鰓呼吸。牠們是地球上最古老的脊椎動物之一，有著極其多樣的形態和生活方式。'
  };*/

  // 處理對話選項點擊
  /*dialogueOptions.forEach((option, index) => {
    option.addEventListener('click', function() {
      // 根據不同選項顯示不同對話
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
  });*/

  // AI Agent 聊天功能
  sendButton.addEventListener('click', handleUserInput);
  userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  });

  function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;
    
    // 顯示用戶輸入
    appendMessage('你', userMessage);
    
    // 生成 AI 回應
    generateAIResponse(userMessage);
    
    // 清空輸入框
    userInput.value = '';
  }

  function appendMessage(sender, message) {
    // 將對話區域轉換為可滾動的聊天記錄
    if (!dialogueText.classList.contains('chat-history')) {
      dialogueText.classList.add('chat-history');
      dialogueText.textContent = '';
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    dialogueText.appendChild(messageElement);
    
    // 滾動到最新消息
    dialogueText.scrollTop = dialogueText.scrollHeight;
  }

  function generateAIResponse(userMessage) {
    // 簡單的關鍵詞匹配
    let aiResponse = null;
    
    // 檢查是否有完全匹配的關鍵詞
    for (const keyword in aiResponses) {
      if (userMessage.toLowerCase().includes(keyword.toLowerCase())) {
        aiResponse = aiResponses[keyword];
        break;
      }
    }
    
    // 如果沒有匹配，使用默認回應
    if (!aiResponse) {
      aiResponse = '我對這個問題還在學習中。你可以問我關於狐狸、貓、狗、大象、鳥或魚的問題！';
    }
    
    // 模擬 AI 思考時間
    setTimeout(() => {
      appendMessage('動物助手', aiResponse);
    }, 500);
  }
      
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

  


});  // 结束 DOMContentLoaded 事件监听器