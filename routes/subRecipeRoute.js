const express = require("express");
const router = express.Router();
const subRecipeController = require("../controllers/subRecipeController");

router.post("/", subRecipeController.createSubRecipe);
router.get("/", subRecipeController.getAllSubRecipes);
router.get("/:id", subRecipeController.getSubRecipeById);
router.put("/:id", subRecipeController.updateSubRecipe);
router.delete("/:id", subRecipeController.deleteSubRecipe);


module.exports = router