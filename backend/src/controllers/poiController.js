const prisma = require('../prisma');

exports.createPoi = async (req, res) => {
    try {
        const { nom, description, adresse, altitude, photo, statut, categorieId, longitude, latitude } = req.body;
        const creeBy = req.user.id;

        await prisma.$executeRaw`
      INSERT INTO pois (nom, description, adresse, altitude, photo, statut, categorie_id, geom, cree_par, date_creation)
      VALUES (${nom}, ${description}, ${adresse}, ${altitude}, ${photo}, ${statut || 'ouvert'}, ${categorieId}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326), ${creeBy}, NOW())
    `;

        res.status(201).json({ message: 'POI créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du POI', error: error.message });
    }
};

exports.getAllPois = async (req, res) => {
    try {
        const pois = await prisma.$queryRaw`
      SELECT id, nom, description, adresse, altitude, photo, statut, categorie_id as "categorieId", 
             ST_X(geom) as longitude, ST_Y(geom) as latitude,
             cree_par as "creeBy", date_creation as "dateCreation"
      FROM pois
    `;
        res.json(pois);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des POI', error: error.message });
    }
};

exports.updatePoi = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, description, adresse, altitude, photo, statut, categorieId } = req.body;

        await prisma.poi.update({
            where: { id: parseInt(id) },
            data: { nom, description, adresse, altitude, photo, statut, categorieId }
        });

        res.json({ message: 'POI mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du POI', error: error.message });
    }
};

exports.deletePoi = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.poi.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'POI supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du POI', error: error.message });
    }
};
