'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Studyplan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Studyplan.belongsToMany(models.Discipline, {
                through: models.StudyplanDisciplines,  // <- Указываем промежуточную таблицу
                foreignKey: "studyplanId"
            });
            Studyplan.belongsToMany(models.User, {
                through: models.UserStudyplans,
                foreignKey: "studyplanId"
            })
        }
    }
    Studyplan.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        courseNumber: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Studyplan',
    });
    return Studyplan;
};
