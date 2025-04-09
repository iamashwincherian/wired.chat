const Router = require("express").Router();
const sendVerification = require("./sendVerification");
const verifyCode = require("./verifyCode");

Router.use("/", verifyCode);
Router.use("/", sendVerification);

module.exports = Router;
