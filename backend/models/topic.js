'use strict';
module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define("Topic", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Topic.associate = (models) => {
    Topic.hasMany(models.Module, { foreignKey: "topicId", onDelete: "SET NULL" });
  };

  return Topic;
};
