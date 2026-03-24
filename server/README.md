# BragBoard Frontend

React-based frontend for the BragBoard employee recognition platform.

## Tech Stack

- React 18
- Tailwind CSS
- React Router
- Axios for API calls
- Context API for state management

## Getting Started

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Project Structure
```
src/
├── pages/          # Main page components (Login, Register, Dashboard)
├── context/        # Auth context for global state
├── services/       # API service configuration
└── assets/         # Images and static files
```

## Features

- User authentication (login/register)
- JWT token management
- Protected routes
- Password reset with security questions
- Responsive design

## Environment

Make sure the backend server is running on `http://127.0.0.1:8000` before starting the frontend.

## Available Routes

- `/login` - User login
- `/register` - New user registration
- `/forgot-password` - Password reset
- `/dashboard` - Main dashboard (protected)