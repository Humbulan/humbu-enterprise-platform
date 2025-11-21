import React, { useState, useEffect } from 'react';
import EnhancedDashboard from './components/EnhancedDashboard';
import SmartAIChat from './components/SmartAIChat';

const API_BASE_URL = 'http://192.168.8.26:8001';

const App = () => {
    const [dashboardData, setDashboardData] = useState({ 
        revenue: 0, 
        customers: 0, 
        transactions_today: 0, 
        active_today: 0,
        satisfaction: 0.0, 
        source: 'N/A' 
    });
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
    const [error, setError] = useState(null);
    const [connectionTest, setConnectionTest] = useState('Testing...');

    // Test connection
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

    // Load business data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashboardRes, customersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/business/dashboard`),
                    fetch(`${API_BASE_URL}/business/customers`)
                ]);

                if (!dashboardRes.ok || !customersRes.ok) {
                    throw new Error('Failed to fetch business data');
                }

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
            {/* Header */}
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
                    Business Intelligence Platform
                </h1>
                
                {/* Connection Status */}
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

                {/* Navigation */}
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
                            padding: '10px 20px', 
                            backgroundColor: currentPage === 'dashboard' ? '#4f46e5' : '#6c757d', 
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        📊 Dashboard
                    </button>
                    <button 
                        onClick={() => setCurrentPage('chat')}
                        style={{ 
                            padding: '10px 20px', 
                            backgroundColor: currentPage === 'chat' ? '#4f46e5' : '#6c757d', 
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        🤖 AI Advisor
                    </button>
                </div>
            </div>

            {/* Error Display */}
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

            {/* Main Content */}
            <div style={{ padding: '0px' }}>
                {currentPage === 'dashboard' && (
                    <EnhancedDashboard currentData={dashboardData} />
                )}

                {currentPage === 'chat' && (
                    <SmartAIChat businessData={dashboardData} />
                )}
            </div>

            {/* Footer */}
            <div style={{ 
                padding: '15px', 
                textAlign: 'center', 
                color: '#666',
                fontSize: '12px',
                borderTop: '1px solid #ddd',
                marginTop: '20px'
            }}>
                <p>Business Intelligence Platform v2.0 • AI-Powered Insights</p>
            </div>
        </div>
    );
};

export default App;
