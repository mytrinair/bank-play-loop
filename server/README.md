# BankDojo Jr. Backend API

Complete backend implementation for BankDojo Jr. - Unlimited Financial Life Platform (Grades 1-5), based on the PRD.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
# or
bun install
```

### Run the Server
```bash
# Using Bun (recommended - fastest)
bun run dev:server

# The server will start on http://localhost:3001
```

### Run Frontend + Backend Together
```bash
npm run dev:all
```

This runs both the Vite frontend (port 8080) and the backend server (port 3001) simultaneously.

## 📁 Project Structure

```
server/
├── index.ts              # Main server entry point
├── types.ts              # TypeScript type definitions (all entities)
├── db.ts                 # In-memory database & initialization
├── routes/               # API route handlers
│   ├── students.ts       # Student endpoints
│   ├── teachers.ts       # Teacher endpoints
│   ├── quests.ts         # Quest management & submissions
│   ├── classes.ts        # Class management & join codes
│   ├── store.ts          # Store items & purchases
│   ├── cycles.ts         # Weekly cycles & resets
│   └── transactions.ts   # Transaction history
└── README.md             # This file
```

## 📖 What Each Part Does

### 1. `server/index.ts` - Main Server File
**Purpose**: The entry point that sets up and starts the Hono server.

**Key Components**:
- **Hono app instance**: Creates the main application
- **Middleware**: 
  - `logger()` - Logs all HTTP requests for debugging
  - `cors()` - Allows the frontend to make API requests (enables CORS)
  - `prettyJSON()` - Formats JSON responses nicely in development
- **Route mounting**: Connects all route handlers to the app
- **Error handling**: Catches and handles errors gracefully
- **Server startup**: Starts the server on port 3001 (or PORT env variable)

**What it does**: When you start the server, this file initializes the database, sets up middleware, connects all routes, and starts listening for HTTP requests.

---

### 2. `server/types.ts` - Type Definitions
**Purpose**: Defines all the data structures used throughout the API, matching the PRD requirements.

**Key Types**:
- `Student` - Student user data (coins, goals, class membership, avatar)
- `Teacher` - Teacher user data
- `Class` - Classroom data with complexity presets and feature toggles
- `Quest` - Educational quests/challenges with types and complexity levels
- `QuestSubmission` - Student answers to quests with reflection support
- `Transaction` - Coin transactions (earn/spend) with jar tracking
- `StoreItem` - Store items that can be purchased
- `Purchase` - Purchase records
- `Cycle` - Weekly cycles for the financial life simulation
- `Goal` - Student goals with progress tracking
- `Activity` - Activity feed entries
- `TeacherStats` - Dashboard statistics

**Complexity Presets**: `Starter`, `Core`, `Advanced` - as defined in PRD
**Quest Types**: `Needs vs Wants`, `Budgeting`, `Comparison`, `Goal Setting`

---

### 3. `server/db.ts` - Database Layer
**Purpose**: Provides in-memory data storage (perfect for hackathons - no database setup needed!).

**Key Components**:
- **`db` object**: A Map-based storage system for all data types
- **`initDatabase()` function**: Creates sample data for development/demo

**What it does**: 
- Stores all application data in memory (students, teachers, classes, quests, etc.)
- Provides sample data so you can test immediately
- **Note**: Data is lost when server restarts (perfect for hackathons, but you'd use a real database in production)

**Why Maps?**: Maps are fast for lookups and don't require database setup. Perfect for rapid prototyping!

---

### 4. `server/routes/students.ts` - Student Endpoints
**Purpose**: Handles all API requests related to students.

**Endpoints**:
- `GET /api/students` - Get all students (optionally filtered by classId)
- `GET /api/students/:id` - Get a specific student
- `POST /api/students` - Create a new student
- `GET /api/students/:id/transactions` - Get student's transaction history
- `GET /api/students/:id/activities` - Get student's activity feed
- `GET /api/students/:id/quests` - Get available quests for student
- `POST /api/students/:id/allocate` - Allocate coins between Save and Spend jars
- `POST /api/students/:id/coins` - Update student's coins (earn/spend)
- `PUT /api/students/:id/goal` - Set or update student's current goal

**Key Features**:
- Supports auto-split mode (teacher-controlled) or student choice
- Validates minimum save percentage (if set by teacher)
- Updates goal progress automatically
- Creates transaction and activity records

**Example Request**:
```bash
# Get student by ID
GET http://localhost:3000/api/students/student-1

# Allocate coins (student choice mode)
POST http://localhost:3000/api/students/student-1/allocate
Body: { "saveAmount": 60, "spendAmount": 40 }

