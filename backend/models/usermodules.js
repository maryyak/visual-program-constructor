'use strict';
const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
    class UserModules extends Model {
        static associate(models) {
            UserModules.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
            UserModules.belongsTo(models.Module, { foreignKey: "moduleId", onDelete: "CASCADE" });
        }
    }

    UserModules.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },

            moduleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Modules',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
            modelName: "UserModules",
            timestamps: false
        }
    );

    return UserModules;
};