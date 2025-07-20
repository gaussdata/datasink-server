import express from "express";
import { collector } from "../controllers/collector.js";

const router = express.Router();

// 接收埋点消息
router.post("/t", collector.track);

export default router;
