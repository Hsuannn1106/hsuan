class Laboratory {
  constructor() {
    this.coins = window.pointsManager ? window.pointsManager.getCoins() : 500;
    this.researchPoints = window.pointsManager ? window.pointsManager.getPoints() : 150;
    this.animals = {};
    this.decorations = [];
    this.selectedFood = null;
    this.selectedDecoration = null;
    this.loadCollectedAnimals();
    this.init();
  }

  loadCollectedAnimals() {
    // 從localStorage載入收集到的動物
    const collectedIds = JSON.parse(localStorage.getItem('collectedAnimals') || '[]');
    
    // 從cards.js的動物資料中找到對應的動物
    if (window.animals) {
      const collectedAnimals = window.animals.filter(animal => 
        collectedIds.includes(animal.id) && animal.collected
      );
      
      collectedAnimals.forEach(animal => {
        // 使用動物名稱作為key，轉換為小寫並移除空格
        const animalKey = animal.name.toLowerCase().replace(/空格/g, '');
        this.animals[animalKey] = {
          hunger: 0,
          happiness: 0,
          name: animal.name,
          emoji: animal.emoji
        };
      });
    }
  }

  renderAnimals() {
    const animalDisplay = document.getElementById('animal-display');
    const animalSelection = document.getElementById('animal-selection');
    
    animalDisplay.innerHTML = '';
    animalSelection.innerHTML = '';

    Object.keys(this.animals).forEach(animalType => {
      // 渲染動物展示
      const animalSlot = document.createElement('div');
      animalSlot.className = 'animal-slot';
      animalSlot.dataset.animal = animalType;
      
      animalSlot.innerHTML = `
        <div class="animal-sprite ${animalType}" id="${animalType}-sprite">${this.getAnimalIcon(animalType)}</div>
        <div class="animal-status">
          <div class="hunger-bar">
            <div class="hunger-fill" style="width: 0%"></div>
          </div>
          <div class="happiness-bar">
            <div class="happiness-fill" style="width: 0%"></div>
          </div>
        </div>
      `;
      
      animalDisplay.appendChild(animalSlot);

      // 渲染餵食選項
      const animalOption = document.createElement('div');
      animalOption.className = 'animal-option';
      animalOption.dataset.target = animalType;
      animalOption.innerHTML = `${this.getAnimalIcon(animalType)} ${this.getAnimalName(animalType)}`;
      
      animalSelection.appendChild(animalOption);
    });
  }

  getAnimalIcon(type) {
    // 如果動物資料中有emoji，直接使用
    if (this.animals[type] && this.animals[type].emoji) {
      return this.animals[type].emoji;
    }
    return '🐾';
  }

  init() {
    this.renderAnimals();
    this.renderFoodItems();
    this.bindEvents();
    this.bindAnimalEvents();
    this.updateDisplay();
    this.updateEnvironmentStats();
    this.startAnimalNeeds();
  }

  renderFoodItems() {
    if (!window.itemRewardSystem) return;
    
    const foodGrid = document.querySelector('.food-grid');
    if (!foodGrid) return;
    
    foodGrid.innerHTML = '';
    
    // 獲取背包中的食物
    const allItems = window.itemRewardSystem.getAllItemsWithStatus();
    const foodItems = allItems.filter(item => item.type === '食物' && item.owned);
    
    if (foodItems.length === 0) {
      foodGrid.innerHTML = '<div class="no-food-message">背包中沒有食物道具<br>請先完成遊戲收集食物！</div>';
      return;
    }
    
    foodItems.forEach(item => {
      const foodElement = document.createElement('div');
      foodElement.className = 'food-item';
      foodElement.dataset.food = item.id;
      foodElement.innerHTML = `
        <div class="food-icon">${item.icon}</div>
        <div class="food-name">${item.name}</div>
        <div class="food-quantity">數量: ${item.quantity}</div>
      `;
      foodGrid.appendChild(foodElement);
    });
  }

  bindEvents() {
    // 餵食事件 - 使用事件委託
    document.querySelector('.food-grid').addEventListener('click', (e) => {
      const foodItem = e.target.closest('.food-item');
      if (foodItem) {
        this.selectFood({ currentTarget: foodItem });
      }
    });

    // 裝飾事件
    document.querySelectorAll('.decoration-item').forEach(item => {
      item.addEventListener('click', (e) => this.buyDecoration(e));
    });

    // 模態框關閉
    document.querySelector('.close-modal').addEventListener('click', () => {
      this.closeModal();
    });

    // 實驗室環境點擊放置裝飾
    document.getElementById('lab-environment').addEventListener('click', (e) => {
      this.placeDecoration(e);
    });
  }

  bindAnimalEvents() {
    // 動物選擇事件
    document.querySelectorAll('.animal-option').forEach(option => {
      option.addEventListener('click', (e) => this.feedAnimal(e));
    });
  }

  selectFood(e) {
    const foodItem = e.currentTarget;
    const foodType = foodItem.dataset.food;
    
    // 檢查背包中是否有該食物
    if (!window.itemRewardSystem) {
      this.showNotification('物品系統未載入！', 'error');
      return;
    }
    
    const quantity = window.itemRewardSystem.getItemQuantity(foodType);
    if (quantity <= 0) {
      this.showNotification('背包中沒有這種食物！請先收集食物道具。', 'error');
      return;
    }

    this.selectedFood = { type: foodType, quantity: quantity };
    this.showFeedingModal();
  }

  showFeedingModal() {
    if (Object.keys(this.animals).length === 0) {
      this.showNotification('還沒有收集到任何動物！', 'error');
      return;
    }
    this.bindAnimalEvents();
    document.getElementById('feeding-modal').style.display = 'block';
  }

  closeModal() {
    document.getElementById('feeding-modal').style.display = 'none';
    this.selectedFood = null;
  }

  feedAnimal(e) {
    const animalType = e.currentTarget.dataset.target;
    
    if (!this.selectedFood) return;

    // 從背包中消耗食物
    const currentQuantity = window.itemRewardSystem.getItemQuantity(this.selectedFood.type);
    if (currentQuantity <= 0) {
      this.showNotification('背包中沒有這種食物了！', 'error');
      this.closeModal();
      return;
    }
    
    // 減少背包中的食物數量
    window.itemRewardSystem.addItemToInventory(this.selectedFood.type, -1);
    
    // 增加動物飽食度和快樂度
    const hungerIncrease = this.getFoodEffect(this.selectedFood.type, animalType);
    this.animals[animalType].hunger = Math.min(100, this.animals[animalType].hunger + hungerIncrease);
    this.animals[animalType].happiness = Math.min(100, this.animals[animalType].happiness + 10);

    // 動畫效果
    const animalSprite = document.getElementById(`${animalType}-sprite`);
    animalSprite.classList.add('fed');
    setTimeout(() => animalSprite.classList.remove('fed'), 1000);

    // 更新食物顯示
    this.renderFoodItems();
    this.updateDisplay();
    this.closeModal();
    this.showNotification(`成功餵食${this.getAnimalName(animalType)}！剩餘食物：${currentQuantity - 1}`);
  }

  getFoodEffect(foodType, animalType) {
    // 基本食物效果
    const baseEffect = 20;
    
    // 特殊偏好加成
    const preferences = {
      apple: ['monkey', 'bear', 'elephant'],
      banana: ['monkey', 'bear'],
      carrot: ['rabbit', 'horse', 'deer'],
      fish: ['penguin', 'seal', 'bear', 'cat'],
      honey: ['bear']
    };
    
    const bonus = preferences[foodType]?.includes(animalType) ? 10 : 0;
    return baseEffect + bonus;
  }

  getAnimalName(type) {
    // 如果動物資料中有名稱，直接使用
    if (this.animals[type] && this.animals[type].name) {
      return this.animals[type].name;
    }
    return '動物';
  }

  buyDecoration(e) {
    const decorationItem = e.currentTarget;
    const decorationType = decorationItem.dataset.decoration;
    const cost = parseInt(decorationItem.dataset.cost);

    if (this.coins < cost) {
      this.showNotification('金幣不足！', 'error');
      return;
    }

    this.coins -= cost;
    this.selectedDecoration = decorationType;
    this.updateDisplay();
    this.showNotification('點擊實驗室環境來放置裝飾！');
  }

  placeDecoration(e) {
    if (!this.selectedDecoration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const decoration = document.createElement('div');
    decoration.className = 'decoration-placed';
    decoration.style.left = x + 'px';
    decoration.style.top = y + 'px';
    decoration.textContent = this.getDecorationIcon(this.selectedDecoration);
    
    // 添加移除功能
    decoration.addEventListener('dblclick', () => {
      decoration.remove();
      this.updateEnvironmentStats();
    });

    document.getElementById('decoration-container').appendChild(decoration);
    
    this.decorations.push({
      type: this.selectedDecoration,
      x: x,
      y: y
    });

    this.selectedDecoration = null;
    this.updateEnvironmentStats();
    this.showNotification('裝飾放置成功！雙擊可移除');
  }

  getDecorationIcon(type) {
    const icons = {
      tree: '🌳',
      flower: '🌸',
      rock: '🪨',
      water: '💧'
    };
    return icons[type];
  }

  updateDisplay() {
    if (window.pointsManager) {
      window.pointsManager.setCoins(this.coins);
      window.pointsManager.setPoints(this.researchPoints);
      window.pointsManager.updateDisplay();
    } else {
      document.getElementById('coins').textContent = this.coins;
      document.getElementById('research-points').textContent = this.researchPoints;
    }

    // 更新動物狀態條
    Object.keys(this.animals).forEach(animalType => {
      const animal = this.animals[animalType];
      const slot = document.querySelector(`[data-animal="${animalType}"]`);
      
      const hungerBar = slot.querySelector('.hunger-fill');
      const happinessBar = slot.querySelector('.happiness-fill');
      
      hungerBar.style.width = animal.hunger + '%';
      happinessBar.style.width = animal.happiness + '%';
    });
  }

  updateEnvironmentStats() {
    const comfort = Math.min(100, this.decorations.length * 10);
    const satisfaction = this.calculateSatisfaction();

    document.getElementById('comfort-fill').style.width = comfort + '%';
    document.getElementById('satisfaction-fill').style.width = satisfaction + '%';
    
    document.getElementById('comfort-text').textContent = comfort + '%';
    document.getElementById('satisfaction-text').textContent = satisfaction + '%';
  }

  calculateSatisfaction() {
    const animalCount = Object.keys(this.animals).length;
    if (animalCount === 0) return 0;
    
    const avgHunger = Object.values(this.animals).reduce((sum, animal) => sum + animal.hunger, 0) / animalCount;
    const avgHappiness = Object.values(this.animals).reduce((sum, animal) => sum + animal.happiness, 0) / animalCount;
    return Math.round((avgHunger + avgHappiness) / 2);
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  startAnimalNeeds() {
    setInterval(() => {
      Object.keys(this.animals).forEach(animalType => {
        // 飢餓度每分鐘減少1-3點
        this.animals[animalType].hunger = Math.max(0, this.animals[animalType].hunger - Math.floor(Math.random() * 3) + 1);
        // 快樂度每分鐘減少1-2點
        this.animals[animalType].happiness = Math.max(0, this.animals[animalType].happiness - Math.floor(Math.random() * 2) + 1);
      });
      
      this.updateDisplay();
      this.updateEnvironmentStats();
    }, 60000); // 每分鐘更新
  }
}

// 初始化實驗室
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    new Laboratory();
  }, 100);
});