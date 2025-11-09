# BankDojo Jr. API Reference

Quick reference for all API endpoints.

## Base URL
```
http://localhost:3001
```

Note: Default port is 3001 to avoid conflicts. You can change it with the PORT environment variable:
```bash
PORT=3002 bun run dev:server
```

## Health Check
```
GET /health
```

## Students

### Get All Students
```
GET /api/students?classId={classId}
```

### Get Student
```
GET /api/students/:id
```

### Create Student
```
POST /api/students
Body: { name, email, classId, avatarId? }
```

### Get Student Transactions
```
GET /api/students/:id/transactions
```

### Get Student Activities
```
GET /api/students/:id/activities
```

### Get Available Quests
```
GET /api/students/:id/quests
```

### Allocate Coins
```
POST /api/students/:id/allocate
Body: { saveAmount, spendAmount }
```

### Update Coins
```
POST /api/students/:id/coins
Body: { amount, jar, description? }
```

### Set Goal
```
PUT /api/students/:id/goal
Body: { name, targetAmount }
```

## Teachers

### Get All Teachers
```
GET /api/teachers
```

### Get Teacher
```
GET /api/teachers/:id
```

### Create Teacher
```
POST /api/teachers
Body: { name, email }
```

### Get Teacher Stats
```
GET /api/teachers/:id/stats
```

### Get Class Progress
```
GET /api/teachers/:id/classes/:classId/progress
```

## Quests

### Get All Quests
```
GET /api/quests?classId={classId}&complexity={complexity}&activeOnly={true|false}
```

### Get Quest
```
GET /api/quests/:id
```

### Create Quest
```
POST /api/quests
Body: { title, description, type, rewardCoins, classId?, complexity, startDate?, endDate? }
```

### Update Quest
```
PUT /api/quests/:id
Body: { ...quest fields }
```

### Submit Quest
```
POST /api/quests/:id/submit
Body: { studentId, answer, reflection? }
```

### Get Quest Submissions
```
GET /api/quests/:id/submissions?status={pending|approved|returned}
```

### Review Submission
```
POST /api/quests/:id/submissions/:submissionId/review
Body: { status: "approved"|"returned", teacherId }
```

## Classes

### Get All Classes
```
GET /api/classes?teacherId={teacherId}
```

### Get Class
```
GET /api/classes/:id
```

### Create Class
```
POST /api/classes
Body: { 
  name, teacherId, grade, complexity,
  storeEnabled?, storeLocked?, reflectionsRequired?, 
  surpriseEventsEnabled?, autoSplitEnabled?, 
  autoSplitRatio?, minSavePercentage?, cycleLengthDays?
}
```

### Update Class
```
PUT /api/classes/:id
Body: { ...class fields }
```

### Join Class
```
POST /api/classes/:id/join
Body: { studentId, joinCode }
```

### Get Class by Join Code
```
GET /api/classes/join/:joinCode
```

### Regenerate Join Code
```
POST /api/classes/:id/regenerate-join-code
```

## Store

### Get All Store Items
```
GET /api/store?classId={classId}
```

### Get Store Item
```
GET /api/store/:id
```

### Create Store Item
```
POST /api/store
Body: { name, description, cost, imageUrl?, classId? }
```

### Update Store Item
```
PUT /api/store/:id
Body: { ...store item fields }
```

### Purchase Item
```
POST /api/store/:id/purchase
Body: { studentId }
```

### Get Purchases
```
GET /api/store/purchases?studentId={studentId}
```

## Cycles

### Get All Cycles
```
GET /api/cycles?classId={classId}&activeOnly={true|false}
```

### Get Cycle
```
GET /api/cycles/:id
```

### Get Cycle Summary
```
GET /api/cycles/:id/summary?studentId={studentId}
```

### Create Cycle
```
POST /api/cycles
Body: { classId, startDate?, endDate? }
```

### Reset Cycle
```
POST /api/cycles/:id/reset
```

## Transactions

### Get All Transactions
```
GET /api/transactions?studentId={studentId}&type={earn|spend|transfer}&jar={save|spend}&cycleId={cycleId}
```

### Get Transaction
```
GET /api/transactions/:id
```

## Complexity Presets

- **Starter**: Needs vs Wants + jars
- **Core**: Starter + budgeting
- **Advanced**: Core + mini-life simulation

## Quest Types

- `Needs vs Wants`
- `Budgeting`
- `Comparison`
- `Goal Setting`

## Feature Toggles (Class Settings)

- `storeEnabled`: Enable/disable store
- `storeLocked`: Lock store until goal is met
- `reflectionsRequired`: Require reflections on quests
- `surpriseEventsEnabled`: Enable surprise events (Advanced)
- `autoSplitEnabled`: Auto-split coins vs student choice
- `autoSplitRatio`: Ratio for auto-split (e.g., { save: 60, spend: 40 })
- `minSavePercentage`: Minimum percentage that must go to Save jar

## Response Format

All responses are JSON:

```json
{
  "data": {...},
  "error": "Error message",
  "details": [...]
}
```

## Error Codes

- `400` - Bad Request (validation error)
- `403` - Forbidden (permission denied)
- `404` - Not Found
- `500` - Internal Server Error

