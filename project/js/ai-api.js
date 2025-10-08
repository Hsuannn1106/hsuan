// AI API連接系統
class AIAPISystem {
  constructor() {
    this.currentAI = null;
    this.apiConfigs = this.loadApiConfigs();
    this.init();
  }
  
  init() {
    this.loadApiConfigs();
  }
  
  loadApiConfigs() {
    const saved = localStorage.getItem('ai_api_configs');
    return saved ? JSON.parse(saved) : {};
  }
  
  saveApiConfigs() {
    localStorage.setItem('ai_api_configs', JSON.stringify(this.apiConfigs));
  }
}

const aiSystem = new AIAPISystem();

// 開啟AI聊天
function openAIChat(aiType) {
  if (aiType === 'custom') {
    openApiConfig();
    return;
  }
  
  const config = aiSystem.apiConfigs[aiType];
  if (!config || !config.apiKey) {
    alert('請先設定API Key');
    openApiConfig();
    return;
  }
  
  aiSystem.currentAI = aiType;
  document.getElementById('aiChatTitle').textContent = getAIName(aiType);
  document.getElementById('aiChatOverlay').style.display = 'flex';
  document.getElementById('aiChatInput').focus();
}

// 關閉AI聊天
function closeAIChat() {
  document.getElementById('aiChatOverlay').style.display = 'none';
  document.getElementById('aiChatMessages').innerHTML = '';
}

// 開啟API設定
function openApiConfig() {
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
  alert('API設定已保存');
}

// 發送訊息
async function sendMessage() {
  const input = document.getElementById('aiChatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  input.value = '';
  addMessage('user', message);
  
  try {
    const response = await callAIAPI(aiSystem.currentAI, message);
    addMessage('ai', response);
  } catch (error) {
    addMessage('ai', '抱歉，發生錯誤：' + error.message);
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

// 調用AI API
async function callAIAPI(aiType, message) {
  const config = aiSystem.apiConfigs[aiType];
  
  switch (aiType) {
    case 'chatgpt':
      return await callOpenAI(config, message);
    case 'gemini':
      return await callGemini(config, message);
    case 'claude':
      return await callClaude(config, message);
    default:
      throw new Error('不支援的AI類型');
  }
}

// OpenAI API調用
async function callOpenAI(config, message) {
  const response = await fetch(config.apiUrl, {
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

// Gemini API調用
async function callGemini(config, message) {
  const response = await fetch(`${config.apiUrl}?key=${config.apiKey}`, {
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

// Claude API調用
async function callClaude(config, message) {
  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 150,
      messages: [{ role: 'user', content: message }]
    })
  });
  
  const data = await response.json();
  return data.content[0].text;
}

// 獲取AI名稱
function getAIName(aiType) {
  const names = {
    'chatgpt': 'ChatGPT',
    'gemini': 'Gemini',
    'claude': 'Claude'
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