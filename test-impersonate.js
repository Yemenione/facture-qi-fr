const axios = require('axios');

async function testImpersonate() {
    try {
        // 1. Login first
        console.log('1. Logging in...');
        const loginRes = await axios.post('http://localhost:3001/auth/login', {
            email: 'expert@cabinet.fr',
            password: 'password123'
        });

        const token = loginRes.data.access_token;
        console.log('✅ Login successful, token:', token.substring(0, 20) + '...');

        // 2. Get companies
        console.log('\n2. Getting companies...');
        const companiesRes = await axios.get('http://localhost:3001/accountant/companies', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Companies:', companiesRes.data.map(c => ({ id: c.id, name: c.name })));

        if (companiesRes.data.length === 0) {
            console.log('❌ No companies found!');
            return;
        }

        const companyId = companiesRes.data[0].id;

        // 3. Test impersonate
        console.log(`\n3. Testing impersonate for company: ${companyId}...`);
        const impersonateRes = await axios.post(
            `http://localhost:3001/accountant/companies/${companyId}/impersonate`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('✅ Impersonate successful!');
        console.log('Response:', impersonateRes.data);

    } catch (error) {
        console.error('❌ Error:', error.response?.status, error.response?.data || error.message);
    }
}

testImpersonate();
