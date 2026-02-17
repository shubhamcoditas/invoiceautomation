Request ID: 56aaa918-8fe9-4091-ab75-e6964f41ebb3
# Request ID Tracking - Usage Guide

## Overview
Every API request is automatically assigned a unique Request ID that can be used to trace all logs and activities related to that request.

## Request ID Format
Request IDs are UUIDs in the format: `5fd11853-74f3-4f4f-a2ba-e57e1b1468c6`

## How to Use Request IDs

### 1. Finding Your Request ID

**From API Response Headers:**
Every API response includes the request ID in the `X-Request-ID` header:
```bash
curl -i http://localhost:5000/api/qr-data
# Look for: X-Request-ID: 5fd11853-74f3-4f4f-a2ba-e57e1b1468c6
```

**From Error Responses:**
Error responses include the request ID in the JSON body:
```json
{
  "error": "Failed to fetch data",
  "requestId": "5fd11853-74f3-4f4f-a2ba-e57e1b1468c6"
}
```

**From Server Logs:**
All server logs include the request ID in brackets:
```
[5fd11853-74f3-4f4f-a2ba-e57e1b1468c6] GET /api/qr-data 200 in 45ms
```

### 2. Searching Logs by Request ID

**System Logs:**
```bash
# Get all system logs for a specific request
GET /api/system-logs?requestId=5fd11853-74f3-4f4f-a2ba-e57e1b1468c6
```

**API Logs:**
```bash
# Get all API logs for a specific request
GET /api/api-logs?requestId=5fd11853-74f3-4f4f-a2ba-e57e1b1468c6
```

**Using cURL:**
```bash
curl "http://localhost:5000/api/system-logs?requestId=5fd11853-74f3-4f4f-a2ba-e57e1b1468c6"
```

### 3. Providing Your Own Request ID

You can provide your own request ID by including it in the request header:
```bash
curl -H "X-Request-ID: my-custom-request-id" http://localhost:5000/api/qr-data
```

This is useful for:
- Tracing requests across multiple services
- Correlating client-side and server-side logs
- Debugging distributed systems

### 4. In the Frontend

The System Logs UI component already supports searching by request ID. You can:
1. Navigate to the System Logs page
2. Use the search box to enter a request ID
3. The logs will be filtered to show only entries with that request ID

### 5. Query Scripts

**Using the API Query Script:**
```bash
# Query logs via API (requires server to be running)
node query-request-id.js 56aaa918-8fe9-4091-ab75-e6964f41ebb3

# Or with custom API URL
API_BASE_URL=http://localhost:5000 node query-request-id.js 56aaa918-8fe9-4091-ab75-e6964f41ebb3
```

**Using the Database Query Script:**
```bash
# Query logs directly from database (no server required)
node query-request-id-db.js 56aaa918-8fe9-4091-ab75-e6964f41ebb3
```

Both scripts will display:
- All system logs associated with the Request ID
- All API logs associated with the Request ID
- Detailed information including timestamps, parameters, and responses

### 6. Database Queries

If you're using the database service, you can query directly:
```sql
-- Find all system logs for a request
SELECT * FROM system_logs 
WHERE request_id = '5fd11853-74f3-4f4f-a2ba-e57e1b1468c6'
ORDER BY timestamp DESC;

-- Find all API logs for a request
SELECT * FROM api_logs 
WHERE request_id = '5fd11853-74f3-4f4f-a2ba-e57e1b1468c6'
ORDER BY timestamp DESC;
```

## Benefits

1. **End-to-End Tracing**: Track a request from start to finish across all services
2. **Debugging**: Quickly find all logs related to a specific request
3. **Error Correlation**: Link errors to the specific request that caused them
4. **Performance Analysis**: Track how long operations take for specific requests
5. **Audit Trail**: Maintain a complete record of all activities for a request

## Example Workflow

1. **Client makes request:**
   ```javascript
   fetch('/api/qr-data', {
     headers: { 'X-Request-ID': '5fd11853-74f3-4f4f-a2ba-e57e1b1468c6' }
   })
   ```

2. **Server processes request:**
   - Request ID is logged in all system logs
   - Request ID is included in all API logs
   - Request ID is returned in response headers

3. **If error occurs:**
   - Error response includes request ID
   - All related logs can be found using the request ID

4. **Debugging:**
   ```bash
   # Search for all logs related to this request
   curl "http://localhost:5000/api/system-logs?requestId=5fd11853-74f3-4f4f-a2ba-e57e1b1468c6"
   ```

## Notes

- Request IDs are automatically generated if not provided
- Request IDs are included in all error responses
- Request IDs are logged in all system and API logs
- Request IDs are included in response headers for client-side tracing

