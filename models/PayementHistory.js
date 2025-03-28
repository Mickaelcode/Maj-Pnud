const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Attribution = require('./Attribution');

const PayementHistory = sequelize.define('PayementHistory', {
    payementHistory_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    attributionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'attribution',
            key: 'attribution_id',
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    payementId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'payementhistory',
    timestamps: false,
    id: false,
    defaultScope: {
        attributes: { exclude: ['id'] }
    }
});

PayementHistory.belongsTo(Attribution, {
    foreignKey: 'attributionId',
    targetKey: 'attribution_id',
});

PayementHistory.beforeCreate((paymentHistory, options) => {
    delete paymentHistory.id;
});

module.exports = PayementHistory;
