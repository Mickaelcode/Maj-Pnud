const express = require("express");
const router = express.Router();
const {getDailySumByRecipeType, getWeeklySumByRecipeType, getMonthlySumByRecipeType, getYearlySumByRecipeType } = require("../controllers/recipeStatController");

router.get("/daily", getDailySumByRecipeType);
router.get("/weekly", getWeeklySumByRecipeType);
router.get("/monthly", getMonthlySumByRecipeType);
router.get("/yearly", getYearlySumByRecipeType);

module.exports = router;
