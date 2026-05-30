# RoleBase - RBAC Task Management System

A production-grade full-stack MERN application implementing Role-Based Access Control (RBAC) with JWT authentication, activity logging, and a complete admin dashboard.

Built for: **Avidus Interactive - Software Engineer Assignment**

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
| Create tasks | Own only | -- |
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
- `LOGIN` - user signed in
- `TASK_CREATED` - task created
- `TASK_UPDATED` - task status changed
- `TASK_DELETED` - task removed

### Admin Dashboard
- Analytics cards - total users, tasks, completed, pending
- User Management - view, activate/deactivate, delete users
- Task Monitor - view all tasks across all users, filter by status
- Activity Logs - full audit trail with timestamps

---

## Project Structure

```
rbac/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # register, login, getMe
│   │   ├── adminController.js     # admin CRUD operations
│   │   └── taskController.js      # task CRUD with ownership
│   ├── middleware/
│   │   └── authMiddleware.js      # protect + adminOnly
│   ├── models/
│   │   ├── User.js                # role, status fields
│   │   ├── Task.js                # userId ownership
│   │   └── ActivityLog.js         # action tracking
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── generateToken.js       # JWT generation
│   │   └── logger.js              # reusable activity logger
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ProtectedRoute.jsx  # blocks unauthenticated
        │   └── AdminRoute.jsx      # blocks non-admins
        ├── context/
        │   └── AuthContext.jsx     # global auth state
        ├── layouts/
        │   └── Sidebar.jsx         # role-based navigation
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx       # user task manager
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── UserManagement.jsx
        │       ├── TaskMonitor.jsx
        │       └── ActivityLogs.jsx
        ├── services/
        │   └── api.js              # axios instance + interceptors
        ├── App.jsx
        └── index.css
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

## Security

- Passwords never stored in plain text - bcrypt with 12 rounds
- JWT secret stored only in environment variables
- All admin routes validated server-side
- Task ownership enforced in every controller
- Deactivated users blocked at middleware level
- CORS restricted to known frontend origin in production

---

## Git Workflow

```
main                          - production-ready code
feature/rbac-admin-dashboard  - feature branch (PR raised)
```

---

## Environment Variables

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
