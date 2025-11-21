const express = require('express');

const app = express();
const PORT = process.env.PORT || 8203;

app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'payment-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Payment endpoints
app.post('/payments/process', (req, res) => {
  const { amount, currency, token } = req.body;
  
  res.json({
    success: true,
    paymentId: 'pay_' + Math.random().toString(36).substr(2, 9),
    amount,
    currency,
    status: 'completed',
    timestamp: new Date().toISOString()
  });
});

app.get('/payments/:id', (req, res) => {
  res.json({
    paymentId: req.params.id,
    amount: 99.99,
    currency: 'USD',
    status: 'completed',
    createdAt: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`💳 Payment Service running on port ${PORT}`);
});
