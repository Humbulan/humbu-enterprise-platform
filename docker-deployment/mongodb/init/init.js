db = db.getSiblingDB('users');

db.createUser({
  user: 'humbu_user',
  pwd: 'humbu2024',
  roles: [
    {
      role: 'readWrite',
      db: 'users'
    }
  ]
});

// Create initial collections
db.createCollection('users');
db.createCollection('profiles');

// Insert demo user
db.users.insertOne({
  _id: ObjectId(),
  username: 'admin',
  email: 'admin@humbu.store',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
});

print('✅ MongoDB initialized successfully');
