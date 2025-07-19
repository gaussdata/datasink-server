import express from "express";
import analysis from "../controllers/analysis.js";

const router = express.Router();

router.get("/count", analysis.getCount);
router.get("/view", analysis.getView);
router.get("/pvuv", analysis.getPVUV);
router.get("/top-pages", analysis.getTopPages);

export default router;