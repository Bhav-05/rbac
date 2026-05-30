# RoleBase â€” RBAC Task Management System

A production-grade full-stack MERN application implementing Role-Based Access Control (RBAC) with JWT authentication, activity logging, and a complete admin dashboard.

Built for: **Avidus Interactive â€” Software Engineer Assignment**

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://rbac-ashy.vercel.app |
| Backend API | https://rbac-backend-p2rl.onrender.com |
| Health Check | https://rbac-backend-p2rl.onrender.com/api/health |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| User | user@test.com | user1234 |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 19, React Router v6 |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB, Mongoose 9 |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## Features

### Authentication
- JWT-based login and registration
- bcrypt password hashing (12 salt rounds)
- Token stored in localStorage, sent as Bearer header
- Inactive account blocking at middleware level

### Role-Based Access Control

| Feature | User | Admin |
|---------|------|-------|
| Create tasks | Own only | â€” |
| View tasks | Own only | All users |
| Update tasks | Own only | All users |
| Delete tasks | Own only | All users |
| View all users | No | Yes |
| Delete users | No | Yes |
| Toggle user status | No | Yes |
| View activity logs | No | Yes |
| Analytics dashboard | No | Yes |

### Activity Logging
Every key action is tracked in MongoDB:
- `LOGIN` â€” user signed in
- `TASK_CREATED` â€” task created
- `TASK_UPDATED` â€” task status changed
- `TASK_DELETED` â€” task removed

### Admin Dashboard
- Analytics cards â€” total users, tasks, completed, pending
- User Management â€” view, activate/deactivate, delete users
- Task Monitor â€” view all tasks across all users, filter by status
- Activity Logs â€” full audit trail with timestamps

---

## Project Structure

```
rbac/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ controllers/
â”‚   â”‚   â”œâ”€â”€ authController.js      # register, login, getMe
â”‚   â”‚   â”œâ”€â”€ adminController.js     # admin CRUD operations
â”‚   â”‚   â””â”€â”€ taskController.js      # task CRUD with ownership
â”‚   â”œâ”€â”€ middleware/
â”‚   â”‚   â””â”€â”€ authMiddleware.js      # protect + adminOnly
â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”œâ”€â”€ User.js                # role, status fields
â”‚   â”‚   â”œâ”€â”€ Task.js                # userId ownership
â”‚   â”‚   â””â”€â”€ ActivityLog.js         # action tracking
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ authRoutes.js
â”‚   â”‚   â”œâ”€â”€ taskRoutes.js
â”‚   â”‚   â””â”€â”€ adminRoutes.js
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”œâ”€â”€ generateToken.js       # JWT generation
â”‚   â”‚   â””â”€â”€ logger.js              # reusable activity logger
â”‚   â”œâ”€â”€ server.js
â”‚   â”œâ”€â”€ .env.example
â”‚   â””â”€â”€ package.json
â”‚
â””â”€â”€ frontend/
    â””â”€â”€ src/
        â”œâ”€â”€ components/
        â”‚   â”œâ”€â”€ ProtectedRoute.jsx  # blocks unauthenticated
        â”‚   â””â”€â”€ AdminRoute.jsx      # blocks non-admins
        â”œâ”€â”€ context/
        â”‚   â””â”€â”€ AuthContext.jsx     # global auth state
        â”œâ”€â”€ layouts/
        â”‚   â””â”€â”€ Sidebar.jsx         # role-based navigation
        â”œâ”€â”€ pages/
        â”‚   â”œâ”€â”€ Login.jsx
        â”‚   â”œâ”€â”€ Register.jsx
        â”‚   â”œâ”€â”€ Dashboard.jsx       # user task manager
        â”‚   â””â”€â”€ admin/
        â”‚       â”œâ”€â”€ AdminDashboard.jsx
        â”‚       â”œâ”€â”€ UserManagement.jsx
        â”‚       â”œâ”€â”€ TaskMonitor.jsx
        â”‚       â””â”€â”€ ActivityLogs.jsx
        â”œâ”€â”€ services/
        â”‚   â””â”€â”€ api.js              # axios instance + interceptors
        â”œâ”€â”€ App.jsx
        â””â”€â”€ index.css
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally OR MongoDB Atlas URI

### 1. Clone the repo
```bash
git clone https://github.com/Bhav-05/rbac.git
cd rbac
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `.env` file:
```
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
node server.js
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

App runs at `http://localhost:3000`

---

## API Reference

### Auth Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Create account |
| POST | /api/auth/login | Public | Login, get JWT |
| GET | /api/auth/me | Protected | Get current user |

### Task Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/tasks | Protected | Get own tasks |
| POST | /api/tasks | Protected | Create task |
| PUT | /api/tasks/:id | Protected + Owner | Update task |
| DELETE | /api/tasks/:id | Protected + Owner | Delete task |

### Admin Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/admin/users | Admin | View all users |
| DELETE | /api/admin/users/:id | Admin | Delete user |
| PATCH | /api/admin/users/:id/status | Admin | Toggle active/inactive |
| GET | /api/admin/tasks | Admin | View all tasks |
| GET | /api/admin/analytics | Admin | System stats |
| GET | /api/admin/logs | Admin | Activity logs |

---

## Security Highlights

- Passwords never stored in plain text â€” bcrypt with 12 rounds
- JWT secret stored only in environment variables
- All admin routes validated server-side â€” never trust frontend
- Task ownership enforced in every controller, not just frontend
- Deactivated users blocked at middleware level even with valid token
- CORS restricted to known frontend origin in production

---

## Git Workflow

```
main                    â† production-ready code
feature/rbac-admin-dashboard  â† feature branch (PR raised)
```

### Branch strategy
- All feature work done on `feature/rbac-admin-dashboard`
- PR raised against `main`
- Code reviewed before merge

---

## Environment Variables Reference

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret for signing tokens | random_32_char_string |
| JWT_EXPIRES_IN | Token expiry | 7d |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | production |
| FRONTEND_URL | Allowed CORS origin | https://app.vercel.app |

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API base URL | https://api.onrender.com/api |

