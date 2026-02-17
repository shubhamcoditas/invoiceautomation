# Fix Summary: UNIQUE Constraint Error Resolution

## Issue
You were encountering this error when inserting data:
```
SQL Error [19]: [SQLITE_CONSTRAINT_UNIQUE] A UNIQUE constraint failed (UNIQUE constraint failed: users.username)
```

## Root Cause
The `users` table has a UNIQUE constraint on the `username` column. When running `init-db.js` multiple times, it attempted to insert the same "admin" user repeatedly, causing the constraint violation.

## Changes Made

### 1. ✅ Fixed `init-db.js` (Idempotent Initialization)
**File**: `init-db.js`

**Changes**:
- Added checks before inserting admin user
- Added checks before inserting QR data
- Added checks before inserting EGAM data
- Added checks before inserting system logs

**Benefit**: You can now safely run this script multiple times without errors!

**Before**:
```javascript
// Would fail on second run
const insertUser = db.prepare(`INSERT INTO users ...`);
insertUser.run(adminUser.id, ...);
```

**After**:
```javascript
// Checks if user exists first
const checkUser = db.prepare('SELECT COUNT(*) as count FROM users WHERE username = ?');
const userExists = checkUser.get('admin');

if (userExists.count === 0) {
  // Only insert if doesn't exist
  const insertUser = db.prepare(`INSERT INTO users ...`);
  insertUser.run(adminUser.id, ...);
  console.log('Admin user created successfully');
} else {
  console.log('Admin user already exists, skipping user creation');
}
```

### 2. ✅ Enhanced `server/database.ts` (Error Handling)
**File**: `server/database.ts`

**Changes in `createUser()` method**:
- Pre-checks if username already exists
- Catches and handles UNIQUE constraint violations
- Returns clear error messages

**Before**:
```typescript
async createUser(user: ...) {
  // Would throw cryptic SQLite error
  const stmt = db.prepare(`INSERT INTO users ...`);
  stmt.run(id, user.username, ...);
  return { id, ...user };
}
```

**After**:
```typescript
async createUser(user: ...) {
  // Check if user already exists
  const existingUser = await this.getUserByUsername(user.username);
  if (existingUser) {
    throw new Error(`User with username '${user.username}' already exists`);
  }

  try {
    const stmt = db.prepare(`INSERT INTO users ...`);
    stmt.run(id, user.username, ...);
    return { id, ...user };
  } catch (error: any) {
    // Handle UNIQUE constraint violation
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      throw new Error(`User with username '${user.username}' already exists`);
    }
    throw error;
  }
}
```

**Changes in `createEGAMData()` method**:
- Pre-checks if IRN already exists
- Handles duplicates gracefully by returning existing data
- No more crashes on duplicate IRN

### 3. ✅ Created `reset-db.js` (Database Reset Utility)
**File**: `reset-db.js` (NEW)

**Purpose**: Safely delete the database when you want a fresh start

**Usage**:
```bash
node reset-db.js
```

### 4. ✅ Updated `package.json` (NPM Scripts)
**File**: `package.json`

**Added scripts**:
```json
{
  "scripts": {
    "db:init": "node init-db.js",
    "db:reset": "node reset-db.js && node init-db.js"
  }
}
```

**Usage**:
```bash
# Initialize database (safe to run multiple times)
npm run db:init

# Reset and re-initialize database
npm run db:reset
```

### 5. ✅ Created Documentation
**Files**: 
- `DATABASE_GUIDE.md` (NEW) - Comprehensive database management guide
- `FIX_SUMMARY.md` (NEW) - This file

## How to Use

### Quick Start
```bash
# If database doesn't exist or you want to ensure it's initialized
npm run db:init

# If you want a completely fresh database
npm run db:reset
```

### Normal Development Flow
1. Run `npm run db:init` once to create the database
2. The script will create tables and insert sample data
3. Run it again anytime - it won't duplicate data!

### If You Get UNIQUE Constraint Error

**Scenario 1: During initialization**
```bash
# Solution: The fix should prevent this, but if it happens:
npm run db:reset
```

**Scenario 2: In your application code**
```typescript
// Check if user exists first
const existingUser = await databaseService.getUserByUsername('username');
if (!existingUser) {
  await databaseService.createUser(userData);
}

// Or handle the error
try {
  await databaseService.createUser(userData);
} catch (error) {
  console.error('User already exists:', error.message);
}
```

## Testing the Fix

### Test 1: Run init-db.js twice
```bash
node init-db.js
node init-db.js  # Should not error!
```

**Expected Output**:
```
Creating database tables...
Inserting sample data...
Admin user already exists, skipping user creation
QR data already exists, skipping QR data insertion
EGAM data already exists, skipping EGAM data insertion
System logs already exist, skipping system logs insertion
Database initialized successfully!
```

### Test 2: Try creating duplicate user
```typescript
// First call - should succeed
await databaseService.createUser({
  username: 'testuser',
  password: 'password123',
  role: 'business_user'
});

// Second call - should throw clear error
try {
  await databaseService.createUser({
    username: 'testuser',  // Same username
    password: 'password456',
    role: 'business_user'
  });
} catch (error) {
  console.log(error.message);
  // Output: "User with username 'testuser' already exists"
}
```

## Files Changed

1. ✏️ `init-db.js` - Made idempotent with existence checks
2. ✏️ `server/database.ts` - Enhanced error handling
3. ✏️ `package.json` - Added database management scripts
4. ✨ `reset-db.js` - New database reset utility
5. ✨ `DATABASE_GUIDE.md` - New comprehensive guide
6. ✨ `FIX_SUMMARY.md` - This summary

## Database Schema with Constraints

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,  -- ⚠️ UNIQUE constraint here
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'business_user',
  entity_id TEXT NOT NULL DEFAULT 'hsbc',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### EGAM Repository Table
```sql
CREATE TABLE egam_repository (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL DEFAULT 'hsbc',
  irn TEXT UNIQUE NOT NULL,  -- ⚠️ UNIQUE constraint here
  invoice_no TEXT NOT NULL,
  date TEXT NOT NULL,
  vendor_gstin TEXT NOT NULL,
  amount TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processed',
  fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Key Benefits

✅ **No More Errors**: Init script can be run multiple times safely
✅ **Clear Error Messages**: Know exactly what went wrong
✅ **Easy Database Management**: Simple npm scripts
✅ **Graceful Handling**: Duplicate data handled properly
✅ **Production Ready**: Error handling suitable for production use

## Next Steps

1. **Test the fix**:
   ```bash
   npm run db:reset
   ```

2. **Run your application**:
   ```bash
   npm run dev
   ```

3. **If you encounter issues**:
   - Check `DATABASE_GUIDE.md` for detailed troubleshooting
   - Ensure database is not locked by other applications
   - Close DBeaver if connected to the database

## Support

For more information, see:
- `DATABASE_GUIDE.md` - Comprehensive database management guide
- `init-db.js` - Database initialization script
- `server/database.ts` - DatabaseService implementation

---

**Status**: ✅ FIXED - UNIQUE constraint errors have been resolved!

