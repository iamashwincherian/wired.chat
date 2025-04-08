"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "googleId", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "githubId", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "provider", {
      type: Sequelize.ENUM("local", "google", "github"),
      defaultValue: "local",
    });

    await queryInterface.addColumn("Users", "avatar", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "googleId");
    await queryInterface.removeColumn("Users", "githubId");
    await queryInterface.removeColumn("Users", "provider");
    await queryInterface.removeColumn("Users", "avatar");
  },
};
