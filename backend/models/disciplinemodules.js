'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DisciplineModules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DisciplineModules.init({
    disciplineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Discipline", key: "id" },
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Module", key: "id" },
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false, // Порядок модуля в программе
    },
  }, {
    sequelize,
    modelName: 'DisciplineModules',
  });
  return DisciplineModules;
};