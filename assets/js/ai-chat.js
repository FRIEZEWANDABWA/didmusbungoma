// AI Chat Assistant
class AIChatAssistant {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.knowledgeBase = {
            greetings: [
                "Hello! I'm here to help you learn about Didmus Barasa's vision for Bungoma County. What would you like to know?",
                "Welcome! Ask me anything about our development agenda, policies, or how to get involved in the campaign.",
                "Hi there! I can help you navigate the website and answer questions about our plans for Bungoma County."
            ],
            vision: {
                keywords: ['vision', 'plan', 'agenda', 'goals', 'future'],
                response: "Didmus Barasa's vision centers on five key pillars: Digital Infrastructure Revolution, Youth Economic Empowerment, Agricultural Transformation, Healthcare Excellence, and Infrastructure Development. Each pillar is designed to transform Bungoma County into a modern, prosperous region."
            },
            digital: {
                keywords: ['digital', 'internet', 'wifi', 'technology', 'connectivity'],
                response: "Our Digital Infrastructure Revolution includes county-wide fiber optic networks, free WiFi in 500+ public locations, mobile learning vans, and smart county services. We're connecting every ward to global opportunities."
            },
            youth: {
                keywords: ['youth', 'jobs', 'employment', 'skills', 'training', 'boda'],
                response: "Youth empowerment includes 100 digital skills hubs, boda boda empowerment programs, small business support, and a KSh 2B innovation fund. We're creating 25,000 new jobs for young people."
            },
            agriculture: {
                keywords: ['farming', 'agriculture', 'crops', 'soya', 'farmers'],
                response: "Agricultural transformation focuses on smart farming technology, high-value crops like soya beans and avocados, agri-processing facilities, and digital market platforms that eliminate middlemen and increase farmer incomes by 300%."
            },
            healthcare: {
                keywords: ['health', 'hospital', 'medical', 'insurance', 'treatment'],
                response: "Healthcare excellence includes modernizing all health facilities, telemedicine services, training 1,000+ community health workers, and affordable county-based insurance covering every family."
            },
            infrastructure: {
                keywords: ['roads', 'electricity', 'water', 'infrastructure', 'development'],
                response: "Infrastructure development includes 2,000km of upgraded roads, 95% electricity coverage through renewable energy, 100% clean water access, and smart urban planning for sustainable growth."
            },
            volunteer: {
                keywords: ['volunteer', 'help', 'join', 'support', 'involved'],
                response: "You can get involved by volunteering for campaign activities, joining our youth programs, supporting local initiatives, or spreading the word about our vision. Visit our contact page to sign up!"
            },
            contact: {
                keywords: ['contact', 'reach', 'phone', 'email', 'office'],
                response: "You can reach us at +254 700 000 000, email info@didmusbarasa.com, or visit our office in Kimilili, Bungoma County. We're always ready to connect with supporters!"
            }
        };
        
