class Laboratory {
  constructor() {
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
    const foodGrid = document.querySelector('.food-grid');
    if (!foodGrid) return;
    
    const foods = [
      { id: 'apple', icon: '🍎', name: '蘋果', cost: 10 },
      { id: 'carrot', icon: '🥕', name: '胡蘿蔔', cost: 8 },
      { id: 'fish', icon: '🐟', name: '魚', cost: 15 },
      { id: 'seeds', icon: '🌰', name: '種子', cost: 5 }
    ];
    
    foodGrid.innerHTML = '';
    foods.forEach(food => {
      const foodElement = document.createElement('div');
      foodElement.className = 'food-item';
      foodElement.dataset.food = food.id;
      foodElement.dataset.cost = food.cost;
      foodElement.innerHTML = `
        <div class="food-icon">${food.icon}</div>
        <div class="food-name">${food.name}</div>
        <div class="food-cost">${food.cost}點數</div>
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
    const animalOptions = document.querySelectorAll('.animal-option');
    animalOptions.forEach(option => {
      option.addEventListener('click', (e) => this.feedAnimal(e));
    });
  }

  selectFood(e) {
    const foodItem = e.currentTarget;
    const foodType = foodItem.dataset.food;
    const cost = parseInt(foodItem.dataset.cost);
    
    if (!window.pointsManager.hasEnoughPoints(cost)) {
      this.showNotification(`研究點數不足！需要${cost}點數`, 'error');
      return;
    }

    this.selectedFood = { type: foodType, cost: cost };
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
    
    if (!this.selectedFood || !animalType) return;

    // 檢查點數是否足夠
    if (!window.pointsManager.hasEnoughPoints(this.selectedFood.cost)) {
      this.showNotification(`研究點數不足！需要${this.selectedFood.cost}點數`, 'error');
      this.closeModal();
      return;
    }
    
    // 扣除研究點數
    window.pointsManager.subtractPoints(this.selectedFood.cost);
    
    // 增加動物飽食度和快樂度
    if (this.animals[animalType]) {
      const hungerIncrease = this.getFoodEffect(this.selectedFood.type, animalType);
      this.animals[animalType].hunger = Math.min(100, this.animals[animalType].hunger + hungerIncrease);
      this.animals[animalType].happiness = Math.min(100, this.animals[animalType].happiness + 10);
    }

    // 動畫效果
    const animalSprite = document.getElementById(`${animalType}-sprite`);
    if (animalSprite) {
      animalSprite.classList.add('fed');
      setTimeout(() => animalSprite.classList.remove('fed'), 1000);
    }

    this.updateDisplay();
    this.closeModal();
    const animalName = this.getAnimalName(animalType) || '動物';
    const cost = this.selectedFood ? this.selectedFood.cost : 0;
    this.showNotification(`成功餵食${animalName}！消耗了${cost}研究點數`);
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
    if (type && this.animals[type] && this.animals[type].name) {
      return this.animals[type].name;
    }
    return '動物';
  }

  buyDecoration(e) {
    const decorationItem = e.currentTarget;
    const decorationType = decorationItem.dataset.decoration;
    const cost = parseInt(decorationItem.dataset.cost);

    if (!window.pointsManager.hasEnoughPoints(cost)) {
      this.showNotification(`研究點數不足！需要${cost}點數`, 'error');
      return;
    }

    window.pointsManager.subtractPoints(cost);
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
      window.pointsManager.updateDisplay();
    }

    // 更新動物狀態條
    Object.keys(this.animals).forEach(animalType => {
      const animal = this.animals[animalType];
      const slot = document.querySelector(`[data-animal="${animalType}"]`);
      
      if (slot) {
        const hungerBar = slot.querySelector('.hunger-fill');
        const happinessBar = slot.querySelector('.happiness-fill');
        
        if (hungerBar) hungerBar.style.width = animal.hunger + '%';
        if (happinessBar) happinessBar.style.width = animal.happiness + '%';
      }
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
    
    const isCenterMessage = message.includes('點擊實驗室環境來放置裝飾') || 
                           message.includes('裝飾放置成功') || 
                           message.includes('研究點數不足') ||
                           message.includes('成功餵食') ||
                           message.includes('還沒有收集到任何動物');
    
    notification.style.cssText = `
      position: fixed;
      ${isCenterMessage ? 'top: 50%; left: 50%; transform: translate(-50%, -50%);' : 'top: 20px; right: 20px;'}
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      animation: ${isCenterMessage ? 'fadeIn' : 'slideIn'} 0.5s ease-out;
      background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
      ${isCenterMessage ? 'font-size: 1.2em; box-shadow: 0 4px 12px rgba(0,0,0,0.3);' : ''}
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