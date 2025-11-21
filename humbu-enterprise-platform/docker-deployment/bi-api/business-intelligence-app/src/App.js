import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://192.168.8.26:8001';

// Enhanced Dashboard Component
const EnhancedDashboard = ({ currentData }) => {
    const [timeRange, setTimeRange] = useState('30d');
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const newAlerts = [];
        if (currentData.satisfaction < 4.5) {
            newAlerts.push({ type: 'warning', message: 'Customer satisfaction below target (4.5)' });
        }
        if (currentData.transactions_today > 200) {
            newAlerts.push({ type: 'info', message: 'High transaction volume today' });
        }
        setAlerts(newAlerts);
    }, [currentData]);

    const MetricCard = ({ title, value, trend, alert }) => (
        <div style={{
            padding: '15px',
            backgroundColor: alert ? '#fff3cd' : '#f8f9fa',
            borderRadius: '10px',
            border: alert ? '2px solid #ffc107' : '1px solid #dee2e6',
            marginBottom: '15px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#333' }}>{title}</h4>
                {alert && <span style={{ color: '#856404' }}>⚠️</span>}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                {typeof value === 'number' ? (title.includes('Revenue') ? `$${value}` : value) : value}
            </div>
            {trend && (
                <div style={{ fontSize: '12px', color: trend > 0 ? '#28a745' : '#dc3545' }}>
                    {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% from last period
                </div>
            )}
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🚀 Enhanced Business Dashboard</h2>
                <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                </select>
            </div>

            {alerts.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    {alerts.map((alert, index) => (
                        <div key={index} style={{
                            padding: '10px',
                            backgroundColor: alert.type === 'warning' ? '#fff3cd' : '#d1ecf1',
                            border: alert.type === 'warning' ? '1px solid #ffeaa7' : '1px solid #bee5eb',
                            borderRadius: '5px',
                            marginBottom: '5px'
                        }}>
                            {alert.message}
                        </div>
                    ))}
                </div>
            )}

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '15px',
                marginBottom: '30px'
            }}>
                <MetricCard 
                    title="Revenue" 
                    value={currentData.revenue} 
                    trend={2.5}
                    alert={currentData.revenue < 30000}
                />
                <MetricCard 
                    title="Customers" 
                    value={currentData.customers} 
                    trend={3.2}
                />
                <MetricCard 
                    title="Satisfaction" 
                    value={currentData.satisfaction} 
                    trend={1.0}
                    alert={currentData.satisfaction < 4.5}
                />
                <MetricCard 
                    title="Active Today" 
                    value={currentData.active_today} 
                    trend={5.8}
                />
            </div>

            <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h3>📈 Revenue Trend ({timeRange})</h3>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'end', 
                    height: '100px',
                    gap: '10px',
                    marginTop: '20px'
                }}>
                    {[32000, 31500, 32500, 31800, 32480, 33000, 33500].map((value, index) => (
                        <div key={index} style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                height: `${(value / 35000) * 80}px`,
                                backgroundColor: '#007bff',
                                width: '20px',
                                borderRadius: '5px 5px 0 0'
                            }}></div>
                            <div style={{ fontSize: '10px', marginTop: '5px' }}>Day {index + 1}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Smart AI Chat Component
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
    
    const messagesEndRef = React.useRef(null);

    const quickTemplates = [
        { label: "📊 Analyze Revenue", prompt: "Analyze my current revenue trends and suggest growth opportunities." },
        { label: "👥 Customer Strategy", prompt: "Suggest customer retention strategies based on my satisfaction metrics." },
        { label: "🚀 Growth Ideas", prompt: "Provide 3 actionable growth strategies for my business." },
        { label: "📈 Metric Insights", prompt: "What metrics should I focus on right now and why?" }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    React.useEffect(scrollToBottom, [messages]);

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
            
            setMessages(prev => {
                const withoutThinking = prev.filter(msg => !msg.isThinking);
                return [...withoutThinking, {
                    id: Date.now() + 2,
                    type: 'ai',
                    content: data.response,
                    confidence: data.confidence,
                    source: data.source,
                    timestamp: new Date().toLocaleTimeString()
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

    return (
        <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2>🤖 AI Business Advisor</h2>
            
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
                                cursor: 'pointer'
                            }}
                        >
                            {template.label}
                        </button>
                    ))}
                </div>
            </div>

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
                        marginLeft: msg.type === 'user' ? 'auto' : '0'
                    }}>
                        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
                            <strong>{msg.type === 'user' ? 'You' : 'AI Advisor'}</strong>
                            <span style={{ float: 'right' }}>{msg.timestamp}</span>
                        </div>
                        <div>{msg.content}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="Ask about your business..."
                    disabled={isThinking}
                    style={{ 
                        flex: 1, 
                        padding: '12px', 
                        border: '1px solid #ccc',
                        borderRadius: '5px'
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
                        borderRadius: '5px'
                    }}
                >
                    {isThinking ? '🤔' : '➤'}
                </button>
            </form>
        </div>
    );
};

