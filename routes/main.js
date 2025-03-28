
const express = require("express")

const subRecipeRoutes = require("./subRecipeRoute")
const recipeRoutes = require("./Recipe")
const localizationRoute = require("./localizationRoute")
const attributionRoute = require("./attributionRoute")
const payementHistoryRoute = require("./payementHistoryRoute")
const ticketRoute = require("./ticketRoute")
const recipeStatRoute = require("./recipeStatRoute")
const perceptorLocationRoute = require("./perceptorLocationRoute")
const router = express.Router();

router.use("/recipes", recipeRoutes)
router.use("/subRecipes", subRecipeRoutes)
router.use('/localization', localizationRoute)
router.use('/attribution', attributionRoute)
router.use('/payementHistory', payementHistoryRoute)
router.use('/ticket', ticketRoute)
router.use('/recipeStat', recipeStatRoute)
router.use('/perceptorLocation', perceptorLocationRoute)

module.exports = router;