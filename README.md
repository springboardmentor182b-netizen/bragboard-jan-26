# 🏆 BragBoard

**Employee Recognition Platform** — A modern web application for celebrating team achievements and fostering a culture of appreciation.

![BragBoard Preview](README.png)

## 📋 Overview

BragBoard is a comprehensive employee recognition platform that enables teams to give and receive shout-outs, track engagement, and moderate content. The platform features a beautifully designed user interface with robust administrative capabilities.

## ✨ Key Features

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

### 🛡️ Admin Shout-Out Moderation Screen

The **Moderation Queue** is a powerful feature that allows administrators to review and manage reported content efficiently:

#### Features:
- **Smart Filtering** — Filter reports by status (All, Pending, Under Review)
- **Flexible Sorting** — Sort by Most Recent or Oldest First
- **Detailed Information** — View flagged content, reporter details, violation reasons, and current status
- **Quick Actions** — Dismiss false reports or delete inappropriate content with one click
- **Touch-Responsive** — Fully optimized for touchscreen devices with visual feedback
- **Real-Time Updates** — Instantly see changes as you take action

#### Moderation Actions:
- **Dismiss** — Mark a report as resolved without taking action
- **Delete** — Remove inappropriate shout-outs from the platform
- **Status Tracking** — Visual badges show report status at a glance

![Admin Moderation Screen - BragBoard](README.png)

## 🏗️ Tech Stack

### Frontend
- **React 18** — Modern UI library with hooks
- **React Router** — Client-side routing
- **Tailwind CSS** — Utility-first CSS framework
- **Axios** — HTTP client for API calls
- **Context API** — State management

### Backend
- **Python** — Server-side language
- **FastAPI** — Modern, fast web framework
- **SQLite/PostgreSQL** — Database options
- **JWT Authentication** — Secure user sessions

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bragboard-jan-26
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   pip install -r requirements.txt
   ```

### Running the Application

#### Start the Backend Server
```bash
cd server
python main.py
```
The server will run on `http://127.0.0.1:8000`

#### Start the Frontend
```bash
cd client
npm start
```
The app will run on `http://localhost:3000`

## 📁 Project Structure

```
bragboard-jan-26/
├── client/                  # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # Images and styles
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # Global state management
│   │   ├── features/        # Feature-based modules
│   │   │   ├── admin/       # Admin-specific features
│   │   │   │   ├── pages/   # Moderation.js, ShoutOuts.js
│   │   │   │   └── services/# Admin API services
│   │   │   └── authentication/
│   │   ├── layout/          # Layout components (Sidebar, Header)
│   │   ├── pages/           # Main page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── services/        # API configuration
│   └── package.json
│
└── server/                  # Python backend
    ├── src/                 # Source code modules
    ├── api.py               # API endpoints
    ├── main.py              # Application entry point
    ├── create_admin.py      # Admin user creation script
    ├── create_tables.py     # Database initialization
    └── requirements.txt     # Python dependencies
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

## 🎨 UI/UX Highlights

- **Modern Design** — Clean, professional interface with gradient accents
- **Responsive Layout** — Optimized for desktop, tablet, and mobile
- **Interactive Feedback** — Touch-responsive buttons with visual states
- **Accessibility** — Semantic HTML and ARIA labels
- **Dark Mode Ready** — Color scheme designed for future dark mode support

## 📊 Analytics & Insights

Track key metrics on the admin dashboard:
- Total Employees
- Total Shout-Outs
- Engagement (Likes & Comments)
- Top Performers
- Category Breakdown
- Growth Trends

## 🛠️ Development

### Available Scripts

#### Client
- `npm start` — Start development server
- `npm run build` — Build for production
- `npm test` — Run tests

#### Server
- `python main.py` — Start the API server
- `python create_tables.py` — Initialize database tables
- `python create_admin.py` — Create admin user

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

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons from [Lucide React](https://lucide.dev/)
- UI inspiration from modern SaaS platforms
- Built with ❤️ for teams who appreciate great work

---

**Made with 🎯 BragBoard** — *Because every achievement deserves recognition.*