// Main App Component
const App = () => {
    const [dashboardData, setDashboardData] = useState({ 
        revenue: 0, 
        customers: 0, 
        transactions_today: 0, 
        active_today: 0,
        satisfaction: 0.0
    });
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
    const [error, setError] = useState(null);
    const [connectionTest, setConnectionTest] = useState('Testing...');

    useEffect(() => {
        const testConnection = async () => {
            try {
                const response = await fetch(API_BASE_URL + '/');
                await response.json();
                setConnectionTest('✅ Connected to API Bridge');
            } catch (err) {
                setConnectionTest('❌ Cannot connect to API Bridge');
                setError(`Cannot connect to ${API_BASE_URL}`);
            }
        };
        testConnection();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashboardRes, customersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/business/dashboard`),
                    fetch(`${API_BASE_URL}/business/customers`)
                ]);

                const dashboardData = await dashboardRes.json();
                const customerData = await customersRes.json();

                setDashboardData({
                    ...dashboardData,
                    active_today: customerData.active_today,
                    satisfaction: customerData.satisfaction
                });
                setError(null);
            } catch (err) {
                setError(`Failed to fetch data: ${err.message}`);
            } finally {
                setIsLoadingMetrics(false);
            }
        };

        if (connectionTest.includes('✅')) {
            fetchData();
        }
    }, [connectionTest]);

    return (
        <div style={{ 
            padding: '0px', 
            fontFamily: 'Arial, sans-serif', 
            backgroundColor: '#f5f5f5', 
            minHeight: '100vh' 
        }}>
            <div style={{ 
                backgroundColor: 'white', 
                padding: '15px 20px', 
                borderBottom: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ 
                    color: '#333', 
                    textAlign: 'center', 
                    margin: 0,
                    fontSize: '24px'
                }}>
                    🚀 Business Intelligence Platform v2.0
                </h1>
                
                <div style={{ 
                    padding: '8px', 
                    marginTop: '10px',
                    backgroundColor: connectionTest.includes('✅') ? '#d4edda' : '#f8d7da',
                    border: `1px solid ${connectionTest.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
                    color: connectionTest.includes('✅') ? '#155724' : '#721c24',
                    borderRadius: '5px',
                    textAlign: 'center',
                    fontSize: '14px'
                }}>
                    <strong>Status:</strong> {connectionTest}
                </div>

                <div style={{ 
                    marginTop: '15px', 
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px'
                }}>
                    <button 
                        onClick={() => setCurrentPage('dashboard')}
                        style={{ 
                            padding: '12px 24px', 
                            backgroundColor: currentPage === 'dashboard' ? '#4f46e5' : '#6c757d', 
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        📊 Enhanced Dashboard
                    </button>
                    <button 
                        onClick={() => setCurrentPage('chat')}
                        style={{ 
                            padding: '12px 24px', 
                            backgroundColor: currentPage === 'chat' ? '#4f46e5' : '#6c757d', 
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        🤖 Smart AI Advisor
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#fee', 
                    border: '1px solid red', 
                    margin: '10px',
                    borderRadius: '5px'
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div style={{ padding: '0px' }}>
                {isLoadingMetrics ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <h3>Loading business data...</h3>
                    </div>
                ) : currentPage === 'dashboard' ? (
                    <EnhancedDashboard currentData={dashboardData} />
                ) : (
                    <SmartAIChat businessData={dashboardData} />
                )}
            </div>

            <div style={{ 
                padding: '15px', 
                textAlign: 'center', 
                color: '#666',
                fontSize: '12px',
                borderTop: '1px solid #ddd',
                marginTop: '20px'
            }}>
                <p>Enhanced Business Intelligence Platform • AI-Powered Insights</p>
            </div>
        </div>
    );
};

export default App;
