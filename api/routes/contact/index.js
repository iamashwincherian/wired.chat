const express = require("express");
const sendRequest = require("./sendRequest");
const acceptRequest = require("./acceptRequest");
const declineRequest = require("./declineRequest");

const router = express.Router();

router.use("/", sendRequest);
router.use("/", acceptRequest);
router.use("/", declineRequest);

module.exports = router;
