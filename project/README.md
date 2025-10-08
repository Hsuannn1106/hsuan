# 動物研究院 - AI學習助手

一個結合遊戲化學習和AI助手的教育平台，專為兒童設計的動物知識學習系統。

## 🌟 功能特色

### 🎮 遊戲化學習
- 互動式動物知識遊戲
- 進度追蹤系統
- 成就獎勵機制
- 探索地圖導航

### 🤖 AI學習助手
- **Demo AI助手** - 無需API Key即可體驗
- **ChatGPT整合** - OpenAI API支援
- **Gemini整合** - Google AI API支援
- **Claude整合** - Anthropic API支援
- **自定義API** - 支援其他AI服務

## 🚀 GitHub Pages部署

### 部署步驟
1. Fork此專案到你的GitHub帳號
2. 進入專案設定 > Pages
3. 選擇 `main` 分支作為來源
4. 等待部署完成

### 線上使用
- 直接訪問: `https://yourusername.github.io/animal-research-institute`
- 點擊地圖右上角的「AI助手」按鈕
- 選擇「Demo AI助手」立即體驗，或設定API Key使用完整功能

## 🔧 本地開發

### 環境需求
- 現代瀏覽器 (Chrome, Firefox, Safari, Edge)
- 本地HTTP服務器 (可選，用於避免CORS問題)

### 安裝步驟
```bash
git clone https://github.com/yourusername/animal-research-institute.git
cd animal-research-institute
# 使用Python啟動本地服務器
python -m http.server 8000
# 或使用Node.js
npx serve .
```

## 🔑 API設定

### 支援的AI服務
1. **OpenAI ChatGPT**
   - 需要OpenAI API Key
   - 註冊: https://platform.openai.com

2. **Google Gemini**
   - 需要Google AI API Key
   - 註冊: https://makersuite.google.com

3. **Anthropic Claude**
   - 需要Anthropic API Key
   - 註冊: https://console.anthropic.com

### 設定方式
1. 點擊「自定義API」
2. 選擇API類型
3. 輸入你的API Key
4. 保存設定即可使用

## 📁 專案結構
```
project/
├── html/           # HTML頁面
│   ├── map.html           # 探索地圖
│   ├── ai-tools.html      # AI助手頁面
│   └── ...
├── css/            # 樣式文件
│   ├── ai-tools-page.css  # AI助手樣式
│   └── ...
├── js/             # JavaScript文件
│   ├── ai-api-github.js   # GitHub Pages適用的AI API
│   └── ...
└── README.md       # 專案說明
```

## 🛡️ 安全性說明

### GitHub Pages限制
- 由於CORS政策，某些API可能無法直接調用
- 使用代理服務器解決跨域問題
- API Key僅存儲在本地瀏覽器中

### 隱私保護
- API Key不會上傳到服務器
- 對話記錄僅存在於當前會話
- 無用戶數據收集

## 🎯 使用建議

### 適合對象
- 6-12歲兒童
- 家長和教育工作者
- 對AI教育感興趣的開發者

### 最佳實踐
1. 首次使用建議先體驗Demo版本
2. 設定API Key前請閱讀相關服務條款
3. 監督兒童使用，確保安全的學習環境

## 🤝 貢獻指南

歡迎提交Issue和Pull Request！

### 開發規範
- 使用語義化的commit訊息
- 保持代碼簡潔和註釋清晰
- 測試新功能的跨瀏覽器兼容性

## 📄 授權條款

MIT License - 詳見 [LICENSE](LICENSE) 文件

## 🙋‍♂️ 支援

如有問題或建議，請：
1. 提交GitHub Issue
2. 查看專案Wiki
3. 聯繫專案維護者

---

**注意**: 使用AI API服務可能產生費用，請查看各服務商的定價政策。