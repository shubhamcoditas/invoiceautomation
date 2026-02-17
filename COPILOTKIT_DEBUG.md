# CopilotKit Debug Guide

## Current Issue
The CopilotKit is trying to connect to the cloud API (`https://api.cloud.copilotkit.ai/copilotkit/v1`) instead of the local runtime endpoint (`/api/copilotkit`).

## Debug Steps

### 1. **Check Server Status**
```bash
# Check if server is running
netstat -an | findstr :5000

# Or check process
tasklist | findstr node
```

### 2. **Test Runtime Endpoint**
```bash
# Test the endpoint directly
node test-server.js

# Or use the HTML test file
# Open test-copilotkit-endpoint.html in browser
```

### 3. **Check CopilotKit Configuration**

#### Frontend Configuration (App.tsx)
```typescript
<CopilotKit 
  runtimeUrl="/api/copilotkit"
  publicApiKey={undefined}
>
```

#### Backend Configuration (routes.ts)
```typescript
// Register CopilotKit runtime endpoint
app.post('/api/copilotkit', runtime.streamHttpServerResponse);
```

### 4. **Common Issues and Solutions**

#### Issue 1: Server Not Running
**Solution**: Start the server
```bash
npm run dev
```

#### Issue 2: Wrong API Key Configuration
**Solution**: Ensure `publicApiKey` is undefined and `runtimeUrl` is set
```typescript
<CopilotKit 
  runtimeUrl="/api/copilotkit"
  publicApiKey={undefined}
>
```

#### Issue 3: CORS Issues
**Solution**: Add CORS headers in server
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

#### Issue 4: Runtime Not Properly Configured
**Solution**: Check runtime configuration
```typescript
export const runtime = new CopilotRuntime({
  actions: [
    // ... your actions
  ],
});
```

### 5. **Test Commands**

#### Test Server Endpoint
```bash
# Using Node.js
node test-server.js

# Using curl (if available)
curl -X POST http://localhost:5000/api/copilotkit \
  -H "Content-Type: application/json" \
  -d '{"action": "getQRData", "parameters": {"limit": 5}}'
```

#### Test Frontend
1. Open browser developer tools
2. Check Network tab for requests to `/api/copilotkit`
3. Look for any errors in Console tab

### 6. **Expected Behavior**

#### When Working Correctly:
- Frontend should make requests to `http://localhost:5000/api/copilotkit`
- Server should respond with data from your database
- No requests to `https://api.cloud.copilotkit.ai`

#### When Not Working:
- Requests go to cloud API instead of local endpoint
- CORS errors in browser console
- Server not responding to requests

### 7. **Debug Checklist**

- [ ] Server is running on port 5000
- [ ] `/api/copilotkit` endpoint is accessible
- [ ] CopilotKit configuration uses `runtimeUrl` not `publicApiKey`
- [ ] No CORS issues
- [ ] Runtime actions are properly defined
- [ ] Database connection is working

### 8. **Next Steps**

1. **Start Server**: `npm run dev`
2. **Test Endpoint**: Run `node test-server.js`
3. **Check Browser**: Open developer tools and check Network tab
4. **Fix Configuration**: Ensure proper CopilotKit setup
5. **Test Chat**: Try using the AI Assistant

## Files to Check

- `client/src/App.tsx` - Frontend CopilotKit configuration
- `server/routes.ts` - Backend runtime configuration
- `test-server.js` - Server endpoint test
- `test-copilotkit-endpoint.html` - Frontend test
