const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const poiRoutes = require('./routes/poiRoutes');
const signalementRoutes = require('./routes/signalementRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/pois', poiRoutes);
app.use('/api/signalements', signalementRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Camayenne Maps' });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
