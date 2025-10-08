// GitHub Pages適用的AI API系統
class GitHubAISystem {
  constructor() {
    this.currentAI = null;
    this.apiConfigs = this.loadApiConfigs();
    this.proxyUrl = 'https://api.allorigins.win/raw?url=';
  }
  
  loadApiConfigs() {
    const saved = localStorage.getItem('ai_api_configs');
    return saved ? JSON.parse(saved) : {};
  }
  
  saveApiConfigs() {
    localStorage.setItem('ai_api_configs', JSON.stringify(this.apiConfigs));
  }
}

const aiSystem = new GitHubAISystem();

// 開啟AI聊天
function openAIChat(aiType) {
  if (aiType === 'custom') {
    openApiConfig();
    return;
  }
  
  // 對於GitHub Pages，使用免費API或提示用戶
  if (aiType === 'demo') {
    aiSystem.currentAI = 'demo';
    document.getElementById('aiChatTitle').textContent = 'Demo AI助手';
    document.getElementById('aiChatOverlay').style.display = 'flex';
    addMessage('ai', '你好！我是演示版AI助手。由於GitHub Pages的限制，這裡只能展示基本功能。要使用完整功能，請在本地環境中設定API Key。');
    return;
  }
  
  const config = aiSystem.apiConfigs[aiType];
  if (!config || !config.apiKey) {
    showApiWarning(aiType);
    return;
  }
  
  aiSystem.currentAI = aiType;
  document.getElementById('aiChatTitle').textContent = getAIName(aiType);
  document.getElementById('aiChatOverlay').style.display = 'flex';
  document.getElementById('aiChatInput').focus();
}

// 顯示API警告
function showApiWarning(aiType) {
  const warning = `
    <div class="api-warning">
      <h3>⚠️ API設定需要</h3>
      <p>由於GitHub Pages的安全限制，需要您自己的API Key才能使用${getAIName(aiType)}。</p>
      <p>您可以：</p>
      <ul>
        <li>點擊"自定義API"設定您的API Key</li>
        <li>或使用"Demo AI助手"體驗基本功能</li>
      </ul>
      <button onclick="openApiConfig()">設定API</button>
      <button onclick="openAIChat('demo')">使用Demo</button>
      <button onclick="closeApiWarning()">關閉</button>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', `
    <div class="warning-overlay" id="warningOverlay">
      <div class="warning-container">${warning}</div>
    </div>
  `);
}

// 關閉API警告
function closeApiWarning() {
  const warning = document.getElementById('warningOverlay');
  if (warning) warning.remove();
}

// 關閉AI聊天
function closeAIChat() {
  document.getElementById('aiChatOverlay').style.display = 'none';
  document.getElementById('aiChatMessages').innerHTML = '';
}

// 開啟API設定
function openApiConfig() {
  closeApiWarning();
  document.getElementById('apiConfigOverlay').style.display = 'flex';
}

// 關閉API設定
function closeApiConfig() {
  document.getElementById('apiConfigOverlay').style.display = 'none';
}

// 保存API設定
function saveApiConfig() {
  const apiType = document.getElementById('apiType').value;
  const apiKey = document.getElementById('apiKey').value;
  const apiUrl = document.getElementById('apiUrl').value;
  
  if (!apiKey) {
    alert('請輸入API Key');
    return;
  }
  
  aiSystem.apiConfigs[apiType] = {
    apiKey: apiKey,
    apiUrl: apiUrl || getDefaultApiUrl(apiType)
  };
  
  aiSystem.saveApiConfigs();
  closeApiConfig();
  alert('API設定已保存！現在可以使用' + getAIName(apiType) + '了');
}

// 發送訊息
async function sendMessage() {
  const input = document.getElementById('aiChatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  input.value = '';
  addMessage('user', message);
  
  if (aiSystem.currentAI === 'demo') {
    // Demo回應
    setTimeout(() => {
      const responses = [
        '這是一個很好的問題！在實際環境中，AI會根據您的問題提供詳細回答。',
        '感謝您的提問！完整版AI助手會提供更準確和有用的回應。',
        '這個功能在設定API Key後會正常工作。目前這只是演示版本。',
        '您的問題很有趣！真正的AI助手會給出更深入的分析。'
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMessage('ai', response);
    }, 1000);
    return;
  }
  
  try {
    const response = await callAIAPI(aiSystem.currentAI, message);
    addMessage('ai', response);
  } catch (error) {
    addMessage('ai', '抱歉，發生錯誤：' + error.message + '\n\n提示：GitHub Pages可能有CORS限制，建議在本地環境使用。');
  }
}

// 處理Enter鍵
function handleEnter(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// 添加訊息到聊天
function addMessage(type, content) {
  const messagesContainer = document.getElementById('aiChatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;
  
  const avatar = type === 'user' ? '👤' : '🤖';
  messageDiv.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">${content}</div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 調用AI API（使用代理解決CORS）
async function callAIAPI(aiType, message) {
  const config = aiSystem.apiConfigs[aiType];
  
  try {
    switch (aiType) {
      case 'chatgpt':
        return await callOpenAIWithProxy(config, message);
      case 'gemini':
        return await callGeminiWithProxy(config, message);
      default:
        throw new Error('此API在GitHub Pages上可能無法正常工作');
    }
  } catch (error) {
    throw new Error('API調用失敗，請檢查網路連接和API Key');
  }
}

// 使用代理調用OpenAI
async function callOpenAIWithProxy(config, message) {
  const apiUrl = encodeURIComponent(config.apiUrl);
  const proxyUrl = `https://api.allorigins.win/raw?url=${apiUrl}`;
  
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      max_tokens: 150
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// 使用代理調用Gemini
async function callGeminiWithProxy(config, message) {
  const apiUrl = encodeURIComponent(`${config.apiUrl}?key=${config.apiKey}`);
  const proxyUrl = `https://api.allorigins.win/raw?url=${apiUrl}`;
  
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }]
    })
  });
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// 獲取AI名稱
function getAIName(aiType) {
  const names = {
    'chatgpt': 'ChatGPT',
    'gemini': 'Gemini',
    'claude': 'Claude',
    'demo': 'Demo AI助手'
  };
  return names[aiType] || 'AI助手';
}

// 獲取預設API URL
function getDefaultApiUrl(apiType) {
  const urls = {
    'openai': 'https://api.openai.com/v1/chat/completions',
    'gemini': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    'claude': 'https://api.anthropic.com/v1/messages'
  };
  return urls[apiType] || '';
}