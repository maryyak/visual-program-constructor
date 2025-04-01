'use strict';
const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
    class UserDisciplines extends Model {
        static associate(models) {
            UserDisciplines.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
            UserDisciplines.belongsTo(models.Discipline, { foreignKey: "disciplineId", onDelete: "CASCADE" });
        }
    }

    UserDisciplines.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },

            disciplineId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Disciplines',
                    key: 'id'
                },
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
        },
        {
            sequelize,
            modelName: "UserDisciplines",
            timestamps: false
        }
    );

    return UserDisciplines;
};