# Admin Panel Documentation

## Overview
A complete admin panel for managing portfolio content with secure email + OTP authentication.

## Features

### Authentication (`/admin/auth`)
- **Email-based login** with OTP verification
- OTP sent to authorized admin email
- Session management with 2-hour token expiry
- Protected routes with automatic redirect

### Dashboard (`/admin`)
- Quick access to all management sections
- Visual cards for each content type
- Statistics overview (Projects, Experience, Skills, Achievements, Events)

### Content Management

#### 1. Projects (`/admin/projects`)
Manage portfolio projects with:
- Project name and overview
- Highlights (feature list)
- Technologies used
- Live URL and repository links
- Thumbnail and snapshot images
- Full CRUD operations (Create, Read, Update, Delete)

#### 2. Experience (`/admin/experience`)
Manage work experience with:
- Company name and location
- Position/role
- Start and end dates (with "current role" option)
- Responsibilities list
- Full CRUD operations

#### 3. Skills (`/admin/skills`)
Manage technical skills with:
- Skill name
- Category (Frontend, Backend, Database, etc.)
- Icon URL with preview
- Skills grouped by category
- Full CRUD operations

#### 4. Achievements (`/admin/achievements`)
Track achievements and milestones:
- Achievement title
- Automatic timestamp
- Simple list view
- Full CRUD operations

#### 5. Find Me Events (`/admin/findme`)
Manage event appearances:
- Event name and image
- Event type (Past/Future)
- Event date and URL
- Separate sections for upcoming and past events
- Full CRUD operations

## Setup Instructions

### 1. Environment Variables
Make sure these are set in your `.env.local`:
```env
NEXT_PUBLIC_GMAIL_USER=your-admin-email@gmail.com
# Add your email configuration for OTP delivery
```

### 2. Admin Email Configuration
Update the admin email in `/app/api/admin/send-otp/route.ts`:
```typescript
if (email !== process.env.NEXT_PUBLIC_GMAIL_USER || email !== "your-admin-email@gmail.com") {
    // Unauthorized
}
```

### 3. Database Models
All required MongoDB models are already defined in `/lib/models/schema.ts`:
- AdminOtp (with 5-minute expiry)
- Project
- Experience
- Skill
- Achievement
- FindMe

## API Endpoints

### Authentication
- `POST /api/admin/send-otp` - Send OTP to admin email
- `POST /api/admin/verify` - Verify OTP code

### Content Management
All content endpoints support standard REST operations:
- `GET /api/{endpoint}` - Fetch all items
- `POST /api/{endpoint}` - Create new item
- `PUT /api/{endpoint}?id={id}` - Update existing item
- `DELETE /api/{endpoint}?id={id}` - Delete item

Endpoints:
- `/api/projects`
- `/api/experience`
- `/api/skill`
- `/api/achievements`
- `/api/findMe`

## Usage

### 1. Login
1. Navigate to `/admin/auth`
2. Enter your admin email
3. Click "Send OTP"
4. Check your email for the 6-digit code
5. Enter the OTP and click "Verify OTP"
6. You'll be redirected to the admin dashboard

### 2. Managing Content
1. From the dashboard, click on any content type card
2. Use the "+ Add" button to create new items
3. Click "Edit" on any item to modify it
4. Click "Delete" to remove items (with confirmation)
5. All changes are immediately saved to the database

### 3. Session Management
- Sessions last for 2 hours
- After expiry, you'll need to log in again
- Use the "Logout" button in the navigation to end your session

## UI Components Used
- Card, CardContent, CardHeader, CardTitle - Content containers
- Button - Actions and navigation
- Input, Label - Form fields
- Dialog - Modal forms for creating/editing
- Toast notifications - User feedback

## Security Features
- Email-based authentication
- OTP expires after 5 minutes
- Session tokens expire after 2 hours
- Protected routes with automatic redirect
- Client-side and server-side validation
- Confirmation dialogs for destructive actions

## Styling
- Dark theme with gradient backgrounds
- Responsive design (mobile, tablet, desktop)
- Consistent color coding:
  - Blue: Projects
  - Green: Experience
  - Purple: Skills
  - Yellow: Achievements
  - Pink: Find Me Events

## Future Enhancements
- Image upload functionality
- Bulk operations
- Search and filtering
- Activity logs
- Multi-admin support
- Role-based permissions
