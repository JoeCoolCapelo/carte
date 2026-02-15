const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    console.log('Requête d\'inscription reçue:', req.body);
    try {
        const { nom, email, motDePasse } = req.body;
        if (!nom || !email || !motDePasse) {
            console.log('Champs manquants');
            return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
        }

        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        const user = await prisma.utilisateur.create({
            data: {
                nom,
                email,
                motDePasse: hashedPassword
            }
        });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user: { id: user.id, nom: user.nom, email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
    }
};

exports.login = async (req, res) => {
    console.log('Tentative de connexion pour:', req.body.email);
    try {
        const { email, motDePasse } = req.body;

        const user = await prisma.utilisateur.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Identifiants invalides' });

        const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isMatch) return res.status(400).json({ message: 'Identifiants invalides' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ user: { id: user.id, nom: user.nom, email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
};
