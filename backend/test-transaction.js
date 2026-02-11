async function testAddTransaction() {
    try {
        const baseUrl = 'http://localhost:3000';
        const email = "test" + Date.now() + "@example.com";
        
        // 1. Register
        console.log("Registering...");
        const regRes = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Username: "Test User",
                Useremail: email,
                Password: "password123"
            })
        });
        const regData = await regRes.json();
        console.log("Register Response:", regRes.status, regData);

        // 2. Login
        console.log("Logging in...");
        const loginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Useremail: email,
                Password: "password123"
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Logged in, token:", token ? "Yes" : "No");

        if (!token) {
            throw new Error("No token received");
        }

        // 3. Add Transaction
        console.log("Adding transaction...");
        const transactionRes = await fetch(`${baseUrl}/transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: "expense",
                amount: 50.50,
                category: "Food",
                description: "Test transaction",
                date: "2023-10-27"
            })
        });
        
        const transData = await transactionRes.json();
        console.log("Add Transaction Response:", transactionRes.status, transData);

    } catch (error) {
        console.error("Test Failed:", error);
    }
}

testAddTransaction();
