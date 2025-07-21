import express from "express";
import analysis from "../controllers/analysis.js";
import { pvuvValidators, topPagesValidators } from "../validators/analysis.validator.js";
import { validate } from "../utils/validate.js";

const router = express.Router();

router.get("/count", analysis.getCount);
router.get("/view", analysis.getView);
router.get("/pvuv", validate(pvuvValidators), analysis.getPVUV);
router.get("/top-pages", validate(topPagesValidators), analysis.getTopPages);

export default router;