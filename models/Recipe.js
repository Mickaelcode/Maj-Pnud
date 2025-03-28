const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Votre fichier de configuration

const Recipe = sequelize.define('Recipe', {
  recipe_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  recipe_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'recipe',
  timestamps: false,
});

module.exports = Recipe;
