# Backend Setup Guide

## Database Setup

### Prerequisites
- MongoDB installed locally OR MongoDB Atlas account

### MongoDB Atlas (Recommended for Production)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
```

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Update `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/portfolio
```

## Environment Configuration

Create `.env.local` file in the root directory:

```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT
JWT_SECRET=your-very-secure-secret-key-change-in-production
JWT_EXPIRE=7d

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation

```bash
npm install
```

This installs all dependencies including:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `axios` - HTTP client
- `next-auth` - Authentication library
- `js-cookie` - Cookie management

## Running the Application

### Development
```bash
npm run dev
```

Server runs on http://localhost:3000

### Test Accounts

Create test accounts through the registration page:

1. **Admin Account**
   - Email: admin@example.com
   - Password: admin123
   - Role: Admin

2. **Client Account**
   - Email: client@example.com
   - Password: client123
   - Role: Client

3. **Student Account**
   - Email: student@example.com
   - Password: student123
   - Role: Student

## API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "student"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Logout
```
POST /api/auth/logout
```

#### Get Profile
```
GET /api/auth/profile
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

## Dashboard Routes

### Admin Routes
- `/dashboard/admin` - Admin Dashboard
- `/dashboard/admin/profile` - Admin Profile
- `/dashboard/admin/users` - User Management
- `/dashboard/admin/analytics` - Analytics

### Client Routes
- `/dashboard/client` - Client Dashboard
- `/dashboard/client/profile` - Client Profile
- `/dashboard/client/projects` - Projects
- `/dashboard/client/invoices` - Invoices

### Student Routes
- `/dashboard/student` - Student Dashboard
- `/dashboard/student/profile` - Student Profile
- `/dashboard/student/courses` - Courses
- `/dashboard/student/assignments` - Assignments

## Authentication Flow

1. **Registration**
   - User registers with email, password, name, and role
   - Password is hashed using bcryptjs
   - User is created in MongoDB
   - JWT token is generated and set in httpOnly cookie

2. **Login**
   - User provides email and password
   - Password is verified against hashed password
   - JWT token is generated and set in httpOnly cookie
   - User is redirected to role-specific dashboard

3. **Authorization**
   - All dashboard routes are protected with ProtectedRoute component
   - Routes check for valid JWT token
   - Routes verify user role matches required roles
   - Unauthorized users are redirected to login

4. **Logout**
   - Token cookie is cleared
   - User is redirected to home page

## Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ HTTP-only cookies for token storage
- ✅ JWT token expiration (7 days)
- ✅ Protected routes with role-based access
- ✅ Input validation on server side
- ✅ Secure environment variables

## File Structure

```
app/
├── api/
│   └── auth/
│       ├── register/route.ts
│       ├── login/route.ts
│       ├── logout/route.ts
│       └── profile/route.ts
├── auth/
│   ├── login/page.tsx
│   └── register/page.tsx
└── dashboard/
    ├── page.tsx
    ├── admin/
    │   ├── page.tsx
    │   └── profile/page.tsx
    ├── client/
    │   ├── page.tsx
    │   └── profile/page.tsx
    └── student/
        ├── page.tsx
        └── profile/page.tsx

components/
├── ProtectedRoute.tsx
├── DashboardLayout.tsx
├── ClientLayout.tsx

contexts/
└── AuthContext.tsx

lib/
├── db.ts
├── auth.ts
├── theme.ts
├── utils.ts
└── constants.ts

models/
└── User.ts

middleware/
└── auth.ts

types/
└── auth.ts
```

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check connection string in `.env.local`
- Ensure credentials are correct for MongoDB Atlas

### Authentication Issues
- Clear browser cookies
- Check JWT_SECRET is set correctly
- Verify token is being stored in cookies

### Protected Route Issues
- Ensure AuthProvider wraps the application
- Check user role matches required roles
- Verify token is valid and not expired

## Production Deployment

### Vercel + MongoDB Atlas

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - MONGODB_URI
   - JWT_SECRET
4. Deploy

### Security Checklist
- [ ] Change JWT_SECRET to secure value
- [ ] Use MongoDB Atlas instead of local MongoDB
- [ ] Enable HTTPS
- [ ] Set secure: true for cookies in production
- [ ] Configure CORS if needed
- [ ] Set up rate limiting
- [ ] Enable database backups
