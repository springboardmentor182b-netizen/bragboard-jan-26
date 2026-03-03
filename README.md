# BragBoard

BragBoard is a premium recognition platform designed to celebrate team achievements and foster a culture of appreciation.

![User Management Interface](./images/README.png)

## Core Features

### 🚀 User Management
The robust Admin Portal provides a centralized interface for managing the entire team. Features include:
- **User Insights**: A comprehensive list of all team members with their roles, departments, and active status.
- **Dynamic Search**: Instantly filter through team members by name, email, or department.
- **Role Control**: Securely manage permissions by assigning 'Admin' or 'Employee' roles.
- **CRUD Operations**: Effortlessly add new team members, edit existing profiles, or remove users when necessary.
- **Modern UI**: A clean, light-themed interface with vibrant purple accents and intuitive navigation.

### 🎯 Core Functionality
- **Shout-Out System** — Post and share recognition messages for team members
- **Interactive Engagement** — Like and comment on shout-outs
- **Category-Based Recognition** — Organize shout-outs by Teamwork, Leadership, Problem Solving, Mentorship, and Communication
- **User Profiles** — Track individual contributions and recognition received

### 👑 Admin Features
- **Analytics Dashboard** — Comprehensive overview of platform metrics and engagement
- **User Management** — Manage team members, roles, and permissions
- **🛡️ Shout-Out Moderation Screen** — Review and moderate flagged content with advanced filtering and sorting capabilities
- **System Logs** — Monitor platform activity and user actions

## Tech Stack

### Frontend
- **React**: Modern component-based architecture.
- **Vite**: Ultra-fast development environment and bundling.
- **Lucide React**: Stunning, consistent iconography.
- **Tailwind CSS**: Utility-first styling for a premium look.

### Backend
- **FastAPI**: High-performance Python framework.
- **SQLAlchemy**: Robust ORM for database interactions.
- **PostgreSQL**: Reliable relational database.
- **Bcrypt**: State-of-the-art password security.
- **JWT Authentication**: Secure user sessions.

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bragboard-jan-26
   ```

2. **Start the Database**
   ```bash
   docker-compose up -d db
   ```

3. **Backend Setup**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🔐 Authentication

BragBoard uses JWT-based authentication with role-based access control:

- **Employee Role** — Can create shout-outs, like, comment, and view analytics
- **Admin Role** — Full access to moderation, user management, and system logs

### Creating an Admin User
```bash
cd server
python create_admin.py
```

## 📊 Analytics & Insights

Track key metrics on the admin dashboard:
- Total Employees
- Total Shout-Outs
- Engagement (Likes & Comments)
- Top Performers
- Category Breakdown
- Growth Trends

## 🔒 Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Protected API routes
- Role-based access control
- Input validation and sanitization
- CORS configuration

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — User login
- `POST /api/auth/forgot-password` — Password reset

### Shout-Outs
- `GET /api/shoutouts` — Fetch all shout-outs
- `POST /api/shoutouts` — Create new shout-out
- `DELETE /api/shoutouts/{id}` — Delete shout-out (admin)

### Admin
- `GET /api/admin/reports` — Fetch moderation reports
- `POST /api/admin/dismiss/{id}` — Dismiss a report
- `DELETE /api/admin/shoutout/{id}` — Delete flagged content

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License.
