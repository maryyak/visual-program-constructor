'use strict';
const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
    class UserStudyplans extends Model {
        static associate(models) {
            UserStudyplans.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
            UserStudyplans.belongsTo(models.Studyplan, { foreignKey: "studyplanId", onDelete: "CASCADE" });
        }
    }

    UserStudyplans.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },

            studyplanId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Studyplans',
                    key: 'id'
                },
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
            },
        },
        {
            sequelize,
            modelName: "UserStudyplans",
            timestamps: false
        }
    );

    return UserStudyplans;
};