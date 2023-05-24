import { Router } from "express";
import getHome from "./getHome";

const router = Router();

router.use("/home", getHome);

export default router;
