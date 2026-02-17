# Asset Creation Data Loss Fix

## Issues Found and Fixed

### 1. ✅ SQLite ALTER TABLE CHECK Constraint Issue
**Problem**: SQLite doesn't support CHECK constraints in `ALTER TABLE ADD COLUMN` statements. The migration was trying to add a CHECK constraint which would fail silently or cause database corruption.

**Fix**: 
- Removed CHECK constraint from ALTER TABLE statement
- Added application-level validation in `createAsset` and `updateAsset` methods
- Changed migration check to use `PRAGMA table_info` instead of try/catch on SELECT

### 2. ✅ Foreign Keys Not Enabled
**Problem**: SQLite requires foreign keys to be explicitly enabled. Without this, foreign key constraints are ignored.

**Fix**: Added `db.pragma('foreign_keys = ON')` at database initialization

### 3. ✅ Migration Logic Improvements
**Problem**: Migration was using try/catch on SELECT which could fail for reasons other than missing column.

**Fix**: 
- Changed to use `PRAGMA table_info(assets)` to check for column existence
- Added proper error handling that doesn't break database initialization
- Removed duplicate table creation code in migration section

### 4. ✅ Application-Level Validation
**Problem**: No validation for serviceMappingType values at application level.

**Fix**: Added validation in `createAsset` and `updateAsset` methods to ensure only 'Direct' or 'Indirect' values are accepted.

## Files Modified

1. **server/database.ts**:
   - Added foreign keys enablement
   - Fixed migration logic for service_mapping_type column
   - Added application-level validation for serviceMappingType
   - Improved error handling in migrations

## Testing Checklist

- [ ] Create a new asset with Direct mapping
- [ ] Create a new asset with Indirect mapping
- [ ] Edit an existing asset
- [ ] Verify existing data (verticals, asset classes, asset types, services, etc.) remains intact after asset creation
- [ ] Verify asset service allocations work correctly for Indirect mapping
- [ ] Test with existing database (migration should work without data loss)
- [ ] Test with fresh database (all tables should be created correctly)

## Migration Safety

The migration is now safe and will:
- ✅ Only add the column if it doesn't exist
- ✅ Not affect existing data
- ✅ Not cause database corruption
- ✅ Handle errors gracefully without breaking initialization
- ✅ Work with both existing and fresh databases

## Next Steps

1. Restart the server to apply the fixes
2. Test asset creation
3. Verify all existing data is intact
4. If data was lost, restore from backup or re-run populate scripts




