// payementHistory.routes.js
const express = require('express');
const router = express.Router();
const payementHistoryController = require('../controllers/payementHistoryController');
const PayementHistory = require('../models/PayementHistory');
const getTaxReportWithComparison = require('../controllers/getTaxReport');





router.post('/', payementHistoryController.createPayementHistory);
router.get('/', payementHistoryController.getAllPayementHistory);
router.get('/fullTransaction', payementHistoryController.getFullTransactions);
router.get('/:id', payementHistoryController.getPayementHistoryById);
router.put('/:id', payementHistoryController.updatePayementHistory);
router.delete('/:id', payementHistoryController.deletePayementHistory);
router.get('/attribution/:attributionId', payementHistoryController.getPayementHistoryByAttributionId);
router.get('/getTotalBySubRecipe/ForMonth/', payementHistoryController.getTotalBySubRecipeForMonth)
router.get('/gettax/report/comparison',getTaxReportWithComparison)
//router.get('/get/notPayed/contribution',getAllNotPayedContribuable)

module.exports = router;
