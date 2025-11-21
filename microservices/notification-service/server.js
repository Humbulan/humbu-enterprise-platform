const express = require('express');
const app = express();
const PORT = process.env.PORT || 8204;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    service: 'notification-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/notifications', (req, res) => {
  res.json({
    notifications: [
      { id: 1, type: 'welcome', message: 'Welcome to Humbu Platform!', read: false },
      { id: 2, type: 'system', message: 'System update completed', read: true }
    ],
    total: 2,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔔 Notification Service running on port ${PORT}`);
});
