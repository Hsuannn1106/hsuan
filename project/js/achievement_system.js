class AchievementSystem {
    constructor() {
        this.achievements = {
            matching_first_complete: {
                id: 'matching_first_complete',
                title: '動物專家',
                description: '首次完成動物連連看',
                icon: '🐾',
                category: 'learning',
                reward: { points: 100, item: '動物圖鑑' },
                unlocked: false
            },
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
                reward: { points: 100, item: '鷹眼徽章' },
                unlocked: false
            },
            maze_first_complete: {
                id: 'maze_first_complete',
                title: '迷宮初探者',
                description: '首次完成迷宮遊戲',
                icon: '🏔️',
                category: 'exploration',
                reward: { points: 100, item: '探險徽章' },
                unlocked: false
            },
            classification_first_complete: {
                id: 'classification_first_complete',
                title: '生態分類專家',
                description: '首次完成生態分類研究',
                icon: '🔬',
                category: 'research',
                reward: { points: 100, item: '研究證書' },
                unlocked: false
            },
            perfect_classification: {
                id: 'perfect_classification',
                title: '完美分類學家',
                description: '100%準確率完成生態分類',
                icon: '🎯',
                category: 'research',
                reward: { points: 100, item: '完美徽章' },
                unlocked: false
            },
            research_novice: {
                id: 'research_novice',
                title: '研究新手',
                description: '累積獲得100研究點數',
                icon: '📚',
                category: 'progress',
                reward: { points: 50, item: '研究筆記' },
                unlocked: false
            }
        };
        
        this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem('achievements_progress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                Object.keys(progress).forEach(key => {
                    if (this.achievements[key]) {
                        this.achievements[key].unlocked = progress[key].unlocked;
                    }
                });
            } catch (error) {
                console.error('載入成就進度失敗:', error);
            }
        }
    }

    saveProgress() {
        const progress = {};
        Object.keys(this.achievements).forEach(key => {
            progress[key] = {
                unlocked: this.achievements[key].unlocked
            };
        });
        
        try {
            localStorage.setItem('achievements_progress', JSON.stringify(progress));
        } catch (error) {
            console.error('保存成就進度失敗:', error);
        }
    }

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
            case 'classification_first_complete':
                shouldUnlock = gameData.completed && gameData.gameType === 'classification';
                break;
            case 'perfect_classification':
                shouldUnlock = gameData.completed && gameData.gameType === 'classification' && gameData.accuracy === 100;
                break;
            case 'research_novice':
                shouldUnlock = gameData.totalPoints >= 100;
                break;
        }

        if (shouldUnlock) {
            achievement.unlocked = true;
            this.saveProgress();
            return achievement;
        }

        return null;
    }

    getAllAchievements() {
        return this.achievements;
    }

    getUnlockedAchievements() {
        return Object.values(this.achievements).filter(a => a.unlocked);
    }

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

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 4000);

        this.playAchievementSound();
    }

    playAchievementSound() {
        try {
            const audio = new Audio('../audio/achievement.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {});
        } catch (e) {}
    }

    updateResearchPoints(points) {
        if (window.pointsManager) {
            return window.pointsManager.addPoints(points);
        } else {
            let currentPoints = parseInt(localStorage.getItem('research_points') || '0');
            currentPoints += points;
            
            try {
                localStorage.setItem('research_points', currentPoints.toString());
            } catch (error) {
                console.error('保存研究點數失敗:', error);
            }

            return currentPoints;
        }
    }

    getCurrentPoints() {
        if (window.pointsManager) {
            return window.pointsManager.getPoints();
        }
        return parseInt(localStorage.getItem('research_points') || '0');
    }

    resetAllAchievements() {
        Object.keys(this.achievements).forEach(key => {
            this.achievements[key].unlocked = false;
        });
        
        localStorage.removeItem('achievements_progress');
    }
}

window.achievementSystem = new AchievementSystem();