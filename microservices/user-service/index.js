
// User Registration Endpoint
app.post('/users/register', (req, res) => {
    console.log('📝 User registration attempt:', req.body);
    
    const { username, email, password } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['username', 'email', 'password'],
            received: req.body
        });
    }
    
    // Create new user (demo implementation)
    const newUser = {
        id: Date.now(), // Simple ID generation
        username: username,
        email: email,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        message: 'User registered successfully via Humbu Platform!'
    };
    
    console.log('✅ New user registered:', newUser.username);
    res.status(201).json(newUser);
});

// Health check endpoint
app.get('/users/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'user-service',
        timestamp: new Date().toISOString(),
        features: ['list-users', 'register-user', 'health-check']
    });
});
