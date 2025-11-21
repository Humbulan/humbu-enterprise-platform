import React, { useState, useRef, useEffect } from 'react';

const SmartAIChat = ({ businessData }) => {
    const [messages, setMessages] = useState([
        { 
            id: 1,
            type: 'ai', 
            content: "Hello! I'm your AI Business Advisor. I can see your current metrics and help you make data-driven decisions.",
            timestamp: new Date().toLocaleTimeString()
        }
    ]);
    const [currentInput, setCurrentInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    
    const messagesEndRef = useRef(null);

    // Quick action templates
    const quickTemplates = [
        { label: "📊 Analyze Revenue", prompt: "Analyze my current revenue trends and suggest growth opportunities based on my data." },
        { label: "👥 Customer Strategy", prompt: "Suggest customer retention strategies based on my current satisfaction metrics." },
        { label: "🚀 Growth Ideas", prompt: "Provide 3 actionable growth strategies for my business type." },
        { label: "📈 Metric Insights", prompt: "What are the most important metrics I should focus on right now and why?" }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    const handleTemplateClick = (prompt) => {
        setCurrentInput(prompt);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!currentInput.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: currentInput,
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, userMessage]);
        
        const userQuestion = currentInput;
        setCurrentInput('');
        setIsThinking(true);

        // Add thinking message
        setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'ai',
            content: "Analyzing your business data...",
            isThinking: true,
            timestamp: new Date().toLocaleTimeString()
        }]);

        try {
            // Enhanced payload with business context
            const payload = {
                message: userQuestion,
                business_context: {
                    revenue: businessData.revenue,
                    customers: businessData.customers,
                    satisfaction: businessData.satisfaction,
                    active_today: businessData.active_today
                }
            };

            const response = await fetch('http://192.168.8.26:8001/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            // Replace thinking with actual response
            setMessages(prev => {
                const withoutThinking = prev.filter(msg => !msg.isThinking);
                return [...withoutThinking, {
                    id: Date.now() + 2,
                    type: 'ai',
                    content: data.response,
                    confidence: data.confidence,
                    source: data.source,
                    timestamp: new Date().toLocaleTimeString(),
                    canSummarize: data.response.length > 500
                }];
            });

        } catch (error) {
            setMessages(prev => {
                const withoutThinking = prev.filter(msg => !msg.isThinking);
                return [...withoutThinking, {
                    id: Date.now() + 2,
                    type: 'error',
                    content: `Error: ${error.message}`,
                    timestamp: new Date().toLocaleTimeString()
                }];
            });
        } finally {
            setIsThinking(false);
        }
    };

    const handleSummarize = async (messageId) => {
        // Implementation for AI-powered summarization
        console.log("Summarizing message:", messageId);
        // This would call a summarization endpoint
    };

    return (
        <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2>AI Business Advisor</h2>
            
            {/* Quick Templates */}
            <div style={{ marginBottom: '15px' }}>
                <h4>Quick Actions:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                    {quickTemplates.map((template, index) => (
                        <button
                            key={index}
                            onClick={() => handleTemplateClick(template.prompt)}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: '#e9ecef',
                                border: '1px solid #dee2e6',
                                borderRadius: '20px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {template.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Messages */}
            <div style={{ 
                flex: 1,
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '10px',
                backgroundColor: '#fafafa',
                overflowY: 'auto',
                marginBottom: '15px'
            }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{ 
                        marginBottom: '15px',
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: msg.type === 'user' ? '#007bff' : 
                                       msg.type === 'error' ? '#dc3545' : 
                                       msg.isThinking ? '#6c757d' : '#28a745',
                        color: 'white',
                        maxWidth: '85%',
                        marginLeft: msg.type === 'user' ? 'auto' : '0',
                        borderBottomRightRadius: msg.type === 'user' ? '4px' : '12px',
                        borderBottomLeftRadius: msg.type === 'user' ? '12px' : '4px'
                    }}>
                        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
                            <strong>{msg.type === 'user' ? 'You' : msg.type === 'error' ? 'Error' : 'AI Advisor'}</strong>
                            <span style={{ float: 'right' }}>{msg.timestamp}</span>
                        </div>
                        <div>{msg.content}</div>
                        {msg.canSummarize && (
                            <button 
                                onClick={() => handleSummarize(msg.id)}
                                style={{
                                    marginTop: '8px',
                                    padding: '4px 8px',
                                    fontSize: '10px',
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '3px',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                📋 Summarize
                            </button>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="Ask about your business metrics..."
                    disabled={isThinking}
                    style={{ 
                        flex: 1, 
                        padding: '12px', 
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        fontSize: '16px'
                    }}
                />
                <button 
                    type="submit"
                    disabled={isThinking || !currentInput.trim()}
                    style={{ 
                        padding: '12px 24px', 
                        backgroundColor: isThinking ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isThinking ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isThinking ? '🤔' : '➤'}
                </button>
            </form>
        </div>
    );
};

export default SmartAIChat;
