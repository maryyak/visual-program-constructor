'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class StudyplanDisciplines extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    StudyplanDisciplines.init({
        studyplanId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "Studyplan", key: "id" },
        },
        disciplineId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "Discipline", key: "id" },
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'StudyplanDisciplines',
    });
    return StudyplanDisciplines;
};