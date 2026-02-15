const prisma = require('../prisma');

exports.createSignalement = async (req, res) => {
    try {
        const { type, description, poiId } = req.body;
        const utilisateurId = req.user.id;

        const signalement = await prisma.signalement.create({
            data: {
                type,
                description,
                poiId,
                utilisateurId
            }
        });

        res.status(201).json(signalement);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du signalement', error: error.message });
    }
};

exports.getPoiSignalements = async (req, res) => {
    try {
        const { poiId } = req.params;
        const signalements = await prisma.signalement.findMany({
            where: { poiId: parseInt(poiId) },
            include: { utilisateur: { select: { nom: true } } }
        });
        res.json(signalements);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des signalements', error: error.message });
    }
};

exports.getAllSignalements = async (req, res) => {
    try {
        const signalements = await prisma.signalement.findMany({
            orderBy: { dateCreation: 'desc' },
            include: {
                utilisateur: { select: { nom: true, email: true } },
                poi: { select: { nom: true } }
            }
        });
        res.json(signalements);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de tous les signalements', error: error.message });
    }
};

exports.updateSignalementStatut = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        const signalement = await prisma.signalement.update({
            where: { id: parseInt(id) },
            data: { statut }
        });

        res.json(signalement);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du signalement', error: error.message });
    }
};
