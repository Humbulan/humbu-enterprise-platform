import React, { useState, useEffect } from 'react';

const EnhancedDashboard = ({ currentData }) => {
    const [timeRange, setTimeRange] = useState('30d');
    const [trendData, setTrendData] = useState({});
    const [alerts, setAlerts] = useState([]);

    // Simulated trend data
    const generateTrendData = () => {
        return {
            revenue: [32000, 31500, 32500, 31800, 32480, 33000, 33500],
            customers: [180, 182, 185, 183, 189, 192, 195],
            satisfaction: [4.8, 4.7, 4.9, 4.8, 4.9, 4.9, 4.9],
            transactions: [42, 45, 44, 43, 47, 50, 52]
        };
    };

    useEffect(() => {
        setTrendData(generateTrendData());
        // Check for alerts
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
                <h2>Business Dashboard</h2>
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

            {/* Alerts */}
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

            {/* Metrics Grid */}
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

            {/* Simple Trend Visualization */}
            <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h3>Revenue Trend ({timeRange})</h3>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'end', 
                    height: '100px',
                    gap: '10px',
                    marginTop: '20px'
                }}>
                    {trendData.revenue?.map((value, index) => (
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

export default EnhancedDashboard;
