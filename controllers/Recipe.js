
const SubRecipe = require("../models/subRecipe");
const Attribution = require("../models/Attribution");
const PayementHistory = require("../models/PayementHistory");
const { Op, fn, col, literal } = require("sequelize");
const Recipe = require("../models/Recipe");
  


const createRecipe = async (req, res) => {
    try {

        const { recipe_type,label} = req.body;
        
    
        const subRecipe = await Recipe.create({ recipe_type,label});
        return res.json({ message: "Recipe ajouter avec succes",subRecipe });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};

const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findAll();
        console.log(recipe);
        res.status(201).json({ success: true, data: recipe, msg: "OK" });
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(400).json({ success: false, msg: "Bad request" });
    }
};

const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { recipe_type,label} = req.body;
    
        const recipe = await Recipe.findByPk(id);
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    
       
        await recipe.update({ recipe_type,label});
       return res.json({
          message:"mise a jour avec succes",
          recipe
        });
      } catch (error) {
       return res.status(500).json({ error: error.message });
      }
};

const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id);
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    
        await recipe.destroy();
        res.json({ message: "Recipe deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};


module.exports = { 
    createRecipe, 
    getRecipe, 
    updateRecipe, 
    deleteRecipe

};