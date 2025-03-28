const express = require('express');
const router = express.Router();
const localizationController = require('../controllers/localizationController');

router.post('/', localizationController.createLocalization);
router.get('/', localizationController.getAllLocalizations);
router.get('/:id', localizationController.getLocalizationById);
router.put('/:id', localizationController.updateLocalization);
router.delete('/:id', localizationController.deleteLocalization);
module.exports = router;
