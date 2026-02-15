const express = require('express');
const router = express.Router();
const signalementController = require('../controllers/signalementController');
const auth = require('../middlewares/auth');

router.post('/', auth, signalementController.createSignalement);
router.get('/', auth, signalementController.getAllSignalements);
router.get('/poi/:poiId', signalementController.getPoiSignalements);
router.put('/:id', auth, signalementController.updateSignalementStatut);

module.exports = router;
