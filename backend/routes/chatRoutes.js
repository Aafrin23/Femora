import express from "express";
import { chatWithFemora } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", chatWithFemora);

export default router;