// 連連看遊戲初始化
let selectedImage = null; //點選的圖片
let selectedName = null;  //點選的名稱
let correctPairs = 0;     //配對數量
const totalPairs = 5;     //配對總數

// 獲取所有動物圖片和名稱元素
const animalImages = document.querySelectorAll('.g1-animal-images .g1-animal-item');
const animalNames = document.querySelectorAll('.g1-animal-names .g1-animal-item');
const connectionLines = document.querySelector('.g1-connection-lines');
const progressValue = document.querySelector('.g1-progress-value');
const progressText = document.querySelector('.g1-progress-text:first-child');
const progressPercent = document.querySelector('.g1-progress-text:last-child');

// 為動物圖片添加點擊事件
animalImages.forEach(image => {
  image.addEventListener('click', function() {
    // 如果這個圖片已經配對成功，則不做任何操作
    if (this.classList.contains('matched')) return;
    
    // 取消之前選中的圖片
    if (selectedImage) {
      selectedImage.classList.remove('selected');
    }
    
    // 選中當前圖片
    this.classList.add('selected');
    selectedImage = this;
    
    // 如果已經選中了名稱，則檢查是否匹配
    if (selectedName) {
      checkMatch();
    }
  });
});

// 為動物名稱添加點擊事件
animalNames.forEach(name => {
  name.addEventListener('click', function() {
    // 如果這個名稱已經配對成功，則不做任何操作
    if (this.classList.contains('matched')) return;
    
    // 取消之前選中的名稱
    if (selectedName) {
      selectedName.classList.remove('selected');
    }
    
    // 選中當前名稱
    this.classList.add('selected');
    selectedName = this;
    
    // 如果已經選中了圖片，則檢查是否匹配
    if (selectedImage) {
      checkMatch();
    }
  });
});

// 檢查是否匹配
function checkMatch() {
  const imageAnimal = selectedImage.dataset.animal;
  const nameAnimal = selectedName.dataset.animal;
  
  if (imageAnimal === nameAnimal) {
    // 匹配成功
    selectedImage.classList.add('matched');
    selectedName.classList.add('matched');
    
    // 繪製連線
    drawLine(selectedImage, selectedName);
    
    // 更新進度
    correctPairs++;
    updateProgress();
    
    // 顯示正確彈窗
    //showModal('correctModal');
    
    // 如果所有配對都完成，顯示完成彈窗
    if (correctPairs === totalPairs) {
      setTimeout(() => {
        showModal('completeModal');
      }, 1000);
    }
  } else {
    // 匹配失敗
    showModal('incorrectModal');
  }
  
  // 重置選擇
  selectedImage.classList.remove('selected');
  selectedName.classList.remove('selected');
  selectedImage = null;
  selectedName = null;
}

//畫連線
function drawLine(image, name) {
  const imageRect = image.getBoundingClientRect();
  const nameRect = name.getBoundingClientRect();
  const containerRect = document.querySelector('.g1-connection-container').getBoundingClientRect();
  
  const x1 = imageRect.right - containerRect.left;
  const y1 = imageRect.top + imageRect.height / 2 - containerRect.top;
  const x2 = nameRect.left - containerRect.left;
  const y2 = nameRect.top + nameRect.height / 2 - containerRect.top;
  
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', '#FF8C00');
  line.setAttribute('stroke-width', '2');
  
  connectionLines.appendChild(line);
}

// 更新進度
function updateProgress() {
  const percent = (correctPairs / totalPairs) * 100;
  progressValue.style.width = `${percent}%`;
  progressText.textContent = `進度：${correctPairs}/${totalPairs}`;
  progressPercent.textContent = `完成度：${percent}%`;
}

// 顯示彈窗
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('show');
  
  const button = modal.querySelector('.modal-button');
  button.addEventListener('click', function() {
    modal.classList.remove('show');
    
    // 如果是完成彈窗，點擊按鈕後返回地圖
    if (modalId === 'completeModal') {
      window.location.href = 'map.html';
    }
  });
}

// 初始化遊戲
function initGame() {
  // 隨機排序動物圖片
  const imagesList = Array.from(animalImages);
  for (let i = imagesList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    imagesList[i].parentNode.insertBefore(imagesList[j], imagesList[i].nextSibling);
    imagesList[i].parentNode.insertBefore(imagesList[i], imagesList[j].nextSibling);
  }

  // 隨機排序動物名稱
  const namesList = Array.from(animalNames);
  for (let i = namesList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    namesList[i].parentNode.insertBefore(namesList[j], namesList[i].nextSibling);
    namesList[i].parentNode.insertBefore(namesList[i], namesList[j].nextSibling);
  }

  
}

// 初始化遊戲
initGame();


