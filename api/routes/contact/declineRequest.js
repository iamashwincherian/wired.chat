const express = require("express");
const { ContactRequest } = require("../../models");
const authenticate = require("../../middleware/auth");

const router = express.Router();

router.post("requests/decline/:requestId", authenticate, async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user.id;

  const request = await ContactRequest.findByPk(requestId);
  if (!request || request.receiverId !== userId) {
    return res.status(404).json({ message: "Request not found" });
  }

  // Update request status
  request.status = "declined";
  await request.save();

  res.json({
    success: true,
    message: "Contact request declined",
  });
});

module.exports = router;
