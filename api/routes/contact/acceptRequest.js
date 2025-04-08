const express = require("express");
const { ContactRequest, Contact } = require("../../models");
const authenticate = require("../../middleware/auth");

const router = express.Router();

router.post("/requests/:requestId/accept/", authenticate, async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user.id;

  const request = await ContactRequest.findByPk(requestId);
  if (!request || request.receiverId !== userId) {
    return res.status(404).json({ message: "Request not found" });
  }

  // Create contact relationship
  await Contact.create({
    user1Id: request.senderId,
    user2Id: request.receiverId,
  });

  // Update request status
  request.status = "accepted";
  await request.save();

  res.json({
    success: true,
    message: "Contact request accepted",
  });
});

module.exports = router;
