// 成就系統管理
class AchievementSystem {
    constructor() {
        this.achievements = {
            // 連連看成就
            matching_first_complete: {
                id: 'matching_first_complete',
                title: '動物專家',
                description: '首次完成動物連連看',
                icon: '🐾',
                category: 'learning',
                reward: { points: 100, item: '動物圖鑑' },
                unlocked: false
            },
            // 找不同成就
            spot_difference_first_complete: {
                id: 'spot_difference_first_complete',
                title: '觀察大師',
                description: '首次完成找不同遊戲',
                icon: '🔍',
                category: 'observation',
                reward: { points: 100, item: '放大鏡' },
                unlocked: false
            },
            spot_difference_no_hints: {
                id: 'spot_difference_no_hints',
                title: '獨立觀察者',
                description: '不使用提示完成找不同',
                icon: '👁️',
                category: 'observation',
                reward: { points: 50, item: '鷹眼徽章' },
                unlocked: false
            },
            // 迷宮遊戲成就
            maze_first_complete: {
                id: 'maze_first_complete',
                title: '迷宮初探者',
                description: '首次完成迷宮遊戲',
                icon: '🏔️',
                category: 'exploration',
                reward: { points: 100, item: '探險徽章' },
                unlocked: false
            },
            /*maze_speed_runner: {
                id: 'maze_speed_runner',
                title: '迷宮飛毛腿',
                description: '在30步內完成迷宮',
                icon: '⚡',
                category: 'exploration',
                reward: { points: 100, item: '速度靴子' },
                unlocked: false
            },
            maze_perfectionist: {
                id: 'maze_perfectionist',
                title: '完美主義者',
                description: '用最少步數完成迷宮',
                icon: '💎',
                category: 'exploration',
                reward: { points: 150, item: '完美水晶' },
                unlocked: false
            },
            // 收集成就
            animal_collector_1: {
                id: 'animal_collector_1',
                title: '初級收集家',
                description: '收集3種不同的動物',
                icon: '🦊',
                category: 'collection',
                reward: { points: 75, item: '收集圖鑑' },
                unlocked: false
            },*/
            
            
            // 研究成就
            /*research_novice: {
                id: 'research_novice',
                title: '研究新手',
                description: '獲得100研究點數',
                icon: '🧪',
                category: 'research',
                reward: { points: 50, item: '研究筆記' },
                unlocked: false
            }*/
        };
        
        this.loadProgress();
    }

    // 載入進度
    loadProgress() {
        const saved = localStorage.getItem('achievements_progress');
        if (saved) {
            const progress = JSON.parse(saved);
            Object.keys(progress).forEach(key => {
                if (this.achievements[key]) {
                    this.achievements[key].unlocked = progress[key].unlocked;
                }
            });
        }
    }

    // 儲存進度
    saveProgress() {
        const progress = {};
        Object.keys(this.achievements).forEach(key => {
            progress[key] = {
                unlocked: this.achievements[key].unlocked
            };
        });
        localStorage.setItem('achievements_progress', JSON.stringify(progress));
    }

    // 檢查並解鎖成就
    checkAchievement(achievementId, gameData = {}) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.unlocked) return null;

        let shouldUnlock = false;

        switch (achievementId) {

            case 'matching_first_complete':
                shouldUnlock = gameData.completed && gameData.gameType === 'matching';
                break;
            case 'spot_difference_first_complete':
                shouldUnlock = gameData.completed && gameData.gameType === 'spot_difference';
                break;
            case 'spot_difference_no_hints':
                shouldUnlock = gameData.completed && gameData.gameType === 'spot_difference' && gameData.hintsUsed === 0;
                break;
            case 'maze_first_complete':
                shouldUnlock = gameData.completed === true;
                break;
            /*case 'maze_speed_runner':
                shouldUnlock = gameData.completed && gameData.steps <= 30;
                break;
            case 'maze_perfectionist':
                shouldUnlock = gameData.completed && gameData.steps <= 20;
                break;
            case 'research_novice':
                shouldUnlock = gameData.totalPoints >= 100;
                break;*/
        }

        if (shouldUnlock) {
            achievement.unlocked = true;
            this.saveProgress();
            return achievement;
        }

        return null;
    }

    // 獲取所有成就
    getAllAchievements() {
        return this.achievements;
    }

    // 獲取已解鎖的成就
    getUnlockedAchievements() {
        return Object.values(this.achievements).filter(a => a.unlocked);
    }

    // 顯示成就解鎖通知
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <div class="achievement-popup-icon">${achievement.icon}</div>
                <div class="achievement-popup-content">
                    <div class="achievement-popup-title">成就解鎖！</div>
                    <div class="achievement-popup-name">${achievement.title}</div>
                    <div class="achievement-popup-reward">
                        獲得：${achievement.reward.points}研究點數 + ${achievement.reward.item}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // 動畫效果
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 4000);

        // 播放音效（如果有的話）
        this.playAchievementSound();
    }

    // 播放成就音效
    playAchievementSound() {
        try {
            const audio = new Audio('../audio/achievement.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {
                // 如果音效檔案不存在，忽略錯誤
            });
        } catch (e) {
            // 忽略音效錯誤
        }
    }

    // 更新研究點數
    updateResearchPoints(points) {
        let currentPoints = parseInt(localStorage.getItem('research_points') || '0');
        currentPoints += points;
        localStorage.setItem('research_points', currentPoints.toString());
        
        // 檢查研究點數相關成就
        const researchAchievement = this.checkAchievement('research_novice', { totalPoints: currentPoints });
        if (researchAchievement) {
            setTimeout(() => this.showAchievementNotification(researchAchievement), 1000);
        }

        return currentPoints;
    }

    // 獲取當前研究點數
    getCurrentPoints() {
        return parseInt(localStorage.getItem('research_points') || '0');
    }

    // 重置所有成就和研究點數
    resetAllAchievements() {
        // 重置成就狀態
        Object.keys(this.achievements).forEach(key => {
            this.achievements[key].unlocked = false;
        });
        
        // 清除localStorage中的成就進度
        localStorage.removeItem('achievements_progress');
        
        // 重置研究點數
        localStorage.setItem('research_points', '0');
        
        // 重置遊戲進度
        if (window.gameProgressManager) {
            window.gameProgressManager.resetProgress();
        }
        
        // 顯示重置完成通知
        this.showResetNotification();
    }

    // 顯示重置完成通知
    showResetNotification() {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup reset-popup">
                <div class="achievement-popup-icon">🔄</div>
                <div class="achievement-popup-content">
                    <div class="achievement-popup-title">重置完成！</div>
                    <div class="achievement-popup-name">所有成就已清空</div>
                    <div class="achievement-popup-reward">
                        研究點數已歸零，遊戲進度已重置
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    }
}

// 全域成就系統實例
const achievementSystem = new AchievementSystem();