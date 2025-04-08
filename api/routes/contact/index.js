const express = require("express");
const sendRequest = require("./sendRequest");
const acceptRequest = require("./acceptRequest");
const declineRequest = require("./declineRequest");
const getRequests = require("./getRequests");
const getContacts = require("./getContacts");

const router = express.Router();

router.use("/", sendRequest);
router.use("/", acceptRequest);
router.use("/", declineRequest);
router.use("/", getRequests);
router.use("/", getContacts);

module.exports = router;
