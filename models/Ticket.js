const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const SubRecipe = require("./subRecipe");

const Ticket = sequelize.define("Ticket", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey:true,
    autoIncrement: true
  },
  matriculeCollector: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  matriculeCashier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateGrant: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dateSale: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isSolde: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:false,
  },
  subRecipe_id: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: 'subrecipe',
        key: 'subRecipe_id'
    }
  },
},{
    tableName: 'ticket',
    timestamps: false,
});

SubRecipe.hasMany(Ticket, {
  foreignKey: "subRecipe_id",
  onDelete: "CASCADE",
});

Ticket.belongsTo(SubRecipe, {
  foreignKey: "subRecipe_id",
});

module.exports = Ticket