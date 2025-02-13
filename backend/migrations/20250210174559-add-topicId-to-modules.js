module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Modules", "topicId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Topics",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Modules", "topicId");
  },
};
