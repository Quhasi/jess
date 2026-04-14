# Pregnancy App Backend



1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Pregnancy Tracker
- `GET /api/pregnancy/` - Get pregnancy data
- `POST /api/pregnancy/` - Create/update pregnancy info
- `GET /api/pregnancy/milestones` - Get milestones
- `POST /api/pregnancy/weight` - Log weight
- `GET /api/pregnancy/weight` - Get weight history

### Advice
- `GET /api/advice/categories` - Get all categories
- `GET /api/advice/:category` - Get advice by category

### Chatbot
- `POST /api/chatbot/message` - Send message

## Environment Variables (in .env)
- PORT=3000
- MONGO_URI=mongodb://localhost:27017/pregnancy-app
- JWT_SECRET=your-secret-key