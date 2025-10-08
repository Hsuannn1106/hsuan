// 動物圖鑑隨機獎勵系統
class AnimalRewardSystem {
    constructor() {
        this.milestones = [
            { count: 5, title: '初級研究員', reward: '解鎖特殊動物' },
            { count: 10, title: '動物專家', reward: '獲得稀有動物' },
            { count: 15, title: '圖鑑大師', reward: '全動物解鎖' }
        ];
    }
    
    // 關卡完成隨機獎勵
    grantGameReward(gameId) {
        const rewardCount = Math.floor(Math.random() * 3) + 2; // 隨機2-4隻動物
        const newAnimals = this.selectRandomAnimals(rewardCount);
        
        if (newAnimals.length > 0) {
            setTimeout(() => {
                this.showRandomReward(gameId, newAnimals);
                this.checkMilestones();
            }, 1000);
        }
    }
    
    // 隨機選擇獎勵動物
    selectRandomAnimals(count) {
        const uncollected = animals.filter(a => !a.collected);
        if (uncollected.length === 0) return [];
        
        const actualCount = Math.min(count, uncollected.length);
        const selected = [];
        
        for (let i = 0; i < actualCount; i++) {
            const randomIndex = Math.floor(Math.random() * uncollected.length);
            const animal = uncollected.splice(randomIndex, 1)[0];
            animal.collected = true;
            selected.push(animal);
        }
        
        animalCollection.saveCollectedAnimals();
        return selected;
    }
    
    // 顯示隨機獎勵彈窗
    showRandomReward(gameId, newAnimals) {
        const gameNames = { game1: '森林探索', game2: '海洋冒險', game3: '草原征程' };
        
        const popup = document.createElement('div');
        popup.className = 'achievement-reward-popup';
        popup.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-header">
                    <div class="achievement-icon">🎉</div>
                    <h2>關卡完成！</h2>
                    <p>${gameNames[gameId] || '未知關卡'} 成功通關</p>
                </div>
                
                <div class="rewards-section">
                    <h3>🎁 隨機獲得 ${newAnimals.length} 張動物圖鑑</h3>
                    <div class="reward-animals">
                        ${newAnimals.map(animal => `
                            <div class="reward-animal-card">
                                <div class="animal-emoji">${animal.emoji}</div>
                                <div class="animal-name">${animal.name}</div>
                                <div class="animal-category">${this.getCategoryName(animal.category)}</div>
                                <div class="unlock-effect">✨ 已解鎖 ✨</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="progress-section">
                    <div class="collection-progress">
                        <span>圖鑑進度：${animals.filter(a => a.collected).length}/${animals.length}</span>
                        <div class="progress-bar-mini">
                            <div class="progress-fill-mini" style="width: ${(animals.filter(a => a.collected).length / animals.length * 100)}%"></div>
                        </div>
                    </div>
                </div>
                
                <button class="achievement-close-btn" onclick="this.parentElement.parentElement.remove(); renderCards(); updateProgress();">繼續探索</button>
            </div>
        `;
        
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 100);
        this.playAchievementSound();
    }
    
    // 獲取分類中文名稱
    getCategoryName(category) {
        const names = {
            forest: '森林',
            ocean: '海洋', 
            farm: '農場',
            savanna: '草原'
        };
        return names[category] || '未知';
    }
    
    // 檢查里程碑成就
    checkMilestones() {
        const collected = animals.filter(a => a.collected).length;
        const unlockedMilestones = JSON.parse(localStorage.getItem('unlockedMilestones') || '[]');
        
        this.milestones.forEach(milestone => {
            if (collected >= milestone.count && !unlockedMilestones.includes(milestone.count)) {
                unlockedMilestones.push(milestone.count);
                localStorage.setItem('unlockedMilestones', JSON.stringify(unlockedMilestones));
                setTimeout(() => this.showMilestoneAchievement(milestone), 2000);
            }
        });
    }
    
    // 顯示里程碑成就
    showMilestoneAchievement(milestone) {
        const popup = document.createElement('div');
        popup.className = 'milestone-popup';
        popup.innerHTML = `
            <div class="milestone-content">
                <div class="milestone-icon">🏅️</div>
                <h2>成就解鎖！</h2>
                <h3>${milestone.title}</h3>
                <p>收集了 ${milestone.count} 種動物</p>
                <div class="milestone-reward">獎勵：${milestone.reward}</div>
                <button onclick="this.parentElement.parentElement.remove()">太棒了！</button>
            </div>
        `;
        
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 100);
    }
    

    
    playAchievementSound() {
        try {
            const audio = new Audio('../audio/achievement.mp3');
            audio.volume = 0.7;
            audio.play().catch(() => {});
        } catch (e) {}
    }
}

// 全域獎勵系統實例
window.animalRewardSystem = new AnimalRewardSystem();

// 暴露獎勵函數
window.grantGameReward = function(gameId) {
    window.animalRewardSystem.grantGameReward(gameId);
};

// 監聽遊戲完成事件
window.addEventListener('gameCompleted', function(event) {
    const gameId = event.detail.gameId;
    window.animalRewardSystem.grantGameReward(gameId);
});