# Set a goal
PUT http://localhost:3000/api/students/student-1/goal
Body: { "name": "New Backpack 🎒", "targetAmount": 75 }
```

---

### 5. `server/routes/teachers.ts` - Teacher Endpoints
**Purpose**: Handles all API requests related to teachers.

**Endpoints**:
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get a specific teacher with their classes
- `POST /api/teachers` - Create a new teacher
- `GET /api/teachers/:id/stats` - Get teacher dashboard statistics
- `GET /api/teachers/:id/classes/:classId/progress` - Get class progress heatmap

**Key Features**:
- Calculates dashboard statistics (active students, quests completed, pending reviews, etc.)
- Concept mastery tracking (Needs vs Wants, Budgeting, Comparison, Goal Setting)
- Progress heatmap for classes

**Example Request**:
```bash
# Get teacher stats
GET http://localhost:3000/api/teachers/teacher-1/stats

# Get class progress
GET http://localhost:3000/api/teachers/teacher-1/classes/class-1/progress
```

---

### 6. `server/routes/quests.ts` - Quest Endpoints
**Purpose**: Handles quest management and submissions.

**Endpoints**:
- `GET /api/quests` - Get all quests (optionally filtered by classId, complexity, active)
- `GET /api/quests/:id` - Get a specific quest
- `POST /api/quests` - Create a new quest
- `PUT /api/quests/:id` - Update a quest
- `POST /api/quests/:id/submit` - Submit an answer to a quest
- `GET /api/quests/:id/submissions` - Get all submissions for a quest
- `POST /api/quests/:id/submissions/:submissionId/review` - Review a quest submission (approve/return)

**Key Features**:
- Supports time windows (startDate/endDate)
- Quest submission with optional reflection (120 char limit)
- Automatic coin awarding when approved
- Goal progress updates when coins are earned
- Prevents duplicate submissions

**Example Request**:
```bash
# Submit a quest answer
POST http://localhost:3000/api/quests/quest-1/submit
Body: { 
  "studentId": "student-1", 
  "answer": "Needs are food and water...",
  "reflection": "I learned that needs come first!"
}

# Approve a submission
POST http://localhost:3000/api/quests/quest-1/submissions/submission-123/review
Body: { "status": "approved", "teacherId": "teacher-1" }
```

---

### 7. `server/routes/classes.ts` - Class Management Endpoints
**Purpose**: Handles classroom management with complexity presets and feature toggles.

**Endpoints**:
- `GET /api/classes` - Get all classes (optionally filtered by teacherId)
- `GET /api/classes/:id` - Get a specific class with students
- `POST /api/classes` - Create a new class
- `PUT /api/classes/:id` - Update class settings
- `POST /api/classes/:id/join` - Join a class using join code
- `GET /api/classes/join/:joinCode` - Get class info by join code
- `POST /api/classes/:id/regenerate-join-code` - Regenerate join code

**Key Features**:
- Complexity presets: Starter, Core, Advanced
- Feature toggles: store enabled/locked, reflections required, surprise events, auto-split
- Auto-split ratio configuration (e.g., 60/40)
- Minimum save percentage requirement
- Join code generation and management

**Example Request**:
```bash
# Create a class with Core complexity
POST http://localhost:3000/api/classes
Body: { 
  "name": "Morning Class", 
  "teacherId": "teacher-1", 
  "grade": "Grade 3", 
  "complexity": "Core",
  "storeEnabled": true,
  "storeLocked": false,
  "autoSplitEnabled": false,
  "minSavePercentage": 20
}

# Join a class
POST http://localhost:3000/api/classes/class-1/join
Body: { "studentId": "student-1", "joinCode": "ABC-123" }
```

---

### 8. `server/routes/store.ts` - Store Endpoints
**Purpose**: Handles store items and purchases.

**Endpoints**:
- `GET /api/store` - Get all store items (optionally filtered by classId)
- `GET /api/store/:id` - Get a specific store item
- `POST /api/store` - Create a new store item
- `PUT /api/store/:id` - Update a store item
- `POST /api/store/:id/purchase` - Purchase a store item
- `GET /api/store/purchases` - Get purchases (optionally filtered by studentId)

**Key Features**:
- Store lock/unlock based on class settings
- Goal-based store locking (lock until goal is met)
- Spend jar validation (items can only be bought with Spend jar)
- Automatic transaction and activity creation
- Class-specific items

**Example Request**:
```bash
# Create a store item
POST http://localhost:3000/api/store
Body: { 
  "name": "Art Supplies", 
  "description": "Colored pencils and markers",
  "cost": 8,
  "classId": "class-1"
}

