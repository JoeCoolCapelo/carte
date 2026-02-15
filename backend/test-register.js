const axios = require('axios');

async function testRegister() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            nom: 'Test User 2',
            email: 'test2@example.com',
            motDePasse: 'password123'
        });
        console.log('✅ Inscription réussie !');
        console.log('Réponse:', response.data);
    } catch (error) {
        console.error('❌ Échec de l\'inscription :');
        console.error(error.response?.data || error.message);
    }
}

testRegister();
