const express = require('express');
const router = express.Router();
const attributionController = require('../controllers/attributionController');


router.post('/', attributionController.createAttribution);
router.get('/', attributionController.getAllAttributions);
router.get('/:id', attributionController.getAttributionById);
router.put('/:id', attributionController.updateAttribution);
router.delete('/:id', attributionController.deleteAttribution);
router.get('/subrecipe/:subrecipeId', attributionController.getAttributionsBySubrecipeId);
router.get('/contribuable/:contribuableId', attributionController.getAttributionsByContribuableId);
router.get('/contrib/attribuable/notPayed', attributionController.notPayed ) 

module.exports = router;
