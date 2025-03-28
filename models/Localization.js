const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Localization = sequelize.define('Localization', {
    localization_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    venue: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    indication_zone: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'localizations',
    timestamps: false,
});

module.exports = Localization;
