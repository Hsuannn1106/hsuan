       // 標籤切換
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // 根據分類過濾成就
        const category = this.textContent.trim();
        filterAchievements(category);
      });
    });
    
    // 成就過濾功能
    function filterAchievements(category) {
      const achievements = document.querySelectorAll('.achievement-card');
      
      achievements.forEach(achievement => {
        const title = achievement.querySelector('.achievement-title').textContent;
        let shouldShow = true;
        
        switch(category) {
          case '收集成就':
            shouldShow = title.includes('收集');
            break;
          case '探索成就':
            shouldShow = title.includes('探險');
            break;
          case '研究成就':
            shouldShow = title.includes('研究');
            break;
          case '全部成就':
          default:
            shouldShow = true;
            break;
        }
        
        achievement.style.display = shouldShow ? 'block' : 'none';
      });
    }