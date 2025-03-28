const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Localization = require("./Localization");

const PerceptorLocation = sequelize.define('PerceptorLocation', {
  perceptorLocation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  perceptor_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  localizationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "localizations",
      key: "localization_id"
    }
  }
}, {
  tableName: 'perceptorlocation',
  timestamps: false,
});

PerceptorLocation.belongsTo(Localization, {
  foreignKey: "localizationId",
  onDelete: "CASCADE"
});
Localization.hasMany(PerceptorLocation, {
  foreignKey: "localizationId",
  onDelete: "CASCADE"
});

module.exports = PerceptorLocation;
