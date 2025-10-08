// 頁面生成器 - 用於快速創建使用共用組件的頁面
class PageGenerator {
  // 生成遊戲頁面HTML
  static generateGamePage(config) {
    const {
      gameTitle = '遊戲',
      gameClass = 'game',
      gameCss = 'game.css',
      gameJs = 'game.js',
      levelTitle = '關卡標題',
      levelDescription = '關卡描述',
      gameContent = '<div>遊戲內容</div>',
      customModals = ''
    } = config;

    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>${gameTitle} - 動物研究院</title>
  ${SharedComponents.getCommonStyles()}
  <link rel="stylesheet" href="../css/${gameCss}">
</head>
<body>
  <div class="hp-container">
    <!-- 頂部導航區域 -->
    <div id="top-area-container"></div>
    
    <!-- 主要遊戲內容區域 -->
    <div class="${gameClass}-main-content">
      <div class="${gameClass}-center-content">
        <!-- 關卡標題區域 -->
        <div class="${gameClass}-level-title">
          <h1>${levelTitle}</h1>
          <p>${levelDescription}</p>
        </div>
        
        <!-- 遊戲內容區域 -->
        <div id="game-content-container">
          ${gameContent}
        </div>
      </div>
    </div>
  </div>
  
  <!-- 彈出視窗容器 -->
  <div id="modals-container"></div>
  ${customModals}
  
  <!-- JavaScript 腳本引入 -->
  <script src="../js/shared-components.js"></script>
  ${SharedComponents.getCommonScripts()}
  <script src="../js/${gameJs}"></script>
  
  <script>
    // 初始化共用組件
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('top-area-container').innerHTML = SharedComponents.createTopArea();
      document.getElementById('modals-container').innerHTML = 
        SharedComponents.createCorrectModal() +
        SharedComponents.createIncorrectModal() +
        SharedComponents.createCompleteModal();
    });
  </script>
</body>
</html>`;
  }

  // 生成一般頁面HTML
  static generateRegularPage(config) {
    const {
      pageTitle = '頁面',
      pageCss = 'page.css',
      pageJs = 'page.js',
      activeMenuItem = '',
      showLeftMenu = true,
      showBackButton = false,
      backUrl = 'map.html',
      pageContent = '<div>頁面內容</div>'
    } = config;

    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>${pageTitle} - 動物研究院</title>
  ${SharedComponents.getCommonStyles()}
  <link rel="stylesheet" href="../css/${pageCss}">
</head>
<body>
  <div class="hp-container">
    <!-- 頂部導航區域 -->
    <div id="top-area-container"></div>
    
    <!-- 主要內容區域 -->
    <div class="hp-main-content">
      ${showLeftMenu ? '<div id="left-menu-container"></div>' : ''}
      
      <!-- 中心內容區 -->
      <div class="center-content">
        ${pageContent}
      </div>
    </div>
  </div>
  
  <!-- JavaScript 腳本引入 -->
  <script src="../js/shared-components.js"></script>
  <script src="../js/menu_click.js"></script>
  ${SharedComponents.getCommonScripts()}
  <script src="../js/${pageJs}"></script>
  
  <script>
    // 初始化共用組件
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('top-area-container').innerHTML = SharedComponents.createTopArea(${showBackButton}, '${backUrl}');
      ${showLeftMenu ? `document.getElementById('left-menu-container').innerHTML = SharedComponents.createLeftMenu('${activeMenuItem}');` : ''}
    });
  </script>
</body>
</html>`;
  }
}

// 使用範例
/*
// 生成遊戲頁面
const gamePageHtml = PageGenerator.generateGamePage({
  gameTitle: '連連看遊戲',
  gameClass: 'g1',
  gameCss: 'game1.css',
  gameJs: 'game1.js',
  levelTitle: '第一關：動物連連看',
  levelDescription: '將動物圖片連接到正確的名稱吧！',
  gameContent: '<div class="matching-game">遊戲內容</div>'
});

// 生成一般頁面
const regularPageHtml = PageGenerator.generateRegularPage({
  pageTitle: '探索地圖',
  pageCss: 'map.css',
  pageJs: 'map.js',
  activeMenuItem: 'map',
  pageContent: '<div class="zones">地圖內容</div>'
});
*/