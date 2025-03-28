const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const SubRecipe = require('./subRecipe');
const Localization =  require('./Localization')




const Attribution = sequelize.define('Attribution', {
    attribution_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    contribuable_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    attribution_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
	localization_id:{
		type:DataTypes.INTEGER,
		allowNull:false,
		references:{
			model: 'localizations',
			key:'localization_id'
		}
	},
    subrecipe_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'subrecipe',
            key: 'subRecipe_id'
        }
    }
	},

	{
    tableName: 'attribution',
    timestamps: false,
});
//Localization.hasMany(Attribution,{ foreignKey: 'localization_id'})
Attribution.belongsTo(Localization,{foreignKey: 'localization_id'})
Attribution.belongsTo(SubRecipe, { foreignKey: 'subrecipe_id' });
module.exports = Attribution;
