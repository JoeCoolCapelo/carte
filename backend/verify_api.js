const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    console.log('Testing Backend API endpoints...');

    try {
        // 1. Health check
        console.log('\n1. Testing Health Check...');
        const health = await axios.get(`${BASE_URL}/health`);
        console.log('Health:', health.data);

        // 2. Places
        console.log('\n2. Testing Places List...');
        const places = await axios.get(`${BASE_URL}/places?limit=2`);
        console.log(`Found ${places.data.length} places (Sample: ${places.data[0]?.name})`);

        // 3. Search
        console.log('\n3. Testing Search...');
        const search = await axios.get(`${BASE_URL}/search?q=pharmacie`);
        console.log(`Search result for "pharmacie": ${search.data.length} results`);

        // 4. Auth
        console.log('\n4. Testing Mock Login...');
        const auth = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'test@camayenne.gn',
            password: 'password123'
        });
        console.log('Auth Token received:', auth.data.token);

        // 5. Routing (Dry run check)
        // Coords near Camayenne
        const start = '-13.6785,9.5370';
        const end = '-13.6820,9.5180';
        console.log(`\n5. Testing Routing (from ${start} to ${end})...`);
        const route = await axios.get(`${BASE_URL}/routes?start=${start}&end=${end}`);
        console.log(`Route length: ${route.data.distance} meters`);

        console.log('\n✅ All basic endpoint tests passed!');
    } catch (error) {
        console.error('\n❌ Test failed:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testEndpoints();
