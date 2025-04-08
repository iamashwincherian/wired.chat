const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const { sequelize } = require("../models");

const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "Session",
  // checkExpirationInterval: 15 * 60 * 1000, // clean expired sessions every 15 min
  // expiration: 24 * 60 * 60 * 1000, // 1 day
});

module.exports = sessionStore;
