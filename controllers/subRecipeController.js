const SubRecipe = require("../models/subRecipe");
const Recipe = require("../models/Recipe");

exports.createSubRecipe = async (req, res) => {
  try {
    const { label, label2, unit, periodicity, price, recipeId } = req.body;
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const subRecipe = await SubRecipe.create({ label, label2, unit, periodicity, price:price, recipeId });
    res.status(201).json(subRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSubRecipes = async (req, res) => {
  try {
    const subRecipes = await SubRecipe.findAll({
      include: [{ model: Recipe, as: "Recipe" }]
    });
    res.json(subRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateSubRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, label2, unit, periodicity, price, recipeId } = req.body;

    const subRecipe = await SubRecipe.findByPk(id);
    if (!subRecipe) return res.status(404).json({ error: "SubRecipe not found" });

    // Vérifier si la nouvelle recette existe avant de modifier
    if (recipeId) {
      const recipe = await Recipe.findByPk(recipeId);
      if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    }

    await subRecipe.update({ label, label2, unit, periodicity, price, recipeId });
    res.json({
      message:"mise a jour avec succes",
      subRecipe
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const subRecipe = await SubRecipe.findByPk(id);
    if (!subRecipe) return res.status(404).json({ error: "SubRecipe not found" });

    await subRecipe.destroy();
    res.json({ message: "SubRecipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const subRecipe = await SubRecipe.findOne({
      where: { subRecipe_id: id },
      include: {
        model: Recipe,
        attributes: ["recipe_id", "recipe_type", "label"], // Champs spécifiques de Recipe
      },
    });

    if (!subRecipe) {
      return res.status(404).json({ message: "Sous-recette non trouvée" });
    }

    res.json(subRecipe);
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

