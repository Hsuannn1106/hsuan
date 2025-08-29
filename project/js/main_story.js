    // 章節點擊展開/收起
    document.querySelectorAll('.chapter-title').forEach(title => {
      title.addEventListener('click', function() {
        const content = this.nextElementSibling;
        content.classList.toggle('active');
      });
    });