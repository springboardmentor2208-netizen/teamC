const http = require('http');

const uniqueEmail = 'vikas.test.' + Date.now() + '@gmail.com';
console.log('Testing registration with email:', uniqueEmail);

const body = JSON.stringify({
    name: 'Vikas Test',
    email: uniqueEmail,
    password: 'Test12345'
});

const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
    }
}, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        try {
            const json = JSON.parse(data);
            console.log('Response:', JSON.stringify(json, null, 2));
        } catch {
            console.log('Raw response:', data);
        }
    });
});

req.on('error', e => console.log('Request error:', e.message));
req.write(body);
req.end();
