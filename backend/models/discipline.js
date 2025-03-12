'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discipline extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Discipline.belongsToMany(models.Module, {
        through: models.DisciplineModules,  // <- Указываем промежуточную таблицу
        foreignKey: "disciplineId"
      });
      Discipline.belongsToMany(models.Studyplan, {
        through: models.StudyplanDisciplines,  // <- Указываем промежуточную таблицу
        foreignKey: "disciplineId"
      });

    }
  }
  Discipline.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
  }, {
    sequelize,
    modelName: 'Discipline',
  });
  return Discipline;
};