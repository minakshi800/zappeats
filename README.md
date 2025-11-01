# ZappEats - Food Delivery App

A full-stack food delivery application built with the MERN stack.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB

## Project Structure

```
ZappEats/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React Context for state management
│   │   ├── services/   # API service functions
│   │   ├── utils/      # Utility functions
│   │   ├── hooks/      # Custom React hooks
│   │   └── App.jsx
│   └── package.json
│
├── backend/           # Express API server
│   ├── config/        # Configuration files
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API route handlers
│   ├── controllers/   # Business logic
│   ├── middleware/    # Custom middleware
│   ├── utils/         # Helper functions
│   └── server.js
│
└── PROJECT_PLAN.md    # Detailed project plan
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB connection string and other variables.

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- Backend API runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:3000`

## Next Steps

See `PROJECT_PLAN.md` for the complete development roadmap and feature list.

