'use strict';
const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsToMany(models.Studyplan, {
                through: models.UserStudyplans,
                foreignKey: 'userId'
            })
            User.belongsToMany(models.Discipline, {
                through: models.UserDisciplines,
                foreignKey: 'userId'
            })
            User.belongsToMany(models.Module, {
                through: models.UserModules,
                foreignKey: 'userId'
            })
        }
    }

    User.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            username: { type: DataTypes.STRING, allowNull: false, unique: true },
            password: { type: DataTypes.STRING, allowNull: false },
            login: { type: DataTypes.STRING, allowNull: false }
        },
        {
            sequelize,
            modelName: "User",
            timestamps: false
        }
    );

    return User;
};