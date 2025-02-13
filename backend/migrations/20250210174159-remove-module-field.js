'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Modules", "topic");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn("Modules", "topic", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  }
};
