# Entity Switching Test Plan

## Test Cases for Application Admin Entity Switching

### 1. Entity Switcher Visibility
- [ ] Entity switcher should only be visible for Application Admin users
- [ ] Entity switcher should be hidden for Business User and Admin roles
- [ ] Entity switcher should work in both collapsed and expanded sidebar states

### 2. Entity Switching Functionality
- [ ] Clicking on entity switcher should show dropdown with all available entities
- [ ] Available entities should include: HSBC Bank, Swiggy, Flipkart
- [ ] Selecting an entity should update the UI theme and branding
- [ ] Current selected entity should be highlighted with checkmark

### 3. Entity-Specific Data
- [ ] QR Scanner should generate entity-specific dummy data when switching entities
- [ ] PDF Upload should use entity-specific invoice numbers and GSTINs
- [ ] EGAM Repository should show entity-specific data
- [ ] All components should reflect the selected entity's branding

### 4. Theme and Branding Updates
- [ ] HSBC: Blue theme (#00338D, #4A90E2)
- [ ] Swiggy: Orange theme (#FF6B35, #FF8C42)
- [ ] Flipkart: Blue theme (#2874F0, #4A90E2)
- [ ] KPMG branding should be visible for all entities
- [ ] Entity name should update in sidebar header

### 5. Data Persistence
- [ ] Entity selection should persist during the session
- [ ] Switching entities should not lose other application state
- [ ] All data should be filtered by selected entity

## Expected Behavior

1. **Application Admin Login**: User with "Application Admin" role should see entity switcher in sidebar
2. **Entity Selection**: Clicking entity switcher shows dropdown with all entities
3. **Theme Update**: Selecting different entity updates colors and branding immediately
4. **Data Context**: All data operations should use the selected entity context
5. **UI Consistency**: All components should reflect the selected entity's theme and data

## Test Data

### HSBC Bank
- GSTIN: 27ABCDE1234F1Z5
- Invoice Prefix: HSBC-INV
- Theme: Blue (#00338D, #4A90E2)

### Swiggy
- GSTIN: 29SWIGGY1234F1Z5
- Invoice Prefix: SWIGGY-INV
- Theme: Orange (#FF6B35, #FF8C42)

### Flipkart
- GSTIN: 29FLIPKART1234F1Z5
- Invoice Prefix: FLIPKART-INV
- Theme: Blue (#2874F0, #4A90E2)
