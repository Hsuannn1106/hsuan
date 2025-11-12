// 測試用：添加一些動物到localStorage
const testAnimals = ['tiger', 'elephant', 'fox', 'rabbit', 'penguin'];
localStorage.setItem('collectedAnimals', JSON.stringify(testAnimals));
console.log('已添加測試動物:', testAnimals);