        this.init();
    }
    
    init() {
        this.createChatInterface();
        this.bindEvents();
        this.showInitialPopup();
    }
    
    createChatInterface() {
        const chatHTML = `
            <div class="ai-chat" id="aiChat">
                <div class="chat-toggle" id="chatToggle">
                    <i class="fas fa-comments"></i>
                    <span class="chat-badge">Ask Didmus</span>
                    <div class="chat-notification" id="chatNotification">1</div>
                </div>
                
                <div class="chat-window" id="chatWindow">
                    <div class="chat-header">
                        <div class="chat-avatar">
                            <img src="assets/images/mini_Cropped barasa.jpg" alt="Didmus Barasa">
                        </div>
                        <div class="chat-info">
                            <h4>Ask Didmus</h4>
                            <span class="chat-status">Online</span>
                        </div>
                        <button class="chat-close" id="chatClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <div class="message bot-message">
                            <div class="message-avatar">
                                <img src="assets/images/mini_Cropped barasa.jpg" alt="Didmus">
                            </div>
                            <div class="message-content">
                                <p>${this.getRandomGreeting()}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input">
                        <div class="input-group">
                            <input type="text" placeholder="Type your message..." id="chatInput">
                            <button class="voice-input" id="voiceInput">
                                <i class="fas fa-microphone"></i>
                            </button>
                            <button class="send-message" id="sendMessage">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="quick-questions">
                            <button class="quick-question" data-question="What is your vision for Bungoma?">Vision for Bungoma</button>
                            <button class="quick-question" data-question="How can I volunteer?">How to Volunteer</button>
                            <button class="quick-question" data-question="Tell me about youth programs">Youth Programs</button>
                            <button class="quick-question" data-question="What about agriculture plans?">Agriculture Plans</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }
    
    bindEvents() {
        const chatToggle = document.getElementById('chatToggle');
        const chatClose = document.getElementById('chatClose');
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendMessage');
        const voiceButton = document.getElementById('voiceInput');
        const quickQuestions = document.querySelectorAll('.quick-question');
        
        chatToggle.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.closeChat());
        sendButton.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        voiceButton.addEventListener('click', () => this.startVoiceInput());
        
        quickQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.sendUserMessage(question);
            });
        });
    }
    
    showInitialPopup() {
        // Show chat immediately when page loads
        setTimeout(() => {
            if (!this.isOpen) {
                this.toggleChat();
                // Auto-minimize after 4 seconds
                setTimeout(() => {
                    if (this.isOpen) {
                        this.closeChat();
                        // Show notification badge
                        const notification = document.getElementById('chatNotification');
                        if (notification) {
                            notification.style.display = 'flex';
                            notification.textContent = '!';
                        }
                    }
                }, 4000);
            }
        }, 1000);
    }
    
    toggleChat() {
        const chatWindow = document.getElementById('chatWindow');
        const notification = document.getElementById('chatNotification');
        
        this.isOpen = !this.isOpen;
        chatWindow.style.display = this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen) {
            notification.style.display = 'none';
            chatWindow.style.animation = 'slideUp 0.3s ease';
        }
    }
    
    closeChat() {
        const chatWindow = document.getElementById('chatWindow');
        this.isOpen = false;
        chatWindow.style.display = 'none';
    }
    
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            this.sendUserMessage(message);
            input.value = '';
        }
    }
    
    sendUserMessage(message) {
        this.addMessage(message, 'user');
        
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000);
    }
    
    addMessage(content, type) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageHTML = `
            <div class="message ${type}-message">
                ${type === 'bot' ? `
                    <div class="message-avatar">
                        <img src="assets/images/mini_Cropped barasa.jpg" alt="Didmus">
                    </div>
                ` : ''}
                <div class="message-content">
                    <p>${content}</p>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check each knowledge category
        for (const [category, data] of Object.entries(this.knowledgeBase)) {
            if (category === 'greetings') continue;
            
            if (data.keywords && data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return data.response;
            }
        }
        
        // Default responses for common queries
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return this.getRandomGreeting();
        }
        
        if (lowerMessage.includes('thank')) {
            return "You're welcome! Is there anything else you'd like to know about our plans for Bungoma County?";
        }
        
        // Default fallback
        return "That's a great question! For detailed information, please explore our website sections or contact us directly. You can also ask me about our vision, youth programs, agriculture plans, healthcare initiatives, or infrastructure development.";
    }
    
    getRandomGreeting() {
        return this.knowledgeBase.greetings[Math.floor(Math.random() * this.knowledgeBase.greetings.length)];
    }
    
    startVoiceInput() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onstart = () => {
                document.getElementById('voiceInput').innerHTML = '<i class="fas fa-stop"></i>';
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chatInput').value = transcript;
                this.sendUserMessage(transcript);
            };
            
            recognition.onend = () => {
                document.getElementById('voiceInput').innerHTML = '<i class="fas fa-microphone"></i>';
            };
            
            recognition.start();
        } else {
            alert('Voice input is not supported in your browser.');
        }
    }
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIChatAssistant();
});

// Chat CSS Styles
const chatCSS = `
.ai-chat {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    font-family: 'Inter', sans-serif;
}

.chat-toggle {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 15px 20px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    position: relative;
}

.chat-toggle:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(37, 99, 235, 0.4);
}

.chat-notification {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
}

.chat-window {
    position: absolute;
    bottom: 70px;
    right: 0;
    width: 350px;
    height: 500px;
    background: var(--bg-secondary);
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    display: none;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-color);
}

@media (max-width: 768px) {
    .ai-chat {
        bottom: 15px;
        right: 15px;
    }
    
    .chat-toggle {
        padding: 12px 16px;
        font-size: 0.9rem;
    }
    
    .chat-badge {
        font-size: 0.8rem;
    }
    
    .chat-window {
        width: calc(100vw - 30px);
        height: 400px;
        bottom: 60px;
        right: -15px;
        border-radius: 10px;
    }
    
    .chat-messages {
        padding: 10px;
    }
    
    .message-content {
        font-size: 0.9rem;
        padding: 8px 12px;
    }
    
    .quick-questions {
        gap: 3px;
    }
    
    .quick-question {
        font-size: 11px;
        padding: 4px 8px;
    }
}

.chat-header {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.chat-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.chat-info h4 {
    margin: 0;
    font-size: 16px;
}

.chat-status {
    font-size: 12px;
    opacity: 0.8;
}

.chat-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    margin-left: auto;
    padding: 5px;
}

.chat-messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.message {
    display: flex;
    gap: 10px;
    align-items: flex-start;
}

.user-message {
    flex-direction: row-reverse;
}

.message-avatar img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
}

.message-content {
    background: var(--bg-card);
    padding: 10px 15px;
    border-radius: 15px;
    max-width: 80%;
}

.user-message .message-content {
    background: #2563eb;
    color: white;
}

.chat-input {
    padding: 15px;
    border-top: 1px solid var(--border-color);
}

.input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.input-group input {
    flex: 1;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 20px;
    background: var(--bg-card);
    color: var(--text-primary);
}

.voice-input, .send-message {
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quick-questions {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.quick-question {
    background: var(--bg-card);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    border-radius: 15px;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.quick-question:hover {
    background: #2563eb;
    color: white;
}

@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}


`;

// Add chat CSS to document
const chatStyle = document.createElement('style');
chatStyle.textContent = chatCSS;
document.head.appendChild(chatStyle);