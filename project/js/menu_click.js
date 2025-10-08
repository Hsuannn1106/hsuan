const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach((item, index) => {
  item.addEventListener('click', function() {
    if (!this.classList.contains('active')) {
      switch(index) {
        case 0:
          window.location.href = 'main_story.html';
          break;
        case 1:
          window.location.href = 'animal_collect.html';
          break;
        case 2:
          window.location.href = 'map.html';
          break;
        case 3:
          window.location.href = 'laboratory.html';
          break;
        case 4:
          window.location.href = 'achievement.html';
          break;
        case 5:
          window.location.href = 'inventory.html';
          break;
      }
    }
  });
});