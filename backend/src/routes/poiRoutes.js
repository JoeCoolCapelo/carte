const express = require('express');
const router = express.Router();
const poiController = require('../controllers/poiController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', poiController.getAllPois);
router.post('/', auth, admin, poiController.createPoi);
router.put('/:id', auth, admin, poiController.updatePoi);
router.delete('/:id', auth, admin, poiController.deletePoi);

module.exports = router;
