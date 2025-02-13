'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Module.belongsToMany(models.Discipline, {
        through: models.DisciplineModules,
        foreignKey: "moduleId"
      });
      Module.belongsTo(models.Topic, { foreignKey: "topicId", onDelete: "SET NULL" });
    }
  }
  Module.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSONB, // Используем JSONB для хранения массива объектов
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Module',
  });

  return Module;
};