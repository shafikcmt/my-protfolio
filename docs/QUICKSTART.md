# Quick Start Guide

## Initial Setup (30 seconds)

```bash
# Install dependencies
npm install

# Create and configure .env.local
# Copy and update the values below:
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser

## First Steps

### 1. Homepage
Visit http://localhost:3000 to see the portfolio homepage

### 2. Register Account
- Click "Get in Touch" button or navigate to http://localhost:3000/auth/register
- Fill in your details
- Select your role: Admin, Client, or Student
- Click "Create Account"

### 3. Access Dashboard
- You'll be automatically redirected to your role-specific dashboard
- View personalized content based on your role

### 4. Explore Features

**Admin Dashboard** (for Admin users)
- View statistics (total users, active sessions, etc.)
- Access user management
- View analytics
- See recent activity

**Client Dashboard** (for Client users)
- Track active projects
- View total spending
- Monitor project progress
- See pending invoices

**Student Dashboard** (for Student users)
- Track enrolled courses
- View grades and progress
- See assignment deadlines
- Monitor course completion

## File Locations

### Key Backend Files
- `models/User.ts` - User database model
- `app/api/auth/` - Authentication API routes
- `lib/auth.ts` - JWT token utilities
- `contexts/AuthContext.tsx` - React auth state management

### Key Frontend Files
- `app/auth/login/page.tsx` - Login page
- `app/auth/register/page.tsx` - Register page
- `app/dashboard/*/page.tsx` - Role-specific dashboards
- `components/ProtectedRoute.tsx` - Route protection wrapper

### Configuration Files
- `.env.local` - Environment variables
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Linting
npm run lint
```

## Architecture Overview

```
User Registration/Login
         ↓
    JWT Token
         ↓
   Protected Routes
         ↓
Role-Based Dashboards
(Admin/Client/Student)
         ↓
Personalized Content
```

## Database Models

### User Model
- `_id` - MongoDB ID
- `email` - Unique email address
- `password` - Hashed password
- `name` - User full name
- `role` - User role (admin/client/student)
- `isActive` - Account status
- `createdAt` - Registration date
- `updatedAt` - Last update date

## Response Examples

### Successful Login
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Customization

### Change Theme Colors
Edit `tailwind.config.ts` and update the color values:
```typescript
colors: {
  primary: {
    500: '#0ea5e9',  // Change this
    600: '#0284c7',
  }
}
```

### Add New API Routes
Create new file in `app/api/` following the pattern:
```typescript
// app/api/endpoint/route.ts
export async function POST(request: NextRequest) {
  // Your logic here
}
```

### Add New Dashboard Pages
Create new files in `app/dashboard/{role}/`:
```typescript
// Wrap with ProtectedRoute and DashboardLayout
export default function Page() {
  return (
    <ProtectedRoute requiredRoles={['role']}>
      <DashboardLayout title="Page Title">
        {/* Your content */}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
```

## Deployment Checklist

- [ ] Set up MongoDB Atlas
- [ ] Update `.env` for production
- [ ] Change JWT_SECRET to a secure value
- [ ] Enable HTTPS
- [ ] Configure domain
- [ ] Test all authentication flows
- [ ] Verify role-based access
- [ ] Set up backups
- [ ] Monitor error logs
- [ ] Implement rate limiting

## Next Steps

1. **Customize Content**: Update dashboard content in role-specific pages
2. **Add More Models**: Create additional Mongoose models as needed
3. **Implement Features**: Add functionality specific to your use case
4. **Deploy**: Push to Vercel or your hosting provider
5. **Monitor**: Set up error tracking and analytics

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Mongoose Documentation](https://mongoosejs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Support

For issues or questions:
1. Check the BACKEND_SETUP.md file for detailed setup instructions
2. Review error messages in the browser console
3. Check terminal output for API errors
4. Verify environment variables are set correctly
