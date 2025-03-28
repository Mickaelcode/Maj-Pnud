const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Recipe = require("./Recipe");

const SubRecipe = sequelize.define('SubRecipe', {
  subRecipe_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  label2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  periodicity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "recipe",
      key: "recipe_id"
    }
  }
}, {
  tableName: 'subrecipe',
  timestamps: false,
});

Recipe.hasMany(SubRecipe, { foreignKey: "recipeId", onDelete: "CASCADE" });
SubRecipe.belongsTo(Recipe, { foreignKey: "recipeId" });

module.exports = SubRecipe;

