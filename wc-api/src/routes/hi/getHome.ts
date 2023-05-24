import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send({ message: "Welcome to Wired.Chat API" });
});

export default router;
