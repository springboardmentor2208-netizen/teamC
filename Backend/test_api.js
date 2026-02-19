const testBackend = async () => {
    try {
        console.log('Testing root endpoint...');
        const rootRes = await fetch('http://localhost:5000/');
        if (!rootRes.ok) throw new Error(`HTTP error! status: ${rootRes.status}`);
        const rootText = await rootRes.text();
        console.log('Root endpoint response:', rootText);

        console.log('\nTesting login with invalid credentials...');
        const loginRes = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'wrongpassword'
            })
        });

        const loginData = await loginRes.json();
        console.log('Login status:', loginRes.status);
        console.log('Login response:', JSON.stringify(loginData, null, 2));

        console.log('\nTesting registration...');
        const uniqueEmail = `test${Date.now()}@example.com`;
        const registerRes = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                username: `testuser${Date.now()}`,
                email: uniqueEmail,
                password: 'password123',
                phone: '1234567890'
            })
        });

        const registerData = await registerRes.json();
        console.log('Register status:', registerRes.status);
        console.log('Register response:', JSON.stringify(registerData, null, 2));

    } catch (error) {
        console.error('Backend seems down or unreachable:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
};

testBackend();
