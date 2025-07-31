
        // Mock WebSocket connection for demonstration
        // In a real app, you would connect to an actual WebSocket server
        class MockWebSocket {
            constructor(url) {
                this.url = url;
                this.onmessage = null;
                this.onopen = null;
                this.onclose = null;
                this.readyState = 0;
                
                // Simulate connection
                setTimeout(() => {
                    this.readyState = 1;
                    if (this.onopen) this.onopen({ type: 'open' });
                }, 500);
            }
            
            send(message) {
                console.log('Sending:', message);
                // Simulate server response after a short delay
                setTimeout(() => {
                    if (this.onmessage) {
                        const response = this.getBotResponse(JSON.parse(message).text);
                        this.onmessage({ 
                            data: JSON.stringify({ 
                                text: response,
                                sender: 'bot',
                                time: new Date().toISOString()
                            }) 
                        });
                    }
                }, 300 + Math.random() * 700);
            }
            
            getBotResponse(userMessage) {
                userMessage = userMessage.toLowerCase();
                
                const greetings = ['hi', 'hello', 'hey', 'greetings'];
                const questions = ['how are you', 'how are you doing', 'whats up'];
                const thanks = ['thanks', 'thank you', 'appreciate it'];
                
                if (greetings.some(g => userMessage.includes(g))) {
                    return "Hello there! 👋 How can I help you today?";
                } else if (questions.some(q => userMessage.includes(q))) {
                    return "I'm doing great, thanks for asking! 😊 What about you?";
                } else if (thanks.some(t => userMessage.includes(t))) {
                    return "You're welcome! 😇 Is there anything else I can help with?";
                } else if (userMessage.includes('bye') || userMessage.includes('goodbye')) {
                    return "Goodbye! 👋 Have a wonderful day!";
                } else if (userMessage.includes('help')) {
                    return "I can answer simple questions and chat with you. Try asking how I am or saying hello! 💜";
                } else if (userMessage.includes('purple') || userMessage.includes('violet')) {
                    return "Purple/violet is the best color! 💜 It's associated with creativity and wisdom.";
                } else {
                    const randomResponses = [
                        "Interesting! Tell me more about that. 💭",
                        "I see. What else is on your mind? 🤔",
                        "That's cool! 😎",
                        "Thanks for sharing that with me. 💜",
                        "I'm not sure I understand. Could you rephrase that?",
                        "Let me think about that... 💭",
                        "Violet power! 💜 What else would you like to chat about?"
                    ];
                    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
                }
            }
            
            close() {
                this.readyState = 3;
                if (this.onclose) this.onclose({ type: 'close' });
            }
        }

        new Vue({
            el: '#app',
            data: {
                messages: [],
                newMessage: '',
                socket: null,
                showSymbols: false,
                symbols: [
                    '😀', '😂', '😊', '😍', '🤔',
                    '👍', '👎', '❤️', '💜', '🔥',
                    '🌟', '🎉', '🙏', '🤗', '😎',
                    '🤩', '😢', '😡', '🤯', '💯'
                ]
            },
            mounted() {
                // Connect to WebSocket server
                // In a real app: this.socket = new WebSocket('ws://yourserver.com/chat');
                this.socket = new MockWebSocket('ws://mock');
                
                this.socket.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    this.messages.push(message);
                    this.scrollToBottom();
                };
                
                // Add welcome message
                setTimeout(() => {
                    this.messages.push({
                        text: "Hello! Welcome to Violet Messenger. How can I help you today? 💜",
                        sender: 'bot',
                        time: new Date().toISOString()
                    });
                }, 1000);
            },
            methods: {
                sendMessage() {
                    if (!this.newMessage.trim()) return;
                    
                    const message = {
                        text: this.newMessage,
                        sender: 'user',
                        time: new Date().toISOString()
                    };
                    
                    this.messages.push(message);
                    this.socket.send(JSON.stringify(message));
                    this.newMessage = '';
                    this.showSymbols = false;
                    this.scrollToBottom();
                },
                addSymbol(symbol) {
                    this.newMessage += symbol;
                    this.showSymbols = false;
                },
                scrollToBottom() {
                    this.$nextTick(() => {
                        const container = this.$refs.messages;
                        container.scrollTop = container.scrollHeight;
                    });
                },
                formatTime(isoString) {
                    const date = new Date(isoString);
                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
            },
            beforeDestroy() {
                if (this.socket) {
                    this.socket.close();
                }
            }
        });
    