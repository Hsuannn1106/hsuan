// 簡化版AI助手系統
class SimpleAIHelper {
  constructor() {
    this.responses = {
      '遊戲': ['這個遊戲真的很有趣呢！你最喜歡哪個部分？🎮', '遊戲可以幫助我們學習新知識，你學到了什麼呢？✨'],
      '動物': ['動物世界真的很奇妙！每種動物都有自己的特色，你想了解哪種動物呢？🐾', '動物們都有自己的生活方式，就像我們人類一樣呢！🦋'],
      '學習': ['學習是一件很棒的事情！你今天學到了什麼新知識呢？📚', '每天學一點新東西，就會變得更聰明喔！🌟'],
      '困難': ['遇到困難是很正常的，重要的是不要放棄！你一定可以的！💪', '困難就像爬山一樣，雖然辛苦但到達山頂時會很有成就感！⛰️'],
      '不會': ['沒關係，每個人都有不會的東西，慢慢學就好了！我相信你！🌈', '不會沒關係，問問題是很棒的學習方式呢！👍'],
      '害怕': ['有點害怕是正常的，但是勇敢面對就會發現其實沒那麼可怕！🦁', '害怕的時候可以深呼吸，然後想想開心的事情！🌸'],
      '為什麼': ['這是個很好的問題！好奇心是學習的開始呢！🤔', '問「為什麼」表示你在思考，這很棒！讓我們一起探索答案吧！🔍'],
      '怎麼': ['想知道怎麼做是很好的學習態度！我們可以一步一步來！👣', '方法有很多種，重要的是找到適合自己的方式！🎯'],
      '開心': ['看到你這麼開心，我也很開心呢！😊', '開心的時候要記住這種感覺，它會給你力量！✨'],
      '難過': ['難過的時候沒關係，每個人都會有這種時候。記住，明天會更好！🌅', '難過是正常的情緒，但不要忘記你有多棒！🌟'],
      'default': [
        '這是個很有趣的問題呢！你能告訴我更多嗎？🤗',
        '我很喜歡和你聊天！還有什麼想問的嗎？💭',
        '你的想法很棒！繼續保持好奇心喔！🌟',
        '每個問題都很重要，謝謝你願意和我分享！😊',
        '你真的很聰明！這個問題讓我也學到了新東西！📚'
      ]
    };
    
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    const aiHelperButton = document.getElementById('aiHelperButton');
    const aiChatOverlay = document.getElementById('aiChatOverlay');
    const aiChatClose = document.getElementById('aiChatClose');
    const aiChatSend = document.getElementById('aiChatSend');
    const aiChatInput = document.getElementById('aiChatInput');
    
    if (aiHelperButton) {
      aiHelperButton.addEventListener('click', () => this.openChat());
    }
    
    if (aiChatClose) {
      aiChatClose.addEventListener('click', () => this.closeChat());
    }
    
    if (aiChatOverlay) {
      aiChatOverlay.addEventListener('click', (e) => {
        if (e.target === aiChatOverlay) {
          this.closeChat();
        }
      });
    }
    
    if (aiChatSend) {
      aiChatSend.addEventListener('click', () => this.sendMessage());
    }
    
    if (aiChatInput) {
      aiChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }
  }
  
  openChat() {
    const overlay = document.getElementById('aiChatOverlay');
    if (overlay) {
      overlay.classList.add('active');
      const input = document.getElementById('aiChatInput');
      if (input) {
        setTimeout(() => input.focus(), 300);
      }
    }
  }
  
  closeChat() {
    const overlay = document.getElementById('aiChatOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }
  
  sendMessage() {
    const input = document.getElementById('aiChatInput');
    const sendButton = document.getElementById('aiChatSend');
    
    if (!input || !input.value.trim()) return;
    
    const message = input.value.trim();
    input.value = '';
    
    this.addUserMessage(message);
    
    if (sendButton) {
      sendButton.disabled = true;
    }
    
    this.showTypingIndicator();
    
    setTimeout(() => {
      this.hideTypingIndicator();
      this.addAIResponse(message);
      
      if (sendButton) {
        sendButton.disabled = false;
      }
    }, 1000 + Math.random() * 1000);
  }
  
  addUserMessage(message) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'user-message';
    messageElement.innerHTML = `
      <div class="message-avatar">👦</div>
      <div class="message-content">
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
  }
  
  addAIResponse(userMessage) {
    const response = this.generateResponse(userMessage);
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'ai-message';
    messageElement.innerHTML = `
      <div class="message-avatar">👩🏫</div>
      <div class="message-content">
        <p>${response}</p>
      </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
  }
  
  generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    for (const [keyword, responses] of Object.entries(this.responses)) {
      if (keyword !== 'default' && message.includes(keyword)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    const defaultResponses = this.responses.default;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
  
  showTypingIndicator() {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    const typingElement = document.createElement('div');
    typingElement.className = 'ai-message typing-message';
    typingElement.innerHTML = `
      <div class="message-avatar">👩🏫</div>
      <div class="message-content typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    messagesContainer.appendChild(typingElement);
    this.scrollToBottom();
  }
  
  hideTypingIndicator() {
    const typingMessage = document.querySelector('.typing-message');
    if (typingMessage) {
      typingMessage.remove();
    }
  }
  
  scrollToBottom() {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// 初始化AI助手
document.addEventListener('DOMContentLoaded', () => {
  new SimpleAIHelper();
});