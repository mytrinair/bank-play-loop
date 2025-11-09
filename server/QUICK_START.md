# BankDojo Jr. Backend - Quick Start Guide

## Installation

```bash
# Install dependencies
npm install
# or
bun install
```

## Run the Server

```bash
# Using Bun (recommended)
bun run dev:server

# The server will start on http://localhost:3001
```

## Test the API

```bash
# Health check
curl http://localhost:3001/health

# Get sample student
curl http://localhost:3001/api/students/student-1

# Get sample teacher stats
curl http://localhost:3001/api/teachers/teacher-1/stats
```

## What Each File Does

### Core Files

1. **`index.ts`** - Main server file
   - Starts the Hono server
   - Sets up middleware (CORS, logging)
   - Connects all routes
   - Handles errors

2. **`types.ts`** - Type definitions
   - Defines all data structures (Student, Teacher, Class, Quest, etc.)
   - Ensures type safety across the API

3. **`db.ts`** - Database layer
   - In-memory storage (Maps)
   - Sample data initialization
   - No database setup required!

### Route Files

4. **`routes/students.ts`** - Student endpoints
   - Get/create students
   - Manage coins (earn/spend)
   - Set goals
   - Allocate coins between Save/Spend jars
   - Get transactions and activities

5. **`routes/teachers.ts`** - Teacher endpoints
   - Get/create teachers
   - Dashboard statistics
   - Class progress tracking

6. **`routes/quests.ts`** - Quest management
   - Create/update quests
   - Submit quest answers
   - Review and approve submissions
   - Award coins automatically

7. **`routes/classes.ts`** - Class management
   - Create/update classes
   - Join codes
   - Complexity presets (Starter/Core/Advanced)
   - Feature toggles (store, reflections, auto-split)

8. **`routes/store.ts`** - Store system
   - Create store items
   - Purchase items
   - Store lock/unlock
   - Purchase validation

9. **`routes/cycles.ts`** - Weekly cycles
   - Create cycles
   - Cycle summaries
   - Weekly resets

10. **`routes/transactions.ts`** - Transaction history
    - Get transactions
    - Filter by student, type, jar, cycle

## Key Concepts

### Complexity Presets
- **Starter**: Needs vs Wants + jars
- **Core**: Starter + budgeting
- **Advanced**: Core + mini-life simulation

### Feature Toggles
- `storeEnabled`: Enable/disable store
- `storeLocked`: Lock store until goal met
- `reflectionsRequired`: Require reflections
- `autoSplitEnabled`: Auto-split coins vs student choice
- `minSavePercentage`: Minimum save percentage

### Save/Spend Jars
- **Save jar**: For goals and future purchases
- **Spend jar**: For immediate purchases
- Students can allocate coins between jars
- Teachers can enable auto-split

### Quests
- Types: Needs vs Wants, Budgeting, Comparison, Goal Setting
- Students submit answers
- Teachers review and approve
- Coins awarded on approval

### Goals
- Students set goals (e.g., "New Backpack")
- Track progress toward goal
- Store can be locked until goal is met

## Sample Data

The database is initialized with sample data:
- 1 teacher (Mrs. Johnson)
- 2 classes (Morning Class - Core, Afternoon Class - Starter)
- 1 student (Alex)
- 3 quests
- 2 store items
- Sample transactions and activities

## Next Steps

1. **Connect Frontend**: Update React components to use these APIs
2. **Add Authentication**: Add JWT tokens or sessions
3. **Add Real Database**: Replace in-memory storage with PostgreSQL
4. **Test Endpoints**: Use Postman or curl to test all endpoints

## Common Operations

### Student completes a quest
1. Student submits quest answer: `POST /api/quests/:id/submit`
2. Teacher approves: `POST /api/quests/:id/submissions/:submissionId/review`
3. Coins automatically awarded to student

### Student purchases item
1. Student purchases: `POST /api/store/:id/purchase`
2. Coins deducted from Spend jar
3. Transaction and activity created

### Student allocates coins
1. Student allocates: `POST /api/students/:id/allocate`
2. Coins split between Save/Spend jars
3. Validates minimum save percentage (if set)

### Teacher creates class
1. Teacher creates class: `POST /api/classes`
2. Join code generated automatically
3. Students join using join code: `POST /api/classes/:id/join`

## API Base URL

All endpoints are prefixed with `/api`:
- Students: `/api/students`
- Teachers: `/api/teachers`
- Quests: `/api/quests`
- Classes: `/api/classes`
- Store: `/api/store`
- Cycles: `/api/cycles`
- Transactions: `/api/transactions`

## Need Help?

- See `README.md` for detailed documentation
- See `API_REFERENCE.md` for complete API reference
- Check the PRD for feature requirements

Happy coding! 🚀

