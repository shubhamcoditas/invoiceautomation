// Simple test to check if the server is running and the endpoint is accessible
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/copilotkit',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Send a test request
const postData = JSON.stringify({
  action: 'getQRData',
  parameters: { limit: 5 }
});

req.write(postData);
req.end();
