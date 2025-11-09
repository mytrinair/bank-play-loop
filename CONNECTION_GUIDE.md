# Frontend-Backend Connection Guide

## ✅ Connection Complete!

The frontend is now connected to the backend API. Here's what was implemented:

## What Was Done

### 1. API Service Layer (`src/lib/api.ts`)
- Created centralized API client with base URL configuration
- Implemented all API endpoints (students, teachers, quests, classes, store, cycles, transactions)
- Type-safe API calls with TypeScript
- Error handling built-in

### 2. React Query Hooks (`src/hooks/use-api.ts`)
- Created custom hooks for all API operations
- Automatic caching and refetching
- Optimistic updates for mutations
- Query invalidation on mutations

### 3. Updated Components
- **StudentDashboard**: Now fetches real data from API
  - Student info, coins, goals
  - Available quests
  - Activity feed
  - Transaction history
  
- **TeacherDashboard**: Now fetches real data from API
  - Teacher stats
  - Classes
  - Pending quest submissions
  - Concept mastery progress

### 4. Backend Updates
- Added endpoint for teacher pending submissions
- Enhanced CORS configuration for development
- Improved error handling

## Configuration

### API Base URL
The API base URL is configured in `src/lib/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

### Environment Variables
Create a `.env` file (optional):
```env
VITE_API_URL=http://localhost:3001
```

## Running the Application

### 1. Start the Backend
```bash
bun run dev:server
```
Backend runs on `http://localhost:3001`

### 2. Start the Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:8080`

### 3. Run Both Together
```bash
npm run dev:all
```
This runs both frontend and backend simultaneously.

## Testing the Connection

### 1. Health Check
```bash
curl http://localhost:3001/health
```

### 2. Test Student Data
```bash
curl http://localhost:3001/api/students/student-1
```

### 3. Test Teacher Stats
```bash
curl http://localhost:3001/api/teachers/teacher-1/stats
```

### 4. Frontend
1. Open `http://localhost:8080/student` - Should show student dashboard with real data
2. Open `http://localhost:8080/teacher` - Should show teacher dashboard with real data

## Sample Data

The backend includes sample data:
- **Teacher**: Mrs. Johnson (teacher-1)
- **Student**: Alex (student-1)
- **Classes**: Morning Class (Core), Afternoon Class (Starter)
- **Quests**: 3 quests available
- **Store Items**: 2 items available

## API Endpoints Used

### Student Dashboard
- `GET /api/students/student-1` - Get student data
- `GET /api/students/student-1/quests` - Get available quests
- `GET /api/students/student-1/activities` - Get activity feed
- `GET /api/students/student-1/transactions` - Get transaction history

### Teacher Dashboard
- `GET /api/teachers/teacher-1` - Get teacher data
- `GET /api/teachers/teacher-1/stats` - Get dashboard statistics
- `GET /api/teachers/teacher-1/pending-submissions` - Get pending quest submissions
- `GET /api/classes?teacherId=teacher-1` - Get teacher's classes
- `POST /api/quests/:id/submissions/:submissionId/review` - Approve/return quest submissions

## Features Working

✅ Student dashboard displays real data from API
✅ Teacher dashboard displays real data from API
✅ Quest listings from API
✅ Activity feed from API
✅ Teacher can approve/return quest submissions
✅ Stats and progress tracking
✅ Loading states
✅ Error handling

## Next Steps

1. **Add Authentication**: Implement user login/session management
2. **Add Quest Submission UI**: Create form for students to submit quests
3. **Add Store UI**: Create store page for purchasing items
4. **Add Goal Setting UI**: Allow students to set goals
5. **Add Real-time Updates**: Use WebSockets or polling for real-time updates

## Troubleshooting

### CORS Errors
If you see CORS errors, make sure:
1. Backend is running on port 3001
2. Frontend is running on port 8080
3. CORS is properly configured in `server/index.ts`

### API Not Responding
1. Check if backend is running: `curl http://localhost:3001/health`
2. Check backend logs for errors
3. Verify API base URL in `src/lib/api.ts`

### Data Not Loading
1. Check browser console for errors
2. Check React Query DevTools (if installed)
3. Verify student/teacher IDs match sample data
4. Check network tab for API requests

## Files Changed

- `src/lib/api.ts` - API service layer
- `src/hooks/use-api.ts` - React Query hooks
- `src/pages/StudentDashboard.tsx` - Updated to use API
- `src/pages/TeacherDashboard.tsx` - Updated to use API
- `server/routes/teachers.ts` - Added pending submissions endpoint
- `server/index.ts` - Enhanced CORS configuration

## Success! 🎉

The frontend is now fully connected to the backend API. You can:
- View student data from the API
- View teacher data from the API
- See real quests, activities, and transactions
- Approve/return quest submissions (teacher)
- View statistics and progress

Happy coding! 🚀

