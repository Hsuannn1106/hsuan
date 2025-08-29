        // 動物資料
        const animals = [
            {
                id: 1,
                name: "獅子",
                emoji: "🦁",
                category: "savanna",
                habitat: "非洲草原",
                fact: "獅子是草原之王，雄獅的鬃毛越濃密代表越強壯！",
                sound: "吼吼吼！",
                collected: false
            },
            {
                id: 2,
                name: "熊貓",
                emoji: "🐼",
                category: "forest",
                habitat: "中國竹林",
                fact: "熊貓一天要吃12-38公斤的竹子，超級能吃！",
                sound: "嗯嗯嗯~",
                collected: false
            },
            {
                id: 3,
                name: "企鵝",
                emoji: "🐧",
                category: "ocean",
                habitat: "南極地區",
                fact: "企鵝走路搖搖擺擺很可愛，但在水中游泳超級快！",
                sound: "嘎嘎嘎！",
                collected: false
            },
            {
                id: 4,
                name: "小牛",
                emoji: "🐄",
                category: "farm",
                habitat: "農場牧場",
                fact: "小牛每天可以產出很多新鮮牛奶給大家喝！",
                sound: "哞哞哞~",
                collected: false
            },
            {
                id: 5,
                name: "老虎",
                emoji: "🐅",
                category: "forest",
                habitat: "亞洲叢林",
                fact: "老虎的條紋就像人類的指紋一樣，每隻都不同！",
                sound: "嗷嗚嗷嗚！",
                collected: false
            },
            {
                id: 6,
                name: "海豚",
                emoji: "🐬",
                category: "ocean",
                habitat: "海洋",
                fact: "海豚很聰明，會用聲音和同伴溝通！",
                sound: "咿咿咿~",
                collected: false
            },
            {
                id: 7,
                name: "小豬",
                emoji: "🐷",
                category: "farm",
                habitat: "農場",
                fact: "小豬其實很愛乾淨，只是喜歡在泥巴裡降溫！",
                sound: "哼哼哼~",
                collected: false
            },
            {
                id: 8,
                name: "長頸鹿",
                emoji: "🦒",
                category: "savanna",
                habitat: "非洲草原",
                fact: "長頸鹿的舌頭有50公分長，可以吃到高高的樹葉！",
                sound: "嗯嗯~",
                collected: false
            },
            {
                id: 9,
                name: "狐狸",
                emoji: "🦊",
                category: "forest",
                habitat: "森林",
                fact: "狐狸很聰明，會用各種策略來尋找食物！",
                sound: "嗷嗷嗷~",
                collected: false
            },
            {
                id: 10,
                name: "鯨魚",
                emoji: "🐳",
                category: "ocean",
                habitat: "深海",
                fact: "藍鯨是地球上最大的動物，心臟就像一輛小汽車那麼大！",
                sound: "嗚嗚嗚~",
                collected: false
            },
            {
                id: 11,
                name: "小羊",
                emoji: "🐑",
                category: "farm",
                habitat: "農場草地",
                fact: "小羊的毛毛很溫暖，可以做成毛衣保暖！",
                sound: "咩咩咩~",
                collected: false
            },
            {
                id: 12,
                name: "大象",
                emoji: "🐘",
                category: "savanna",
                habitat: "非洲草原",
                fact: "大象用鼻子就像我們用手一樣，可以拿東西和打招呼！",
                sound: "嗚嗚嗚！",
                collected: false
            },
            {
                id: 13,
                name: "兔子",
                emoji: "🐰",
                category: "forest",
                habitat: "森林草地",
                fact: "兔子的耳朵很靈敏，可以聽到很遠的聲音！",
                sound: "嗯嗯嗯~",
                collected: false
            },
            {
                id: 14,
                name: "章魚",
                emoji: "🐙",
                category: "ocean",
                habitat: "海底",
                fact: "章魚有8隻觸手和3顆心臟，超級特別！",
                sound: "咕嚕咕嚕~",
                collected: false
            },
            {
                id: 15,
                name: "小雞",
                emoji: "🐤",
                category: "farm",
                habitat: "農場",
                fact: "小雞剛出生就會走路，真的很厲害！",
                sound: "啾啾啾~",
                collected: false
            },
            /*{
                id: 16,
                name: "河馬",
                emoji: "🦛",
                category: "savanna",
                habitat: "非洲河流",
                fact: "河馬看起來笨重，但游泳速度很快！",
                sound: "哼哼哼！",
                collected: false
            },
            {
                id: 17,
                name: "猴子",
                emoji: "🐵",
                category: "forest",
                habitat: "熱帶森林",
                fact: "猴子很會爬樹，可以在樹枝間快速跳躍！",
                sound: "吱吱吱~",
                collected: true
            },
            {
                id: 18,
                name: "螃蟹",
                emoji: "🦀",
                category: "ocean",
                habitat: "海邊沙灘",
                fact: "螃蟹橫著走路，鉗子很有力氣！",
                sound: "卡卡卡~",
                collected: false
            },
            {
                id: 19,
                name: "鴨子",
                emoji: "🦆",
                category: "farm",
                habitat: "農場池塘",
                fact: "鴨子的腳有蹼，游泳很厲害！",
                sound: "嘎嘎嘎~",
                collected: false
            },
            {
                id: 20,
                name: "斑馬",
                emoji: "🦓",
                category: "savanna",
                habitat: "非洲草原",
                fact: "斑馬的條紋可以迷惑敵人，是天然的保護色！",
                sound: "嘶嘶嘶~",
                collected: true
            },
            {
                id: 21,
                name: "松鼠",
                emoji: "🐿️",
                category: "forest",
                habitat: "森林樹上",
                fact: "松鼠會把堅果藏起來當冬天的食物！",
                sound: "吱吱吱~",
                collected: false
            },
            {
                id: 22,
                name: "海龜",
                emoji: "🐢",
                category: "ocean",
                habitat: "海洋",
                fact: "海龜可以活很久很久，有些超過100歲！",
                sound: "嗯嗯嗯~",
                collected: false
            },
            {
                id: 23,
                name: "馬",
                emoji: "🐴",
                category: "farm",
                habitat: "農場草地",
                fact: "馬跑得很快，古時候是重要的交通工具！",
                sound: "希律律~",
                collected: true
            },
            {
                id: 24,
                name: "犀牛",
                emoji: "🦏",
                category: "savanna",
                habitat: "非洲草原",
                fact: "犀牛的角很硬，是用來保護自己的！",
                sound: "哼哼哼！",
                collected: false
            }*/
        ];

        let currentFilter = 'all';
        let currentSearch = '';

        // 動物收集系統
        class AnimalCollectionSystem {
            constructor() {
                this.loadCollectedAnimals();
            }
            
            // 載入已收集的動物
            loadCollectedAnimals() {
                const saved = localStorage.getItem('collectedAnimals');
                if (saved) {
                    const collectedIds = JSON.parse(saved);
                    animals.forEach(animal => {
                        animal.collected = collectedIds.includes(animal.id);
                    });
                }
            }
            
            // 保存收集進度
            saveCollectedAnimals() {
                const collectedIds = animals.filter(a => a.collected).map(a => a.id);
                localStorage.setItem('collectedAnimals', JSON.stringify(collectedIds));
            }
            
            // 隨機獲得動物圖鑑
            grantRandomAnimals(count) {
                const uncollected = animals.filter(a => !a.collected);
                if (uncollected.length === 0) return [];
                
                const actualCount = Math.min(count, uncollected.length);
                const newAnimals = [];
                
                for (let i = 0; i < actualCount; i++) {
                    const randomIndex = Math.floor(Math.random() * uncollected.length);
                    const animal = uncollected.splice(randomIndex, 1)[0];
                    animal.collected = true;
                    newAnimals.push(animal);
                }
                
                this.saveCollectedAnimals();
                return newAnimals;
            }
            
            // 顯示獲得動物的成就彈窗
            showAnimalReward(newAnimals) {
                if (newAnimals.length === 0) return;
                
                const popup = document.createElement('div');
                popup.className = 'animal-reward-popup';
                popup.innerHTML = `
                    <div class="reward-content">
                        <div class="reward-header">
                            <h2>🎉 獲得新動物圖鑑！</h2>
                            <p>恭喜完成關卡，獲得 ${newAnimals.length} 張動物圖鑑</p>
                        </div>
                        <div class="reward-animals">
                            ${newAnimals.map(animal => `
                                <div class="reward-animal">
                                    <div class="animal-emoji">${animal.emoji}</div>
                                    <div class="animal-name">${animal.name}</div>
                                    <div class="animal-category">${getCategoryName(animal.category)}</div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="reward-close-btn" onclick="this.parentElement.parentElement.remove()">確定</button>
                    </div>
                `;
                
                document.body.appendChild(popup);
                setTimeout(() => popup.classList.add('show'), 100);
                
                // 播放獎勵音效
                this.playRewardSound();
            }
            
            // 播放獎勵音效
            playRewardSound() {
                try {
                    const audio = new Audio('../audio/achievement.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(() => {});
                } catch (e) {}
            }
        }
        
        // 全域動物收集系統實例
        const animalCollection = new AnimalCollectionSystem();
        
        // 初始化頁面
        function init() {
            renderCards();
            updateProgress();
            bindEvents();
        }

        // 渲染卡片
        function renderCards() {
            const grid = document.getElementById('cardsGrid');
            const filteredAnimals = animals.filter(animal => {
                const matchCategory = currentFilter === 'all' || animal.category === currentFilter;
                const matchSearch = currentSearch === '' || animal.name.toLowerCase().includes(currentSearch.toLowerCase());
                return matchCategory && matchSearch;
            });

            grid.innerHTML = filteredAnimals.map(animal => `
                <div class="animal-card ${animal.collected ? 'collected' : 'uncollected'}" onclick="openModal(${animal.id})">
                    ${animal.collected ? '<div class="collected-badge">✓</div>' : ''}
                    <div class="card-image">
                        ${animal.collected ? animal.emoji : '❓'}
                    </div>
                    <div class="card-name">${animal.collected ? animal.name : '神秘動物'}</div>
                    <div class="card-category">${getCategoryName(animal.category)}</div>
                </div>
            `).join('');
        }

        // 獲取分類中文名稱
        function getCategoryName(category) {
            const names = {
                forest: '森林',
                ocean: '海洋',
                farm: '農場',
                savanna: '草原'
            };
            return names[category] || '未知';
        }

        // 更新進度
        function updateProgress() {
            const collected = animals.filter(animal => animal.collected).length;
            const total = animals.length;
            const percentage = Math.round((collected / total) * 100);
            
            document.getElementById('progressFill').style.width = percentage + '%';
            document.getElementById('progressText').textContent = `已收集: ${collected}/${total} (${percentage}%)`;
        }

        // 綁定事件
        function bindEvents() {
            // 分類標籤事件
            document.querySelectorAll('.tab-button').forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                    button.classList.add('active');
                    currentFilter = button.getAttribute('data-category');
                    renderCards();
                });
            });

            // 搜尋事件
            document.getElementById('searchInput').addEventListener('input', (e) => {
                currentSearch = e.target.value;
                renderCards();
            });
        }

        // 開啟動物詳細資訊彈窗
        function openModal(animalId) {
            const animal = animals.find(a => a.id === animalId);
            if (!animal || !animal.collected) return;

            document.getElementById('modalImage').textContent = animal.emoji;
            document.getElementById('modalName').textContent = animal.name;
            document.getElementById('animalInfo').innerHTML = `
                <h4>🏠 棲息地：${animal.habitat}</h4>
                <p><strong>🎯 有趣小知識：</strong></p>
                <p>${animal.fact}</p>
            `;
            
            document.getElementById('animalModal').classList.add('show');
        }

        // 關閉彈窗
        function closeModal() {
            document.getElementById('animalModal').classList.remove('show');
        }

        // 播放動物叫聲
        function playAnimalSound() {
            // 這裡可以接入實際的音效播放功能
            alert('🔊 ' + getCurrentAnimal().sound);
        }

        // 獲取當前顯示的動物
        function getCurrentAnimal() {
            const modalName = document.getElementById('modalName').textContent;
            return animals.find(animal => animal.name === modalName);
        }

        // 關卡完成後獲得動物獎勵（供遊戲調用）
        function grantGameReward(gameId) {
            const rewardCount = Math.floor(Math.random() * 3) + 3; // 3-5張隨機
            const newAnimals = animalCollection.grantRandomAnimals(rewardCount);
            
            if (newAnimals.length > 0) {
                setTimeout(() => {
                    animalCollection.showAnimalReward(newAnimals);
                    renderCards();
                    updateProgress();
                }, 1000);
            }
        }
        
        // 收集新動物（供遊戲其他部分調用）
        function collectAnimal(animalId) {
            const animal = animals.find(a => a.id === animalId);
            if (animal && !animal.collected) {
                animal.collected = true;
                animalCollection.saveCollectedAnimals();
                renderCards();
                updateProgress();
                showAchievement(`🎉 恭喜收集到新動物：${animal.name}！`);
            }
        }

        // 顯示成就提示
        function showAchievement(text) {
            const popup = document.getElementById('achievementPopup');
            document.getElementById('achievementText').textContent = text;
            popup.classList.add('show');
            
            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000);
        }

        // 點擊彈窗外部關閉
        document.getElementById('animalModal').addEventListener('click', (e) => {
            if (e.target.id === 'animalModal') {
                closeModal();
            }
        });

        // 頁面載入完成後初始化
        document.addEventListener('DOMContentLoaded', init);