# Purchase an item
POST http://localhost:3000/api/store/item-1/purchase
Body: { "studentId": "student-1" }
```

---

### 9. `server/routes/cycles.ts` - Cycle Management Endpoints
**Purpose**: Handles weekly cycles, resets, and cycle summaries.

**Endpoints**:
- `GET /api/cycles` - Get all cycles (optionally filtered by classId, active)
- `GET /api/cycles/:id` - Get a specific cycle
- `GET /api/cycles/:id/summary` - Get cycle summary for a student
- `POST /api/cycles` - Create a new cycle
- `POST /api/cycles/:id/reset` - Reset cycle for a class (weekly reset)

**Key Features**:
- Weekly cycle management
- Cycle summaries (coins earned/spent, save rate, goal met, quests completed)
- Automatic cycle creation
- Cycle reset functionality

**Example Request**:
```bash
# Get cycle summary
GET http://localhost:3000/api/cycles/cycle-1/summary?studentId=student-1

# Reset cycle (creates new cycle)
POST http://localhost:3000/api/cycles/cycle-1/reset
```

---

### 10. `server/routes/transactions.ts` - Transaction Endpoints
**Purpose**: Handles transaction history and queries.

**Endpoints**:
- `GET /api/transactions` - Get all transactions (optionally filtered by studentId, type, jar, cycleId)
- `GET /api/transactions/:id` - Get a specific transaction

**Key Features**:
- Filter by student, type, jar, or cycle
- Enriched data (includes student, quest, store item info)
- Sorted by most recent first

---

## 🔧 How It All Works Together

1. **Request comes in** → `server/index.ts` receives it
2. **Middleware processes it** → CORS, logging, JSON formatting
3. **Route handler processes it** → The appropriate route file handles the request
4. **Database interaction** → Data is read from or written to `db.ts`
5. **Validation** → Zod schemas validate input data
6. **Response sent back** → JSON response returned to frontend

## 🧪 Testing the API

You can test the API using:
- **Browser**: Visit `http://localhost:3000/health`
- **curl**: `curl http://localhost:3000/api/students/student-1`
- **Postman/Insomnia**: Import the endpoints and test
- **Frontend**: Use React Query (already set up in your frontend!)

## 📋 PRD Implementation Status

### ✅ Implemented Features

**CUJ A - Student Weekly Money Loop**
- ✅ Student joins class via code
- ✅ Quest completion and coin earning
- ✅ Save/Spend jar allocation (auto-split or student choice)
- ✅ Goal setting and tracking
- ✅ Store purchases
- ✅ Transaction history
- ✅ Activity feed

**CUJ B - Teacher Low-Lift Deployment**
- ✅ Create and configure class
- ✅ Complexity presets (Starter/Core/Advanced)
- ✅ Feature toggles (store, reflections, surprise events, auto-split)
- ✅ Quest assignment and approval
- ✅ Dashboard statistics
- ✅ Class progress tracking

**Platform Features**
- ✅ In-memory database (perfect for hackathon)
- ✅ Type-safe API (TypeScript + Zod)
- ✅ RESTful design
- ✅ Error handling
- ✅ Sample data included

### 🚧 Not Yet Implemented (Post-MVP)
- Surprise events (Advanced preset)
- Parent portal/email summaries
- CSV export
- Custom quest builder
- Offline tolerance
- Real database integration

## 🚀 Next Steps

1. **Connect Frontend**: Update your React components to call these API endpoints
2. **Add Authentication**: Add JWT tokens or session-based auth
3. **Add Real Database**: Replace in-memory storage with PostgreSQL/MongoDB
4. **Add Surprise Events**: Implement surprise event system for Advanced preset
5. **Add Parent Features**: Implement parent portal and email summaries

## 📝 Notes for Hackathon

- **In-memory database**: Data resets on server restart (perfect for demos!)
- **No authentication**: Add this if you need user login
- **CORS enabled**: Frontend can make requests from `localhost:8080` and `localhost:5173`
- **Sample data**: `initDatabase()` creates demo data automatically
- **Type-safe**: Full TypeScript support for fewer bugs
- **PRD-compliant**: Implements all P0 features from the PRD

## 🎯 Key Features

✅ Fast setup (no database required)  
✅ Type-safe (TypeScript + Zod validation)  
✅ RESTful API design  
✅ Sample data included  
✅ CORS enabled for frontend  
✅ Error handling  
✅ Request logging  
✅ PRD-compliant implementation  
✅ Complexity presets (Starter/Core/Advanced)  
✅ Feature toggles (store, reflections, auto-split)  
✅ Goal tracking  
✅ Quest submission and approval  
✅ Store with purchase system  
✅ Weekly cycles  

Happy coding! 🚀

