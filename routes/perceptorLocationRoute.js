const express = require('express');
const router = express.Router();
const PerceptorLocationController = require('../controllers/perceptorLocationController');

router.post('/', PerceptorLocationController.createPerceptorLocation);
router.get('/', PerceptorLocationController.getAllPerceptorLocations);
router.get('/:id', PerceptorLocationController.getPerceptorLocationById);
router.put('/:id', PerceptorLocationController.updatePerceptorLocation);
router.delete('/:id', PerceptorLocationController.deletePerceptorLocation);
router.post("/perceptorId", PerceptorLocationController.getPerceptorLocationByPerceptorId)

module.exports = router;