import express from "express";
import analysis from "../controllers/analysis.js";

const router = express.Router();

router.get("/count", analysis.getCount);
router.get("/view", analysis.getView);

export default router;